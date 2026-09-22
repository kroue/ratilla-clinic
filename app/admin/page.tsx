import { count, desc, eq } from "drizzle-orm";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { DatabaseNotConfiguredError, getDb } from "@/lib/db";
import { leads, type LeadStatus } from "@/lib/db/schema";
import { callTimeLabel, reasonLabel } from "@/lib/lead-options";
import { setLeadStatus } from "./actions";
import { DeleteLeadButton } from "./DeleteLeadButton";

const FILTERS = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "closed", label: "Closed" },
  { value: "all", label: "All" },
] as const;
type Filter = (typeof FILTERS)[number]["value"];

const EMPTY: Record<Filter, string> = {
  new: "No new requests. When someone fills in the call-back form on the website, it shows up here.",
  contacted: "No requests marked as contacted yet. Use “Mark contacted” after you call someone back.",
  closed: "No closed requests yet.",
  all: "No requests yet. They appear here as soon as someone sends the call-back form on the website.",
};

const received = new Intl.DateTimeFormat("en-PH", { timeZone: "Asia/Manila", dateStyle: "medium", timeStyle: "short" });

export default async function LeadsPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  await requireAdmin();

  const { status } = await searchParams;
  const filter: Filter = FILTERS.some((f) => f.value === status) ? (status as Filter) : "new";

  let db;
  try {
    db = await getDb();
  } catch (error) {
    if (!(error instanceof DatabaseNotConfiguredError)) throw error;
    return (
      <div className="form-card admin-error" role="alert">
        <h1>The database isn&apos;t connected</h1>
        <p>
          In Vercel, open this project&apos;s Storage tab, connect a Neon Postgres database, then redeploy. The{" "}
          <code>DATABASE_URL</code> variable is added for you.
        </p>
      </div>
    );
  }

  const [rows, totals] = await Promise.all([
    db
      .select()
      .from(leads)
      .where(filter === "all" ? undefined : eq(leads.status, filter))
      .orderBy(desc(leads.createdAt))
      .limit(200),
    db.select({ status: leads.status, n: count() }).from(leads).groupBy(leads.status),
  ]);

  const totalFor = (value: Filter) =>
    value === "all"
      ? totals.reduce((sum, t) => sum + Number(t.n), 0)
      : Number(totals.find((t) => t.status === value)?.n ?? 0);

  return (
    <>
      <div className="admin-title">
        <h1>Call-back requests</h1>
        {!process.env.DATABASE_URL && (
          <p className="form-alert">
            You&apos;re looking at the local development database. Requests sent to the live site are in Neon.
          </p>
        )}
      </div>

      <nav className="filter-tabs" aria-label="Filter by status">
        {FILTERS.map((f) => (
          <Link
            key={f.value}
            href={f.value === "new" ? "/admin" : `/admin?status=${f.value}`}
            aria-current={filter === f.value ? "page" : undefined}
          >
            {f.label} <span className="count">{totalFor(f.value)}</span>
          </Link>
        ))}
      </nav>

      {rows.length === 0 ? (
        <p className="admin-empty">{EMPTY[filter]}</p>
      ) : (
        <ul className="lead-list">
          {rows.map((lead) => (
            <li key={lead.id} className="lead">
              <div className="lead-who">
                <p className="lead-name">{lead.name}</p>
                <a className="lead-phone" href={`tel:${lead.phone}`}>
                  {lead.phone}
                </a>
                {lead.email && (
                  <a className="lead-email" href={`mailto:${lead.email}`}>
                    {lead.email}
                  </a>
                )}
              </div>

              <div className="lead-what">
                <p>
                  <strong>{reasonLabel(lead.reason)}</strong>
                  {lead.reason === "animal-bite" && <span className="lead-flag">Urgent</span>}
                </p>
                <p className="lead-meta">Call: {callTimeLabel(lead.preferredTime)}</p>
                {lead.message && <p className="lead-message">{lead.message}</p>}
              </div>

              <div className="lead-side">
                <p className="lead-meta">
                  <span className={`lead-status lead-status-${lead.status}`}>{lead.status}</span>
                  <time dateTime={lead.createdAt.toISOString()}>{received.format(lead.createdAt)}</time>
                </p>
                <div className="lead-actions">
                  {nextSteps(lead.status).map((step) => (
                    <form key={step.status} action={setLeadStatus.bind(null, lead.id, step.status)}>
                      <button type="submit" className="btn btn-secondary btn-compact">
                        {step.label}
                      </button>
                    </form>
                  ))}
                  <DeleteLeadButton id={lead.id} name={lead.name} />
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

function nextSteps(status: LeadStatus): { status: LeadStatus; label: string }[] {
  if (status === "new") return [{ status: "contacted", label: "Mark contacted" }];
  if (status === "contacted")
    return [
      { status: "closed", label: "Close" },
      { status: "new", label: "Back to new" },
    ];
  return [{ status: "new", label: "Reopen" }];
}

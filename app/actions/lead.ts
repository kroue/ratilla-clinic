"use server";

import { createHash } from "node:crypto";
import { and, count, eq, gt } from "drizzle-orm";
import { headers } from "next/headers";
import { z } from "zod";
import { getDb } from "@/lib/db";
import { leads } from "@/lib/db/schema";
import { CALL_TIMES, REASONS, type LeadField, type LeadFormState } from "@/lib/lead-options";
import { site } from "@/lib/site";

const MAX_PER_HOUR = 5;
const MIN_FILL_MS = 1500;

// Accepts 0912 818 8078, +63 912 818 8078, (088) 323-0178 and stores +63XXXXXXXXXX.
function normalizePhone(raw: string) {
  const digits = raw.replace(/[\s\-().]/g, "");
  if (/^\+63\d{9,10}$/.test(digits)) return digits;
  if (/^63\d{9,10}$/.test(digits)) return `+${digits}`;
  if (/^0\d{9,10}$/.test(digits)) return `+63${digits.slice(1)}`;
  return null;
}

const optional = (max: number, message: string) =>
  z
    .string()
    .trim()
    .max(max, message)
    .transform((v) => v || null);

const leadSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(100, "Please shorten your name to 100 characters."),
  phone: z
    .string()
    .trim()
    .min(1, "Please enter a phone number we can call.")
    .transform((v, ctx) => {
      const phone = normalizePhone(v);
      if (!phone) {
        ctx.addIssue({ code: "custom", message: "Enter a Philippine number, like 09XX XXX XXXX." });
        return z.NEVER;
      }
      return phone;
    }),
  email: z
    .string()
    .trim()
    .max(254)
    .refine((v) => v === "" || z.email().safeParse(v).success, "Check the email address, or leave it blank.")
    .transform((v) => v || null),
  reason: z.enum(REASONS.map((r) => r.value) as [string, ...string[]], "Please choose a reason."),
  preferredTime: z.enum(CALL_TIMES.map((t) => t.value) as [string, ...string[]]).catch("any"),
  message: optional(1000, "Please keep the message under 1,000 characters."),
  consent: z.literal("yes", "Please agree so the clinic can contact you."),
});

const text = (formData: FormData, key: string) => {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
};

export async function submitLead(_prev: LeadFormState, formData: FormData): Promise<LeadFormState> {
  const values = {
    name: text(formData, "name"),
    phone: text(formData, "phone"),
    email: text(formData, "email"),
    reason: text(formData, "reason"),
    preferredTime: text(formData, "preferredTime"),
    message: text(formData, "message"),
    consent: text(formData, "consent"),
  };

  // Bots: a filled honeypot or an instant submit gets a quiet "success" and is not stored.
  const elapsed = Number(text(formData, "elapsed"));
  if (text(formData, "website") || (elapsed > 0 && elapsed < MIN_FILL_MS)) {
    return { status: "success", firstName: values.name.split(" ")[0] || "there", phone: values.phone };
  }

  const parsed = leadSchema.safeParse(values);
  if (!parsed.success) {
    const fieldErrors = z.flattenError(parsed.error).fieldErrors as Partial<Record<LeadField, string[]>>;
    const errors = Object.fromEntries(
      Object.entries(fieldErrors).map(([field, messages]) => [field, messages?.[0] ?? "Check this field."]),
    );
    return { status: "invalid", errors, values };
  }

  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const ipHash = createHash("sha256").update(`rmc-lead:${ip}`).digest("hex");

  try {
    const db = await getDb();
    const [recent] = await db
      .select({ n: count() })
      .from(leads)
      .where(and(eq(leads.ipHash, ipHash), gt(leads.createdAt, new Date(Date.now() - 60 * 60 * 1000))));

    if ((recent?.n ?? 0) >= MAX_PER_HOUR) {
      return {
        status: "error",
        message: `You've already sent several requests this hour. Please call ${site.mobile.display} instead.`,
        values,
      };
    }

    const { name, phone, email, reason, preferredTime, message } = parsed.data;
    await db.insert(leads).values({ name, phone, email, reason, preferredTime, message, ipHash });
  } catch (error) {
    console.error("[submitLead] could not save lead", error);
    return {
      status: "error",
      message: `Sorry, we couldn't send your request just now. Please call ${site.mobile.display}.`,
      values,
    };
  }

  return { status: "success", firstName: parsed.data.name.split(" ")[0], phone: values.phone };
}

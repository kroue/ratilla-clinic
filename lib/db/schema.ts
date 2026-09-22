import { index, pgEnum, pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const leadStatus = pgEnum("lead_status", ["new", "contacted", "closed"]);

export const leads = pgTable(
  "leads",
  {
    id: serial("id").primaryKey(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    name: varchar("name", { length: 100 }).notNull(),
    phone: varchar("phone", { length: 20 }).notNull(),
    email: varchar("email", { length: 254 }),
    reason: varchar("reason", { length: 40 }).notNull(),
    preferredTime: varchar("preferred_time", { length: 20 }),
    message: text("message"),
    status: leadStatus("status").notNull().default("new"),
    // SHA-256 of the sender's IP, kept only to rate-limit repeat submissions.
    ipHash: varchar("ip_hash", { length: 64 }),
  },
  (table) => [
    index("leads_created_at_idx").on(table.createdAt),
    index("leads_ip_hash_idx").on(table.ipHash, table.createdAt),
  ],
);

export type Lead = typeof leads.$inferSelect;
export type LeadStatus = (typeof leadStatus.enumValues)[number];

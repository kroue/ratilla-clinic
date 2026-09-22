CREATE TYPE "public"."lead_status" AS ENUM('new', 'contacted', 'closed');--> statement-breakpoint
CREATE TABLE "leads" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"name" varchar(100) NOT NULL,
	"phone" varchar(20) NOT NULL,
	"email" varchar(254),
	"reason" varchar(40) NOT NULL,
	"preferred_time" varchar(20),
	"message" text,
	"status" "lead_status" DEFAULT 'new' NOT NULL,
	"ip_hash" varchar(64)
);
--> statement-breakpoint
CREATE INDEX "leads_created_at_idx" ON "leads" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "leads_ip_hash_idx" ON "leads" USING btree ("ip_hash","created_at");
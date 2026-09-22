// Applies pending SQL migrations in drizzle/ to the Neon database.
// Runs before `next build`, so every Vercel deploy brings the schema up to date.
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { migrate } from "drizzle-orm/neon-http/migrator";

const url = process.env.DATABASE_URL;

if (!url) {
  const message = "DATABASE_URL is not set, skipping database migrations.";
  if (process.env.VERCEL) {
    console.warn(`\n⚠ ${message} The call-back form won't save leads until a Neon database is connected.\n`);
  } else {
    console.log(`${message} Local dev uses the embedded database in .pglite/.`);
  }
  process.exit(0);
}

await migrate(drizzle({ client: neon(url) }), { migrationsFolder: "./drizzle" });
console.log("Database migrations applied.");

import { defineConfig } from "drizzle-kit";

// `npm run db:generate` turns changes in lib/db/schema.ts into SQL files in drizzle/.
// Those files are applied to Neon on every Vercel build (scripts/migrate.mjs)
// and to the local PGlite database when `npm run dev` first connects.
export default defineConfig({
  dialect: "postgresql",
  schema: "./lib/db/schema.ts",
  out: "./drizzle",
});

import "server-only";
import path from "node:path";
import type { PgDatabase, PgQueryResultHKT } from "drizzle-orm/pg-core";
import * as schema from "./schema";

export type Db = PgDatabase<PgQueryResultHKT, typeof schema>;

export class DatabaseNotConfiguredError extends Error {
  constructor() {
    super("DATABASE_URL is not set. Connect a Neon database to this Vercel project.");
    this.name = "DatabaseNotConfiguredError";
  }
}

// One connection per server instance; kept on globalThis so dev hot reloads reuse it.
const globalForDb = globalThis as unknown as { rmcDb?: Promise<Db> };

export function getDb(): Promise<Db> {
  if (!globalForDb.rmcDb) {
    globalForDb.rmcDb = connect().catch((error) => {
      globalForDb.rmcDb = undefined;
      throw error;
    });
  }
  return globalForDb.rmcDb;
}

async function connect(): Promise<Db> {
  const url = process.env.DATABASE_URL;

  if (url) {
    const { neon } = await import("@neondatabase/serverless");
    const { drizzle } = await import("drizzle-orm/neon-http");
    return drizzle({ client: neon(url), schema }) as unknown as Db;
  }

  if (process.env.VERCEL) throw new DatabaseNotConfiguredError();

  // Local fallback: embedded Postgres saved in .pglite/, so `npm run dev`
  // works before a Neon database exists. Never used on Vercel.
  const { PGlite } = await import("@electric-sql/pglite");
  const { drizzle } = await import("drizzle-orm/pglite");
  const { migrate } = await import("drizzle-orm/pglite/migrator");
  const db = drizzle({ client: new PGlite(path.join(process.cwd(), ".pglite")), schema });
  await migrate(db, { migrationsFolder: path.join(process.cwd(), "drizzle") });
  return db as unknown as Db;
}

import { drizzle } from "drizzle-orm/node-postgres";
import { drizzle as drizzleSqlite } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import pg from "pg";
import * as schema from "@shared/schema";

const { Pool } = pg;

if (!process.env.DATABASE_URL && process.env.NODE_ENV !== "development") {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

let db;
if (process.env.NODE_ENV === "development") {
  const sqlite = new Database("portfolio.db");
  db = drizzleSqlite(sqlite, { schema });
} else {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  db = drizzle(pool, { schema });
}

export { db };

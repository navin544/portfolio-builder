import { defineConfig } from "drizzle-kit";

const isDev = process.env.NODE_ENV === "development";

if (!isDev && !process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL, ensure the database is provisioned");
}

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: isDev ? "sqlite" : "postgresql",
  dbCredentials: isDev ? { url: "portfolio.db" } : { url: process.env.DATABASE_URL! },
});

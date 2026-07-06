import { defineConfig } from "drizzle-kit";

export default defineConfig({
  // Glob EVERY schema file, not just schema.ts. The deterministic prep writes app
  // tables into lib/db/schema.ts, but if the builder ever adds an entity the prep
  // schema lacks, it tends to author a SECOND file (lib/db/app-schema.ts) + crud
  // that imports from it. A single-file `schema` path silently skips that file at
  // `drizzle-kit push`, so those tables are never created and every query 500s with
  // "no such table". A glob makes push create tables from ANY lib/db/*.ts file —
  // bulletproof against however the schema ends up split.
  schema: "./lib/db/*.ts",
  out: "./drizzle",
  dialect: "turso",
  dbCredentials: {
    url: process.env.LIBSQL_URL ?? "file:./app.db",
    authToken: process.env.LIBSQL_AUTH_TOKEN,
  },
});

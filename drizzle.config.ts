import { defineConfig } from "drizzle-kit";

// Used only by `drizzle-kit generate`: it writes drizzle/<timestamp>_<name>/migration.sql
// (drizzle-kit 1.x) or drizzle/<timestamp>_<name>.sql (drizzle-kit 0.x), which
// scripts/flatten-migrations.mjs then copies into migrations/*.sql for
// `wrangler d1 migrations apply` and the vitest plugin.
//
// No `d1-http` driver and no credentials on purpose: remote migrations always go
// through wrangler so local / staging / production use the same command path.
//
// Column naming: name every column explicitly in src/db/schema.ts. If you decide
// to rely on automatic casing instead, set the SAME `casing` here and in
// src/db/index.ts, otherwise generated SQL and runtime queries will disagree.
export default defineConfig({
	out: "./drizzle",
	schema: "./src/db/schema.ts",
	dialect: "sqlite",
});

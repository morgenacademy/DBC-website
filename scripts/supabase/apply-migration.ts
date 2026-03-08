import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { getSupabaseDbUrl } from "./utils";

const DEFAULT_MIGRATION = "supabase/migrations/20260308211000_instagram_content_schema.sql";

function run(): void {
  const dbUrl = getSupabaseDbUrl(process.env);
  const migrationFile = resolve(process.cwd(), process.argv[2] ?? DEFAULT_MIGRATION);

  if (!existsSync(migrationFile)) {
    throw new Error(`Migration file niet gevonden: ${migrationFile}`);
  }

  const checkPsql = spawnSync("psql", ["--version"], { stdio: "pipe" });
  if (checkPsql.error) {
    throw new Error("psql niet gevonden. Installeer PostgreSQL client tools om migrations uit te voeren.");
  }

  console.log(`Applying migration: ${migrationFile}`);
  const result = spawnSync("psql", [dbUrl, "-v", "ON_ERROR_STOP=1", "-f", migrationFile], { stdio: "inherit" });

  if (result.status !== 0) {
    throw new Error(`Migration failed met exit code ${result.status ?? 1}.`);
  }

  console.log("Migration succesvol toegepast.");
}

run();

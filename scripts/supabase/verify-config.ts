import { getSupabaseDbUrl, getSupabaseRestConfig } from "./utils";

function showState(key: string, value: string | undefined): void {
  console.log(`${key}: ${value ? "set" : "missing"}`);
}

function run(): void {
  showState("CONTENT_DATA_SOURCE", process.env.CONTENT_DATA_SOURCE);
  showState("SUPABASE_URL", process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL);
  showState(
    "SUPABASE_READ_KEY",
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
  showState("SUPABASE_DB_URL", process.env.SUPABASE_DB_URL);
  showState("SUPABASE_CONTENT_TABLE", process.env.SUPABASE_CONTENT_TABLE);

  try {
    const rest = getSupabaseRestConfig(process.env);
    console.log(`REST config OK (${rest.table}).`);
  } catch (error) {
    console.warn(error instanceof Error ? error.message : "REST config onvolledig.");
  }

  try {
    getSupabaseDbUrl(process.env);
    console.log("DB config OK.");
  } catch (error) {
    console.warn(error instanceof Error ? error.message : "DB config onvolledig.");
  }
}

run();

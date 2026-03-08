import {
  InMemoryContentDataSource,
  SupabaseContentDataSource,
  type ContentDataSource
} from "@/lib/repositories/content-data-source";

export type ContentDataSourceMode = "mock" | "supabase";

export const CONTENT_DATA_SOURCE_ENV_KEY = "CONTENT_DATA_SOURCE";
export const DEFAULT_CONTENT_DATA_SOURCE_MODE: ContentDataSourceMode = "mock";

export function resolveContentDataSourceMode(rawValue: string | undefined): ContentDataSourceMode {
  if (!rawValue) return DEFAULT_CONTENT_DATA_SOURCE_MODE;
  return rawValue.trim().toLowerCase() === "supabase" ? "supabase" : "mock";
}

export function createContentDataSourceFromEnv(env: NodeJS.ProcessEnv = process.env): ContentDataSource {
  const mode = resolveContentDataSourceMode(env[CONTENT_DATA_SOURCE_ENV_KEY]);
  const fallbackDataSource = new InMemoryContentDataSource();

  if (mode === "supabase") {
    return new SupabaseContentDataSource({
      fallbackDataSource,
      supabaseUrl: env.SUPABASE_URL ?? env.NEXT_PUBLIC_SUPABASE_URL,
      supabaseAnonKey: env.SUPABASE_ANON_KEY ?? env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      rowsJson: env.SUPABASE_CONTENT_ROWS_JSON
    });
  }

  return fallbackDataSource;
}

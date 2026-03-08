import {
  InMemoryContentDataSource,
  SupabaseContentDataSource,
  type ContentDataSource
} from "@/lib/repositories/content-data-source";
import type { SupabaseContentRow } from "@/lib/adapters/instagram";

export type ContentDataSourceMode = "mock" | "supabase";

export const CONTENT_DATA_SOURCE_ENV_KEY = "CONTENT_DATA_SOURCE";
export const DEFAULT_CONTENT_DATA_SOURCE_MODE: ContentDataSourceMode = "mock";
export const SUPABASE_CONTENT_TABLE_ENV_KEY = "SUPABASE_CONTENT_TABLE";
export const DEFAULT_SUPABASE_CONTENT_TABLE = "content_items";

function normalizeSupabaseUrl(rawUrl: string): string {
  return rawUrl.replace(/\/+$/, "");
}

function parseRowsJson(rowsJson: string | undefined): SupabaseContentRow[] | null {
  if (!rowsJson) return null;

  try {
    const parsed = JSON.parse(rowsJson) as unknown;
    return Array.isArray(parsed) ? (parsed as SupabaseContentRow[]) : null;
  } catch {
    return null;
  }
}

function getSupabaseReadConfig(env: NodeJS.ProcessEnv): { url: string; key: string; table: string } | null {
  const url = env.SUPABASE_URL ?? env.NEXT_PUBLIC_SUPABASE_URL;
  const key = env.SUPABASE_SERVICE_ROLE_KEY ?? env.SUPABASE_ANON_KEY ?? env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const table = env[SUPABASE_CONTENT_TABLE_ENV_KEY] ?? DEFAULT_SUPABASE_CONTENT_TABLE;

  if (!url || !key) return null;

  return { url: normalizeSupabaseUrl(url), key, table };
}

async function loadSupabaseRowsFromRest(env: NodeJS.ProcessEnv): Promise<SupabaseContentRow[] | null> {
  const config = getSupabaseReadConfig(env);
  if (!config) return null;

  const endpoint = `${config.url}/rest/v1/${config.table}?select=*&order=published_at.desc`;

  try {
    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        apikey: config.key,
        Authorization: `Bearer ${config.key}`
      }
    });

    if (!response.ok) {
      const details = await response.text();
      console.warn(`Supabase read failed (${response.status}). Falling back to mock datasource.`, details);
      return null;
    }

    const payload = (await response.json()) as unknown;
    return Array.isArray(payload) ? (payload as SupabaseContentRow[]) : null;
  } catch (error) {
    console.warn("Supabase read failed. Falling back to mock datasource.", error);
    return null;
  }
}

export function resolveContentDataSourceMode(rawValue: string | undefined): ContentDataSourceMode {
  if (!rawValue) return DEFAULT_CONTENT_DATA_SOURCE_MODE;
  return rawValue.trim().toLowerCase() === "supabase" ? "supabase" : "mock";
}

export function createContentDataSourceFromEnvSync(env: NodeJS.ProcessEnv = process.env): ContentDataSource {
  const mode = resolveContentDataSourceMode(env[CONTENT_DATA_SOURCE_ENV_KEY]);
  const fallbackDataSource = new InMemoryContentDataSource();

  if (mode === "supabase") {
    const rowsFromJson = parseRowsJson(env.SUPABASE_CONTENT_ROWS_JSON);

    return new SupabaseContentDataSource({
      fallbackDataSource,
      rows: rowsFromJson,
      sourceLabel: rowsFromJson ? "json" : undefined
    });
  }

  return fallbackDataSource;
}

export async function createContentDataSourceFromEnv(env: NodeJS.ProcessEnv = process.env): Promise<ContentDataSource> {
  const mode = resolveContentDataSourceMode(env[CONTENT_DATA_SOURCE_ENV_KEY]);
  const fallbackDataSource = new InMemoryContentDataSource();

  if (mode !== "supabase") {
    return fallbackDataSource;
  }

  const rowsFromJson = parseRowsJson(env.SUPABASE_CONTENT_ROWS_JSON);
  if (rowsFromJson && rowsFromJson.length > 0) {
    return new SupabaseContentDataSource({
      fallbackDataSource,
      rows: rowsFromJson,
      sourceLabel: "json"
    });
  }

  const rowsFromLiveRead = await loadSupabaseRowsFromRest(env);

  return new SupabaseContentDataSource({
    fallbackDataSource,
    rows: rowsFromLiveRead,
    sourceLabel: rowsFromLiveRead ? "live" : undefined
  });
}

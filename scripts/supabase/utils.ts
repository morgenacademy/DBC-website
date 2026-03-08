import { loadEnvConfig } from "@next/env";

// Laad .env/.env.local zodat scripts dezelfde env-bron gebruiken als de app.
loadEnvConfig(process.cwd());

const DEFAULT_TABLE = "content_items";

export interface SupabaseRestConfig {
  supabaseUrl: string;
  supabaseReadKey: string;
  table: string;
}

export function getSupabaseRestConfig(env: NodeJS.ProcessEnv = process.env): SupabaseRestConfig {
  const supabaseUrl = (env.SUPABASE_URL ?? env.NEXT_PUBLIC_SUPABASE_URL ?? "").trim().replace(/\/+$/, "");
  const supabaseReadKey = (
    env.SUPABASE_SERVICE_ROLE_KEY ??
    env.SUPABASE_ANON_KEY ??
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    ""
  ).trim();
  const table = (env.SUPABASE_CONTENT_TABLE ?? DEFAULT_TABLE).trim() || DEFAULT_TABLE;

  if (!supabaseUrl) {
    throw new Error("SUPABASE_URL (of NEXT_PUBLIC_SUPABASE_URL) ontbreekt.");
  }

  if (!supabaseReadKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY of SUPABASE_ANON_KEY ontbreekt.");
  }

  return { supabaseUrl, supabaseReadKey, table };
}

export function getSupabaseDbUrl(env: NodeJS.ProcessEnv = process.env): string {
  const dbUrl = (env.SUPABASE_DB_URL ?? "").trim();
  if (!dbUrl) {
    throw new Error("SUPABASE_DB_URL ontbreekt.");
  }

  return dbUrl;
}

export function chunk<T>(items: T[], size: number): T[][] {
  if (size <= 0) return [items];

  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }
  return chunks;
}

export async function fetchJson(endpoint: string, options: RequestInit): Promise<unknown> {
  const response = await fetch(endpoint, options);
  const raw = await response.text();
  let payload: unknown = null;

  try {
    payload = raw ? (JSON.parse(raw) as unknown) : null;
  } catch {
    payload = raw;
  }

  if (!response.ok) {
    throw new Error(
      `Request failed (${response.status}) on ${endpoint}. Response: ${
        typeof payload === "string" ? payload : JSON.stringify(payload)
      }`
    );
  }

  return payload;
}

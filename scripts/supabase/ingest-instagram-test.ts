import { instagramPostOverrides } from "../../lib/data/instagram-post-overrides";
import { normalizeInstagramPost } from "../../lib/adapters/instagram";
import { mapContentItemToSupabaseRow } from "../../lib/adapters/instagram";
import type { SupabaseContentRow } from "../../lib/adapters/instagram";
import { mapInstagramGraphMediaNodeToRawRecord } from "../../lib/adapters/instagram-graph";
import type { InstagramGraphMediaNode } from "../../lib/adapters/instagram-graph";
import { chunk, fetchJson, getSupabaseRestConfig } from "./utils";

const DEFAULT_TEST_LIMIT = 5;
const MAX_TEST_LIMIT = 20;
const UPSERT_CHUNK_SIZE = 100;
const DEFAULT_GRAPH_VERSION = "v23.0";

interface InstagramGraphMediaListResponse {
  data?: InstagramGraphMediaNode[];
}

interface InstagramIngestionConfig {
  graphBaseUrl: string;
  accountId: string;
  accessToken: string;
  limit: number;
  includeSourceIds: Set<string>;
}

function parseLimitedNumber(raw: string | undefined, fallback: number): number {
  if (!raw) return fallback;
  const parsed = Number.parseInt(raw, 10);
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback;
  return Math.min(parsed, MAX_TEST_LIMIT);
}

function parseIncludeSourceIds(raw: string | undefined): Set<string> {
  if (!raw) return new Set<string>();
  return new Set(
    raw
      .split(",")
      .map((part) => part.trim())
      .filter(Boolean)
  );
}

function getInstagramIngestionConfig(env: NodeJS.ProcessEnv = process.env): InstagramIngestionConfig {
  const graphVersion = (env.INSTAGRAM_GRAPH_VERSION ?? DEFAULT_GRAPH_VERSION).trim();
  const graphBaseUrl = (env.INSTAGRAM_GRAPH_API_BASE_URL ?? `https://graph.facebook.com/${graphVersion}`)
    .trim()
    .replace(/\/+$/, "");
  const accountId = (env.INSTAGRAM_ACCOUNT_ID ?? "").trim();
  const accessToken = (env.INSTAGRAM_ACCESS_TOKEN ?? "").trim();

  if (!accountId) {
    throw new Error("INSTAGRAM_ACCOUNT_ID ontbreekt.");
  }

  if (!accessToken) {
    throw new Error("INSTAGRAM_ACCESS_TOKEN ontbreekt.");
  }

  return {
    graphBaseUrl,
    accountId,
    accessToken,
    limit: parseLimitedNumber(env.INSTAGRAM_TEST_INGEST_LIMIT, DEFAULT_TEST_LIMIT),
    includeSourceIds: parseIncludeSourceIds(env.INSTAGRAM_TEST_SOURCE_IDS)
  };
}

async function fetchInstagramMedia(config: InstagramIngestionConfig): Promise<InstagramGraphMediaNode[]> {
  const endpoint = new URL(`${config.graphBaseUrl}/${config.accountId}/media`);
  endpoint.searchParams.set(
    "fields",
    "id,caption,media_type,media_url,permalink,timestamp,thumbnail_url,children{media_type,media_url,thumbnail_url}"
  );
  endpoint.searchParams.set("limit", String(config.limit));
  endpoint.searchParams.set("access_token", config.accessToken);

  const payload = (await fetchJson(endpoint.toString(), { method: "GET", cache: "no-store" })) as InstagramGraphMediaListResponse;

  if (!Array.isArray(payload.data)) {
    throw new Error("Instagram response bevat geen geldige data-array.");
  }

  return payload.data;
}

async function createSyncRun(supabaseUrl: string, supabaseKey: string): Promise<number | null> {
  const endpoint = `${supabaseUrl}/rest/v1/instagram_sync_runs`;
  try {
    const payload = (await fetchJson(endpoint, {
      method: "POST",
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        "Content-Type": "application/json",
        Prefer: "return=representation"
      },
      body: JSON.stringify([{ status: "running" }])
    })) as Array<{ id?: number }>;

    const runId = payload?.[0]?.id;
    return typeof runId === "number" ? runId : null;
  } catch (error) {
    console.warn("Sync run logging niet beschikbaar. Doorgaan zonder run-log.", error);
    return null;
  }
}

async function finalizeSyncRun(
  supabaseUrl: string,
  supabaseKey: string,
  runId: number | null,
  status: "success" | "failed",
  fetchedCount: number,
  upsertedCount: number,
  errorCount: number,
  errorDetails?: string
): Promise<void> {
  if (!runId) return;

  const endpoint = `${supabaseUrl}/rest/v1/instagram_sync_runs?id=eq.${runId}`;

  try {
    await fetchJson(endpoint, {
      method: "PATCH",
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        status,
        finished_at: new Date().toISOString(),
        fetched_count: fetchedCount,
        upserted_count: upsertedCount,
        error_count: errorCount,
        error_details: errorDetails ? { message: errorDetails } : null
      })
    });
  } catch (error) {
    console.warn("Sync run afronding mislukt.", error);
  }
}

async function updateSyncState(supabaseUrl: string, supabaseKey: string): Promise<void> {
  const endpoint = `${supabaseUrl}/rest/v1/instagram_sync_state?on_conflict=id`;

  try {
    await fetchJson(endpoint, {
      method: "POST",
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        "Content-Type": "application/json",
        Prefer: "resolution=merge-duplicates,return=minimal"
      },
      body: JSON.stringify([
        {
          id: 1,
          last_successful_sync_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ])
    });
  } catch (error) {
    console.warn("Sync state update mislukt.", error);
  }
}

async function upsertRows(
  supabaseUrl: string,
  supabaseKey: string,
  table: string,
  rows: SupabaseContentRow[]
): Promise<number> {
  const batches = chunk(rows, UPSERT_CHUNK_SIZE);
  const endpoint = `${supabaseUrl}/rest/v1/${table}?on_conflict=id`;
  let written = 0;

  for (let index = 0; index < batches.length; index += 1) {
    const batch = batches[index];
    await fetchJson(endpoint, {
      method: "POST",
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        "Content-Type": "application/json",
        Prefer: "resolution=merge-duplicates,return=minimal"
      },
      body: JSON.stringify(batch)
    });
    written += batch.length;
    console.log(`Upsert batch ${index + 1}/${batches.length}: ${batch.length} records.`);
  }

  return written;
}

async function run(): Promise<void> {
  const { supabaseUrl, supabaseReadKey, table } = getSupabaseRestConfig(process.env);
  const config = getInstagramIngestionConfig(process.env);

  console.log(`Instagram test-ingest gestart (limit=${config.limit}, table=${table}).`);
  if (config.includeSourceIds.size > 0) {
    console.log(`Filter actief op source IDs: ${Array.from(config.includeSourceIds).join(", ")}`);
  }

  const syncRunId = await createSyncRun(supabaseUrl, supabaseReadKey);
  try {
    const mediaNodes = await fetchInstagramMedia(config);
    const rawRecords = mediaNodes
      .map((node) => mapInstagramGraphMediaNodeToRawRecord(node))
      .filter((record): record is NonNullable<typeof record> => Boolean(record))
      .filter((record) => config.includeSourceIds.size === 0 || config.includeSourceIds.has(record.id))
      .slice(0, config.limit);

    const normalizedItems = rawRecords.map((rawRecord) =>
      normalizeInstagramPost(rawRecord, instagramPostOverrides[rawRecord.id])
    );
    const rows = normalizedItems.map((item) => mapContentItemToSupabaseRow(item));

    if (rows.length === 0) {
      console.log("Geen records gevonden voor ingestie met huidige filter/limit.");
      await finalizeSyncRun(supabaseUrl, supabaseReadKey, syncRunId, "success", mediaNodes.length, 0, 0);
      return;
    }

    const upsertedCount = await upsertRows(supabaseUrl, supabaseReadKey, table, rows);
    await updateSyncState(supabaseUrl, supabaseReadKey);
    await finalizeSyncRun(supabaseUrl, supabaseReadKey, syncRunId, "success", mediaNodes.length, upsertedCount, 0);

    console.log(`Instagram test-ingest voltooid: ${upsertedCount} records geupsert.`);
    console.log(`Voorbeeld slugs: ${normalizedItems.slice(0, 5).map((item) => item.slug).join(", ")}`);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Onbekende ingest-fout";
    await finalizeSyncRun(supabaseUrl, supabaseReadKey, syncRunId, "failed", 0, 0, 1, message);
    throw error;
  }
}

run().catch((error) => {
  console.error(error instanceof Error ? error.message : "Instagram test-ingest mislukt.");
  process.exit(1);
});

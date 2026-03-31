import { instagramPostOverrides } from "../../lib/data/instagram-post-overrides";
import { normalizeInstagramPost } from "../../lib/adapters/instagram";
import { mapContentItemToSupabaseRow } from "../../lib/adapters/instagram";
import type { SupabaseContentRow } from "../../lib/adapters/instagram";
import { mapInstagramGraphMediaNodeToRawRecord } from "../../lib/adapters/instagram-graph";
import type { InstagramGraphMediaNode } from "../../lib/adapters/instagram-graph";
import { chunk, fetchJson, getSupabaseRestConfig } from "./utils";

const DEFAULT_TEST_LIMIT = 5;
const DEFAULT_PAGE_SIZE = 50;
const TEST_LIMIT_CAP = 20;
const UPSERT_CHUNK_SIZE = 100;
const FULL_SYNC_MAX_PAYLOAD_BYTES = 50_000;
const DEFAULT_GRAPH_VERSION = "v23.0";

export type InstagramSyncMode = "test" | "full";

interface InstagramGraphMediaListResponse {
  data?: InstagramGraphMediaNode[];
  paging?: {
    next?: string;
  };
}

interface InstagramSyncOptions {
  mode: InstagramSyncMode;
}

interface InstagramSyncConfig {
  graphBaseUrl: string;
  configuredAccountId: string;
  pageId: string;
  accessToken: string;
  authSource: "meta_system_user" | "instagram_access_token";
  pageSize: number;
  maxRecords: number | null;
  includeSourceIds: Set<string>;
}

interface FacebookPageLookupResponse {
  instagram_business_account?: {
    id?: string;
    username?: string;
  };
}

function parsePositiveNumber(raw: string | undefined): number | null {
  if (!raw) return null;
  const parsed = Number.parseInt(raw, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

function parseBoundedNumber(raw: string | undefined, fallback: number, max: number): number {
  const parsed = parsePositiveNumber(raw);
  if (!parsed) return fallback;
  return Math.min(parsed, max);
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

function resolveInstagramAccessToken(
  env: NodeJS.ProcessEnv
): Pick<InstagramSyncConfig, "accessToken" | "authSource"> {
  const systemUserAccessToken = (env.META_SYSTEM_USER_ACCESS_TOKEN ?? "").trim();
  if (systemUserAccessToken) {
    return {
      accessToken: systemUserAccessToken,
      authSource: "meta_system_user"
    };
  }

  const instagramAccessToken = (env.INSTAGRAM_ACCESS_TOKEN ?? "").trim();
  if (instagramAccessToken) {
    return {
      accessToken: instagramAccessToken,
      authSource: "instagram_access_token"
    };
  }

  throw new Error("META_SYSTEM_USER_ACCESS_TOKEN of INSTAGRAM_ACCESS_TOKEN ontbreekt.");
}

function getInstagramSyncConfig(options: InstagramSyncOptions, env: NodeJS.ProcessEnv = process.env): InstagramSyncConfig {
  const graphVersion = (env.INSTAGRAM_GRAPH_VERSION ?? DEFAULT_GRAPH_VERSION).trim();
  const graphBaseUrl = (env.INSTAGRAM_GRAPH_API_BASE_URL ?? `https://graph.facebook.com/${graphVersion}`)
    .trim()
    .replace(/\/+$/, "");
  const configuredAccountId = (env.INSTAGRAM_ACCOUNT_ID ?? "").trim();
  const pageId = (env.FACEBOOK_PAGE_ID ?? "").trim();
  const { accessToken, authSource } = resolveInstagramAccessToken(env);

  if (!configuredAccountId && !pageId) {
    throw new Error("INSTAGRAM_ACCOUNT_ID of FACEBOOK_PAGE_ID ontbreekt.");
  }

  const pageSize =
    options.mode === "test"
      ? parseBoundedNumber(env.INSTAGRAM_TEST_INGEST_LIMIT, DEFAULT_TEST_LIMIT, TEST_LIMIT_CAP)
      : parsePositiveNumber(env.INSTAGRAM_SYNC_PAGE_SIZE) ?? DEFAULT_PAGE_SIZE;
  const maxRecords = options.mode === "test" ? pageSize : parsePositiveNumber(env.INSTAGRAM_SYNC_LIMIT);

  return {
    graphBaseUrl,
    configuredAccountId,
    pageId,
    accessToken,
    authSource,
    pageSize,
    maxRecords,
    includeSourceIds: parseIncludeSourceIds(env.INSTAGRAM_TEST_SOURCE_IDS)
  };
}

async function resolveInstagramAccountId(config: InstagramSyncConfig): Promise<string> {
  if (!config.pageId) {
    return config.configuredAccountId;
  }

  const endpoint = new URL(`${config.graphBaseUrl}/${config.pageId}`);
  endpoint.searchParams.set("fields", "instagram_business_account{id,username}");
  endpoint.searchParams.set("access_token", config.accessToken);

  const payload = (await fetchJson(endpoint.toString(), { method: "GET", cache: "no-store" })) as FacebookPageLookupResponse;
  const resolvedAccountId = payload.instagram_business_account?.id?.trim() ?? "";

  if (!resolvedAccountId) {
    throw new Error("FACEBOOK_PAGE_ID heeft geen gekoppeld Instagram business account.");
  }

  if (config.configuredAccountId && config.configuredAccountId !== resolvedAccountId) {
    throw new Error(
      `INSTAGRAM_ACCOUNT_ID (${config.configuredAccountId}) komt niet overeen met het account op FACEBOOK_PAGE_ID (${resolvedAccountId}).`
    );
  }

  return resolvedAccountId;
}

async function fetchInstagramMedia(
  config: InstagramSyncConfig
): Promise<{ accountId: string; mediaNodes: InstagramGraphMediaNode[] }> {
  const accountId = await resolveInstagramAccountId(config);
  const mediaNodes: InstagramGraphMediaNode[] = [];
  let nextUrl: string | null = new URL(`${config.graphBaseUrl}/${accountId}/media`).toString();

  while (nextUrl) {
    const endpoint = new URL(nextUrl);
    endpoint.searchParams.set(
      "fields",
      "id,caption,media_type,media_url,permalink,timestamp,thumbnail_url,children{media_type,media_url,thumbnail_url}"
    );
    endpoint.searchParams.set("limit", String(config.pageSize));
    endpoint.searchParams.set("access_token", config.accessToken);

    const payload = (await fetchJson(endpoint.toString(), {
      method: "GET",
      cache: "no-store"
    })) as InstagramGraphMediaListResponse;

    if (!Array.isArray(payload.data)) {
      throw new Error("Instagram response bevat geen geldige data-array.");
    }

    mediaNodes.push(...payload.data);

    if (config.maxRecords && mediaNodes.length >= config.maxRecords) {
      break;
    }

    nextUrl = payload.paging?.next ?? null;
  }

  return {
    accountId,
    mediaNodes: config.maxRecords ? mediaNodes.slice(0, config.maxRecords) : mediaNodes
  };
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

function getStableInstagramUpsertRows(rows: SupabaseContentRow[]): SupabaseContentRow[] {
  const invalidRows = rows.filter((row) => row.source_platform !== "instagram" || !row.source_id);
  if (invalidRows.length > 0) {
    throw new Error("Instagram sync vereist rows met source_platform=instagram en een geldige source_id.");
  }

  return rows.map((row) => ({
    ...row,
    id: `ig-${row.source_id}`
  }));
}

function buildFullSyncBatches(rows: SupabaseContentRow[], upsertChunkSize: number): SupabaseContentRow[][] {
  const batches: SupabaseContentRow[][] = [];
  let currentBatch: SupabaseContentRow[] = [];
  let currentBytes = 2;

  for (const row of rows) {
    const rowPayload = JSON.stringify(row);
    const rowBytes = Buffer.byteLength(rowPayload, "utf8");
    const separatorBytes = currentBatch.length > 0 ? 1 : 0;
    const wouldExceedRecordLimit = currentBatch.length >= upsertChunkSize;
    const wouldExceedPayloadLimit = currentBatch.length > 0 && currentBytes + separatorBytes + rowBytes > FULL_SYNC_MAX_PAYLOAD_BYTES;

    if (wouldExceedRecordLimit || wouldExceedPayloadLimit) {
      batches.push(currentBatch);
      currentBatch = [];
      currentBytes = 2;
    }

    currentBatch.push(row);
    currentBytes += (currentBatch.length > 1 ? 1 : 0) + rowBytes;
  }

  if (currentBatch.length > 0) {
    batches.push(currentBatch);
  }

  return batches;
}

function buildUpsertBatches(
  mode: InstagramSyncMode,
  rows: SupabaseContentRow[],
  upsertChunkSize: number
): SupabaseContentRow[][] {
  return mode === "full" ? buildFullSyncBatches(rows, upsertChunkSize) : chunk(rows, upsertChunkSize);
}

async function upsertRows(
  mode: InstagramSyncMode,
  upsertChunkSize: number,
  supabaseUrl: string,
  supabaseKey: string,
  table: string,
  rows: SupabaseContentRow[]
): Promise<number> {
  const stableRows = getStableInstagramUpsertRows(rows);
  const batches = buildUpsertBatches(mode, stableRows, upsertChunkSize);
  const endpoint = `${supabaseUrl}/rest/v1/${table}?on_conflict=id`;
  let written = 0;

  for (let index = 0; index < batches.length; index += 1) {
    const batch = batches[index];
    const batchNumber = index + 1;
    const payloadKind = Array.isArray(batch) ? "array" : typeof batch;
    const firstRecord = Array.isArray(batch) && batch.length > 0 ? batch[0] : null;
    const payloadBody = batch ? JSON.stringify(batch) : undefined;

    if (mode === "full") {
      console.log(
        [
          `Full sync upsert prep batch=${batchNumber}/${batches.length}`,
          `size=${Array.isArray(batch) ? batch.length : 0}`,
          `payload=${payloadKind}`,
          `first_id=${firstRecord?.id ?? "n/a"}`,
          `first_source_id=${firstRecord?.source_id ?? "n/a"}`
        ].join(" ")
      );
    }

    if (!Array.isArray(batch) || batch.length === 0) {
      console.warn(`Lege of ongeldige batch overgeslagen (${batchNumber}/${batches.length}).`);
      continue;
    }

    if (!payloadBody || payloadBody === "[]") {
      console.warn(`Lege payloadstring overgeslagen (${batchNumber}/${batches.length}).`);
      continue;
    }

    await fetchJson(endpoint, {
      method: "POST",
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        "Content-Type": "application/json",
        Prefer: "resolution=merge-duplicates,return=minimal"
      },
      body: payloadBody
    });
    written += batch.length;
    console.log(`Upsert batch ${batchNumber}/${batches.length}: ${batch.length} records.`);
  }

  return written;
}

export async function runInstagramSync(options: InstagramSyncOptions): Promise<void> {
  const { supabaseUrl, supabaseReadKey, table } = getSupabaseRestConfig(process.env);
  const config = getInstagramSyncConfig(options, process.env);
  const modeLabel = options.mode === "test" ? "test-ingest" : "sync";
  const upsertChunkSize =
    options.mode === "full" ? Math.min(UPSERT_CHUNK_SIZE, Math.max(config.pageSize, 1)) : UPSERT_CHUNK_SIZE;

  console.log(
    `Instagram ${modeLabel} gestart (pageSize=${config.pageSize}, maxRecords=${config.maxRecords ?? "all"}, table=${table}, auth=${config.authSource}).`
  );
  if (config.includeSourceIds.size > 0) {
    console.log(`Filter actief op source IDs: ${Array.from(config.includeSourceIds).join(", ")}`);
  }

  const syncRunId = await createSyncRun(supabaseUrl, supabaseReadKey);
  try {
    const { accountId, mediaNodes } = await fetchInstagramMedia(config);
    console.log(`Instagram account resolved: ${accountId}${config.pageId ? ` via page ${config.pageId}` : ""}.`);

    const rawRecords = mediaNodes
      .map((node) => mapInstagramGraphMediaNodeToRawRecord(node))
      .filter((record): record is NonNullable<typeof record> => Boolean(record))
      .filter((record) => config.includeSourceIds.size === 0 || config.includeSourceIds.has(record.id));

    const normalizedItems = rawRecords.map((rawRecord) =>
      normalizeInstagramPost(rawRecord, instagramPostOverrides[rawRecord.id])
    );
    const rows = normalizedItems.map((item) => mapContentItemToSupabaseRow(item));

    if (rows.length === 0) {
      console.log("Geen records gevonden voor ingestie met huidige filter/limit.");
      await finalizeSyncRun(supabaseUrl, supabaseReadKey, syncRunId, "success", mediaNodes.length, 0, 0);
      return;
    }

    const upsertedCount = await upsertRows(options.mode, upsertChunkSize, supabaseUrl, supabaseReadKey, table, rows);
    await updateSyncState(supabaseUrl, supabaseReadKey);
    await finalizeSyncRun(supabaseUrl, supabaseReadKey, syncRunId, "success", mediaNodes.length, upsertedCount, 0);

    console.log(`Instagram ${modeLabel} voltooid: ${upsertedCount} records geupsert.`);
    console.log(`Voorbeeld slugs: ${normalizedItems.slice(0, 5).map((item) => item.slug).join(", ")}`);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Onbekende ingest-fout";
    await finalizeSyncRun(supabaseUrl, supabaseReadKey, syncRunId, "failed", 0, 0, 1, message);
    throw error;
  }
}

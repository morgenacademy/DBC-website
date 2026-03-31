import { createContentDataSourceFromEnv, CONTENT_DATA_SOURCE_ENV_KEY } from "../../lib/repositories/content-data-source-factory";
import { mapSupabaseContentRowToContentItem } from "../../lib/adapters/instagram";
import type { ContentItem } from "../../lib/types";
import type { SupabaseContentRow } from "../../lib/adapters/instagram";
import { fetchJson, getSupabaseRestConfig } from "./utils";

const READ_LIMIT = 50;

function getLiveItemIds(items: ContentItem[]): Set<string> {
  return new Set(items.filter((item) => item.sourcePlatform === "instagram" && item.sourceId).map((item) => item.id));
}

async function run(): Promise<void> {
  const { supabaseUrl, supabaseReadKey, table } = getSupabaseRestConfig(process.env);
  const endpoint = `${supabaseUrl}/rest/v1/${table}?select=*&order=published_at.desc&limit=${READ_LIMIT}`;

  const payload = await fetchJson(endpoint, {
    method: "GET",
    headers: {
      apikey: supabaseReadKey,
      Authorization: `Bearer ${supabaseReadKey}`
    },
    cache: "no-store"
  });

  if (!Array.isArray(payload)) {
    throw new Error("Onverwachte response: verwacht een array met content rows.");
  }

  const rows = payload as SupabaseContentRow[];
  const itemsFromRows = rows.map((row) => mapSupabaseContentRowToContentItem(row));
  const instagramItemsFromRows = itemsFromRows.filter((item) => item.sourcePlatform === "instagram" && item.sourceId);

  if (itemsFromRows.length === 0) {
    console.warn("Read-path OK, maar nog geen records in Supabase.");
    return;
  }

  const invalidItems = itemsFromRows.filter((item) => !item.id || !item.slug || !item.title || !item.publishedAt);
  if (invalidItems.length > 0) {
    throw new Error(`Read-path faalde validatie: ${invalidItems.length} record(s) missen verplichte velden.`);
  }

  const siteDataSource = await createContentDataSourceFromEnv({
    ...process.env,
    [CONTENT_DATA_SOURCE_ENV_KEY]: "supabase"
  });
  const siteItems = siteDataSource.listContentItems();
  const liveSiteItemIds = getLiveItemIds(siteItems);
  const missingLiveItems = instagramItemsFromRows.filter((item) => !liveSiteItemIds.has(item.id));

  if (missingLiveItems.length > 0) {
    throw new Error(`Site read-path mist ${missingLiveItems.length} live record(s) uit Supabase.`);
  }

  console.log(
    `Read-path OK. ${instagramItemsFromRows.length} live Instagram-records geladen uit ${table} en zichtbaar via de site datasource.`
  );
  console.log(`Voorbeeld slug(s): ${siteItems.slice(0, 5).map((item) => item.slug).join(", ")}`);
}

run().catch((error) => {
  console.error(error instanceof Error ? error.message : "Read-path verificatie mislukt.");
  process.exit(1);
});

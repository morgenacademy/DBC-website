import { mapSupabaseContentRowToContentItem } from "../../lib/adapters/instagram";
import type { SupabaseContentRow } from "../../lib/adapters/instagram";
import { fetchJson, getSupabaseRestConfig } from "./utils";

const READ_LIMIT = 50;

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
  const items = rows.map((row) => mapSupabaseContentRowToContentItem(row));

  if (items.length === 0) {
    console.warn("Read-path OK, maar nog geen records in Supabase.");
    return;
  }

  const invalidItems = items.filter((item) => !item.id || !item.slug || !item.title || !item.publishedAt);
  if (invalidItems.length > 0) {
    throw new Error(`Read-path faalde validatie: ${invalidItems.length} record(s) missen verplichte velden.`);
  }

  console.log(`Read-path OK. ${items.length} records geladen uit ${table}.`);
  console.log(`Voorbeeld slug(s): ${items.slice(0, 5).map((item) => item.slug).join(", ")}`);
}

run().catch((error) => {
  console.error(error instanceof Error ? error.message : "Read-path verificatie mislukt.");
  process.exit(1);
});

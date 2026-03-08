import { contentItems } from "../../lib/data/content-items";
import { mapContentItemToSupabaseRow } from "../../lib/adapters/instagram";
import { chunk, fetchJson, getSupabaseRestConfig } from "./utils";

const UPSERT_CHUNK_SIZE = 100;

async function run(): Promise<void> {
  const { supabaseUrl, supabaseReadKey, table } = getSupabaseRestConfig(process.env);
  const rows = contentItems.map((item) => mapContentItemToSupabaseRow(item));
  const batches = chunk(rows, UPSERT_CHUNK_SIZE);

  if (rows.length === 0) {
    console.log("Geen content items gevonden voor backfill.");
    return;
  }

  console.log(`Backfill gestart: ${rows.length} records naar ${table} (${batches.length} batch(es)).`);

  for (let index = 0; index < batches.length; index += 1) {
    const batch = batches[index];
    const endpoint = `${supabaseUrl}/rest/v1/${table}?on_conflict=id`;

    await fetchJson(endpoint, {
      method: "POST",
      headers: {
        apikey: supabaseReadKey,
        Authorization: `Bearer ${supabaseReadKey}`,
        "Content-Type": "application/json",
        Prefer: "resolution=merge-duplicates,return=minimal"
      },
      body: JSON.stringify(batch)
    });

    console.log(`Batch ${index + 1}/${batches.length} voltooid (${batch.length} records).`);
  }

  console.log("Backfill succesvol afgerond.");
}

run().catch((error) => {
  console.error(error instanceof Error ? error.message : "Backfill mislukt.");
  process.exit(1);
});

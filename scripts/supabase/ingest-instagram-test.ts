import { runInstagramSync } from "./instagram-sync";

runInstagramSync({ mode: "test" }).catch((error) => {
  console.error(error instanceof Error ? error.message : "Instagram test-ingest mislukt.");
  process.exit(1);
});

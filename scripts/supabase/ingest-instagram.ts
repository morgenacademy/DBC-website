import { runInstagramSync } from "./instagram-sync";

runInstagramSync({ mode: "full" }).catch((error) => {
  console.error(error instanceof Error ? error.message : "Instagram sync mislukt.");
  process.exit(1);
});

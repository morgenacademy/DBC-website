import type { ContentItem } from "@/lib/types";

function normalize(values: string[]): string {
  return values
    .join(" ")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9# ]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function createSearchIndexInput(item: ContentItem): string {
  return normalize([
    item.title,
    item.caption,
    item.excerpt,
    ...item.hashtags.map((tag) => `#${tag.replace(/^#/, "")}`),
    ...item.tags,
    ...item.themes,
    ...item.categories,
    ...item.moments
  ]);
}

export function queryMatchesIndex(indexInput: string, query: string): boolean {
  if (!query.trim()) return true;

  const normalizedQuery = normalize([query]);
  return indexInput.includes(normalizedQuery);
}

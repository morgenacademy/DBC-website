import type { ContentItem, Theme } from "@/lib/types";

function getFirstRelevantImage(items: ContentItem[]): string | undefined {
  return items.find((item) => item.image)?.image ?? items.find((item) => item.thumbnail)?.thumbnail;
}

export function resolveThemeHeroImage(theme: Theme, relevantItems: ContentItem[]): string | undefined {
  return theme.heroImage ?? getFirstRelevantImage(relevantItems);
}

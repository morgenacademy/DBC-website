import type { ContentLayer, MediaType, SourcePlatform, WeekendCategory } from "@/lib/types";

const contentLayerLabels: Record<ContentLayer, string> = {
  fast: "Nieuw",
  evergreen: "Gids",
  moment: "Moment"
};

const categoryLabels: Record<WeekendCategory, string> = {
  food: "Eten",
  events: "Events",
  culture: "Cultuur",
  kids: "Kids",
  shopping: "Winkelen",
  nightlife: "Uitgaan",
  "local-tips": "Lokale tips"
};

const sourcePlatformLabels: Record<SourcePlatform, string> = {
  instagram: "Instagram",
  editorial: "Redactie"
};

const mediaTypeLabels: Record<MediaType, string> = {
  image: "Foto",
  carousel: "Carousel",
  reel: "Reel"
};

export function getContentLayerLabel(layer: ContentLayer): string {
  return contentLayerLabels[layer] ?? layer;
}

export function getCategoryLabel(category: WeekendCategory | string | undefined): string {
  if (!category) return "";
  return categoryLabels[category as WeekendCategory] ?? category;
}

export function getSourcePlatformLabel(platform: SourcePlatform): string {
  return sourcePlatformLabels[platform] ?? platform;
}

export function getMediaTypeLabel(type: MediaType): string {
  return mediaTypeLabels[type] ?? type;
}

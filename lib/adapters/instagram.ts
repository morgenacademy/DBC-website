import { slugify } from "@/lib/utils";
import type { ContentItem, InstagramRawRecord } from "@/lib/types";

export function normalizeInstagramRecord(raw: InstagramRawRecord): ContentItem {
  const plainCaption = raw.caption.replace(/#\w+/g, "").trim();
  const hashtags = raw.caption.match(/#(\w+)/g)?.map((value) => value.replace("#", "")) ?? [];

  return {
    id: `ig-${raw.id}`,
    slug: slugify(plainCaption.slice(0, 64) || raw.id),
    title: plainCaption.slice(0, 64) || "Instagram item",
    excerpt: plainCaption.slice(0, 140),
    caption: raw.caption,
    body: [plainCaption],
    sourcePlatform: "instagram",
    sourcePermalink: raw.permalink,
    sourceId: raw.id,
    mediaType: raw.media_type === "VIDEO" ? "reel" : raw.media_type === "CAROUSEL_ALBUM" ? "carousel" : "image",
    image: raw.media_url,
    publishedAt: raw.timestamp,
    contentLayer: "fast",
    categories: ["local-tips"],
    themes: [],
    moments: [],
    tags: [],
    hashtags,
    isFeatured: false,
    collectionIds: [],
    relatedIds: []
  };
}

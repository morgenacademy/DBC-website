import { finalizeContentItem } from "@/lib/content-item-factory";
import { enrichInstagramTaxonomy } from "@/lib/enrichment/instagram-taxonomy";
import { slugify } from "@/lib/utils";
import type {
  ContentItem,
  ContentItemDraft,
  InstagramIngestionAdapter,
  InstagramPostOverride,
  InstagramRawRecord,
  SeoFields
} from "@/lib/types";

export interface SupabaseContentRow {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  caption: string;
  body: string[];
  source_platform: "instagram" | "editorial";
  source_permalink?: string | null;
  source_id?: string | null;
  media_type: "image" | "carousel" | "reel";
  image: string;
  thumbnail: string;
  media_urls: string[];
  published_at: string;
  searchable_text?: string | null;
  content_layer: "fast" | "evergreen" | "moment";
  categories: string[];
  themes: string[];
  moments: string[];
  tags: string[];
  hashtags: string[];
  manual_tags?: string[] | null;
  featured?: boolean | null;
  is_featured: boolean;
  featured_rank?: number | null;
  editorial_label?: string | null;
  hero_variant?: "standard" | "immersive" | "split" | null;
  collection_ids: string[];
  related_ids: string[];
  seo?: SeoFields | null;
}

function extractHashtags(caption: string): string[] {
  return caption
    .match(/#([\p{L}\p{N}_]+)/gu)
    ?.map((value) => value.replace("#", "").toLowerCase())
    .filter(Boolean) ?? [];
}

function getPrimaryImage(raw: InstagramRawRecord, override: InstagramPostOverride): string {
  return override.thumbnail ?? raw.thumbnail_url ?? raw.media_urls?.[0] ?? raw.media_url;
}

function getMediaUrls(raw: InstagramRawRecord, override: InstagramPostOverride, primaryImage: string): string[] {
  if (override.mediaUrls && override.mediaUrls.length > 0) {
    return override.mediaUrls;
  }

  if (raw.media_type === "VIDEO") {
    return [
      ...new Set(
        [raw.media_url, raw.thumbnail_url].filter((value): value is string => Boolean(value))
      )
    ];
  }

  return raw.media_urls ?? [primaryImage];
}

export function truncateText(value: string, maxCharacters: number): string {
  return Array.from(value).slice(0, maxCharacters).join("");
}

export function normalizeInstagramPost(raw: InstagramRawRecord, override: InstagramPostOverride = {}): ContentItem {
  const plainCaption = raw.caption.replace(/#[\p{L}\p{N}_]+/gu, "").replace(/\s+/g, " ").trim();
  const hashtags = extractHashtags(raw.caption);
  const enrichment = enrichInstagramTaxonomy(raw.caption, hashtags);
  const primaryImage = getPrimaryImage(raw, override);
  const mediaUrls = getMediaUrls(raw, override, primaryImage);
  const title = override.title ?? (truncateText(plainCaption, 72) || "Instagram item");

  const draft: ContentItemDraft = {
    id: override.internalId ?? `ig-${raw.id}`,
    slug: override.slug ?? raw.slug ?? slugify(title),
    title,
    excerpt: override.excerpt ?? truncateText(plainCaption, 160),
    caption: raw.caption,
    body: override.body ?? [plainCaption],
    sourcePlatform: "instagram",
    sourcePermalink: raw.permalink,
    sourceId: raw.id,
    mediaType: raw.media_type === "VIDEO" ? "reel" : raw.media_type === "CAROUSEL_ALBUM" ? "carousel" : "image",
    image: primaryImage,
    thumbnail: primaryImage,
    mediaUrls,
    publishedAt: raw.timestamp,
    contentLayer: override.contentLayer ?? "fast",
    categories: override.categories ?? enrichment.categories,
    themes: override.themes ?? enrichment.themes,
    moments: override.moments ?? enrichment.moments,
    tags: override.tags ?? [],
    hashtags,
    manualTags: override.manualTags ?? [],
    isFeatured: override.isFeatured ?? override.featured ?? false,
    featured: override.featured ?? override.isFeatured ?? false,
    featuredRank: override.featuredRank,
    editorialLabel: override.editorialLabel,
    heroVariant: override.heroVariant,
    collectionIds: override.collectionIds ?? [],
    relatedIds: override.relatedIds ?? [],
    seo: override.seo
  };

  return finalizeContentItem(draft);
}

export function mapSupabaseContentRowToContentItem(row: SupabaseContentRow): ContentItem {
  const draft: ContentItemDraft = {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    caption: row.caption,
    body: row.body,
    sourcePlatform: row.source_platform,
    sourcePermalink: row.source_permalink ?? undefined,
    sourceId: row.source_id ?? undefined,
    mediaType: row.media_type,
    image: row.image,
    thumbnail: row.thumbnail,
    mediaUrls: row.media_urls,
    publishedAt: row.published_at,
    searchableText: row.searchable_text ?? undefined,
    contentLayer: row.content_layer,
    categories: row.categories as ContentItem["categories"],
    themes: row.themes,
    moments: row.moments,
    tags: row.tags,
    hashtags: row.hashtags,
    manualTags: row.manual_tags ?? [],
    featured: row.featured ?? row.is_featured,
    isFeatured: row.is_featured,
    featuredRank: row.featured_rank ?? undefined,
    editorialLabel: row.editorial_label ?? undefined,
    heroVariant: row.hero_variant ?? undefined,
    collectionIds: row.collection_ids,
    relatedIds: row.related_ids,
    seo: row.seo ?? undefined
  };

  return finalizeContentItem(draft);
}

export function mapContentItemToSupabaseRow(item: ContentItem): SupabaseContentRow {
  return {
    id: item.id,
    slug: item.slug,
    title: item.title,
    excerpt: item.excerpt,
    caption: item.caption,
    body: item.body,
    source_platform: item.sourcePlatform,
    source_permalink: item.sourcePermalink ?? null,
    source_id: item.sourceId ?? null,
    media_type: item.mediaType,
    image: item.image,
    thumbnail: item.thumbnail,
    media_urls: item.mediaUrls,
    published_at: item.publishedAt,
    searchable_text: item.searchableText,
    content_layer: item.contentLayer,
    categories: item.categories,
    themes: item.themes,
    moments: item.moments,
    tags: item.tags,
    hashtags: item.hashtags,
    manual_tags: item.manualTags ?? [],
    featured: item.featured ?? item.isFeatured,
    is_featured: item.isFeatured,
    featured_rank: item.featuredRank ?? null,
    editorial_label: item.editorialLabel ?? null,
    hero_variant: item.heroVariant ?? null,
    collection_ids: item.collectionIds,
    related_ids: item.relatedIds,
    seo: item.seo ?? null
  };
}

export const instagramIngestionAdapter: InstagramIngestionAdapter = {
  normalizeInstagramPost
};

// Backwards compatible alias for existing imports/tests.
export const normalizeInstagramRecord = normalizeInstagramPost;

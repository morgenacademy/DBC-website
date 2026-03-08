export type SourcePlatform = "instagram" | "editorial";

export type MediaType = "image" | "carousel" | "reel";

export type ContentLayer = "fast" | "evergreen" | "moment";

export type HeroVariant = "standard" | "immersive" | "split";

export type WeekendCategory =
  | "food"
  | "events"
  | "culture"
  | "kids"
  | "shopping"
  | "nightlife"
  | "local-tips";

export interface SeoFields {
  title?: string;
  description?: string;
  ogImage?: string;
  canonicalPath?: string;
  noIndex?: boolean;
}

export interface ContentItem {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  caption: string;
  body: string[];
  sourcePlatform: SourcePlatform;
  sourcePermalink?: string;
  sourceId?: string;
  mediaType: MediaType;
  image: string;
  publishedAt: string;
  contentLayer: ContentLayer;
  categories: WeekendCategory[];
  themes: string[];
  moments: string[];
  tags: string[];
  hashtags: string[];
  isFeatured: boolean;
  featuredRank?: number;
  editorialLabel?: string;
  heroVariant?: HeroVariant;
  collectionIds: string[];
  relatedIds: string[];
  seo?: SeoFields;
}

export interface WeekendItem {
  id: string;
  title: string;
  slug: string;
  date: string;
  endDate?: string;
  category: WeekendCategory;
  location: string;
  summary: string;
  ctaLabel: string;
  ctaHref: string;
  image: string;
}

export interface Theme {
  id: string;
  slug: string;
  title: string;
  kind: "theme" | "moment";
  intro: string;
  heroImage: string;
  accentColor: string;
  featuredContentIds: string[];
  seo?: SeoFields;
}

export interface Collection {
  id: string;
  slug: string;
  title: string;
  intro: string;
  contentIds: string[];
  channel: "newsletter" | "campaign" | "seasonal" | "editorial";
  heroImage: string;
  ctaLabel?: string;
  ctaHref?: string;
  seo?: SeoFields;
}

export interface Product {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  priceDisplay?: string;
  image: string;
  imageUrls: string[];
  category: string;
  color?: string;
  partnerName: string;
  partnerUrl: string;
  badge?: string;
  isFeatured: boolean;
  notes?: string;
}

export interface ContentFilters {
  q?: string;
  theme?: string;
  category?: WeekendCategory | string;
  moment?: string;
  type?: ContentLayer | string;
}

export interface DateRange {
  from: string;
  to: string;
}

export interface ContentRepository {
  listContent(filters?: ContentFilters): ContentItem[];
  getContentBySlug(slug: string): ContentItem | undefined;
  searchContent(query: string, filters?: Omit<ContentFilters, "q">): ContentItem[];
  getRelatedContent(item: ContentItem, limit?: number): ContentItem[];
}

export interface ThemeRepository {
  listThemes(kind?: Theme["kind"]): Theme[];
  getThemeBySlug(slug: string): Theme | undefined;
}

export interface CollectionRepository {
  listCollections(channel?: Collection["channel"]): Collection[];
  getCollectionBySlug(slug: string): Collection | undefined;
}

export interface WeekendRepository {
  listWeekendItems(dateRange?: DateRange, category?: WeekendCategory): WeekendItem[];
}

export interface CommerceProvider {
  listProducts(featuredOnly?: boolean): Product[];
  getProductBySlug(slug: string): Product | undefined;
}

export interface InstagramRawRecord {
  id: string;
  permalink: string;
  caption: string;
  media_type: "IMAGE" | "CAROUSEL_ALBUM" | "VIDEO";
  media_url: string;
  timestamp: string;
}

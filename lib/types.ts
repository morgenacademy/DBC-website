export type SourcePlatform = "instagram" | "editorial" | "press";

export type ContentType = "instafirst_update" | "guide" | "eigen_post";

export type ContentStatus = "draft" | "review" | "published" | "archived";

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
  googleMapsUrl?: string;
}

export interface ContentItem {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  caption: string;
  body: string[];
  contentType: ContentType;
  sourcePlatform: SourcePlatform;
  sourcePermalink?: string;
  sourceId?: string;
  mediaType: MediaType;
  image: string;
  thumbnail: string;
  mediaUrls: string[];
  publishedAt: string;
  firstPublishedAt?: string;
  lastMaterialUpdateAt?: string;
  relevanceStartAt?: string;
  relevanceEndAt?: string;
  evergreenScore: number;
  freshnessRank?: number;
  status: ContentStatus;
  searchableText: string;
  contentLayer: ContentLayer;
  categories: WeekendCategory[];
  themes: string[];
  moments: string[];
  tags: string[];
  hashtags: string[];
  manualTags?: string[];
  featured?: boolean;
  isFeatured: boolean;
  featuredRank?: number;
  editorialLabel?: string;
  heroVariant?: HeroVariant;
  collectionIds: string[];
  relatedIds: string[];
  seo?: SeoFields;
}

export type ContentItemDraft = Omit<
  ContentItem,
  | "contentType"
  | "thumbnail"
  | "mediaUrls"
  | "firstPublishedAt"
  | "lastMaterialUpdateAt"
  | "relevanceStartAt"
  | "relevanceEndAt"
  | "evergreenScore"
  | "freshnessRank"
  | "status"
  | "searchableText"
  | "manualTags"
  | "featured"
> & {
  contentType?: ContentType;
  thumbnail?: string;
  mediaUrls?: string[];
  firstPublishedAt?: string;
  lastMaterialUpdateAt?: string;
  relevanceStartAt?: string;
  relevanceEndAt?: string;
  evergreenScore?: number;
  freshnessRank?: number;
  status?: ContentStatus;
  searchableText?: string;
  manualTags?: string[];
  featured?: boolean;
};

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

export type WeekendGuideDay = "hele-weekend" | "donderdag" | "vrijdag" | "zaterdag" | "zondag" | "maandag";

export interface WeekendGuideWeather {
  day: "do" | "vr" | "za" | "zo" | "ma";
  temperature: string;
  icon: "sunny" | "partly-cloudy" | "cloudy" | "rainy";
}

export interface WeekendGuideEvent {
  id: string;
  slug: string;
  title: string;
  description: string;
  venue: string;
  timeLabel?: string;
  detailsList?: string[];
  day: WeekendGuideDay;
  sourceDateLabel?: string;
  sourceLink?: string;
}

export interface WeekendGuideEdition {
  id: string;
  slug: string;
  title: string;
  periodLabel: string;
  introTitle: string;
  introBody: string;
  weather: WeekendGuideWeather[];
  events: WeekendGuideEvent[];
}

export interface Theme {
  id: string;
  slug: string;
  title: string;
  kind: "theme" | "moment";
  intro: string;
  heroImage?: string;
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
  contentType?: ContentType | string;
  status?: ContentStatus | "all";
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
  listFeatured(limit?: number): ContentItem[];
  listLatest(limit?: number): ContentItem[];
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
  getCurrentGuide(): WeekendGuideEdition;
  listGuideSections(editionSlug?: string): { day: WeekendGuideDay; label: string; events: WeekendGuideEvent[] }[];
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
  media_urls?: string[];
  thumbnail_url?: string;
  timestamp: string;
  slug?: string;
}

export interface InstagramPostOverride {
  internalId?: string;
  slug?: string;
  title?: string;
  excerpt?: string;
  body?: string[];
  contentLayer?: ContentLayer;
  categories?: WeekendCategory[];
  themes?: string[];
  moments?: string[];
  tags?: string[];
  manualTags?: string[];
  isFeatured?: boolean;
  featured?: boolean;
  featuredRank?: number;
  editorialLabel?: string;
  heroVariant?: HeroVariant;
  collectionIds?: string[];
  relatedIds?: string[];
  seo?: SeoFields;
  thumbnail?: string;
  mediaUrls?: string[];
}

export interface InstagramIngestionAdapter {
  normalizeInstagramPost(rawPost: InstagramRawRecord, override?: InstagramPostOverride): ContentItem;
}

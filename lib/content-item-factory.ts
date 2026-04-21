import { createSearchIndexInput } from "@/lib/search-index";
import type { ContentItem, ContentItemDraft, ContentType } from "@/lib/types";

function resolveContentType(draft: ContentItemDraft): ContentType {
  if (draft.contentType) return draft.contentType;
  if (draft.sourcePlatform === "instagram") return "instafirst_update";
  return "eigen_post";
}

export function finalizeContentItem(draft: ContentItemDraft): ContentItem {
  const thumbnail = draft.thumbnail ?? draft.image;
  const mediaUrls = draft.mediaUrls && draft.mediaUrls.length > 0 ? draft.mediaUrls : [thumbnail];
  const manualTags = draft.manualTags ?? [];
  const featured = draft.featured ?? draft.isFeatured;
  const contentType = resolveContentType(draft);

  const withDefaults: ContentItem = {
    ...draft,
    contentType,
    thumbnail,
    mediaUrls,
    firstPublishedAt: draft.firstPublishedAt ?? draft.publishedAt,
    lastMaterialUpdateAt: draft.lastMaterialUpdateAt,
    relevanceStartAt: draft.relevanceStartAt,
    relevanceEndAt: draft.relevanceEndAt,
    evergreenScore: draft.evergreenScore ?? (draft.contentLayer === "evergreen" ? 50 : 0),
    freshnessRank: draft.freshnessRank,
    status: draft.status ?? "published",
    manualTags,
    featured,
    searchableText: draft.searchableText ?? ""
  };

  return {
    ...withDefaults,
    searchableText: draft.searchableText ?? createSearchIndexInput(withDefaults)
  };
}

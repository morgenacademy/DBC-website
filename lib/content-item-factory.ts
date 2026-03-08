import { createSearchIndexInput } from "@/lib/search-index";
import type { ContentItem, ContentItemDraft } from "@/lib/types";

export function finalizeContentItem(draft: ContentItemDraft): ContentItem {
  const thumbnail = draft.thumbnail ?? draft.image;
  const mediaUrls = draft.mediaUrls && draft.mediaUrls.length > 0 ? draft.mediaUrls : [thumbnail];
  const manualTags = draft.manualTags ?? [];
  const featured = draft.featured ?? draft.isFeatured;

  const withDefaults: ContentItem = {
    ...draft,
    thumbnail,
    mediaUrls,
    manualTags,
    featured,
    searchableText: draft.searchableText ?? ""
  };

  return {
    ...withDefaults,
    searchableText: draft.searchableText ?? createSearchIndexInput(withDefaults)
  };
}

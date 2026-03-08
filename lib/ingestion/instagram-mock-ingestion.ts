import { normalizeInstagramPost } from "@/lib/adapters/instagram";
import { instagramPostOverrides } from "@/lib/data/instagram-post-overrides";
import { instagramRawPosts } from "@/lib/data/instagram-raw-posts";
import type { ContentItem } from "@/lib/types";

export function ingestMockInstagramContent(): ContentItem[] {
  return instagramRawPosts.map((rawPost) => normalizeInstagramPost(rawPost, instagramPostOverrides[rawPost.id]));
}

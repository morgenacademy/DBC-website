import { describe, expect, it } from "vitest";
import { resolveContentMediaEntries } from "@/lib/content-media";
import type { ContentItem } from "@/lib/types";

const baseItem: ContentItem = {
  id: "ig-1",
  slug: "post",
  title: "Post",
  excerpt: "Excerpt",
  caption: "Caption",
  body: ["Paragraph"],
  sourcePlatform: "instagram",
  sourcePermalink: "https://instagram.com/p/test",
  sourceId: "1",
  mediaType: "image",
  image: "https://example.com/image.jpg",
  thumbnail: "https://example.com/thumb.jpg",
  mediaUrls: ["https://example.com/image.jpg"],
  publishedAt: "2026-03-31T00:00:00.000Z",
  searchableText: "post",
  contentLayer: "fast",
  categories: ["local-tips"],
  themes: [],
  moments: [],
  tags: [],
  hashtags: [],
  isFeatured: false,
  collectionIds: [],
  relatedIds: []
};

describe("resolveContentMediaEntries", () => {
  it("prefers the stored video url for single video posts", () => {
    expect(
      resolveContentMediaEntries({
        ...baseItem,
        mediaType: "reel",
        mediaUrls: ["https://example.com/video.mp4", "https://example.com/poster.jpg"]
      })
    ).toEqual([{ type: "video", url: "https://example.com/video.mp4", poster: "https://example.com/thumb.jpg" }]);
  });

  it("collapses mixed carousel video+poster pairs into ordered media entries", () => {
    expect(
      resolveContentMediaEntries({
        ...baseItem,
        mediaType: "carousel",
        mediaUrls: [
          "https://example.com/image-1.jpg",
          "https://example.com/video-2.mp4",
          "https://example.com/poster-2.jpg",
          "https://example.com/image-3.jpg"
        ]
      })
    ).toEqual([
      { type: "image", url: "https://example.com/image-1.jpg" },
      { type: "video", url: "https://example.com/video-2.mp4", poster: "https://example.com/poster-2.jpg" },
      { type: "image", url: "https://example.com/image-3.jpg" }
    ]);
  });
});

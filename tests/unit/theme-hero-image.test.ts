import { describe, expect, it } from "vitest";
import { resolveThemeHeroImage } from "@/lib/theme-hero-image";
import type { ContentItem, Theme } from "@/lib/types";

const baseTheme: Theme = {
  id: "t1",
  slug: "terraces",
  title: "Terrassen",
  kind: "theme",
  intro: "Test",
  accentColor: "#F2B484",
  featuredContentIds: []
};

const baseItem: ContentItem = {
  id: "ig-1",
  slug: "terraces-post",
  title: "Terraces post",
  excerpt: "Excerpt",
  caption: "Caption",
  body: ["Paragraph"],
  contentType: "instafirst_update",
  sourcePlatform: "instagram",
  sourcePermalink: "https://instagram.com/p/test",
  sourceId: "1",
  mediaType: "image",
  image: "https://example.com/image.jpg",
  thumbnail: "https://example.com/thumb.jpg",
  mediaUrls: ["https://example.com/image.jpg"],
  publishedAt: "2026-03-31T00:00:00.000Z",
  firstPublishedAt: "2026-03-31T00:00:00.000Z",
  evergreenScore: 0,
  status: "published",
  searchableText: "terraces post",
  contentLayer: "fast",
  categories: ["local-tips"],
  themes: ["terraces"],
  moments: [],
  tags: [],
  hashtags: [],
  isFeatured: false,
  collectionIds: [],
  relatedIds: []
};

describe("resolveThemeHeroImage", () => {
  it("prefers the manual editorial hero image", () => {
    expect(resolveThemeHeroImage({ ...baseTheme, heroImage: "https://example.com/editorial.jpg" }, [baseItem])).toBe(
      "https://example.com/editorial.jpg"
    );
  });

  it("falls back to the first relevant content image when no manual hero exists", () => {
    expect(resolveThemeHeroImage(baseTheme, [baseItem])).toBe("https://example.com/image.jpg");
  });
});

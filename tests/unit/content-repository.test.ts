import { describe, expect, it } from "vitest";
import { contentRepository } from "@/lib/repositories";

describe("content repository", () => {
  it("kan filteren op theme", () => {
    const items = contentRepository.listContent({ theme: "vegetarian" });
    expect(items.length).toBeGreaterThan(0);
    expect(items.every((item) => item.themes.includes("vegetarian"))).toBe(true);
  });

  it("kan zoeken op query", () => {
    const items = contentRepository.searchContent("koningsdag");
    expect(items.some((item) => item.slug === "koningsdag-den-bosch-2026")).toBe(true);
  });

  it("kan filteren op content type", () => {
    const guides = contentRepository.listContent({ contentType: "guide" });
    expect(guides.map((item) => item.slug)).toContain("mei-in-den-bosch-maandgids");
    expect(guides.every((item) => item.contentType === "guide")).toBe(true);
  });

  it("geeft gerelateerde content terug", () => {
    const item = contentRepository.getContentBySlug("11-vegetarian-restaurants-den-bosch");
    expect(item).toBeDefined();
    if (!item) return;

    const related = contentRepository.getRelatedContent(item, 3);
    expect(related.length).toBeGreaterThan(0);
    expect(related[0].id).not.toBe(item.id);
  });
});

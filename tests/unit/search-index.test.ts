import { describe, expect, it } from "vitest";
import { createSearchIndexInput, queryMatchesIndex } from "@/lib/search-index";
import { contentItems } from "@/lib/data/content-items";

describe("search index shaping", () => {
  it("neemt title, caption, tags en taxonomy velden mee", () => {
    const item = contentItems[0];
    const index = createSearchIndexInput(item);

    expect(index).toContain("vegetarian");
    expect(index).toContain("restaurants");
    expect(index).toContain("weekend in den bosch");
  });

  it("matcht query tegen genormaliseerde input", () => {
    const index = createSearchIndexInput(contentItems[0]);
    expect(queryMatchesIndex(index, "vegetarian")).toBe(true);
    expect(queryMatchesIndex(index, "carnaval")).toBe(false);
  });
});

import { describe, expect, it } from "vitest";
import { buildContentDetailCopy } from "@/lib/content-detail";

describe("buildContentDetailCopy", () => {
  it("removes a duplicated lead sentence from the first body paragraph when the title is a truncated prefix", () => {
    const result = buildContentDetailCopy({
      title: "Oke dit is zo'n plek wat je eigenlijk geheim zou willen houden: @uylenho",
      excerpt: "Oke dit is zo'n plek wat je eigenlijk geheim zou willen houden: @uylenho",
      body: [
        "Oke dit is zo'n plek wat je eigenlijk geheim zou willen houden: @uylenhohotel. Verstopt in de Uilenburg, in een van de oudste pandjes van Den Bosch.",
        "De binnentuin maakt het af."
      ]
    });

    expect(result.showExcerpt).toBe(false);
    expect(result.bodyParagraphs).toEqual([
      "Verstopt in de Uilenburg, in een van de oudste pandjes van Den Bosch.",
      "De binnentuin maakt het af."
    ]);
  });

  it("keeps a distinct excerpt once near the top and removes exact repetition from the body", () => {
    const result = buildContentDetailCopy({
      title: "De beste terrassen in Den Bosch",
      excerpt: "Zonnige plekken langs de Binnendieze, op pleinen en in rustige straatjes.",
      body: [
        "Zonnige plekken langs de Binnendieze, op pleinen en in rustige straatjes.",
        "Hier drink je iets op het water, in het terrasgroen of op een intiem plein."
      ]
    });

    expect(result.showExcerpt).toBe(true);
    expect(result.bodyParagraphs).toEqual([
      "Hier drink je iets op het water, in het terrasgroen of op een intiem plein."
    ]);
  });
});

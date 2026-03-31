import { describe, expect, it } from "vitest";
import { enrichInstagramTaxonomy } from "@/lib/enrichment/instagram-taxonomy";

describe("enrichInstagramTaxonomy", () => {
  it("maps vegetarian terrace content to an existing theme and food category", () => {
    expect(
      enrichInstagramTaxonomy(
        "Vegetarisch brunchen op het terras met goede koffie en brunch plates in Den Bosch.",
        ["denboschcity", "vegetarisch", "brunch"]
      )
    ).toEqual({
      categories: ["food"],
      themes: ["vegetarian", "terraces"],
      moments: []
    });
  });

  it("maps shopping content from caption keywords", () => {
    expect(
      enrichInstagramTaxonomy("Wat issie leuk die bordeauxrode hoodie. Shop via de link in onze bio.", [
        "denboschcity",
        "hoodie"
      ])
    ).toEqual({
      categories: ["shopping"],
      themes: ["shopping"],
      moments: []
    });
  });

  it("maps Koningsdag content to the event category and moment", () => {
    expect(
      enrichInstagramTaxonomy("Koningsdag tips voor de vrijmarkt en de leukste oranje spots in de stad.", [
        "koningsdag",
        "vrijmarkt"
      ])
    ).toEqual({
      categories: ["events"],
      themes: [],
      moments: ["koningsdag"]
    });
  });

  it("falls back to local tips when no rule matches", () => {
    expect(enrichInstagramTaxonomy("Een fijne update vanuit Den Bosch.", ["denboschcity"])).toEqual({
      categories: ["local-tips"],
      themes: [],
      moments: []
    });
  });
});

import { describe, expect, it } from "vitest";
import { slugify } from "@/lib/utils";

describe("slugify", () => {
  it("normaliseert strings naar SEO slugs", () => {
    expect(slugify("11 vegetarische restaurants Den Bosch!")).toBe("11-vegetarische-restaurants-den-bosch");
  });

  it("verwijdert accenten", () => {
    expect(slugify("Café à la mode")).toBe("cafe-a-la-mode");
  });
});

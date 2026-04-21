import { describe, expect, it } from "vitest";
import { normalizeInstagramPost, truncateText } from "@/lib/adapters/instagram";

function hasLoneSurrogate(value: string): boolean {
  for (let index = 0; index < value.length; index += 1) {
    const code = value.charCodeAt(index);
    const next = index + 1 < value.length ? value.charCodeAt(index + 1) : null;
    const previous = index > 0 ? value.charCodeAt(index - 1) : null;
    const isHigh = code >= 0xd800 && code <= 0xdbff;
    const isLow = code >= 0xdc00 && code <= 0xdfff;

    if (isHigh && !(next !== null && next >= 0xdc00 && next <= 0xdfff)) {
      return true;
    }

    if (isLow && !(previous !== null && previous >= 0xd800 && previous <= 0xdbff)) {
      return true;
    }
  }

  return false;
}

describe("instagram adapter truncateText", () => {
  it("truncateert codepoint-veilig rond emoji op de grens", () => {
    const input = `${"a".repeat(71)}🐓b`;
    const truncated = truncateText(input, 72);
    const serialized = JSON.stringify({ truncated });
    const parsed = JSON.parse(serialized) as { truncated: string };

    expect(Array.from(truncated)).toHaveLength(72);
    expect(truncated.endsWith("🐓")).toBe(true);
    expect(truncated.includes("b")).toBe(false);
    expect(hasLoneSurrogate(truncated)).toBe(false);
    expect(parsed.truncated).toBe(truncated);
  });
});

describe("instagram adapter normalization", () => {
  it("marks ingested Instagram records as instafirst updates", () => {
    const item = normalizeInstagramPost({
      id: "178-test",
      permalink: "https://www.instagram.com/p/test/",
      caption: "Nieuwe tip in Den Bosch #denbosch",
      media_type: "IMAGE",
      media_url: "https://example.com/image.jpg",
      timestamp: "2026-04-01T10:00:00.000Z"
    });

    expect(item.contentType).toBe("instafirst_update");
    expect(item.sourcePlatform).toBe("instagram");
    expect(item.firstPublishedAt).toBe(item.publishedAt);
    expect(item.status).toBe("published");
  });
});

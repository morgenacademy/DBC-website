import { describe, expect, it } from "vitest";
import { truncateText } from "@/lib/adapters/instagram";

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

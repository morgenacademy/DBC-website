import { describe, expect, it } from "vitest";
import { mapInstagramGraphMediaNodeToRawRecord } from "@/lib/adapters/instagram-graph";

describe("instagram graph adapter", () => {
  it("zet carousel node om naar raw record met geordende media urls", () => {
    const record = mapInstagramGraphMediaNodeToRawRecord({
      id: "123",
      caption: "Test caption #denbosch",
      media_type: "CAROUSEL_ALBUM",
      permalink: "https://www.instagram.com/p/AbCdEf123/",
      timestamp: "2026-03-08T10:00:00+0000",
      children: {
        data: [
          { id: "a", media_type: "IMAGE", media_url: "https://img.example/1.jpg" },
          { id: "b", media_type: "IMAGE", media_url: "https://img.example/2.jpg" }
        ]
      }
    });

    expect(record).toBeDefined();
    expect(record?.id).toBe("123");
    expect(record?.media_type).toBe("CAROUSEL_ALBUM");
    expect(record?.media_url).toBe("https://img.example/1.jpg");
    expect(record?.media_urls).toEqual(["https://img.example/1.jpg", "https://img.example/2.jpg"]);
    expect(record?.slug).toBe("AbCdEf123");
  });

  it("geeft null terug als node geen bruikbare media url heeft", () => {
    const record = mapInstagramGraphMediaNodeToRawRecord({
      id: "124",
      media_type: "IMAGE",
      permalink: "https://www.instagram.com/p/no-media/",
      timestamp: "2026-03-08T10:00:00+0000"
    });

    expect(record).toBeNull();
  });
});

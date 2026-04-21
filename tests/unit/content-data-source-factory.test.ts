import { afterEach, describe, expect, it, vi } from "vitest";
import { contentItems } from "@/lib/data/content-items";
import { createContentDataSourceFromEnv, createContentDataSourceFromEnvSync, resolveContentDataSourceMode } from "@/lib/repositories/content-data-source-factory";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("content datasource factory", () => {
  it("gebruikt mock als default mode", () => {
    expect(resolveContentDataSourceMode(undefined)).toBe("mock");
    expect(resolveContentDataSourceMode("")).toBe("mock");
    expect(resolveContentDataSourceMode("iets-anders")).toBe("mock");
  });

  it("herkent supabase mode", () => {
    expect(resolveContentDataSourceMode("supabase")).toBe("supabase");
    expect(resolveContentDataSourceMode(" SUPABASE ")).toBe("supabase");
  });

  it("valt terug op mock data als supabase mode niet volledig geconfigureerd is", () => {
    const source = createContentDataSourceFromEnvSync({
      NODE_ENV: "test",
      CONTENT_DATA_SOURCE: "supabase"
    });
    const items = source.listContentItems();

    expect(items.length).toBe(contentItems.length);
    expect(items[0].slug).toBe(contentItems[0].slug);
  });

  it("kan stub-supabase rows gebruiken als ze via env json worden aangeleverd", () => {
    const rowsJson = JSON.stringify([
      {
        id: "sup-1",
        slug: "supabase-ingested-item",
        title: "Supabase Ingested Item",
        excerpt: "Stub row from supabase",
        caption: "Caption #supabase",
        body: ["Eerste paragraaf"],
        source_platform: "instagram",
        source_permalink: "https://instagram.com/p/sup-1",
        source_id: "178000999",
        media_type: "image",
        image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1000&q=80",
        thumbnail: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1000&q=80",
        media_urls: ["https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1000&q=80"],
        published_at: "2026-03-08T10:00:00.000Z",
        searchable_text: null,
        content_layer: "fast",
        categories: ["local-tips"],
        themes: ["shopping"],
        moments: ["weekend-in-den-bosch"],
        tags: ["supabase"],
        hashtags: ["supabase"],
        manual_tags: ["stub"],
        featured: true,
        is_featured: true,
        featured_rank: 1,
        editorial_label: "Stub",
        hero_variant: "standard",
        collection_ids: [],
        related_ids: [],
        seo: null
      }
    ]);

    const source = createContentDataSourceFromEnvSync({
      NODE_ENV: "test",
      CONTENT_DATA_SOURCE: "supabase",
      SUPABASE_URL: "https://example.supabase.co",
      SUPABASE_ANON_KEY: "anon-key",
      SUPABASE_CONTENT_ROWS_JSON: rowsJson
    });

    const items = source.listContentItems();
    expect(items).toHaveLength(1);
    expect(items[0].slug).toBe("supabase-ingested-item");
    expect(items[0].sourcePlatform).toBe("instagram");
    expect(items[0].contentType).toBe("instafirst_update");
    expect(items[0].searchableText).toContain("supabase");
  });

  it("leest live rows via supabase rest als json-stub ontbreekt", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [
        {
          id: "live-1",
          slug: "live-row",
          title: "Live Row",
          excerpt: "Live excerpt",
          caption: "Live caption #live",
          body: ["live body"],
          source_platform: "instagram",
          source_permalink: "https://instagram.com/p/live-1",
          source_id: "178009999",
          media_type: "image",
          image: "https://example.com/image.jpg",
          thumbnail: "https://example.com/thumb.jpg",
          media_urls: ["https://example.com/image.jpg"],
          published_at: "2026-03-08T12:00:00.000Z",
          searchable_text: "live row",
          content_layer: "fast",
          categories: ["local-tips"],
          themes: ["shopping"],
          moments: ["weekend-in-den-bosch"],
          tags: ["live"],
          hashtags: ["live"],
          manual_tags: [],
          featured: false,
          is_featured: false,
          featured_rank: null,
          editorial_label: null,
          hero_variant: null,
          collection_ids: [],
          related_ids: [],
          seo: null
        }
      ],
      text: async () => ""
    });

    vi.stubGlobal("fetch", mockFetch);

    const source = await createContentDataSourceFromEnv({
      NODE_ENV: "test",
      CONTENT_DATA_SOURCE: "supabase",
      SUPABASE_URL: "https://example.supabase.co",
      SUPABASE_ANON_KEY: "anon-key"
    });

    const items = source.listContentItems();
    expect(items).toHaveLength(1);
    expect(items[0].slug).toBe("live-row");
    expect(items[0].contentType).toBe("instafirst_update");
  });

  it("valt terug op mock als live supabase read faalt", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      text: async () => "boom"
    });
    vi.stubGlobal("fetch", mockFetch);

    const source = await createContentDataSourceFromEnv({
      NODE_ENV: "test",
      CONTENT_DATA_SOURCE: "supabase",
      SUPABASE_URL: "https://example.supabase.co",
      SUPABASE_ANON_KEY: "anon-key"
    });

    const items = source.listContentItems();
    expect(items.length).toBe(contentItems.length);
  });
});

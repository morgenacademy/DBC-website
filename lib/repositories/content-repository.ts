import { createSearchIndexInput, queryMatchesIndex } from "@/lib/search-index";
import { createContentDataSourceFromEnv } from "@/lib/repositories/content-data-source-factory";
import type { ContentDataSource } from "@/lib/repositories/content-data-source";
import type { ContentFilters, ContentItem, ContentRepository } from "@/lib/types";

function byNewest(first: ContentItem, second: ContentItem): number {
  return new Date(second.publishedAt).getTime() - new Date(first.publishedAt).getTime();
}

function byFeatured(first: ContentItem, second: ContentItem): number {
  const firstRank = first.featuredRank ?? Number.MAX_SAFE_INTEGER;
  const secondRank = second.featuredRank ?? Number.MAX_SAFE_INTEGER;
  if (firstRank === secondRank) return byNewest(first, second);
  return firstRank - secondRank;
}

export class InMemoryContentRepository implements ContentRepository {
  constructor(private readonly dataSource: ContentDataSource) {}

  private get items(): ContentItem[] {
    return this.dataSource.listContentItems();
  }

  listContent(filters: ContentFilters = {}): ContentItem[] {
    const filtered = this.items.filter((item) => {
      if (filters.status && filters.status !== "all" && item.status !== filters.status) {
        return false;
      }

      if (!filters.status && item.status !== "published") {
        return false;
      }

      if (filters.category && !item.categories.includes(filters.category as ContentItem["categories"][number])) {
        return false;
      }

      if (filters.theme && !item.themes.includes(filters.theme)) {
        return false;
      }

      if (filters.moment && !item.moments.includes(filters.moment)) {
        return false;
      }

      if (filters.type && item.contentLayer !== filters.type) {
        return false;
      }

      if (filters.contentType && item.contentType !== filters.contentType) {
        return false;
      }

      if (filters.q) {
        const indexInput = item.searchableText || createSearchIndexInput(item);
        return queryMatchesIndex(indexInput, filters.q);
      }

      return true;
    });

    return filtered.sort(byNewest);
  }

  getContentBySlug(slug: string): ContentItem | undefined {
    return this.items.find((item) => item.slug === slug && item.status === "published");
  }

  searchContent(query: string, filters: Omit<ContentFilters, "q"> = {}): ContentItem[] {
    return this.listContent({ ...filters, q: query });
  }

  getRelatedContent(item: ContentItem, limit = 3): ContentItem[] {
    const explicitRelated = item.relatedIds
      .map((id) => this.items.find((candidate) => candidate.id === id))
      .filter((value): value is ContentItem => Boolean(value));

    if (explicitRelated.length >= limit) {
      return explicitRelated.slice(0, limit);
    }

    const fallback = this.items
      .filter((candidate) => candidate.id !== item.id)
      .filter((candidate) => {
        const sharedTheme = candidate.themes.some((theme) => item.themes.includes(theme));
        const sharedMoment = candidate.moments.some((moment) => item.moments.includes(moment));
        const sharedCategory = candidate.categories.some((category) => item.categories.includes(category));
        return sharedTheme || sharedMoment || sharedCategory;
      })
      .sort(byFeatured);

    const merged = [...explicitRelated, ...fallback.filter((candidate) => !explicitRelated.includes(candidate))];
    return merged.slice(0, limit);
  }

  listFeatured(limit = 6): ContentItem[] {
    return this.items.filter((item) => item.status === "published" && item.isFeatured).sort(byFeatured).slice(0, limit);
  }

  listLatest(limit = 8): ContentItem[] {
    return this.items.filter((item) => item.status === "published").sort(byNewest).slice(0, limit);
  }
}

export async function getContentRepository(): Promise<ContentRepository> {
  const resolvedContentDataSource = await createContentDataSourceFromEnv();
  return new InMemoryContentRepository(resolvedContentDataSource);
}

const resolvedContentDataSource = await createContentDataSourceFromEnv();

export const contentRepository = new InMemoryContentRepository(resolvedContentDataSource);

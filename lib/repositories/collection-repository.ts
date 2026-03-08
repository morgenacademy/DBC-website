import { collections } from "@/lib/data/collections";
import type { Collection, CollectionRepository } from "@/lib/types";

export class InMemoryCollectionRepository implements CollectionRepository {
  private items = collections;

  listCollections(channel?: Collection["channel"]): Collection[] {
    if (!channel) return this.items;
    return this.items.filter((item) => item.channel === channel);
  }

  getCollectionBySlug(slug: string): Collection | undefined {
    return this.items.find((item) => item.slug === slug);
  }
}

export const collectionRepository = new InMemoryCollectionRepository();

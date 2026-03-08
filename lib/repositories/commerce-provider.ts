import { products } from "@/lib/data/products";
import type { CommerceProvider, Product } from "@/lib/types";

export class InMemoryCommerceProvider implements CommerceProvider {
  private items = products;

  listProducts(featuredOnly = false): Product[] {
    if (!featuredOnly) return this.items;
    return this.items.filter((item) => item.isFeatured);
  }

  getProductBySlug(slug: string): Product | undefined {
    return this.items.find((item) => item.slug === slug);
  }
}

export const commerceProvider = new InMemoryCommerceProvider();

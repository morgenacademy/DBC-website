import { slugify } from "@/lib/utils";
import type { Product } from "@/lib/types";

interface WordPressImage {
  src?: string;
}

interface WordPressCategory {
  name?: string;
}

export interface WordPressShopProductRecord {
  id: number | string;
  slug?: string;
  name?: string;
  title?: string;
  short_description?: string;
  description?: string;
  price_html?: string;
  regular_price?: string;
  sale_price?: string;
  featured?: boolean;
  external_url?: string;
  affiliate_url?: string;
  partner_name?: string;
  badge?: string;
  images?: WordPressImage[];
  categories?: WordPressCategory[];
}

function stripHtml(input?: string): string {
  if (!input) return "";
  return input.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function parsePriceDisplay(raw: WordPressShopProductRecord): string {
  const htmlPrice = stripHtml(raw.price_html);
  if (htmlPrice) return htmlPrice;

  if (raw.sale_price) return `EUR ${raw.sale_price.replace(".", ",")}`;
  if (raw.regular_price) return `EUR ${raw.regular_price.replace(".", ",")}`;
  return "Prijs op partnerwebsite";
}

export function normalizeWordPressShopProduct(raw: WordPressShopProductRecord): Product {
  const title = raw.name ?? raw.title ?? "Partner product";
  const shortDescription = stripHtml(raw.short_description) || stripHtml(raw.description) || "Bekijk dit partnerproduct op de externe website.";
  const partnerUrl = raw.affiliate_url ?? raw.external_url ?? "https://example.com";

  return {
    id: `wp-${raw.id}`,
    slug: raw.slug ?? slugify(title),
    title,
    shortDescription,
    priceDisplay: parsePriceDisplay(raw),
    image: raw.images?.[0]?.src ?? "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1000&q=80",
    category: raw.categories?.[0]?.name ?? "Partnerdeal",
    partnerName: raw.partner_name ?? "Externe partner",
    partnerUrl,
    badge: raw.badge,
    isFeatured: Boolean(raw.featured)
  };
}

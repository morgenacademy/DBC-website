import type { Product } from "@/lib/types";

export interface ShopCsvRecord {
  title: string;
  slug: string;
  color: string;
  short_description: string;
  price_display: string;
  partner_name: string;
  external_url: string;
  image_urls: string;
  featured: string;
  notes: string;
}

function normalizeFeatured(value: string): boolean {
  return value.trim().toLowerCase() === "true";
}

function parseImageUrls(raw: string): string[] {
  return raw
    .split(" | ")
    .map((image) => image.trim())
    .filter(Boolean);
}

function inferCategory(title: string): string {
  const lower = title.toLowerCase();
  if (lower.includes("hoodie")) return "Hoodies";
  if (lower.includes("sweatshirt")) return "Sweatshirts";
  if (lower.includes("kersttrui")) return "Kersttruien";
  return "Partner picks";
}

export function normalizeShopCsvRecord(raw: ShopCsvRecord): Product {
  const imageUrls = parseImageUrls(raw.image_urls);
  const primaryImage = imageUrls[0] ?? "/brand/header-logo.png";

  return {
    id: `csv-${raw.slug}`,
    slug: raw.slug,
    title: raw.title,
    shortDescription: raw.short_description,
    priceDisplay: raw.price_display || undefined,
    image: primaryImage,
    imageUrls,
    category: inferCategory(raw.title),
    color: raw.color || undefined,
    partnerName: raw.partner_name,
    partnerUrl: raw.external_url,
    badge: undefined,
    isFeatured: normalizeFeatured(raw.featured),
    notes: raw.notes || undefined
  };
}

function parseCsvLine(line: string): ShopCsvRecord | undefined {
  const parts = line.split(",");
  if (parts.length < 10) return undefined;

  // CSV rows may contain an unquoted comma in "price_display" (e.g. "€ 59,95").
  // We parse from both ends to preserve all tail fields reliably.
  const tailStart = parts.length - 5;

  return {
    title: parts[0]?.trim() ?? "",
    slug: parts[1]?.trim() ?? "",
    color: parts[2]?.trim() ?? "",
    short_description: parts[3]?.trim() ?? "",
    price_display: parts
      .slice(4, tailStart)
      .join(",")
      .trim(),
    partner_name: parts[tailStart]?.trim() ?? "",
    external_url: parts[tailStart + 1]?.trim() ?? "",
    image_urls: parts[tailStart + 2]?.trim() ?? "",
    featured: parts[tailStart + 3]?.trim() ?? "false",
    notes: parts[tailStart + 4]?.trim() ?? ""
  };
}

export function parseShopProductsCsv(csvText: string): Product[] {
  const lines = csvText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length < 2) return [];

  return lines
    .slice(1)
    .map(parseCsvLine)
    .filter((item): item is ShopCsvRecord => Boolean(item))
    .map(normalizeShopCsvRecord)
    .filter((item) => Boolean(item.slug) && Boolean(item.title) && Boolean(item.partnerUrl));
}

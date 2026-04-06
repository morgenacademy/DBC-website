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
  if (lower.includes("shirt") || lower.includes("tee")) return "T-shirts";
  if (lower.includes("kersttrui")) return "Kersttruien";
  return "Partner picks";
}

function parseCsvRows(csvText: string): string[][] {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentField = "";
  let inQuotes = false;

  for (let index = 0; index < csvText.length; index += 1) {
    const char = csvText[index];
    const next = csvText[index + 1];

    if (char === "\"") {
      if (inQuotes && next === "\"") {
        currentField += "\"";
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === "," && !inQuotes) {
      currentRow.push(currentField.trim());
      currentField = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && next === "\n") {
        index += 1;
      }
      currentRow.push(currentField.trim());
      currentField = "";
      if (currentRow.some((value) => value.length > 0)) {
        rows.push(currentRow);
      }
      currentRow = [];
      continue;
    }

    currentField += char;
  }

  if (currentField.length > 0 || currentRow.length > 0) {
    currentRow.push(currentField.trim());
    if (currentRow.some((value) => value.length > 0)) {
      rows.push(currentRow);
    }
  }

  return rows;
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

export function parseShopProductsCsv(csvText: string): Product[] {
  const rows = parseCsvRows(csvText);
  if (rows.length < 2) return [];

  const headers = rows[0].map((value) => value.trim());
  const column = (name: keyof ShopCsvRecord): number => headers.indexOf(name);

  const records: ShopCsvRecord[] = rows.slice(1).map((row) => ({
    title: row[column("title")] ?? "",
    slug: row[column("slug")] ?? "",
    color: row[column("color")] ?? "",
    short_description: row[column("short_description")] ?? "",
    price_display: row[column("price_display")] ?? "",
    partner_name: row[column("partner_name")] ?? "",
    external_url: row[column("external_url")] ?? "",
    image_urls: row[column("image_urls")] ?? "",
    featured: row[column("featured")] ?? "false",
    notes: row[column("notes")] ?? ""
  }));

  return records
    .map(normalizeShopCsvRecord)
    .filter((item) => Boolean(item.slug) && Boolean(item.title) && Boolean(item.partnerUrl));
}

import fs from "node:fs";
import path from "node:path";
import { parseShopProductsCsv } from "@/lib/adapters/shop-csv";
import type { Product } from "@/lib/types";

function loadShopProductsFromCsv(): Product[] {
  const csvPath = path.join(process.cwd(), "shop-products.csv");

  try {
    const csvText = fs.readFileSync(csvPath, "utf8");
    return parseShopProductsCsv(csvText);
  } catch (error) {
    console.error("Kon shop-products.csv niet laden:", error);
    return [];
  }
}

export const products: Product[] = loadShopProductsFromCsv();

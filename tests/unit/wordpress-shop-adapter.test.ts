import { describe, expect, it } from "vitest";
import { normalizeWordPressShopProduct } from "@/lib/adapters/wordpress-shop";

describe("wordpress shop adapter", () => {
  it("normaliseert WordPress shop record naar partner productmodel", () => {
    const product = normalizeWordPressShopProduct({
      id: 101,
      name: "Weekend Tas",
      short_description: "<p>Stevige tas voor city trips</p>",
      price_html: "EUR 19,95",
      featured: true,
      affiliate_url: "https://partner.example.com/weekend-tas",
      partner_name: "Concept Store Den Bosch",
      badge: "Best Seller",
      categories: [{ name: "Fashion" }],
      images: [{ src: "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=1000&q=80" }]
    });

    expect(product.slug).toBe("weekend-tas");
    expect(product.shortDescription).toContain("Stevige tas");
    expect(product.priceDisplay).toBe("EUR 19,95");
    expect(product.partnerName).toBe("Concept Store Den Bosch");
    expect(product.partnerUrl).toBe("https://partner.example.com/weekend-tas");
    expect(product.category).toBe("Fashion");
    expect(product.isFeatured).toBe(true);
  });
});

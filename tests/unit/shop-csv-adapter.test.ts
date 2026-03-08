import { describe, expect, it } from "vitest";
import { parseShopProductsCsv } from "@/lib/adapters/shop-csv";

describe("shop csv adapter", () => {
  it("gebruikt eerste image als primary en bewaart volledige gallery", () => {
    const csv = `title,slug,color,short_description,price_display,partner_name,external_url,image_urls,featured,notes
HOODIE 'S-HERTOGENBOSCH,hoodie-s-hertogenbosch-bordeaux,Bordeaux,De Hoodie van 's-Hertogenbosch,€ 59,95,Studio Mark Jimena,https://studiomarkjimena.com/shop/s-hertogenbosch-hoodie-bordeaux-rood/,https://denboschcity.com/a.jpg | https://denboschcity.com/b.jpg,true,Carousel order provided by user`;

    const [item] = parseShopProductsCsv(csv);

    expect(item.slug).toBe("hoodie-s-hertogenbosch-bordeaux");
    expect(item.image).toBe("https://denboschcity.com/a.jpg");
    expect(item.imageUrls).toEqual(["https://denboschcity.com/a.jpg", "https://denboschcity.com/b.jpg"]);
    expect(item.priceDisplay).toBe("€ 59,95");
    expect(item.partnerUrl).toBe("https://studiomarkjimena.com/shop/s-hertogenbosch-hoodie-bordeaux-rood/");
  });

  it("laat priceDisplay leeg als prijs ontbreekt", () => {
    const csv = `title,slug,color,short_description,price_display,partner_name,external_url,image_urls,featured,notes
DEN BOSCH KERSTTRUI GROEN,den-bosch-kersttrui-groen,Groen,De enige echte Bossche Kersttrui,,Just Another Store,https://justanotherstore.nl/kersttrui,https://denboschcity.com/c.jpg,true,Prijs nog invullen`;

    const [item] = parseShopProductsCsv(csv);

    expect(item.priceDisplay).toBeUndefined();
  });
});

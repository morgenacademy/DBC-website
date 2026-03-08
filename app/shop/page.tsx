import type { Metadata } from "next";
import { ProductCard } from "@/components/cards/product-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { buildMetadata } from "@/lib/seo";
import { commerceProvider } from "@/lib/repositories";

export const metadata: Metadata = buildMetadata({
  title: "Shop",
  description: "Shop shell met featured drops en voorbereide commerce-architectuur voor latere Shopify integratie.",
  path: "/shop"
});

export default function ShopPage(): React.JSX.Element {
  const featured = commerceProvider.listProducts(true);
  const allProducts = commerceProvider.listProducts();

  return (
    <div className="mx-auto w-full max-w-6xl space-y-10 px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <SectionHeading
        eyebrow="Shop"
        title="Lokale drops en city merchandise"
        description="V1 shop shell met duidelijke productstructuur, klaar voor toekomstige Shopify of andere commerce provider integratie."
      />

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-brand-teal">Featured</h2>
        <div className="grid gap-5 md:grid-cols-3">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-brand-teal">Alle producten</h2>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {allProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}

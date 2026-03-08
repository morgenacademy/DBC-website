import type { Metadata } from "next";
import { ProductCard } from "@/components/cards/product-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { buildMetadata } from "@/lib/seo";
import { commerceProvider } from "@/lib/repositories";
import { unique } from "@/lib/utils";

export const metadata: Metadata = buildMetadata({
  title: "Shop",
  description: "Gecureerde partnerproducten van Den Bosch City met directe doorklik naar partnerwebsites.",
  path: "/shop"
});

export default function ShopPage(): React.JSX.Element {
  const allProducts = commerceProvider.listProducts();
  const categories = unique(allProducts.map((item) => item.category));

  return (
    <div className="mx-auto w-full max-w-6xl space-y-10 px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <SectionHeading
        eyebrow="Shop"
        title="Den Bosch City Shop"
        description="Ontdek onze favoriete Bossche producten. Je bestelt direct bij onze partners."
      />

      <section className="rounded-editorial border border-brand-teal/15 bg-white p-5 shadow-card">
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-brand-teal/60">Categorieën</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {categories.map((category) => (
            <span key={category} className="rounded-full bg-brand-sand px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-brand-teal">
              {category}
            </span>
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

import type { Metadata } from "next";
import Link from "next/link";
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

interface ShopPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function ShopPage({ searchParams }: ShopPageProps): Promise<React.JSX.Element> {
  const params = await searchParams;
  const selectedCategory = params.category ?? "";
  const allProducts = commerceProvider.listProducts();
  const categories = unique(allProducts.map((item) => item.category));
  const filteredProducts = selectedCategory ? allProducts.filter((item) => item.category === selectedCategory) : allProducts;
  const christmasProducts = filteredProducts.filter((item) => item.category.toLowerCase().includes("kersttrui"));
  const regularProducts = filteredProducts.filter((item) => !item.category.toLowerCase().includes("kersttrui"));
  const showSplitLayout = selectedCategory === "" && christmasProducts.length > 0 && regularProducts.length > 0;

  return (
    <div className="mx-auto w-full max-w-6xl space-y-10 px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <SectionHeading
        eyebrow="Shop"
        title="Den Bosch City Shop"
        description="Omdat we van deze mooie stad houden en dat soms ook graag uitdragen."
      />

      <section className="rounded-editorial border border-brand-teal/15 bg-white p-5 shadow-card">
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-brand-teal/60">Categorieën</p>
        <div className="mt-2 flex flex-wrap gap-2">
          <Link
            href="/shop"
            className={`rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-wide transition ${
              selectedCategory === "" ? "bg-brand-coral text-white" : "bg-brand-sand text-brand-teal hover:bg-brand-peach"
            }`}
          >
            Toon alles
          </Link>
          {categories.map((category) => (
            <Link
              key={category}
              href={`/shop?category=${encodeURIComponent(category)}`}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-wide transition ${
                selectedCategory === category ? "bg-brand-coral text-white" : "bg-brand-sand text-brand-teal hover:bg-brand-peach"
              }`}
            >
              {category}
            </Link>
          ))}
        </div>
      </section>

      {showSplitLayout ? (
        <>
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-brand-teal">Alle producten</h2>
            <p className="text-sm leading-relaxed text-brand-teal/75">
              In samenwerking met lokale, Bossche partners. Je bestelt direct via de maker.
            </p>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {regularProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>

          <section className="space-y-4 pt-8">
            <div className="rounded-editorial border border-brand-coral/20 bg-brand-peach/45 px-5 py-3">
              <h2 className="text-2xl font-bold text-brand-teal">Kersttruien</h2>
            </div>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {christmasProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        </>
      ) : (
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-brand-teal">{selectedCategory ? `${selectedCategory}` : "Alle producten"}</h2>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

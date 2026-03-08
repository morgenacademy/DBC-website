import Image from "next/image";
import { Pill } from "@/components/ui/pill";
import type { Product } from "@/lib/types";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps): React.JSX.Element {
  const upperTitle = product.title.toUpperCase();
  const orderLabel = upperTitle.includes("HOODIE")
    ? "Bestel hoodie"
    : upperTitle.includes("SWEATSHIRT")
      ? "Bestel sweatshirt"
      : upperTitle.includes("KERSTTRUI")
        ? "Bestel kersttrui"
        : "Bestel nu";

  return (
    <article id={product.slug} className="overflow-hidden rounded-editorial border border-brand-teal/15 bg-white shadow-card">
      <a href={product.partnerUrl} target="_blank" rel="sponsored noreferrer" className="block">
        <div className="relative aspect-[4/5]">
          <Image src={product.image} alt={product.title} fill className="object-cover object-top" sizes="(max-width: 768px) 100vw, 33vw" />
        </div>
      </a>

      <div className="space-y-3 p-4">
        <div className="flex flex-wrap items-center gap-2">
          <Pill label={product.category} />
          {product.badge ? <Pill label={product.badge} tone="accent" /> : null}
        </div>

        <h3 className="text-xl font-bold text-brand-teal">{product.title}</h3>
        {product.color ? <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-teal/65">Kleur: {product.color}</p> : null}
        <p className="text-sm text-brand-teal/75">{product.shortDescription}</p>

        <div className="flex items-center justify-between gap-3">
          <div>
            {product.priceDisplay ? <p className="text-sm font-bold text-brand-coral">{product.priceDisplay}</p> : null}
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-teal/60">Partner: {product.partnerName}</p>
          </div>

          <a
            href={product.partnerUrl}
            target="_blank"
            rel="sponsored noreferrer"
            className="rounded-full bg-brand-coral px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-white hover:opacity-90"
          >
            {orderLabel}
          </a>
        </div>
      </div>
    </article>
  );
}

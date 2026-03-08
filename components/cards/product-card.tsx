import Image from "next/image";
import { Pill } from "@/components/ui/pill";
import type { Product } from "@/lib/types";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps): React.JSX.Element {
  return (
    <article id={product.slug} className="overflow-hidden rounded-editorial border border-brand-teal/15 bg-white shadow-card">
      <a href={product.partnerUrl} target="_blank" rel="sponsored noreferrer" className="block">
        <div className="relative aspect-[4/3]">
          <Image src={product.image} alt={product.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
        </div>
      </a>

      <div className="space-y-3 p-4">
        <div className="flex flex-wrap items-center gap-2">
          <Pill label={product.category} />
          {product.badge ? <Pill label={product.badge} tone="accent" /> : null}
        </div>

        <h3 className="text-xl font-bold text-brand-teal">{product.title}</h3>
        <p className="text-sm text-brand-teal/75">{product.shortDescription}</p>

        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-bold text-brand-coral">{product.priceDisplay}</p>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-teal/60">Partner: {product.partnerName}</p>
          </div>

          <a
            href={product.partnerUrl}
            target="_blank"
            rel="sponsored noreferrer"
            className="rounded-full border border-brand-teal/25 px-3 py-1.5 text-sm font-semibold text-brand-teal hover:border-brand-coral hover:text-brand-coral"
          >
            Ga naar partner ↗
          </a>
        </div>
      </div>
    </article>
  );
}

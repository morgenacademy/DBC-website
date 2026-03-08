import Image from "next/image";
import Link from "next/link";
import { Pill } from "@/components/ui/pill";
import { formatPriceEUR } from "@/lib/utils";
import type { Product } from "@/lib/types";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps): React.JSX.Element {
  const href = product.externalUrl ?? `/shop#${product.slug}`;

  return (
    <article id={product.slug} className="overflow-hidden rounded-editorial border border-brand-teal/15 bg-white shadow-card">
      <div className="relative aspect-[4/3]">
        <Image src={product.image} alt={product.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
      </div>
      <div className="space-y-2 p-4">
        {product.dropLabel ? <Pill label={product.dropLabel} tone="accent" /> : null}
        <h3 className="text-xl font-bold text-brand-teal">{product.title}</h3>
        <p className="text-sm text-brand-teal/75">{product.summary}</p>
        <div className="flex items-center justify-between">
          <p className="text-sm font-bold text-brand-coral">{formatPriceEUR(product.price)}</p>
          <Link href={href} className="text-sm font-semibold text-brand-teal hover:text-brand-coral">
            Bekijk →
          </Link>
        </div>
      </div>
    </article>
  );
}

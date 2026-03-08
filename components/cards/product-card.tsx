"use client";

import { useState } from "react";
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
  const gallery = product.imageUrls.length > 0 ? product.imageUrls : [product.image];
  const [activeIndex, setActiveIndex] = useState(0);
  const hasMultipleImages = gallery.length > 1;

  function showPreviousImage(): void {
    setActiveIndex((current) => (current - 1 + gallery.length) % gallery.length);
  }

  function showNextImage(): void {
    setActiveIndex((current) => (current + 1) % gallery.length);
  }

  return (
    <article id={product.slug} className="overflow-hidden rounded-editorial border border-brand-teal/15 bg-white shadow-card">
      <div className="relative">
        <a href={product.partnerUrl} target="_blank" rel="sponsored noreferrer" className="block">
          <div className="relative aspect-[4/5]">
            <Image
              src={gallery[activeIndex]}
              alt={`${product.title} foto ${activeIndex + 1}`}
              fill
              className="object-cover object-top"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </div>
        </a>

        {hasMultipleImages ? (
          <>
            <button
              type="button"
              onClick={showPreviousImage}
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 px-2 py-1 text-sm font-semibold text-brand-teal shadow-sm"
              aria-label="Vorige foto"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={showNextImage}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 px-2 py-1 text-sm font-semibold text-brand-teal shadow-sm"
              aria-label="Volgende foto"
            >
              ›
            </button>
            <p className="absolute bottom-3 right-3 rounded-full bg-brand-teal/85 px-2.5 py-1 text-xs font-semibold text-white">
              {activeIndex + 1} / {gallery.length}
            </p>
          </>
        ) : null}
      </div>

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

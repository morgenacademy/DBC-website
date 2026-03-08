"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Pill } from "@/components/ui/pill";
import type { Product } from "@/lib/types";

interface ProductCardProps {
  product: Product;
}

const CAROUSEL_SPEED_MS = 4500;

export function ProductCard({ product }: ProductCardProps): React.JSX.Element {
  const orderLabel = "Bestel nu";
  const gallery = product.imageUrls.length > 0 ? product.imageUrls : [product.image];
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const hasMultipleImages = gallery.length > 1;

  useEffect(() => {
    if (!hasMultipleImages || isPaused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const intervalId = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % gallery.length);
    }, CAROUSEL_SPEED_MS);

    return () => window.clearInterval(intervalId);
  }, [gallery.length, hasMultipleImages, isPaused]);

  function showPreviousImage(): void {
    setActiveIndex((current) => (current - 1 + gallery.length) % gallery.length);
  }

  function showNextImage(): void {
    setActiveIndex((current) => (current + 1) % gallery.length);
  }

  return (
    <article id={product.slug} className="overflow-hidden rounded-editorial border border-brand-teal/15 bg-white shadow-card">
      <div
        className="relative"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onFocus={() => setIsPaused(true)}
        onBlur={() => setIsPaused(false)}
      >
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
              className="absolute left-2 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full border border-white/55 bg-white/55 text-lg leading-none text-brand-teal/90 backdrop-blur-sm transition hover:bg-white/80"
              aria-label="Vorige foto"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={showNextImage}
              className="absolute right-2 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full border border-white/55 bg-white/55 text-lg leading-none text-brand-teal/90 backdrop-blur-sm transition hover:bg-white/80"
              aria-label="Volgende foto"
            >
              ›
            </button>
            <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1.5 rounded-full bg-black/20 px-2 py-1 backdrop-blur-sm">
              {gallery.map((_, index) => (
                <button
                  key={`${product.id}-dot-${index}`}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  aria-label={`Ga naar foto ${index + 1}`}
                  className={`h-1.5 w-1.5 rounded-full transition ${
                    index === activeIndex ? "bg-white" : "bg-white/55 hover:bg-white/80"
                  }`}
                />
              ))}
            </div>
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
        <p className="whitespace-pre-line text-sm leading-relaxed text-brand-teal/78">{product.shortDescription}</p>

        <div className="space-y-3 pt-1">
          <div className="space-y-1">
            {product.priceDisplay ? <p className="text-sm font-bold text-brand-coral">{product.priceDisplay}</p> : null}
            <p className="text-sm font-semibold text-brand-teal/75">Partner: {product.partnerName}</p>
          </div>

          <div className="flex justify-center">
            <a
              href={product.partnerUrl}
              target="_blank"
              rel="sponsored noreferrer"
              className="whitespace-nowrap rounded-full bg-brand-coral px-7 py-2.5 text-sm font-semibold text-white hover:opacity-90"
            >
              {orderLabel}
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}

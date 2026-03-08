"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { Pill } from "@/components/ui/pill";
import type { Product } from "@/lib/types";

interface ProductCardProps {
  product: Product;
}

const CAROUSEL_SPEED_MS = 4500;
let carouselTick = 0;
let carouselIntervalId: number | null = null;
const carouselListeners = new Set<() => void>();

function notifyCarouselListeners(): void {
  carouselListeners.forEach((listener) => listener());
}

function startCarouselClock(): void {
  if (carouselIntervalId !== null) return;

  carouselIntervalId = window.setInterval(() => {
    carouselTick += 1;
    notifyCarouselListeners();
  }, CAROUSEL_SPEED_MS);
}

function stopCarouselClock(): void {
  if (carouselIntervalId === null) return;

  window.clearInterval(carouselIntervalId);
  carouselIntervalId = null;
}

function subscribeCarouselClock(listener: () => void): () => void {
  carouselListeners.add(listener);

  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    startCarouselClock();
  }

  return () => {
    carouselListeners.delete(listener);

    if (carouselListeners.size === 0) {
      stopCarouselClock();
    }
  };
}

function getCarouselTickSnapshot(): number {
  return carouselTick;
}

function getCarouselTickServerSnapshot(): number {
  return 0;
}

function useSynchronizedCarouselTick(): number {
  return useSyncExternalStore(subscribeCarouselClock, getCarouselTickSnapshot, getCarouselTickServerSnapshot);
}

function normalizeDescription(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

function splitDescription(product: Product): { lead: string; details: string[] } {
  const normalized = normalizeDescription(product.shortDescription);
  const sentences = normalized.split(/(?<=[.!?])\s+/).filter(Boolean);
  const withoutPriceSentence = product.priceDisplay
    ? sentences.filter((sentence) => !/^(sale:\s*)?shop nu voor/i.test(sentence.trim()))
    : sentences;

  const lead = withoutPriceSentence[0] ?? normalized;
  const rest = withoutPriceSentence.slice(1).join(" ").trim();

  if (!rest) return { lead, details: [] };

  const details = rest
    .split(/(?=(?:Gemaakt van|Nu 11%|Verkrijgbaar))/g)
    .map((part) => part.trim())
    .filter(Boolean);

  const normalizedDetails = details.length > 0 ? details : [rest];

  if (product.category.toLowerCase().includes("kersttrui")) {
    const availabilityIndex = normalizedDetails.findIndex((part) => /^Verkrijgbaar\b/i.test(part));
    const discountIndex = normalizedDetails.findIndex((part) => /^Nu\s*11%\s*KORTING\b/i.test(part));

    if (availabilityIndex !== -1 && discountIndex !== -1 && availabilityIndex > discountIndex) {
      const reordered = [...normalizedDetails];
      const [availability] = reordered.splice(availabilityIndex, 1);
      reordered.splice(discountIndex, 0, availability);
      return { lead, details: reordered };
    }
  }

  return { lead, details: normalizedDetails };
}

export function ProductCard({ product }: ProductCardProps): React.JSX.Element {
  const orderLabel = "Bestel nu";
  const gallery = product.imageUrls.length > 0 ? product.imageUrls : [product.image];
  const isChristmasProduct = product.category.toLowerCase().includes("kersttrui");
  const [manualOffset, setManualOffset] = useState(0);
  const synchronizedTick = useSynchronizedCarouselTick();
  const hasMultipleImages = gallery.length > 1;
  const description = splitDescription(product);
  const christmasTitleMatch = isChristmasProduct ? product.title.match(/^(.*\bKERSTTRUI)\s+([A-Z]+)$/i) : null;
  const christmasTitleMain = christmasTitleMatch?.[1] ?? product.title;
  const christmasTitleColor = christmasTitleMatch?.[2];
  const citySuffixTitleMatch = !isChristmasProduct ? product.title.match(/^(.*)\s('S-HERTOGENBOSCH)$/i) : null;
  const citySuffixTitleMain = citySuffixTitleMatch?.[1] ?? product.title;
  const citySuffixTitle = citySuffixTitleMatch?.[2];
  const autoIndex = hasMultipleImages ? synchronizedTick % gallery.length : 0;
  const activeIndex = hasMultipleImages ? (autoIndex + manualOffset + gallery.length * 100) % gallery.length : 0;

  useEffect(() => {
    setManualOffset(0);
  }, [product.id, gallery.length]);

  function showPreviousImage(): void {
    if (!hasMultipleImages) return;
    setManualOffset((current) => current - 1);
  }

  function showNextImage(): void {
    if (!hasMultipleImages) return;
    setManualOffset((current) => current + 1);
  }

  function goToImage(index: number): void {
    if (!hasMultipleImages) return;
    setManualOffset(index - autoIndex);
  }

  return (
    <article id={product.slug} className="glass-surface flex h-full flex-col overflow-hidden rounded-editorial shadow-card">
      <div className="relative">
        <a href={product.partnerUrl} target="_blank" rel="sponsored noreferrer" className="block">
          <div className="relative aspect-[4/5] overflow-hidden">
            <div
              className="flex h-full w-full transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {gallery.map((imageUrl, index) => (
                <div key={`${product.id}-image-${index}`} className="relative h-full min-w-full">
                  <Image
                    src={imageUrl}
                    alt={`${product.title} foto ${index + 1}`}
                    fill
                    className="object-cover object-top"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
              ))}
            </div>
          </div>
        </a>

        {hasMultipleImages ? (
          <>
            <button
              type="button"
              onClick={showPreviousImage}
              className="absolute left-2 top-1/2 h-7 w-7 -translate-y-1/2 rounded-full border border-white/45 bg-white/45 text-base leading-none text-brand-teal/80 backdrop-blur-sm transition hover:bg-white/70"
              aria-label="Vorige foto"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={showNextImage}
              className="absolute right-2 top-1/2 h-7 w-7 -translate-y-1/2 rounded-full border border-white/45 bg-white/45 text-base leading-none text-brand-teal/80 backdrop-blur-sm transition hover:bg-white/70"
              aria-label="Volgende foto"
            >
              ›
            </button>
            <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1.5 rounded-full bg-black/20 px-2 py-1 backdrop-blur-sm">
              {gallery.map((_, index) => (
                <button
                  key={`${product.id}-dot-${index}`}
                  type="button"
                  onClick={() => goToImage(index)}
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

      <div className="flex flex-1 flex-col space-y-3 p-4">
        <div className="flex flex-wrap items-center gap-2">
          <Pill label={product.category} />
          {product.badge ? <Pill label={product.badge} tone="accent" /> : null}
        </div>

        <h3 className="text-xl font-bold text-brand-teal">
          {christmasTitleColor ? (
            <>
              {christmasTitleMain}
              <br />
              {christmasTitleColor}
            </>
          ) : citySuffixTitle ? (
            <>
              {citySuffixTitleMain}
              <br />
              <span className="whitespace-nowrap">{citySuffixTitle}</span>
            </>
          ) : null}
          {!christmasTitleColor && !citySuffixTitle ? product.title : null}
        </h3>
        {product.color ? <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-teal/65">Kleur: {product.color}</p> : null}
        <p className="text-[1.05rem] leading-relaxed text-brand-teal/90">{description.lead}</p>
        <div className="space-y-2">
          {description.details.map((paragraph, index) => (
            <p
              key={`${product.id}-paragraph-${index}`}
              className={`leading-relaxed ${
                /^Verkrijgbaar\b/i.test(paragraph) ? "text-[0.84rem] text-brand-teal/68" : "text-[0.95rem] text-brand-teal/78"
              }`}
            >
              {paragraph}
            </p>
          ))}
        </div>

        <div className="mt-auto space-y-3 pt-1">
          <div className="min-h-[3.8rem] space-y-1">
            {product.priceDisplay ? (
              <p className="text-[1.15rem] font-bold text-brand-coral">{product.priceDisplay}</p>
            ) : (
              <p aria-hidden className="text-[1.15rem] font-bold text-transparent">
                &nbsp;
              </p>
            )}
            {!isChristmasProduct ? (
              <p className="text-[0.66rem] uppercase tracking-[0.14em] text-brand-teal/56">Productie door: {product.partnerName}</p>
            ) : (
              <p aria-hidden className="text-[0.66rem] uppercase tracking-[0.14em] text-transparent">
                &nbsp;
              </p>
            )}
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

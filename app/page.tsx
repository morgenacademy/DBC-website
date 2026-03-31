import Image from "next/image";
import Link from "next/link";
import { ContentCard } from "@/components/cards/content-card";
import { ProductCard } from "@/components/cards/product-card";
import { NewsletterCta } from "@/components/sections/newsletter-cta";
import { SectionHeading } from "@/components/ui/section-heading";
import { homepageConfig } from "@/lib/config/homepage";
import { getCategoryLabel } from "@/lib/content-labels";
import { buildMetadata } from "@/lib/seo";
import { commerceProvider, getContentRepository, weekendRepository } from "@/lib/repositories";
import type { ContentItem, WeekendGuideDay, WeekendGuideEvent } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export const metadata = buildMetadata({
  title: "Home",
  description: "Den Bosch City met focus op Home, Weekend Guide, Ontdek en Shop.",
  path: "/"
});

interface HomeWeekendHighlight {
  id: string;
  dayLabel: string;
  title: string;
  summary: string;
  meta: string;
  ctaHref: string;
}

function extractLeadSentence(text: string): string {
  const firstSentence = text.split(/(?<=[.!?])\s+/)[0];
  return (firstSentence ?? text).trim();
}

function parseTimeValue(timeLabel?: string): number {
  if (!timeLabel) return Number.POSITIVE_INFINITY;
  const match = timeLabel.match(/(\d{1,2}):(\d{2})/);
  if (!match) return Number.POSITIVE_INFINITY;
  return Number(match[1]) * 60 + Number(match[2]);
}

function getHomeWeekendHighlights(): HomeWeekendHighlight[] {
  const guide = weekendRepository.getCurrentGuide();
  const dayOrder: WeekendGuideDay[] = ["donderdag", "vrijdag", "zaterdag", "zondag", "maandag", "hele-weekend"];
  const dayLabels: Record<WeekendGuideDay, string> = {
    "hele-weekend": "Hele weekend",
    donderdag: "Donderdag",
    vrijdag: "Vrijdag",
    zaterdag: "Zaterdag",
    zondag: "Zondag",
    maandag: "Maandag"
  };

  const sortedEvents = [...guide.events].sort((first, second) => {
    const dayDifference = dayOrder.indexOf(first.day) - dayOrder.indexOf(second.day);
    if (dayDifference !== 0) return dayDifference;
    return parseTimeValue(first.timeLabel) - parseTimeValue(second.timeLabel);
  });

  const uniquePerDay = new Map<WeekendGuideDay, WeekendGuideEvent>();
  for (const event of sortedEvents) {
    if (event.day === "hele-weekend") continue;
    if (!uniquePerDay.has(event.day)) {
      uniquePerDay.set(event.day, event);
    }
  }

  const sourceEvents = [...uniquePerDay.entries()].slice(0, 2);

  return sourceEvents.map(([day, event]) => {
    const meta = [event.timeLabel, event.venue].filter(Boolean).join(" · ");

    return {
      id: `${day}-${event.id}`,
      dayLabel: dayLabels[day],
      title: event.title,
      summary: extractLeadSentence(event.description),
      meta,
      ctaHref: `/weekend-guide#${day}`
    };
  });
}

function resolveHomepageFeaturedItem(items: ContentItem[], fallbackItems: ContentItem[]): ContentItem | undefined {
  const config = homepageConfig.featuredItem;

  if (config) {
    const configuredItem = items.find((item) => {
      if (config.id) return item.id === config.id;
      if (config.slug) return item.slug === config.slug;
      if (config.sourceId) return item.sourceId === config.sourceId;
      return false;
    });

    if (configuredItem) {
      return configuredItem;
    }
  }

  return fallbackItems[0];
}

export default async function HomePage(): Promise<React.JSX.Element> {
  const contentRepository = await getContentRepository();
  const featured = contentRepository.listFeatured(4);
  const heroItem = featured[0];
  const weekendHighlights = getHomeWeekendHighlights();
  const allItems = contentRepository.listContent();
  const latest = contentRepository.listLatest(6);
  const products = commerceProvider.listProducts(true).slice(0, 3);
  const highlightedItem = resolveHomepageFeaturedItem(allItems, latest);
  const highlightedSupportingItems = latest.filter((item) => item.id !== highlightedItem?.id).slice(0, 2);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-14 px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
      <section className="glass-hero relative overflow-hidden rounded-[2rem] border border-brand-teal/15 px-6 py-12 text-white sm:px-10">
        <div className="absolute right-0 top-0 h-48 w-48 -translate-y-1/2 translate-x-1/3 rounded-full bg-brand-coral/45 blur-2xl" />
        <div className="grid gap-8 lg:grid-cols-[1.15fr_1fr] lg:items-end">
          <div>
            <p className="font-display text-sm uppercase tracking-[0.28em] text-brand-peach">{homepageConfig.sections.featuredLabel}</p>
            <h1 className="mt-3 max-w-xl text-balance text-4xl font-bold leading-tight sm:text-5xl">{homepageConfig.hero.subtitle}</h1>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/85">Van fijne adressen en events tot mooie Bossche producten.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href={homepageConfig.hero.ctaPrimary.href}
                className="rounded-full bg-brand-coral px-5 py-2.5 text-sm font-semibold text-white"
              >
                {homepageConfig.hero.ctaPrimary.label}
              </Link>
              <Link
                href={homepageConfig.hero.ctaSecondary.href}
                className="rounded-full border border-white/40 px-5 py-2.5 text-sm font-semibold text-white"
              >
                {homepageConfig.hero.ctaSecondary.label}
              </Link>
            </div>
          </div>

          {heroItem ? (
            <article className="glass-surface overflow-hidden rounded-editorial text-brand-teal shadow-card">
              <div className="relative aspect-[4/3]">
                <Image src={heroItem.image} alt={heroItem.title} fill className="object-cover" priority sizes="(max-width: 1024px) 100vw, 40vw" />
              </div>
              <div className="space-y-2 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-coral">{heroItem.editorialLabel}</p>
                <h2 className="text-2xl font-bold leading-tight">
                  <Link href={`/ontdek/${heroItem.slug}`}>{heroItem.title}</Link>
                </h2>
                <p className="text-sm text-brand-teal/75">{heroItem.excerpt}</p>
              </div>
            </article>
          ) : null}
        </div>
      </section>

      <section className="space-y-5">
        <SectionHeading
          eyebrow="Weekend Guide"
          title="Snel weten wat je dit weekend doet"
          description="Twee fijne tips uit de gids van deze week."
        />
        <div className="grid gap-4 md:grid-cols-2">
          {weekendHighlights.map((highlight) => (
            <article key={highlight.id} className="glass-surface rounded-editorial p-5 shadow-card">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-coral">{highlight.dayLabel}</p>
              <h3 className="mt-1 text-xl font-bold text-brand-teal">{highlight.title}</h3>
              <p className="mt-2 text-sm text-brand-teal/75">{highlight.summary}</p>
              <p className="mt-2 text-xs font-semibold uppercase tracking-[0.14em] text-brand-teal/60">{highlight.meta}</p>
              <Link href={highlight.ctaHref} className="mt-3 inline-flex text-sm font-semibold text-brand-teal hover:text-brand-coral">
                Bekijk dag →
              </Link>
            </article>
          ))}
        </div>
        <Link href="/weekend-guide" className="inline-flex text-sm font-semibold text-brand-teal hover:text-brand-coral">
          Bekijk volledige Weekend Guide →
        </Link>
      </section>

      <section className="space-y-5">
        <SectionHeading
          eyebrow={homepageConfig.sections.discoverLabel}
          title="Laatste tips uit Den Bosch"
          description="Nieuwe plekken, fijne adressen en tips om te bewaren voor later."
        />
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {latest.map((item, index) => (
            <ContentCard key={item.id} item={item} priority={index < 2} />
          ))}
        </div>
        <Link href="/ontdek" className="inline-flex text-sm font-semibold text-brand-teal hover:text-brand-coral">
          Ontdek Den Bosch →
        </Link>
      </section>

      {highlightedItem ? (
        <section className="space-y-5">
          <SectionHeading
            eyebrow={homepageConfig.sections.highlightedLabel}
            title="Wat nu speelt in Den Bosch"
            description="Handmatig uitgelicht als we iets kiezen, en anders gewoon de nieuwste live post."
          />
          <div className="grid gap-5 lg:grid-cols-[1.2fr_1fr]">
            <article className="glass-surface overflow-hidden rounded-editorial shadow-card">
              <Link href={`/ontdek/${highlightedItem.slug}`} className="block">
                <div className="relative aspect-[16/10]">
                  <Image
                    src={highlightedItem.image}
                    alt={highlightedItem.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 55vw"
                  />
                </div>
              </Link>
              <div className="space-y-3 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-coral">
                  {highlightedItem.editorialLabel ?? homepageConfig.sections.highlightedLabel}
                </p>
                <h3 className="text-2xl font-bold text-brand-teal">
                  <Link href={`/ontdek/${highlightedItem.slug}`}>{highlightedItem.title}</Link>
                </h3>
                <p className="text-sm text-brand-teal/75">{highlightedItem.excerpt}</p>
                <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.14em] text-brand-teal/60">
                  <span>{formatDate(highlightedItem.publishedAt)}</span>
                  <span>{getCategoryLabel(highlightedItem.categories[0])}</span>
                </div>
              </div>
            </article>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              {highlightedSupportingItems.map((item) => (
                <ContentCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="space-y-5">
        <SectionHeading
          eyebrow={homepageConfig.sections.shopLabel}
          title="Shop favorieten"
          description="In samenwerking met lokale, Bossche partners. Je bestelt direct via de maker."
        />
        <div className="grid gap-5 md:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <Link href="/shop" className="inline-flex text-sm font-semibold text-brand-teal hover:text-brand-coral">
          Bekijk de shop →
        </Link>
      </section>

      <NewsletterCta />
    </div>
  );
}

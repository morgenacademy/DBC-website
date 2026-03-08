import Image from "next/image";
import Link from "next/link";
import { ContentCard } from "@/components/cards/content-card";
import { ProductCard } from "@/components/cards/product-card";
import { NewsletterCta } from "@/components/sections/newsletter-cta";
import { SectionHeading } from "@/components/ui/section-heading";
import { homepageConfig } from "@/lib/config/homepage";
import { buildMetadata } from "@/lib/seo";
import { commerceProvider, contentRepository, themeRepository, weekendRepository } from "@/lib/repositories";

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

function getHomeWeekendHighlights(): HomeWeekendHighlight[] {
  const guide = weekendRepository.getCurrentGuide();
  const sections = weekendRepository.listGuideSections(guide.slug);
  const orderedSections = sections.filter((section) => section.day !== "hele-weekend");
  const sourceSections = orderedSections.length > 0 ? orderedSections : sections;

  return sourceSections.slice(0, 2).map((section) => {
    const event = section.events[0];
    const meta = [event.timeLabel, event.venue].filter(Boolean).join(" · ");

    return {
      id: `${section.day}-${event.id}`,
      dayLabel: section.label,
      title: event.title,
      summary: extractLeadSentence(event.description),
      meta,
      ctaHref: `/weekend-guide#${section.day}`
    };
  });
}

export default function HomePage(): React.JSX.Element {
  const featured = contentRepository.listFeatured(4);
  const heroItem = featured[0];
  const weekendHighlights = getHomeWeekendHighlights();
  const latest = contentRepository.listLatest(6);
  const products = commerceProvider.listProducts(true).slice(0, 3);

  const seasonalMoment = themeRepository.listThemes("moment").find((item) => item.slug === "koningsdag") ?? themeRepository.listThemes("moment")[0];
  const seasonalItems = seasonalMoment ? contentRepository.listContent({ moment: seasonalMoment.slug }).slice(0, 3) : [];

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-14 px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
      <section className="glass-hero relative overflow-hidden rounded-[2rem] border border-brand-teal/15 px-6 py-12 text-white sm:px-10">
        <div className="absolute right-0 top-0 h-48 w-48 -translate-y-1/2 translate-x-1/3 rounded-full bg-brand-coral/45 blur-2xl" />
        <div className="grid gap-8 lg:grid-cols-[1.15fr_1fr] lg:items-end">
          <div>
            <p className="font-display text-sm uppercase tracking-[0.28em] text-brand-peach">{homepageConfig.sections.featuredLabel}</p>
            <h1 className="mt-3 max-w-xl text-balance text-4xl font-bold leading-tight sm:text-5xl">{homepageConfig.hero.subtitle}</h1>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/85">
              Ontdek wat er speelt in Den Bosch, plan je weekend en shop lokale favorieten.
            </p>
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
                  <Link href={`/discover/${heroItem.slug}`}>{heroItem.title}</Link>
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
          description="Twee actuele picks uit de gids van deze week. Open de Weekend Guide voor het complete overzicht per dag."
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
          title="Laatste tips en Instagram-gedreven stories"
          description="Ontdek is je hoofdingang voor zoeken, terugvinden en bladeren door oudere content."
        />
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {latest.map((item, index) => (
            <ContentCard key={item.id} item={item} priority={index < 2} />
          ))}
        </div>
        <Link href="/discover" className="inline-flex text-sm font-semibold text-brand-teal hover:text-brand-coral">
          Ontdek Den Bosch →
        </Link>
      </section>

      {seasonalMoment ? (
        <section className="space-y-5">
          <SectionHeading
            eyebrow={homepageConfig.sections.seasonalLabel}
            title={`${seasonalMoment.title} in Den Bosch`}
            description="Thema&apos;s en momenten blijven beschikbaar als landingspagina's binnen Ontdek."
          />
          <div className="grid gap-5 lg:grid-cols-[1.2fr_1fr]">
            <Link href={`/moment/${seasonalMoment.slug}`} className="glass-surface rounded-editorial p-5 shadow-card">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-coral">Moment</p>
              <h3 className="mt-1 text-2xl font-bold text-brand-teal">{seasonalMoment.title}</h3>
              <p className="mt-2 text-sm text-brand-teal/75">{seasonalMoment.intro}</p>
              <span className="mt-4 inline-flex text-sm font-semibold text-brand-teal">Open moment pagina →</span>
            </Link>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              {seasonalItems.slice(0, 2).map((item) => (
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
          Naar Shop →
        </Link>
      </section>

      <NewsletterCta />
    </div>
  );
}

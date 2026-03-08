import Image from "next/image";
import Link from "next/link";
import { ContentCard } from "@/components/cards/content-card";
import { ProductCard } from "@/components/cards/product-card";
import { NewsletterCta } from "@/components/sections/newsletter-cta";
import { SectionHeading } from "@/components/ui/section-heading";
import { homepageConfig } from "@/lib/config/homepage";
import { buildMetadata } from "@/lib/seo";
import { collectionRepository, commerceProvider, contentRepository, themeRepository, weekendRepository } from "@/lib/repositories";

export const metadata = buildMetadata({
  title: "Home",
  description: "Curated city platform voor Den Bosch: weekend guide, discover, themes, moments en shop.",
  path: "/"
});

export default function HomePage(): React.JSX.Element {
  const featured = contentRepository.listFeatured(6);
  const hero = featured[0];
  const latest = contentRepository.listLatest(6);
  const weekend = weekendRepository.listWeekendItems().slice(0, 3);
  const themes = themeRepository.listThemes("theme").slice(0, 4);
  const moments = themeRepository.listThemes("moment").slice(0, 3);
  const collections = collectionRepository.listCollections().slice(0, 3);
  const products = commerceProvider.listProducts(true).slice(0, 3);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-16 px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
      <section className="relative overflow-hidden rounded-[2rem] border border-brand-teal/15 bg-gradient-to-br from-brand-teal to-[#0a7e7f] px-6 py-12 text-white sm:px-10">
        <div className="absolute right-0 top-0 h-48 w-48 -translate-y-1/2 translate-x-1/3 rounded-full bg-brand-coral/45 blur-2xl" />
        <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:items-end">
          <div>
            <p className="font-display text-sm uppercase tracking-[0.28em] text-brand-peach">{homepageConfig.sections.featuredLabel}</p>
            <h1 className="mt-3 max-w-xl text-balance text-4xl font-bold leading-tight sm:text-5xl">{homepageConfig.hero.subtitle}</h1>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/85">
              Den Bosch City combineert social-first content met een eigen, doorzoekbare en redactionele city experience.
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

          {hero ? (
            <article className="overflow-hidden rounded-editorial bg-white/95 text-brand-teal shadow-card">
              <div className="relative aspect-[4/3]">
                <Image src={hero.image} alt={hero.title} fill className="object-cover" priority sizes="(max-width: 1024px) 100vw, 40vw" />
              </div>
              <div className="space-y-2 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-coral">{hero.editorialLabel}</p>
                <h2 className="text-2xl font-bold leading-tight">
                  <Link href={`/discover/${hero.slug}`}>{hero.title}</Link>
                </h2>
                <p className="text-sm text-brand-teal/75">{hero.excerpt}</p>
              </div>
            </article>
          ) : null}
        </div>
      </section>

      <section className="space-y-5">
        <SectionHeading
          eyebrow="Weekend Guide"
          title="Weekend route met duidelijke categorieën"
          description="Food, events, culture, kids en shopping direct overzichtelijk in één redactioneel blok."
        />
        <div className="grid gap-4 md:grid-cols-3">
          {weekend.map((item) => (
            <article key={item.id} className="rounded-editorial border border-brand-teal/15 bg-white p-4 shadow-card">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-coral">{item.category}</p>
              <h3 className="mt-1 text-lg font-bold text-brand-teal">{item.title}</h3>
              <p className="mt-2 text-sm text-brand-teal/75">{item.summary}</p>
              <Link href={item.ctaHref} className="mt-3 inline-flex text-sm font-semibold text-brand-teal hover:text-brand-coral">
                {item.ctaLabel} →
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-5">
        <SectionHeading
          eyebrow={homepageConfig.sections.discoverLabel}
          title="Actuele city stories"
          description="Curated highlights op Home, volledige zoek- en filterervaring op Discover."
        />
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {latest.slice(0, 6).map((item, index) => (
            <ContentCard key={item.id} item={item} priority={index < 2} />
          ))}
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-4">
          <SectionHeading eyebrow={homepageConfig.sections.momentsLabel} title="Themes en moments" />
          <div className="grid gap-3 sm:grid-cols-2">
            {themes.concat(moments).slice(0, 6).map((entry) => (
              <Link
                key={entry.id}
                href={entry.kind === "theme" ? `/theme/${entry.slug}` : `/moment/${entry.slug}`}
                className="rounded-editorial border border-brand-teal/15 bg-white p-4 shadow-card transition hover:border-brand-coral/40"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-coral">{entry.kind}</p>
                <h3 className="mt-1 text-lg font-bold text-brand-teal">{entry.title}</h3>
                <p className="mt-2 text-sm text-brand-teal/75">{entry.intro}</p>
              </Link>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <SectionHeading eyebrow={homepageConfig.sections.collectionsLabel} title="Collections als redactionele laag" />
          <div className="space-y-3">
            {collections.map((collection) => (
              <Link
                key={collection.id}
                href={`/collection/${collection.slug}`}
                className="block rounded-editorial border border-brand-teal/15 bg-white p-4 shadow-card"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-coral">{collection.channel}</p>
                <h3 className="mt-1 text-lg font-bold text-brand-teal">{collection.title}</h3>
                <p className="mt-2 text-sm text-brand-teal/75">{collection.intro}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-5">
        <SectionHeading eyebrow={homepageConfig.sections.shopLabel} title="Shop teaser" />
        <div className="grid gap-5 md:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <Link href="/shop" className="inline-flex text-sm font-semibold text-brand-teal hover:text-brand-coral">
          Naar volledige shopervaring →
        </Link>
      </section>

      <NewsletterCta />
    </div>
  );
}

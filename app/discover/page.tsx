import type { Metadata } from "next";
import Link from "next/link";
import { ContentCard } from "@/components/cards/content-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { getCategoryLabel } from "@/lib/content-labels";
import { buildMetadata } from "@/lib/seo";
import { getContentRepository, themeRepository } from "@/lib/repositories";
import type { WeekendCategory } from "@/lib/types";

export const metadata: Metadata = buildMetadata({
  title: "Ontdek",
  description: "Ontdek is de centrale instagrid en zoekbare contenthub van Den Bosch City.",
  path: "/discover"
});

interface DiscoverPageProps {
  searchParams: Promise<{ q?: string; theme?: string; moment?: string; category?: string }>;
}

const categories: WeekendCategory[] = ["food", "events", "culture", "kids", "shopping", "nightlife", "local-tips"];

export default async function DiscoverPage({ searchParams }: DiscoverPageProps): Promise<React.JSX.Element> {
  const contentRepository = await getContentRepository();
  const params = await searchParams;
  const hasActiveFilters = Boolean(params.q || params.theme || params.moment || params.category);

  const items = contentRepository.listContent({
    q: params.q,
    theme: params.theme,
    moment: params.moment,
    category: params.category
  });

  const featured = contentRepository.listFeatured(3);
  const themes = themeRepository.listThemes("theme").slice(0, 6);
  const moments = themeRepository.listThemes("moment").slice(0, 4);

  return (
    <div className="mx-auto w-full max-w-6xl space-y-8 px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <section className="glass-surface rounded-[2rem] p-6 shadow-card sm:p-8">
        <SectionHeading eyebrow="Ontdek" title="Ontdek Den Bosch" />

        <form className="mt-6 grid gap-3 md:grid-cols-4" role="search" aria-label="Zoek en filter Ontdek">
          <label className="md:col-span-2">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.16em] text-brand-teal/60">Zoeken</span>
            <input
              type="search"
              name="q"
              defaultValue={params.q}
              placeholder="bijv. vegetarisch, koningsdag, brunch"
              className="h-11 w-full rounded-xl border border-brand-teal/20 bg-white px-3 text-sm"
            />
          </label>

          <label>
            <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.16em] text-brand-teal/60">Thema</span>
            <select name="theme" defaultValue={params.theme ?? ""} className="h-11 w-full rounded-xl border border-brand-teal/20 bg-white px-3 text-sm">
              <option value="">Alle</option>
              {themes.map((theme) => (
                <option key={theme.id} value={theme.slug}>
                  {theme.title}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.16em] text-brand-teal/60">Categorie</span>
            <select
              name="category"
              defaultValue={params.category ?? ""}
              className="h-11 w-full rounded-xl border border-brand-teal/20 bg-white px-3 text-sm"
            >
              <option value="">Alle</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {getCategoryLabel(category)}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.16em] text-brand-teal/60">Moment</span>
            <select name="moment" defaultValue={params.moment ?? ""} className="h-11 w-full rounded-xl border border-brand-teal/20 bg-white px-3 text-sm">
              <option value="">Alle</option>
              {moments.map((moment) => (
                <option key={moment.id} value={moment.slug}>
                  {moment.title}
                </option>
              ))}
            </select>
          </label>

          <div className="flex items-end gap-2 md:col-span-4">
            <button type="submit" className="rounded-full bg-brand-coral px-4 py-2 text-sm font-semibold text-white">
              Zoek in Ontdek
            </button>
            <Link href="/discover" className="rounded-full border border-brand-teal/20 bg-white px-4 py-2 text-sm font-semibold text-brand-teal">
              Reset
            </Link>
          </div>
        </form>
      </section>

      <section className="space-y-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-teal/60">Thema&apos;s</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {themes.map((theme) => (
              <Link key={theme.id} href={`/theme/${theme.slug}`} className="rounded-full bg-brand-sand px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-brand-teal">
                {theme.title}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-teal/60">Nu relevant</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {moments.map((moment) => (
              <Link
                key={moment.id}
                href={`/moment/${moment.slug}`}
                className="glass-chip rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-brand-teal"
              >
                {moment.title}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {!hasActiveFilters ? (
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-brand-teal">Populair nu</h2>
          <div className="grid gap-5 md:grid-cols-3">
            {featured.map((item, index) => (
              <ContentCard key={item.id} item={item} priority={index < 2} />
            ))}
          </div>
        </section>
      ) : null}

      <section className="space-y-4">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-2xl font-bold text-brand-teal">{hasActiveFilters ? "Zoekresultaten" : "Laatste uit Ontdek"}</h2>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-brand-teal/60">
            {items.length} {items.length === 1 ? "resultaat" : "resultaten"}
          </p>
        </div>

        {items.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {items.map((item, index) => (
              <ContentCard key={item.id} item={item} priority={index < 2} />
            ))}
          </div>
        ) : (
          <div className="glass-surface rounded-editorial p-6 text-sm text-brand-teal/75">
            Geen resultaten gevonden. Probeer een andere zoekterm of reset je filters.
          </div>
        )}
      </section>
    </div>
  );
}

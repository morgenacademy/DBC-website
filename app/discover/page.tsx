import type { Metadata } from "next";
import Link from "next/link";
import { ContentCard } from "@/components/cards/content-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { buildMetadata } from "@/lib/seo";
import { contentRepository, themeRepository } from "@/lib/repositories";
import { unique } from "@/lib/utils";
import type { ContentLayer, WeekendCategory } from "@/lib/types";

export const metadata: Metadata = buildMetadata({
  title: "Discover",
  description: "Doorzoek en filter Den Bosch City content op thema, moment, categorie en type.",
  path: "/discover"
});

interface DiscoverPageProps {
  searchParams: Promise<{ q?: string; theme?: string; moment?: string; category?: string; type?: string }>;
}

const categories: WeekendCategory[] = ["food", "events", "culture", "kids", "shopping", "nightlife", "local-tips"];
const layers: ContentLayer[] = ["fast", "evergreen", "moment"];

export default async function DiscoverPage({ searchParams }: DiscoverPageProps): Promise<React.JSX.Element> {
  const params = await searchParams;
  const items = contentRepository.listContent({
    q: params.q,
    theme: params.theme,
    moment: params.moment,
    category: params.category,
    type: params.type
  });

  const themes = themeRepository.listThemes("theme").map((item) => item.slug);
  const moments = unique(
    themeRepository
      .listThemes("moment")
      .map((item) => item.slug)
      .concat(contentRepository.listContent().flatMap((item) => item.moments))
  );

  return (
    <div className="mx-auto w-full max-w-6xl space-y-8 px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <SectionHeading
        eyebrow="Discover"
        title="Zoek, filter en ontdek"
        description="Discover is breed en filter-gedreven: zoek op caption, tags, hashtags, themes, categories en moments."
      />

      <form className="grid gap-3 rounded-editorial border border-brand-teal/15 bg-white p-4 shadow-card md:grid-cols-5" role="search">
        <label className="md:col-span-2">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.16em] text-brand-teal/60">Zoeken</span>
          <input
            type="search"
            name="q"
            defaultValue={params.q}
            placeholder="bijv. vegetarian, koningsdag, brunch"
            className="w-full rounded-xl border border-brand-teal/20 bg-white px-3 py-2 text-sm"
          />
        </label>

        <label>
          <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.16em] text-brand-teal/60">Theme</span>
          <select name="theme" defaultValue={params.theme ?? ""} className="w-full rounded-xl border border-brand-teal/20 bg-white px-3 py-2 text-sm">
            <option value="">Alle</option>
            {themes.map((theme) => (
              <option key={theme} value={theme}>
                {theme}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.16em] text-brand-teal/60">Moment</span>
          <select name="moment" defaultValue={params.moment ?? ""} className="w-full rounded-xl border border-brand-teal/20 bg-white px-3 py-2 text-sm">
            <option value="">Alle</option>
            {moments.map((moment) => (
              <option key={moment} value={moment}>
                {moment}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.16em] text-brand-teal/60">Category</span>
          <select
            name="category"
            defaultValue={params.category ?? ""}
            className="w-full rounded-xl border border-brand-teal/20 bg-white px-3 py-2 text-sm"
          >
            <option value="">Alle</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.16em] text-brand-teal/60">Type</span>
          <select name="type" defaultValue={params.type ?? ""} className="w-full rounded-xl border border-brand-teal/20 bg-white px-3 py-2 text-sm">
            <option value="">Alle</option>
            {layers.map((layer) => (
              <option key={layer} value={layer}>
                {layer}
              </option>
            ))}
          </select>
        </label>

        <div className="flex items-end gap-2 md:col-span-5">
          <button type="submit" className="rounded-full bg-brand-coral px-4 py-2 text-sm font-semibold text-white">
            Filter
          </button>
          <Link href="/discover" className="rounded-full border border-brand-teal/20 bg-white px-4 py-2 text-sm font-semibold text-brand-teal">
            Reset
          </Link>
        </div>
      </form>

      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-brand-teal/60">{items.length} resultaten</p>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item, index) => (
          <ContentCard key={item.id} item={item} priority={index < 2} />
        ))}
      </div>
    </div>
  );
}

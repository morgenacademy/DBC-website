import Link from "next/link";
import { SectionHeading } from "@/components/ui/section-heading";
import { getCategoryLabel } from "@/lib/content-labels";
import type { Theme, WeekendCategory } from "@/lib/types";

interface DiscoverSearchSectionProps {
  action?: string;
  query?: string;
  theme?: string;
  category?: string;
  moment?: string;
  themes: Theme[];
  moments: Theme[];
}

const categories: WeekendCategory[] = ["food", "events", "culture", "kids", "shopping", "nightlife", "local-tips"];

export function DiscoverSearchSection({
  action = "/ontdek",
  query,
  theme,
  category,
  moment,
  themes,
  moments
}: DiscoverSearchSectionProps): React.JSX.Element {
  return (
    <section className="glass-surface rounded-[2rem] p-6 shadow-card sm:p-8">
      <SectionHeading
        eyebrow="Ontdek"
        title="Ontdek Den Bosch"
        description="Van fijne terrassen en brunch tot winkels, cultuur en leuke tips voor later."
      />

      <form action={action} className="mt-6 grid gap-3 md:grid-cols-4" role="search" aria-label="Zoek en filter Ontdek">
        <label className="md:col-span-2">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.16em] text-brand-teal/60">Zoeken</span>
          <input
            type="search"
            name="q"
            defaultValue={query}
            placeholder="bijv. vegetarisch, koningsdag, brunch"
            className="h-11 w-full rounded-xl border border-brand-teal/20 bg-white px-3 text-sm"
          />
        </label>

        <label>
          <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.16em] text-brand-teal/60">Thema</span>
          <select name="theme" defaultValue={theme ?? ""} className="h-11 w-full rounded-xl border border-brand-teal/20 bg-white px-3 text-sm">
            <option value="">Alle</option>
            {themes.map((themeOption) => (
              <option key={themeOption.id} value={themeOption.slug}>
                {themeOption.title}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.16em] text-brand-teal/60">Categorie</span>
          <select name="category" defaultValue={category ?? ""} className="h-11 w-full rounded-xl border border-brand-teal/20 bg-white px-3 text-sm">
            <option value="">Alle</option>
            {categories.map((categoryOption) => (
              <option key={categoryOption} value={categoryOption}>
                {getCategoryLabel(categoryOption)}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.16em] text-brand-teal/60">Moment</span>
          <select name="moment" defaultValue={moment ?? ""} className="h-11 w-full rounded-xl border border-brand-teal/20 bg-white px-3 text-sm">
            <option value="">Alle</option>
            {moments.map((momentOption) => (
              <option key={momentOption.id} value={momentOption.slug}>
                {momentOption.title}
              </option>
            ))}
          </select>
        </label>

        <div className="flex items-end gap-2 md:col-span-4">
          <button type="submit" className="rounded-full bg-brand-coral px-4 py-2 text-sm font-semibold text-white">
            Zoeken
          </button>
          <Link href="/ontdek" className="rounded-full border border-brand-teal/20 bg-white px-4 py-2 text-sm font-semibold text-brand-teal">
            Wis filters
          </Link>
        </div>
      </form>
    </section>
  );
}

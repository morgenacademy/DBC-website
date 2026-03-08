import type { Metadata } from "next";
import Link from "next/link";
import { WeekendCard } from "@/components/cards/weekend-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { buildMetadata } from "@/lib/seo";
import { weekendRepository } from "@/lib/repositories";
import type { WeekendCategory } from "@/lib/types";

const categories: WeekendCategory[] = ["food", "events", "culture", "kids", "shopping", "nightlife", "local-tips"];

export const metadata: Metadata = buildMetadata({
  title: "Weekend Guide",
  description: "Redactionele weekendselectie voor Den Bosch met categorieën en directe routes.",
  path: "/weekend-guide"
});

interface WeekendGuidePageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function WeekendGuidePage({ searchParams }: WeekendGuidePageProps): Promise<React.JSX.Element> {
  const params = await searchParams;
  const selectedCategory = categories.includes(params.category as WeekendCategory)
    ? (params.category as WeekendCategory)
    : undefined;

  const items = weekendRepository.listWeekendItems(undefined, selectedCategory);

  return (
    <div className="mx-auto w-full max-w-6xl space-y-8 px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <SectionHeading
        eyebrow="Weekend Guide"
        title="Jouw weekend in Den Bosch"
        description="Een redactionele planning met snelle categorie-keuzes voor food, culture, kids, nightlife en lokale tips."
      />

      <form className="flex flex-wrap gap-2" role="search" aria-label="Filter weekend categorie">
        {categories.map((category) => (
          <button
            key={category}
            type="submit"
            name="category"
            value={category}
            className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
              selectedCategory === category
                ? "border-brand-coral bg-brand-coral text-white"
                : "border-brand-teal/25 bg-white text-brand-teal hover:border-brand-coral/55"
            }`}
          >
            {category}
          </button>
        ))}
        {selectedCategory ? (
          <Link href="/weekend-guide" className="rounded-full border border-brand-teal/25 bg-white px-4 py-2 text-sm font-semibold text-brand-teal">
            Reset
          </Link>
        ) : null}
      </form>

      <div className="grid gap-4">
        {items.map((item) => (
          <WeekendCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}

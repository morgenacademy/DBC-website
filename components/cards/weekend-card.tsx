import Image from "next/image";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import type { WeekendItem } from "@/lib/types";

interface WeekendCardProps {
  item: WeekendItem;
}

export function WeekendCard({ item }: WeekendCardProps): React.JSX.Element {
  return (
    <article className="grid gap-4 overflow-hidden rounded-editorial border border-brand-teal/15 bg-white p-3 shadow-card sm:grid-cols-[160px_1fr]">
      <div className="relative aspect-[4/3] overflow-hidden rounded-xl sm:aspect-square">
        <Image src={item.image} alt={item.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 160px" />
      </div>
      <div className="flex flex-col justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-brand-coral">
            {item.category} · {formatDate(item.date)}
          </p>
          <h3 className="mt-1 text-xl font-bold text-brand-teal">{item.title}</h3>
          <p className="mt-1 text-sm text-brand-teal/75">{item.summary}</p>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-[0.15em] text-brand-teal/60">{item.location}</span>
          <Link href={item.ctaHref} className="text-sm font-semibold text-brand-teal hover:text-brand-coral">
            {item.ctaLabel} →
          </Link>
        </div>
      </div>
    </article>
  );
}

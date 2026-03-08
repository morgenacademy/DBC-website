import Image from "next/image";
import Link from "next/link";
import { Pill } from "@/components/ui/pill";
import { formatDate } from "@/lib/utils";
import type { ContentItem } from "@/lib/types";

interface ContentCardProps {
  item: ContentItem;
  priority?: boolean;
}

export function ContentCard({ item, priority = false }: ContentCardProps): React.JSX.Element {
  return (
    <article className="group overflow-hidden rounded-editorial border border-brand-teal/15 bg-white shadow-card transition hover:-translate-y-0.5">
      <Link href={`/discover/${item.slug}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={item.image}
            alt={item.title}
            fill
            className="object-cover transition duration-300 group-hover:scale-[1.02]"
            sizes="(max-width: 768px) 100vw, 33vw"
            priority={priority}
          />
        </div>
      </Link>

      <div className="flex flex-col gap-3 p-4">
        <div className="flex flex-wrap items-center gap-2">
          {item.editorialLabel ? <Pill label={item.editorialLabel} tone="accent" /> : null}
          <Pill label={item.contentLayer} />
        </div>

        <h3 className="text-lg font-bold leading-tight text-brand-teal">
          <Link href={`/discover/${item.slug}`} className="hover:text-brand-coral">
            {item.title}
          </Link>
        </h3>

        <p className="text-sm leading-relaxed text-brand-teal/75">{item.excerpt}</p>

        <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-brand-teal/55">
          <span>{formatDate(item.publishedAt)}</span>
          <span>{item.categories[0]}</span>
        </div>
      </div>
    </article>
  );
}

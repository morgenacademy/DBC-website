import Image from "next/image";
import Link from "next/link";
import { Pill } from "@/components/ui/pill";
import { resolveContentMediaEntries } from "@/lib/content-media";
import { getCategoryLabel } from "@/lib/content-labels";
import { formatDate } from "@/lib/utils";
import type { ContentItem } from "@/lib/types";

interface ContentCardProps {
  item: ContentItem;
  priority?: boolean;
}

export function ContentCard({ item, priority = false }: ContentCardProps): React.JSX.Element {
  const mediaCount = resolveContentMediaEntries(item).length;
  const hasMultipleMedia = item.mediaType === "carousel" && mediaCount > 1;
  const isVideoPost = item.mediaType === "reel";
  const displayTitle = item.title.replace(/(['’]s)-Hertogenbosch/g, "$1‑Hertogenbosch");

  return (
    <article className="glass-surface group overflow-hidden rounded-editorial shadow-card transition hover:-translate-y-0.5">
      <Link href={`/ontdek/${item.slug}`} className="block">
        <div className="relative aspect-square overflow-hidden sm:aspect-[4/5]">
          <Image
            src={item.image}
            alt={item.title}
            fill
            className="object-cover transition duration-300 group-hover:scale-[1.02]"
            sizes="(max-width: 768px) 100vw, 33vw"
            priority={priority}
          />
          {isVideoPost ? (
            <div className="absolute right-2 top-2 rounded-full bg-black/45 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-white backdrop-blur-sm sm:right-3 sm:top-3 sm:px-2.5 sm:py-1 sm:text-[10px]">
              Video
            </div>
          ) : null}
          {hasMultipleMedia ? (
            <div className="absolute right-2 top-2 rounded-full bg-black/45 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-white backdrop-blur-sm sm:right-3 sm:top-3 sm:px-2.5 sm:py-1 sm:text-[10px]">
              {mediaCount} media
            </div>
          ) : null}
        </div>
      </Link>

      <div className="flex flex-col gap-2 p-3 sm:gap-3 sm:p-4">
        {item.editorialLabel ? (
          <div className="flex flex-wrap items-center gap-2">
            <Pill label={item.editorialLabel} tone="accent" />
          </div>
        ) : null}

        <h3 className="text-balance text-[0.95rem] font-bold leading-[1.15] text-brand-teal sm:text-lg" style={{ textWrap: "balance" }}>
          <Link href={`/ontdek/${item.slug}`} className="hover:text-brand-coral">
            {displayTitle}
          </Link>
        </h3>

        <p className="text-[13px] leading-snug text-brand-teal/75 sm:text-sm sm:leading-relaxed">{item.excerpt}</p>

        <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.12em] text-brand-teal/55 sm:text-xs sm:tracking-wide">
          <span>{formatDate(item.publishedAt)}</span>
          <span>{getCategoryLabel(item.categories[0])}</span>
        </div>
      </div>
    </article>
  );
}

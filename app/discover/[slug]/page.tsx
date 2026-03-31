import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ContentCard } from "@/components/cards/content-card";
import { ContentMediaCarousel } from "@/components/media/content-media-carousel";
import { resolveContentMediaEntries } from "@/lib/content-media";
import { Pill } from "@/components/ui/pill";
import { getCategoryLabel, getContentLayerLabel } from "@/lib/content-labels";
import { buildMetadata } from "@/lib/seo";
import { getContentRepository } from "@/lib/repositories";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

interface ContentDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ContentDetailPageProps): Promise<Metadata> {
  const contentRepository = await getContentRepository();
  const resolved = await params;
  const item = contentRepository.getContentBySlug(resolved.slug);

  if (!item) {
    return buildMetadata({ title: "Niet gevonden", description: "Content niet gevonden.", path: "/ontdek", noIndex: true });
  }

  return buildMetadata({
    title: item.seo?.title ?? item.title,
    description: item.seo?.description ?? item.excerpt,
    path: item.seo?.canonicalPath ?? `/ontdek/${item.slug}`,
    image: item.seo?.ogImage ?? item.image
  });
}

export default async function ContentDetailPage({ params }: ContentDetailPageProps): Promise<React.JSX.Element> {
  const contentRepository = await getContentRepository();
  const resolved = await params;
  const item = contentRepository.getContentBySlug(resolved.slug);

  if (!item) {
    notFound();
  }

  const related = contentRepository.getRelatedContent(item, 3);
  const mediaItems = resolveContentMediaEntries(item);
  const heroMedia = mediaItems[0];
  const additionalMediaItems = mediaItems.slice(1);
  const detailRows = [
    item.themes.length > 0
      ? {
          label: "Thema's",
          value: item.themes.join(", ")
        }
      : null,
    item.moments.length > 0
      ? {
          label: "Momenten",
          value: item.moments.join(", ")
        }
      : null,
    item.categories.length > 0
      ? {
          label: "Categorieën",
          value: item.categories.map((category) => getCategoryLabel(category)).join(", ")
        }
      : null,
    item.hashtags.length > 0
      ? {
          label: "Hashtags",
          value: item.hashtags.map((tag) => `#${tag}`).join(" ")
        }
      : null
  ].filter(Boolean) as Array<{ label: string; value: string }>;

  return (
    <article className="mx-auto w-full max-w-5xl space-y-8 px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <header className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          {item.editorialLabel ? <Pill label={item.editorialLabel} tone="accent" /> : null}
          <Pill label={getContentLayerLabel(item.contentLayer)} />
        </div>
        <h1 className="text-balance text-4xl font-bold leading-tight text-brand-teal sm:text-5xl">{item.title}</h1>
        <p className="max-w-3xl text-lg text-brand-teal/75">{item.excerpt}</p>
        <div className="flex flex-wrap gap-4 text-xs font-semibold uppercase tracking-[0.16em] text-brand-teal/55">
          <span>{formatDate(item.publishedAt)}</span>
        </div>
      </header>

      {heroMedia?.type === "video" ? (
        <div className="mx-auto max-w-md overflow-hidden rounded-[1.8rem] bg-black shadow-card">
          <video controls playsInline preload="metadata" poster={heroMedia.poster} className="aspect-[9/16] h-full w-full bg-black object-contain">
            <source src={heroMedia.url} />
          </video>
        </div>
      ) : item.mediaType === "carousel" ? (
        <div className="relative aspect-[16/9] overflow-hidden rounded-[1.8rem]">
          <Image src={item.image} alt={item.title} fill className="object-cover" priority sizes="100vw" />
        </div>
      ) : (
        <div className="relative aspect-[16/9] overflow-hidden rounded-[1.8rem]">
          <Image src={item.image} alt={item.title} fill className="object-cover" priority sizes="100vw" />
        </div>
      )}

      <section className="grid gap-8 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-4 text-base leading-relaxed text-brand-teal/90">
          {item.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}

          {additionalMediaItems.length > 0 ? <ContentMediaCarousel title={item.title} mediaItems={additionalMediaItems} /> : null}

          {item.sourcePermalink ? (
            <a
              href={item.sourcePermalink}
              target="_blank"
              rel="noreferrer"
              className="inline-flex rounded-full border border-brand-teal/25 bg-white px-4 py-2 text-sm font-semibold text-brand-teal"
            >
              Bekijk originele post
            </a>
          ) : null}
        </div>

        {detailRows.length > 0 || item.themes.length > 0 ? (
          <aside className="space-y-4 rounded-editorial border border-brand-teal/15 bg-white p-4">
            <h2 className="text-lg font-bold text-brand-teal">Details</h2>
            {detailRows.length > 0 ? (
              <div className="space-y-2 text-sm text-brand-teal/80">
                {detailRows.map((row) => (
                  <p key={row.label}>
                    <span className="font-semibold">{row.label}:</span> {row.value}
                  </p>
                ))}
              </div>
            ) : null}

            {item.themes.length > 0 ? (
              <div className="pt-2">
                {item.themes.slice(0, 2).map((theme) => (
                  <Link key={theme} href={`/theme/${theme}`} className="mr-2 inline-flex rounded-full bg-brand-sand px-3 py-1 text-xs font-semibold uppercase tracking-wide">
                    {theme}
                  </Link>
                ))}
              </div>
            ) : null}
          </aside>
        ) : null}
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-brand-teal">Gerelateerde content</h2>
        <div className="grid gap-5 md:grid-cols-3">
          {related.map((relatedItem) => (
            <ContentCard key={relatedItem.id} item={relatedItem} />
          ))}
        </div>
      </section>
    </article>
  );
}

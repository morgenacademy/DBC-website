import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ContentCard } from "@/components/cards/content-card";
import { Pill } from "@/components/ui/pill";
import { buildMetadata } from "@/lib/seo";
import { contentRepository } from "@/lib/repositories";
import { formatDate } from "@/lib/utils";

interface ContentDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  return contentRepository.listContent().map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: ContentDetailPageProps): Promise<Metadata> {
  const resolved = await params;
  const item = contentRepository.getContentBySlug(resolved.slug);

  if (!item) {
    return buildMetadata({ title: "Niet gevonden", description: "Content niet gevonden.", path: "/discover", noIndex: true });
  }

  return buildMetadata({
    title: item.seo?.title ?? item.title,
    description: item.seo?.description ?? item.excerpt,
    path: item.seo?.canonicalPath ?? `/discover/${item.slug}`,
    image: item.seo?.ogImage ?? item.image
  });
}

export default async function ContentDetailPage({ params }: ContentDetailPageProps): Promise<React.JSX.Element> {
  const resolved = await params;
  const item = contentRepository.getContentBySlug(resolved.slug);

  if (!item) {
    notFound();
  }

  const related = contentRepository.getRelatedContent(item, 3);

  return (
    <article className="mx-auto w-full max-w-5xl space-y-8 px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <header className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          {item.editorialLabel ? <Pill label={item.editorialLabel} tone="accent" /> : null}
          <Pill label={item.contentLayer} />
        </div>
        <h1 className="text-balance text-4xl font-bold leading-tight text-brand-teal sm:text-5xl">{item.title}</h1>
        <p className="max-w-3xl text-lg text-brand-teal/75">{item.excerpt}</p>
        <div className="flex flex-wrap gap-4 text-xs font-semibold uppercase tracking-[0.16em] text-brand-teal/55">
          <span>{formatDate(item.publishedAt)}</span>
          <span>{item.sourcePlatform}</span>
          <span>{item.mediaType}</span>
        </div>
      </header>

      <div className="relative aspect-[16/9] overflow-hidden rounded-[1.8rem]">
        <Image src={item.image} alt={item.title} fill className="object-cover" priority sizes="100vw" />
      </div>

      <section className="grid gap-8 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-4 text-base leading-relaxed text-brand-teal/90">
          {item.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}

          <div className="rounded-editorial border border-brand-teal/15 bg-white p-4">
            <h2 className="text-lg font-bold text-brand-teal">Caption</h2>
            <p className="mt-2 text-sm leading-relaxed text-brand-teal/75">{item.caption}</p>
          </div>

          {item.sourcePermalink ? (
            <a
              href={item.sourcePermalink}
              target="_blank"
              rel="noreferrer"
              className="inline-flex rounded-full border border-brand-teal/25 bg-white px-4 py-2 text-sm font-semibold text-brand-teal"
            >
              Bekijk originele Instagram post
            </a>
          ) : null}
        </div>

        <aside className="space-y-4 rounded-editorial border border-brand-teal/15 bg-white p-4">
          <h2 className="text-lg font-bold text-brand-teal">Metadata</h2>
          <div className="space-y-2 text-sm text-brand-teal/80">
            <p>
              <span className="font-semibold">Themes:</span> {item.themes.join(", ")}
            </p>
            <p>
              <span className="font-semibold">Moments:</span> {item.moments.join(", ")}
            </p>
            <p>
              <span className="font-semibold">Categories:</span> {item.categories.join(", ")}
            </p>
            <p>
              <span className="font-semibold">Hashtags:</span> {item.hashtags.map((tag) => `#${tag}`).join(" ")}
            </p>
          </div>

          <div className="pt-2">
            {item.themes.slice(0, 2).map((theme) => (
              <Link key={theme} href={`/theme/${theme}`} className="mr-2 inline-flex rounded-full bg-brand-sand px-3 py-1 text-xs font-semibold uppercase tracking-wide">
                {theme}
              </Link>
            ))}
          </div>
        </aside>
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

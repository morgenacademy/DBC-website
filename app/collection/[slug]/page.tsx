import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ContentCard } from "@/components/cards/content-card";
import { buildMetadata } from "@/lib/seo";
import { collectionRepository, contentRepository } from "@/lib/repositories";

interface CollectionPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  return collectionRepository.listCollections().map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: CollectionPageProps): Promise<Metadata> {
  const resolved = await params;
  const collection = collectionRepository.getCollectionBySlug(resolved.slug);

  if (!collection) {
    return buildMetadata({ title: "Collectie niet gevonden", description: "Collectie niet gevonden", path: "/ontdek", noIndex: true });
  }

  return buildMetadata({
    title: collection.title,
    description: collection.intro,
    path: `/collection/${collection.slug}`,
    image: collection.heroImage
  });
}

export default async function CollectionPage({ params }: CollectionPageProps): Promise<React.JSX.Element> {
  const resolved = await params;
  const collection = collectionRepository.getCollectionBySlug(resolved.slug);

  if (!collection) {
    notFound();
  }

  const items = collection.contentIds
    .map((id) => contentRepository.listContent().find((item) => item.id === id))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  return (
    <div className="mx-auto w-full max-w-6xl space-y-8 px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <section className="overflow-hidden rounded-[2rem] border border-brand-teal/15 bg-white shadow-card">
        <div className="relative min-h-[220px]">
          <Image src={collection.heroImage} alt={collection.title} fill className="object-cover" sizes="100vw" priority />
          <div className="absolute inset-0 bg-brand-teal/50" />
          <div className="relative z-10 px-6 py-8 text-white sm:px-10 sm:py-10">
            <p className="font-display text-sm uppercase tracking-[0.25em]">Collectie · {collection.channel}</p>
            <h1 className="mt-2 text-balance text-4xl font-bold sm:text-5xl">{collection.title}</h1>
            <p className="mt-3 max-w-2xl text-sm text-white/85">{collection.intro}</p>
            {collection.ctaLabel && collection.ctaHref ? (
              <Link href={collection.ctaHref} className="mt-5 inline-flex rounded-full bg-brand-coral px-4 py-2 text-sm font-semibold text-white">
                {collection.ctaLabel}
              </Link>
            ) : null}
          </div>
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <ContentCard key={item.id} item={item} />
        ))}
      </section>
    </div>
  );
}

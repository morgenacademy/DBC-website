import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ContentCard } from "@/components/cards/content-card";
import { NewsletterCta } from "@/components/sections/newsletter-cta";
import { buildMetadata } from "@/lib/seo";
import { getContentRepository, themeRepository } from "@/lib/repositories";
import { resolveThemeHeroImage } from "@/lib/theme-hero-image";

export const dynamic = "force-dynamic";

interface MomentPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: MomentPageProps): Promise<Metadata> {
  const resolved = await params;
  const moment = themeRepository.getThemeBySlug(resolved.slug);

  if (!moment || moment.kind !== "moment") {
    return buildMetadata({ title: "Moment niet gevonden", description: "Moment niet gevonden", path: "/ontdek", noIndex: true });
  }

  const contentRepository = await getContentRepository();
  const items = contentRepository.listContent({ moment: moment.slug });
  const heroImage = resolveThemeHeroImage(moment, items);

  return buildMetadata({
    title: moment.title,
    description: moment.intro,
    path: `/moment/${moment.slug}`,
    image: heroImage
  });
}

export default async function MomentPage({ params }: MomentPageProps): Promise<React.JSX.Element> {
  const resolved = await params;
  const moment = themeRepository.getThemeBySlug(resolved.slug);

  if (!moment || moment.kind !== "moment") {
    notFound();
  }

  const contentRepository = await getContentRepository();
  const items = contentRepository.listContent({ moment: moment.slug });
  const heroImage = resolveThemeHeroImage(moment, items);

  return (
    <div className="mx-auto w-full max-w-6xl space-y-8 px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <section className="grid gap-6 overflow-hidden rounded-[2rem] border border-brand-teal/15 bg-white lg:grid-cols-[1.2fr_1fr]">
        <div className="p-6 sm:p-10">
          <p className="font-display text-sm uppercase tracking-[0.26em] text-brand-coral">Moment</p>
          <h1 className="mt-2 text-balance text-4xl font-bold text-brand-teal sm:text-5xl">{moment.title}</h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-brand-teal/75">{moment.intro}</p>
          <div className="mt-6 flex gap-3">
            <Link href="/ontdek" className="rounded-full bg-brand-coral px-4 py-2 text-sm font-semibold text-white">
              Ontdek Den Bosch
            </Link>
          </div>
        </div>
        <div
          className="relative min-h-[260px]"
          style={!heroImage ? { background: `linear-gradient(135deg, ${moment.accentColor}, rgba(255, 255, 255, 0.55))` } : undefined}
        >
          {heroImage ? <Image src={heroImage} alt={moment.title} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 40vw" /> : null}
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <ContentCard key={item.id} item={item} />
        ))}
      </section>

      <NewsletterCta />
    </div>
  );
}

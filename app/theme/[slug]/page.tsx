import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ContentCard } from "@/components/cards/content-card";
import { buildMetadata } from "@/lib/seo";
import { getContentRepository, themeRepository } from "@/lib/repositories";
import { resolveThemeHeroImage } from "@/lib/theme-hero-image";

export const dynamic = "force-dynamic";

interface ThemePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ThemePageProps): Promise<Metadata> {
  const resolved = await params;
  const theme = themeRepository.getThemeBySlug(resolved.slug);

  if (!theme || theme.kind !== "theme") {
    return buildMetadata({ title: "Thema niet gevonden", description: "Thema niet gevonden", path: "/ontdek", noIndex: true });
  }

  const contentRepository = await getContentRepository();
  const items = contentRepository.listContent({ theme: theme.slug });
  const heroImage = resolveThemeHeroImage(theme, items);

  return buildMetadata({
    title: theme.title,
    description: theme.intro,
    path: `/theme/${theme.slug}`,
    image: heroImage
  });
}

export default async function ThemePage({ params }: ThemePageProps): Promise<React.JSX.Element> {
  const resolved = await params;
  const theme = themeRepository.getThemeBySlug(resolved.slug);

  if (!theme || theme.kind !== "theme") {
    notFound();
  }

  const contentRepository = await getContentRepository();
  const items = contentRepository.listContent({ theme: theme.slug });
  const heroImage = resolveThemeHeroImage(theme, items);

  return (
    <div className="mx-auto w-full max-w-6xl space-y-8 px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <section className="relative overflow-hidden rounded-[2rem] border border-brand-teal/15" style={!heroImage ? { backgroundColor: theme.accentColor } : undefined}>
        {heroImage ? (
          <div className="absolute inset-0">
            <Image src={heroImage} alt={theme.title} fill className="object-cover" sizes="100vw" priority />
            <div className="absolute inset-0 bg-brand-teal/55" />
          </div>
        ) : null}
        <div className="relative z-10 px-6 py-12 text-white sm:px-10">
          <p className="font-display text-sm uppercase tracking-[0.26em]">Thema</p>
          <h1 className="mt-2 text-4xl font-bold sm:text-5xl">{theme.title}</h1>
          <p className="mt-3 max-w-2xl text-sm text-white/85">{theme.intro}</p>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-3 lg:gap-5">
        {items.map((item) => (
          <ContentCard key={item.id} item={item} />
        ))}
      </section>
    </div>
  );
}

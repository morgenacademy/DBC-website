import type { MetadataRoute } from "next";
import { getContentRepository, themeRepository } from "@/lib/repositories";
import { siteConfig } from "@/lib/site-config";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.domain;
  const contentRepository = await getContentRepository();

  const staticRoutes = ["", "/ontdek", "/weekend-guide", "/shop"].map((path) => ({
    url: `${base}${path}`,
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.8
  }));

  const contentRoutes = contentRepository.listContent().map((item) => ({
    url: `${base}/ontdek/${item.slug}`,
    changeFrequency: "weekly" as const,
    priority: item.isFeatured ? 0.9 : 0.7
  }));

  const themeRoutes = themeRepository.listThemes().map((item) => ({
    url: `${base}/${item.kind === "theme" ? "theme" : "moment"}/${item.slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.75
  }));

  return [...staticRoutes, ...contentRoutes, ...themeRoutes];
}

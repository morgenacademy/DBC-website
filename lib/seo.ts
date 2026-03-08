import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";

interface BuildMetaInput {
  title: string;
  description: string;
  path: string;
  image?: string;
  noIndex?: boolean;
}

export function buildMetadata({
  title,
  description,
  path,
  image = "/brand/header-logo.png",
  noIndex = false
}: BuildMetaInput): Metadata {
  const url = new URL(path, siteConfig.domain).toString();

  return {
    title,
    description,
    alternates: {
      canonical: url
    },
    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.name,
      type: "website",
      locale: "nl_NL",
      images: [
        {
          url: image
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image]
    },
    robots: noIndex
      ? {
          index: false,
          follow: false
        }
      : undefined
  };
}

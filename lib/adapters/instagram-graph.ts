import type { InstagramRawRecord } from "@/lib/types";

export type InstagramGraphMediaType = "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";

export interface InstagramGraphMediaChild {
  id: string;
  media_type?: InstagramGraphMediaType;
  media_url?: string;
  thumbnail_url?: string;
}

export interface InstagramGraphMediaNode {
  id: string;
  caption?: string;
  media_type: InstagramGraphMediaType;
  media_url?: string;
  thumbnail_url?: string;
  permalink: string;
  timestamp: string;
  children?: {
    data?: InstagramGraphMediaChild[];
  };
}

function extractShortcode(permalink: string): string | undefined {
  const match = permalink.match(/\/p\/([^/?#]+)/i);
  return match?.[1];
}

function unique(values: Array<string | undefined>): string[] {
  return [...new Set(values.filter((value): value is string => Boolean(value && value.trim())))]
    .map((value) => value.trim());
}

function collectCarouselMediaUrls(node: InstagramGraphMediaNode): string[] {
  const children = node.children?.data ?? [];
  return unique(children.flatMap((child) => [child.media_url, child.thumbnail_url]));
}

export function mapInstagramGraphMediaNodeToRawRecord(node: InstagramGraphMediaNode): InstagramRawRecord | null {
  const carouselMediaUrls = node.media_type === "CAROUSEL_ALBUM" ? collectCarouselMediaUrls(node) : [];
  const primaryMediaUrl = node.media_url ?? node.thumbnail_url ?? carouselMediaUrls[0];
  const videoMediaUrls = node.media_type === "VIDEO" ? unique([node.media_url, node.thumbnail_url]) : [];

  if (!primaryMediaUrl) {
    return null;
  }

  return {
    id: node.id,
    permalink: node.permalink,
    caption: node.caption ?? "",
    media_type: node.media_type,
    media_url: primaryMediaUrl,
    media_urls:
      node.media_type === "CAROUSEL_ALBUM"
        ? unique([primaryMediaUrl, ...carouselMediaUrls])
        : node.media_type === "VIDEO"
          ? videoMediaUrls
          : undefined,
    thumbnail_url: node.thumbnail_url,
    timestamp: node.timestamp,
    slug: extractShortcode(node.permalink)
  };
}

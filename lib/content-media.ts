import type { ContentItem } from "@/lib/types";

export interface ContentMediaEntry {
  type: "image" | "video";
  url: string;
  poster?: string;
}

function uniqueUrls(urls: string[]): string[] {
  return [...new Set(urls.filter(Boolean))];
}

export function isVideoUrl(url: string): boolean {
  return /\.(mp4|m4v|mov)(\?|$)/i.test(url);
}

export function resolveContentMediaEntries(item: Pick<ContentItem, "mediaType" | "mediaUrls" | "image" | "thumbnail">): ContentMediaEntry[] {
  const urls = uniqueUrls(item.mediaUrls.length > 0 ? item.mediaUrls : [item.image, item.thumbnail].filter(Boolean));

  if (item.mediaType === "reel") {
    const videoUrl = urls.find(isVideoUrl);
    if (videoUrl) {
      return [
        {
          type: "video",
          url: videoUrl,
          poster: item.thumbnail ?? item.image
        }
      ];
    }

    return [{ type: "image", url: item.image }];
  }

  if (item.mediaType !== "carousel") {
    return [{ type: "image", url: item.image }];
  }

  const entries: ContentMediaEntry[] = [];

  for (let index = 0; index < urls.length; index += 1) {
    const currentUrl = urls[index];

    if (isVideoUrl(currentUrl)) {
      const nextUrl = urls[index + 1];
      const poster = nextUrl && !isVideoUrl(nextUrl) ? nextUrl : item.thumbnail ?? item.image;

      entries.push({
        type: "video",
        url: currentUrl,
        poster
      });

      if (nextUrl && !isVideoUrl(nextUrl)) {
        index += 1;
      }

      continue;
    }

    entries.push({
      type: "image",
      url: currentUrl
    });
  }

  return entries.length > 0 ? entries : [{ type: "image", url: item.image }];
}

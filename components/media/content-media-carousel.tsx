import Image from "next/image";
import type { ContentMediaEntry } from "@/lib/content-media";

interface ContentMediaCarouselProps {
  title: string;
  mediaItems: ContentMediaEntry[];
}

export function ContentMediaCarousel({ title, mediaItems }: ContentMediaCarouselProps): React.JSX.Element | null {
  const gallery = mediaItems.filter((item) => Boolean(item.url));

  if (gallery.length === 0) return null;

  return (
    <div className="rounded-[1.4rem] border border-brand-teal/10 bg-white/70 p-4">
      <div className="grid gap-4 sm:grid-cols-2">
        {gallery.map((mediaItem, index) => (
          <div key={`${mediaItem.url}-${index}`} className="relative aspect-[4/5] overflow-hidden rounded-[1.2rem] bg-brand-sand/30">
            {mediaItem.type === "video" ? (
              <video
                controls
                playsInline
                preload="metadata"
                poster={mediaItem.poster}
                className="h-full w-full bg-black object-contain"
              >
                <source src={mediaItem.url} />
              </video>
            ) : (
              <Image
                src={mediaItem.url}
                alt={`${title} foto ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 45vw"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { weekendRepository } from "@/lib/repositories/weekend-repository";
import type { WeekendGuideDay, WeekendGuideWeather } from "@/lib/types";

export const metadata: Metadata = buildMetadata({
  title: "Weekend Guide",
  description: "De leukste tips voor je weekend in Den Bosch, overzichtelijk per dag.",
  path: "/weekend-guide"
});

const dayTitles: Record<WeekendGuideDay, string> = {
  "hele-weekend": "Het hele weekend",
  donderdag: "Donderdag",
  vrijdag: "Vrijdag",
  zaterdag: "Zaterdag",
  zondag: "Zondag",
  maandag: "Maandag"
};

const dayShort: Record<WeekendGuideWeather["day"], string> = {
  do: "DO",
  vr: "VR",
  za: "ZA",
  zo: "ZO",
  ma: "MA"
};

function weatherIcon(icon: WeekendGuideWeather["icon"]): string {
  if (icon === "sunny") return "☀";
  if (icon === "partly-cloudy") return "⛅";
  if (icon === "rainy") return "🌧";
  return "☁";
}

export default function WeekendGuidePage(): React.JSX.Element {
  const guide = weekendRepository.getCurrentGuide();
  const sections = weekendRepository.listGuideSections(guide.slug);

  return (
    <div className="mx-auto w-full max-w-6xl space-y-8 px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <section className="glass-hero relative grid gap-6 overflow-hidden rounded-[2rem] p-6 text-white shadow-card lg:grid-cols-[1.1fr_0.9fr] lg:items-start sm:p-8">
        <div className="pointer-events-none absolute right-0 top-0 h-48 w-48 -translate-y-1/2 translate-x-1/3 rounded-full bg-brand-coral/40 blur-2xl" />
        <div className="text-white">
          <p className="font-display text-sm uppercase tracking-[0.22em] text-brand-sand">Weekend Guide</p>
          <h1 className="mt-2 font-sans text-4xl font-bold leading-[1.05] text-white sm:text-5xl">{guide.introTitle}</h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/85 sm:text-lg">{guide.introBody}</p>
        </div>

        <aside className="rounded-editorial border border-white/55 bg-white/90 p-6 text-center shadow-card backdrop-blur-sm sm:p-8">
          <p className="font-display text-4xl uppercase tracking-[0.12em] text-brand-coral drop-shadow-[0_1px_0_rgba(255,255,255,0.24)]">
            Weekend Guide
          </p>
          <p className="mt-2 font-display text-xl uppercase tracking-[0.06em] text-brand-coral drop-shadow-[0_1px_0_rgba(255,255,255,0.16)] sm:text-2xl">
            {guide.periodLabel}
          </p>
          <div className="mt-7 grid gap-1.5 sm:gap-3" style={{ gridTemplateColumns: `repeat(${guide.weather.length}, minmax(0, 1fr))` }}>
            {guide.weather.map((item) => (
              <div key={item.day} className="space-y-1 py-1">
                <p className="font-display text-xl tracking-[0.08em] text-brand-teal sm:text-3xl">{dayShort[item.day]}</p>
                <p className="text-xl text-brand-coral sm:text-2xl">{weatherIcon(item.icon)}</p>
                <p className="font-display text-xl tracking-[0.04em] text-brand-teal sm:text-3xl">{item.temperature}</p>
              </div>
            ))}
          </div>
        </aside>
      </section>

      <nav aria-label="Weekend dagen" className="glass-surface sticky top-[74px] z-40 rounded-editorial p-3 backdrop-blur">
        <div className="flex flex-wrap gap-2">
          {sections.map((section) => (
            <Link
              key={section.day}
              href={`#${section.day}`}
              className="rounded-full border border-brand-teal/20 bg-brand-sand px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-brand-teal transition hover:border-brand-coral hover:bg-brand-peach/60 hover:text-brand-coral"
            >
              {section.label}
            </Link>
          ))}
        </div>
      </nav>

      <div className="space-y-10">
        {sections.map((section) => (
          <section key={section.day} id={section.day} className="scroll-mt-32 space-y-5">
            <div className="glass-surface-warm rounded-editorial px-5 py-4 sm:px-7">
              <h2 className="font-display text-4xl uppercase tracking-[0.1em] text-brand-coral sm:text-5xl">{dayTitles[section.day]}</h2>
            </div>

            <div className="space-y-4">
              {section.events.map((event) => (
                <article key={event.id} className="glass-surface rounded-editorial p-5 shadow-card sm:p-6">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-brand-teal/68">
                    {event.timeLabel ?? "Hele dag"} · {event.venue}
                  </p>
                  <h3 className="font-display text-3xl uppercase tracking-[0.04em] text-brand-teal">{event.title}</h3>
                  <p className="mt-2 text-base leading-relaxed text-brand-teal/88">{event.description}</p>
                  {event.detailsList && event.detailsList.length > 0 ? (
                    <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-brand-teal/82">
                      {event.detailsList.map((item) => (
                        <li key={`${event.id}-${item}`}>{item}</li>
                      ))}
                    </ul>
                  ) : null}
                  {event.sourceLink ? (
                    <a
                      href={event.sourceLink}
                      className="mt-4 inline-flex rounded-full bg-brand-teal px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-orange"
                    >
                      Bekijk het overzicht
                    </a>
                  ) : null}
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

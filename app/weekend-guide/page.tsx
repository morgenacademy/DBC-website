import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { weekendRepository } from "@/lib/repositories";
import type { WeekendGuideDay, WeekendGuideWeather } from "@/lib/types";

export const metadata: Metadata = buildMetadata({
  title: "Weekend Guide",
  description: "Het complete weekendoverzicht van Den Bosch City, opgebouwd uit gestructureerde eventdata.",
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
  zo: "ZO"
};

function weatherIcon(icon: WeekendGuideWeather["icon"]): string {
  if (icon === "sunny") return "☀";
  if (icon === "partly-cloudy") return "⛅";
  return "☁";
}

export default function WeekendGuidePage(): React.JSX.Element {
  const guide = weekendRepository.getCurrentGuide();
  const sections = weekendRepository.listGuideSections(guide.slug);
  const totalEvents = sections.reduce((total, section) => total + section.events.length, 0);

  return (
    <div className="mx-auto w-full max-w-6xl space-y-8 px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
        <div className="rounded-editorial border border-brand-teal/15 bg-white p-6 shadow-card sm:p-8">
          <p className="font-display text-sm uppercase tracking-[0.22em] text-brand-coral">Weekend Guide</p>
          <h1 className="mt-2 font-display text-5xl uppercase tracking-[0.08em] text-brand-teal sm:text-6xl">{guide.introTitle}</h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-brand-teal/80 sm:text-lg">{guide.introBody}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            <span className="inline-flex rounded-full border border-brand-teal/20 bg-brand-sand px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-brand-teal">
              {guide.periodLabel}
            </span>
            <span className="inline-flex rounded-full border border-brand-teal/20 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-brand-teal">
              {totalEvents} events
            </span>
          </div>
        </div>

        <aside className="rounded-editorial border border-brand-teal/15 bg-brand-peach/45 p-6 text-center shadow-card sm:p-8">
          <p className="font-display text-4xl uppercase tracking-[0.12em] text-brand-coral">Weekend Guide</p>
          <p className="mt-1 font-display text-2xl uppercase tracking-[0.08em] text-brand-coral">{guide.periodLabel}</p>
          <div className="mt-7 grid grid-cols-4 gap-3 rounded-2xl border border-brand-coral/20 bg-white/60 p-3">
            {guide.weather.map((item) => (
              <div key={item.day} className="space-y-1 rounded-xl py-1">
                <p className="font-display text-2xl tracking-[0.08em] text-brand-teal sm:text-3xl">{dayShort[item.day]}</p>
                <p className="text-xl text-brand-coral sm:text-2xl">{weatherIcon(item.icon)}</p>
                <p className="font-display text-2xl tracking-[0.04em] text-brand-teal sm:text-3xl">{item.temperature}</p>
              </div>
            ))}
          </div>
        </aside>
      </section>

      <nav aria-label="Weekend dagen" className="sticky top-[74px] z-40 rounded-editorial border border-brand-teal/15 bg-white/95 p-3 shadow-card backdrop-blur">
        <div className="flex flex-wrap gap-2">
          {sections.map((section) => (
            <Link
              key={section.day}
              href={`#${section.day}`}
              className="rounded-full border border-brand-teal/20 bg-brand-sand px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-brand-teal transition hover:border-brand-coral hover:text-brand-coral"
            >
              {section.label}
            </Link>
          ))}
        </div>
      </nav>

      <div className="space-y-10">
        {sections.map((section) => (
          <section key={section.day} id={section.day} className="scroll-mt-32 space-y-5">
            <div className="rounded-editorial border border-brand-coral/20 bg-brand-peach/50 px-5 py-4 sm:px-7">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <h2 className="font-display text-4xl uppercase tracking-[0.1em] text-brand-coral sm:text-5xl">{dayTitles[section.day]}</h2>
                <span className="inline-flex rounded-full border border-brand-coral/35 bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-brand-coral">
                  {section.events.length} {section.events.length === 1 ? "event" : "events"}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              {section.events.map((event) => (
                <article key={event.id} className="rounded-editorial border border-brand-teal/15 bg-white p-5 shadow-card sm:p-6">
                  <div className="grid gap-4 sm:grid-cols-[auto_1fr] sm:gap-5">
                    <div className="flex min-w-[7.25rem] shrink-0 flex-row gap-2 sm:flex-col sm:gap-2">
                      <span className="inline-flex rounded-full border border-brand-coral/25 bg-brand-coral/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-brand-coral">
                        {event.timeLabel ?? "Hele dag"}
                      </span>
                      <span className="inline-flex rounded-full border border-brand-teal/20 bg-brand-sand px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-brand-teal">
                        {event.venue}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-display text-3xl uppercase tracking-[0.04em] text-brand-teal">{event.title}</h3>
                      <p className="mt-2 text-base leading-relaxed text-brand-teal/88">{event.description}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

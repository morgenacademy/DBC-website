import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

export function NewsletterCta(): React.JSX.Element {
  return (
    <section className="overflow-hidden rounded-[2rem] border border-brand-teal/20 bg-brand-teal px-6 py-10 text-brand-sand sm:px-10">
      <p className="font-display text-sm uppercase tracking-[0.26em] text-brand-aqua">Nieuwsbrief</p>
      <h2 className="mt-2 max-w-2xl text-3xl font-bold text-white sm:text-4xl">
        Elke woensdag een compacte selectie voor jouw weekend in Den Bosch.
      </h2>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-brand-sand/85">
        Geen spam. Wel actuele tips, seizoensmomenten en lokale favorieten die je direct kunt gebruiken.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="#nieuwsbrief" className="rounded-full bg-brand-coral px-5 py-2.5 text-sm font-semibold text-white">
          Schrijf me in
        </Link>
        <Link
          href={siteConfig.social.instagram}
          target="_blank"
          rel="noreferrer"
          className="rounded-full border border-brand-sand/30 px-5 py-2.5 text-sm font-semibold text-brand-sand"
        >
          Volg op Instagram
        </Link>
      </div>
    </section>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = buildMetadata({
  title: "Over",
  description: "Over Den Bosch City",
  path: "/over"
});

export default function OverPage(): React.JSX.Element {
  return (
    <div className="mx-auto w-full max-w-4xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
      <section className="space-y-4">
        <h1 className="text-4xl font-bold text-brand-teal">Over Den Bosch City</h1>
        <p className="text-base leading-relaxed text-brand-teal/80">
          Den Bosch is een waanzinnig mooie stad met stadswateren waar je doorheen vaart, de imposante Sint-Janskathedraal en natuurlijk Bossche
          bollen vers van de bakker. Maar daar stopt het niet.
        </p>
        <p className="text-base leading-relaxed text-brand-teal/80">
          Het stikt in de stad van romantische straatjes, leuke eettentjes en boetiekwinkels. Daarnaast is er in het seizoen elke week wel een tof
          event. Er is altijd wel wat te doen - voor Bosschenaren én voor toeristen. Geloof je ons niet? Kijk maar even mee!
        </p>
      </section>

      <section className="rounded-editorial border border-brand-teal/15 bg-white p-6 shadow-card sm:p-8">
        <h2 className="text-2xl font-bold text-brand-teal">Het team</h2>
        <p className="mt-3 text-base leading-relaxed text-brand-teal/80">
          Achter Den Bosch City staat een compact team van creatievelingen, schrijvers, fotografen en social media-makers. Samen bouwen we aan een
          platform voor en door Bosschenaren: warm, lokaal en altijd in beweging.
        </p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {siteConfig.team.map((member) => (
            <article key={member.name} className="rounded-2xl border border-brand-teal/12 bg-brand-sand/35 p-4">
              <h3 className="text-lg font-bold text-brand-teal">{member.name}</h3>
              <p className="text-sm font-semibold uppercase tracking-[0.1em] text-brand-coral">{member.role}</p>
              <p className="mt-2 text-sm leading-relaxed text-brand-teal/80">{member.bio}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-editorial border border-brand-teal/15 bg-brand-sand/40 p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-brand-teal">Samenwerken?</h2>
        <p className="mt-3 text-base leading-relaxed text-brand-teal/80">
          Heb je een leuk idee, wil je samenwerken of bijdragen als maker? Stuur ons gerust een berichtje.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/contact" className="rounded-full bg-brand-coral px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90">
            Neem contact op
          </Link>
          <a
            href={`mailto:${siteConfig.contact.email}`}
            className="rounded-full border border-brand-teal/25 bg-white px-5 py-2.5 text-sm font-semibold text-brand-teal hover:border-brand-coral hover:text-brand-coral"
          >
            {siteConfig.contact.email}
          </a>
        </div>
      </section>
    </div>
  );
}

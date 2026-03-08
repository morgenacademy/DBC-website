import Link from "next/link";
import { NewsletterSignupForm } from "@/components/forms/newsletter-signup-form";
import { siteConfig } from "@/lib/site-config";

const socialLinks = [
  { href: siteConfig.social.instagram, label: "Instagram", shortLabel: "IG" },
  { href: siteConfig.social.facebook, label: "Facebook", shortLabel: "F" },
  { href: siteConfig.social.pinterest, label: "Pinterest", shortLabel: "P" },
  { href: siteConfig.social.tiktok, label: "TikTok", shortLabel: "T" },
  { href: siteConfig.social.linkedin, label: "LinkedIn", shortLabel: "in" }
] as const;

export function SiteFooter(): React.JSX.Element {
  return (
    <footer className="border-t border-brand-teal/15 bg-brand-teal text-brand-sand">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1.35fr_1fr_1fr] lg:gap-10 lg:px-8">
        <div className="space-y-5">
          <p className="font-display text-2xl tracking-wide text-brand-peach">Den Bosch City</p>
          <p className="max-w-xl text-base leading-relaxed text-brand-sand/92">
            Den Bosch is een prachtige stad waar locals trots op zijn. Romantische straatjes, restaurants, winkels en events. Vind local tips
            hier, check wekelijks de weekendguide of shop de mooiste Bossche producten.
          </p>

          <div className="space-y-1 pt-1 text-sm text-brand-sand/82">
            <p>{siteConfig.contact.company}</p>
            <p>{siteConfig.contact.addressLine1}</p>
            <p>{siteConfig.contact.addressLine2}</p>
            <p>{siteConfig.contact.postalCity}</p>
            <a href={`mailto:${siteConfig.contact.email}`} className="inline-flex pt-1 text-lg font-semibold text-brand-aqua hover:text-white">
              {siteConfig.contact.email}
            </a>
          </div>
        </div>

        <div className="space-y-6">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-aqua">Snel Naar</p>
          <ul className="space-y-2.5 text-base">
            <li>
              <Link href="/discover" className="hover:text-white">
                Ontdek Den Bosch
              </Link>
            </li>
            <li>
              <Link href="/weekend-guide" className="hover:text-white">
                Weekend Guide
              </Link>
            </li>
            <li>
              <Link href="/shop" className="hover:text-white">
                Shop
              </Link>
            </li>
            <li>
              <Link href="/over" className="hover:text-white">
                Over Den Bosch City
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-white">
                Contact
              </Link>
            </li>
          </ul>

          <div id="nieuwsbrief" className="rounded-editorial border border-brand-sand/15 bg-white/5 p-4">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-brand-aqua">Inschrijven nieuwsbrief</p>
            <div className="mt-2">
              <NewsletterSignupForm />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-aqua">Stuur ons een berichtje</p>
          <p className="text-base leading-relaxed text-brand-sand/90">
            Heb je tips, een samenwerking of een vraag? Mail ons op{" "}
            <a className="font-semibold text-brand-aqua hover:text-white" href={`mailto:${siteConfig.contact.email}`}>
              {siteConfig.contact.email}
            </a>
            .
          </p>

          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-aqua">Love Us On Social</p>
          <div className="flex flex-wrap items-center gap-2.5">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                aria-label={social.label}
                title={social.label}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-brand-sand/45 bg-brand-sand/10 transition hover:border-brand-aqua hover:bg-brand-sand/20"
              >
                <span className="text-xs font-bold uppercase tracking-[0.08em] text-brand-sand">{social.shortLabel}</span>
                <span className="sr-only">{social.label}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

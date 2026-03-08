import Link from "next/link";
import { NewsletterSignupForm } from "@/components/forms/newsletter-signup-form";
import { siteConfig } from "@/lib/site-config";

export function SiteFooter(): React.JSX.Element {
  return (
    <footer className="border-t border-brand-teal/15 bg-brand-teal text-brand-sand">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.25fr_1fr_1fr] lg:px-8">
        <div className="space-y-4">
          <p className="font-display text-2xl tracking-wide text-brand-peach">Den Bosch City</p>
          <p className="max-w-xl text-sm leading-relaxed text-brand-sand/90">
            Den Bosch is een prachtige stad waar locals trots op zijn. Romantische straatjes, restaurants, winkels en events. Vind local tips
            hier, check wekelijks de weekendguide of shop de mooiste Bossche producten.
          </p>

          <div className="space-y-1 pt-2 text-sm text-brand-sand/85">
            <p>{siteConfig.contact.company}</p>
            <p>{siteConfig.contact.addressLine1}</p>
            <p>{siteConfig.contact.addressLine2}</p>
            <p>{siteConfig.contact.postalCity}</p>
            <a href={`mailto:${siteConfig.contact.email}`} className="inline-flex pt-1 font-semibold text-brand-aqua hover:text-white">
              {siteConfig.contact.email}
            </a>
          </div>
        </div>

        <div className="space-y-5">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-aqua">Snel Naar</p>
          <ul className="space-y-2 text-sm">
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

          <div className="space-y-2 pt-2">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-brand-aqua">Inschrijven nieuwsbrief</p>
            <NewsletterSignupForm />
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-aqua">Stuur ons een berichtje</p>
          <p className="text-sm text-brand-sand/90">
            Heb je tips, een samenwerking of een vraag? Mail ons op{" "}
            <a className="font-semibold text-brand-aqua hover:text-white" href={`mailto:${siteConfig.contact.email}`}>
              {siteConfig.contact.email}
            </a>
            .
          </p>

          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-aqua">Love Us On Social</p>
          <ul className="space-y-2 text-sm">
            <li>
              <a className="hover:text-white" href={siteConfig.social.instagram} target="_blank" rel="noreferrer">
                Instagram
              </a>
            </li>
            <li>
              <a className="hover:text-white" href={siteConfig.social.facebook} target="_blank" rel="noreferrer">
                Facebook
              </a>
            </li>
            <li>
              <a className="hover:text-white" href={siteConfig.social.pinterest} target="_blank" rel="noreferrer">
                Pinterest
              </a>
            </li>
            <li>
              <a className="hover:text-white" href={siteConfig.social.tiktok} target="_blank" rel="noreferrer">
                TikTok
              </a>
            </li>
            <li>
              <a className="hover:text-white" href={siteConfig.social.linkedin} target="_blank" rel="noreferrer">
                LinkedIn
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

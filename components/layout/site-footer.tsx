import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

export function SiteFooter(): React.JSX.Element {
  return (
    <footer className="border-t border-brand-teal/15 bg-brand-teal text-brand-sand">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-3 lg:px-8">
        <div>
          <p className="font-display text-2xl tracking-wide text-brand-peach">Den Bosch City</p>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-brand-sand/85">
            Simpel en sterk: Home, Weekend Guide, Ontdek en Shop. Instagram-first content met blijvende vindbaarheid.
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-aqua">Navigatie</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link href="/" className="hover:text-white">
                Home
              </Link>
            </li>
            <li>
              <Link href="/weekend-guide" className="hover:text-white">
                Weekend Guide
              </Link>
            </li>
            <li>
              <Link href="/discover" className="hover:text-white">
                Ontdek
              </Link>
            </li>
            <li>
              <Link href="/shop" className="hover:text-white">
                Shop
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-aqua">Meer</p>
          <div className="mt-3 flex flex-col gap-2 text-sm">
            <a className="hover:text-white" href={siteConfig.newsletterUrl} target="_blank" rel="noreferrer">
              Nieuwsbrief
            </a>
            <Link href="/over" className="hover:text-white">
              Over
            </Link>
            <Link href="/contact" className="hover:text-white">
              Contact
            </Link>
            <a className="hover:text-white" href={siteConfig.social.instagram} target="_blank" rel="noreferrer">
              Instagram
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

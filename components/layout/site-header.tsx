import Image from "next/image";
import Link from "next/link";
import { navigation } from "@/lib/config/navigation";

export function SiteHeader(): React.JSX.Element {
  return (
    <header className="sticky top-0 z-50 border-b border-brand-teal/15 bg-brand-sand/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-6 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="group inline-flex items-center gap-3" aria-label="Den Bosch City home">
          <Image src="/brand/logo-dbc.svg" alt="Den Bosch City" width={140} height={61} priority className="h-auto w-28 sm:w-32" />
          <span className="hidden text-xs font-semibold uppercase tracking-[0.28em] text-brand-teal/70 group-hover:text-brand-teal sm:block">
            City Platform
          </span>
        </Link>

        <nav aria-label="Hoofdnavigatie" className="hidden items-center gap-5 md:flex">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-semibold text-brand-teal transition hover:text-brand-coral"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/discover"
          className="hidden rounded-full bg-brand-coral px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 md:inline-flex"
        >
          Start Discover
        </Link>

        <details className="relative md:hidden">
          <summary className="cursor-pointer list-none rounded-full border border-brand-teal/30 px-4 py-2 text-sm font-semibold text-brand-teal">
            Menu
          </summary>
          <div className="absolute right-0 mt-2 w-60 rounded-2xl border border-brand-teal/20 bg-white p-3 shadow-card">
            <nav className="flex flex-col gap-1" aria-label="Mobiele navigatie">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-xl px-3 py-2 text-sm font-semibold text-brand-teal transition hover:bg-brand-sand"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </details>
      </div>
    </header>
  );
}

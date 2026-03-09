"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navigation } from "@/lib/config/navigation";

export function SiteHeader(): React.JSX.Element {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent): void {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-brand-teal/15 bg-brand-sand/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-6 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="inline-flex items-center gap-3" aria-label="Den Bosch City home">
          <Image src="/brand/logo-dbc.svg" alt="Den Bosch City" width={140} height={61} priority className="h-auto w-28 sm:w-32" />
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

        <div className="relative md:hidden">
          <button
            type="button"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((current) => !current)}
            className="rounded-full border border-white/50 bg-brand-teal px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-teal/90"
          >
            {menuOpen ? "Sluit" : "Menu"}
          </button>
          {menuOpen ? (
            <>
              <button
                type="button"
                className="fixed inset-0 top-[72px] z-40 bg-transparent"
                aria-label="Sluit menu"
                onClick={() => setMenuOpen(false)}
              />
              <div id="mobile-menu" className="glass-surface absolute right-0 z-50 mt-2 w-64 rounded-2xl p-3 shadow-card">
                <nav className="flex flex-col gap-1" aria-label="Mobiele navigatie">
                  {navigation.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMenuOpen(false)}
                      className="rounded-xl px-3 py-2 text-sm font-semibold text-brand-teal transition hover:bg-brand-sand"
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </header>
  );
}

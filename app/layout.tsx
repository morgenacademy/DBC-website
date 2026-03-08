import type { Metadata } from "next";
import localFont from "next/font/local";
import type { ReactNode } from "react";
import "@/app/globals.css";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { siteConfig } from "@/lib/site-config";

const workSans = localFont({
  src: "../Huisstijl/Fonts/Work_Sans/WorkSans-VariableFont_wght.ttf",
  display: "swap",
  variable: "--font-work-sans"
});

const unicaOne = localFont({
  src: "../Huisstijl/Fonts/Unica_One/UnicaOne-Regular.ttf",
  display: "swap",
  variable: "--font-unica-one"
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.domain),
  title: {
    default: "Den Bosch City",
    template: "%s | Den Bosch City"
  },
  description: siteConfig.description,
  openGraph: {
    type: "website",
    locale: "nl_NL",
    siteName: siteConfig.name
  }
};

export default function RootLayout({ children }: { children: ReactNode }): React.JSX.Element {
  return (
    <html lang="nl" className={`${workSans.variable} ${unicaOne.variable}`}>
      <body className="text-brand-teal antialiased">
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}

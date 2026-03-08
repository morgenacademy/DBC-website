import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = buildMetadata({
  title: "Contact",
  description: "Contact Den Bosch City",
  path: "/contact"
});

export default function ContactPage(): React.JSX.Element {
  return (
    <div className="mx-auto w-full max-w-3xl space-y-6 px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold text-brand-teal">Stuur ons een berichtje</h1>
      <p className="text-base leading-relaxed text-brand-teal/80">
        Voor samenwerkingen, tips, events of vragen kun je ons altijd mailen. We lezen mee en reageren zo snel mogelijk.
      </p>

      <a
        href={`mailto:${siteConfig.contact.email}`}
        className="inline-flex rounded-full bg-brand-coral px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90"
      >
        Mail naar {siteConfig.contact.email}
      </a>
    </div>
  );
}

import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Contact",
  description: "Contact Den Bosch City",
  path: "/contact"
});

export default function ContactPage(): React.JSX.Element {
  return (
    <div className="mx-auto w-full max-w-3xl space-y-4 px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold text-brand-teal">Contact</h1>
      <p className="text-base leading-relaxed text-brand-teal/80">
        Voor samenwerkingen, tips of vragen kun je ons bereiken via Instagram DM of via de nieuwsbriefkanalen van Den Bosch City.
      </p>
    </div>
  );
}

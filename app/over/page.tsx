import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Over",
  description: "Over Den Bosch City",
  path: "/over"
});

export default function OverPage(): React.JSX.Element {
  return (
    <div className="mx-auto w-full max-w-3xl space-y-4 px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold text-brand-teal">Over Den Bosch City</h1>
      <p className="text-base leading-relaxed text-brand-teal/80">
        Den Bosch City is een lokaal lifestyleplatform voor &apos;s-Hertogenbosch, met focus op weekendtips, ontdekking en lokale hotspots.
      </p>
    </div>
  );
}

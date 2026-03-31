import { notFound } from "next/navigation";
import { buildMetadata } from "@/lib/seo";
export const metadata = buildMetadata({
  title: "Collectie niet gevonden",
  description: "Collectie niet gevonden",
  path: "/ontdek",
  noIndex: true
});

export default function CollectionPage(): never {
  notFound();
}

import type { Collection } from "@/lib/types";

export const collections: Collection[] = [
  {
    id: "co1",
    slug: "nieuwsbrief-weekend-selectie",
    title: "Nieuwsbrief: Weekend Selectie",
    intro: "Compacte vrijdagselectie met 6 tips, 1 route en 1 shop pick.",
    contentIds: ["c5", "c2", "c3", "c1"],
    channel: "newsletter",
    heroImage:
      "https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=1400&q=80",
    ctaLabel: "Schrijf je in",
    ctaHref: "https://denboschcity.nl/nieuwsbrief"
  },
  {
    id: "co2",
    slug: "koningsdag-city-campaign",
    title: "Koningsdag City Campaign",
    intro: "Gecombineerde set voor social, site en mailing rondom Koningsdag.",
    contentIds: ["c4", "c7", "c5"],
    channel: "campaign",
    heroImage:
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1400&q=80",
    ctaLabel: "Bekijk moment",
    ctaHref: "/moment/koningsdag"
  },
  {
    id: "co3",
    slug: "summer-city-roundup",
    title: "Summer City Roundup",
    intro: "Rooftops, terrassen en shopping picks voor lange zomerweekenden.",
    contentIds: ["c10", "c2", "c8"],
    channel: "seasonal",
    heroImage:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=80",
    ctaLabel: "Naar summer moment",
    ctaHref: "/moment/summer-in-den-bosch"
  },
  {
    id: "co4",
    slug: "editorial-green-route",
    title: "Editorial Green Route",
    intro: "Een gecureerde city route rondom vegetarisch eten en rustige plekken.",
    contentIds: ["c1", "c6", "c9"],
    channel: "editorial",
    heroImage:
      "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1400&q=80",
    ctaLabel: "Open discover",
    ctaHref: "/discover?q=vegetarian"
  }
];

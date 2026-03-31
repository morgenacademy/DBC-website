export interface HomepageFeaturedItemConfig {
  id?: string;
  slug?: string;
  sourceId?: string;
}

export const homepageConfig = {
  hero: {
    title: "Den Bosch City",
    subtitle: "Beleef onze stad Den Bosch door de ogen van locals.",
    ctaPrimary: { label: "Naar Weekend Guide", href: "/weekend-guide" },
    ctaSecondary: { label: "Ontdek Den Bosch", href: "/ontdek" }
  },
  sections: {
    featuredLabel: "Den Bosch City",
    discoverLabel: "Ontdek",
    highlightedLabel: "Uitgelicht",
    shopLabel: "Shop"
  },
  featuredItem: undefined as HomepageFeaturedItemConfig | undefined
} as const;

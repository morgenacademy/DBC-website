export interface DiscoverFeaturedItemConfig {
  id?: string;
  slug?: string;
  sourceId?: string;
}

export const discoverConfig: {
  sections: {
    featuredTitle: string;
    featuredDescription: string;
  };
  featuredItems: DiscoverFeaturedItemConfig[];
} = {
  sections: {
    featuredTitle: "Uitgelicht",
    featuredDescription: "Drie tips die je nu niet wilt missen."
  },
  // Pas deze lijst aan om de handmatige redactionele rij op /discover te sturen.
  featuredItems: [
    { sourceId: "18575079427027043" },
    { sourceId: "18097751344797471" },
    { sourceId: "17881594929501490" }
  ]
};

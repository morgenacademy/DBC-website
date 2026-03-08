import type { Theme } from "@/lib/types";

export const themes: Theme[] = [
  {
    id: "t1",
    slug: "vegetarian",
    title: "Vegetarisch",
    kind: "theme",
    intro: "Plantaardige hotspots, brunch-adressen en comfort food zonder compromis.",
    heroImage:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1400&q=80",
    accentColor: "#83B3B6",
    featuredContentIds: ["c1", "c3"]
  },
  {
    id: "t2",
    slug: "terraces",
    title: "Terrassen",
    kind: "theme",
    intro: "De beste terrassen voor lunch, borrel en avondzon in de stad.",
    heroImage:
      "https://images.unsplash.com/photo-1564758568476-4f4f3fd9f9f4?auto=format&fit=crop&w=1400&q=80",
    accentColor: "#F2B484",
    featuredContentIds: ["c2", "c10"]
  },
  {
    id: "t3",
    slug: "shopping",
    title: "Winkelen",
    kind: "theme",
    intro: "Lokale boetieks, concept stores en stadsroutes voor style en gifts.",
    heroImage:
      "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=1400&q=80",
    accentColor: "#EA582D",
    featuredContentIds: ["c8"]
  },
  {
    id: "t4",
    slug: "culture",
    title: "Cultuur",
    kind: "theme",
    intro: "Musea, makers, exposities en lokale verhalen met karakter.",
    heroImage:
      "https://images.unsplash.com/photo-1518998053901-5348d3961a04?auto=format&fit=crop&w=1400&q=80",
    accentColor: "#005A5B",
    featuredContentIds: ["c6", "c9"]
  },
  {
    id: "m1",
    slug: "koningsdag",
    title: "Koningsdag",
    kind: "moment",
    intro: "Oranje routes, hotspots en slimme timing voor de beste dag in de stad.",
    heroImage:
      "https://images.unsplash.com/photo-1468818438311-4bab781ab9b8?auto=format&fit=crop&w=1400&q=80",
    accentColor: "#EA582D",
    featuredContentIds: ["c4"]
  },
  {
    id: "m2",
    slug: "carnival",
    title: "Carnaval",
    kind: "moment",
    intro: "Oeteldonk special met route, muziekspots en praktische tips.",
    heroImage:
      "https://images.unsplash.com/photo-1508973378895-8dd39a4f0d71?auto=format&fit=crop&w=1400&q=80",
    accentColor: "#F2B484",
    featuredContentIds: ["c7"]
  },
  {
    id: "m3",
    slug: "weekend-in-den-bosch",
    title: "Weekend in Den Bosch",
    kind: "moment",
    intro: "Elke week een compacte route voor eten, cultuur en city life.",
    heroImage:
      "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1400&q=80",
    accentColor: "#83B3B6",
    featuredContentIds: ["c5", "c3", "c2"]
  },
  {
    id: "m4",
    slug: "summer-in-den-bosch",
    title: "Zomer in Den Bosch",
    kind: "moment",
    intro: "Lange avonden, terrassen en rooftops op z'n Bosschs.",
    heroImage:
      "https://images.unsplash.com/photo-1465379944081-7f47de8d74ac?auto=format&fit=crop&w=1400&q=80",
    accentColor: "#EBDEC6",
    featuredContentIds: ["c2", "c10"]
  },
  {
    id: "m5",
    slug: "christmas",
    title: "Kerst",
    kind: "moment",
    intro: "Winterse hotspots, cadeau-routes en knusse plekken in de binnenstad.",
    heroImage:
      "https://images.unsplash.com/photo-1482517967863-00e15c9b44be?auto=format&fit=crop&w=1400&q=80",
    accentColor: "#005A5B",
    featuredContentIds: ["c8", "c9"]
  }
];

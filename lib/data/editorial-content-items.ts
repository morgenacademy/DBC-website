import { finalizeContentItem } from "@/lib/content-item-factory";
import type { ContentItem, ContentItemDraft } from "@/lib/types";

const editorialContentDrafts: ContentItemDraft[] = [
  {
    id: "c5",
    slug: "what-to-do-this-weekend-den-bosch",
    title: "Wat te doen dit weekend in Den Bosch",
    excerpt: "Onze snelle selectie voor vrijdagavond tot zondagmiddag.",
    caption: "Weekend in Den Bosch? Hier is je shortlist: food, cultuur, kids en nacht. #weekend #denboschcity",
    body: [
      "Geen tijd voor eindeloos scrollen: dit is de compacte weekendroute.",
      "Mix van nieuwe tips, terugkerende favorieten en actuele events.",
      "Gebruik deze pagina als startpunt en spring door naar thema's."
    ],
    sourcePlatform: "editorial",
    mediaType: "image",
    image: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1200&q=80",
    publishedAt: "2026-03-06T07:00:00.000Z",
    contentLayer: "fast",
    categories: ["events", "culture", "food", "kids"],
    themes: ["weekend", "city-picks"],
    moments: ["weekend-in-den-bosch"],
    tags: ["weekend", "tips", "agenda"],
    hashtags: ["weekend", "denboschcity"],
    manualTags: ["redactie", "weekoverzicht"],
    isFeatured: true,
    featured: true,
    featuredRank: 4,
    editorialLabel: "Weekend Edit",
    heroVariant: "split",
    collectionIds: ["co1"],
    relatedIds: ["c2", "c6", "c8", "c9"]
  },
  {
    id: "c9",
    slug: "hidden-gems-den-bosch",
    title: "Hidden gems in Den Bosch",
    excerpt: "Minder bekende plekken voor wie de stad al denkt te kennen.",
    caption: "Den Bosch beyond the obvious: van stille hofjes tot verrassende adressen. #hiddengems #denbosch",
    body: [
      "Deze gids is gemaakt voor bewoners en terugkerende bezoekers.",
      "We focussen op plekken met karakter en een lokaal verhaal.",
      "Tip: combineer met een themawandeling voor een complete dag."
    ],
    sourcePlatform: "editorial",
    mediaType: "image",
    image: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=1200&q=80",
    publishedAt: "2025-12-18T08:00:00.000Z",
    contentLayer: "evergreen",
    categories: ["culture", "local-tips"],
    themes: ["culture", "hotspots"],
    moments: ["winter-in-den-bosch", "weekend-in-den-bosch"],
    tags: ["hidden gems", "wandelen", "stad"],
    hashtags: ["hiddengems", "denbosch"],
    manualTags: ["evergreen", "stadsgids"],
    isFeatured: false,
    featured: false,
    editorialLabel: "Long Read",
    heroVariant: "split",
    collectionIds: ["co4"],
    relatedIds: ["c5", "c6", "c7"]
  }
];

export const editorialContentItems: ContentItem[] = editorialContentDrafts.map((draft) => finalizeContentItem(draft));

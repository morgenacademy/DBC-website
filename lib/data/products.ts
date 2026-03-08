import type { Product } from "@/lib/types";

export const products: Product[] = [
  {
    id: "p1",
    slug: "dbc-city-map-poster",
    title: "Den Bosch City Map Poster",
    shortDescription: "Gelimiteerde art print met favoriete stadsroutes.",
    priceDisplay: "EUR 24,95",
    image:
      "https://images.unsplash.com/photo-1511988617509-a57c8a288659?auto=format&fit=crop&w=1000&q=80",
    category: "Home & Print",
    partnerName: "Studio Bosch",
    partnerUrl: "https://partner.example.com/studio-bosch/map-poster",
    badge: "Limited",
    isFeatured: true
  },
  {
    id: "p2",
    slug: "weekend-guide-tote-bag",
    title: "Weekend Guide Tote Bag",
    shortDescription: "Stevige canvas tas voor je city-day essentials.",
    priceDisplay: "EUR 19,95",
    image:
      "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=1000&q=80",
    category: "Fashion",
    partnerName: "Den Bosch Concept Store",
    partnerUrl: "https://partner.example.com/concept-store/weekend-tote",
    badge: "Best Seller",
    isFeatured: true
  },
  {
    id: "p3",
    slug: "oeteldonk-capsule-pin-set",
    title: "Oeteldonk Capsule Pin Set",
    shortDescription: "Seizoensset met 3 pins, ontworpen voor carnaval season.",
    priceDisplay: "EUR 14,95",
    image:
      "https://images.unsplash.com/photo-1564866657315-68f0d0eb0f8f?auto=format&fit=crop&w=1000&q=80",
    category: "Seizoenscollectie",
    partnerName: "Oeteldonk Atelier",
    partnerUrl: "https://partner.example.com/oeteldonk/pin-set",
    badge: "Seasonal",
    isFeatured: false
  },
  {
    id: "p4",
    slug: "den-bosch-city-notebook",
    title: "Den Bosch City Notebook",
    shortDescription: "A5 notebook voor routes, hotspots en weekendplannen.",
    priceDisplay: "EUR 12,95",
    image:
      "https://images.unsplash.com/photo-1531346680769-a1d79b57de5c?auto=format&fit=crop&w=1000&q=80",
    category: "Stationery",
    partnerName: "Papierwaren Noord",
    partnerUrl: "https://partner.example.com/papierwaren/notebook",
    isFeatured: false
  },
  {
    id: "p5",
    slug: "local-hotspots-gift-card",
    title: "Local Hotspots Gift Card",
    shortDescription: "Digitale cadeaubon voor lokale ervaringen en city specials.",
    priceDisplay: "Vanaf EUR 50,00",
    image:
      "https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&w=1000&q=80",
    category: "Ervaringen",
    partnerName: "Bossche Hotspots",
    partnerUrl: "https://partner.example.com/hotspots/gift-card",
    badge: "Partner Pick",
    isFeatured: true
  }
];

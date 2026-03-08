import type { Product } from "@/lib/types";

export const products: Product[] = [
  {
    id: "p1",
    slug: "dbc-city-map-poster",
    title: "Den Bosch City Map Poster",
    price: 24.95,
    currency: "EUR",
    image:
      "https://images.unsplash.com/photo-1511988617509-a57c8a288659?auto=format&fit=crop&w=1000&q=80",
    summary: "Gelimiteerde art print met favoriete stadsroutes.",
    featured: true,
    dropLabel: "Limited Drop"
  },
  {
    id: "p2",
    slug: "weekend-guide-tote-bag",
    title: "Weekend Guide Tote Bag",
    price: 19.95,
    currency: "EUR",
    image:
      "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=1000&q=80",
    summary: "Stevige canvas tas voor je city-day essentials.",
    featured: true,
    dropLabel: "Best Seller"
  },
  {
    id: "p3",
    slug: "oeteldonk-capsule-pin-set",
    title: "Oeteldonk Capsule Pin Set",
    price: 14.95,
    currency: "EUR",
    image:
      "https://images.unsplash.com/photo-1564866657315-68f0d0eb0f8f?auto=format&fit=crop&w=1000&q=80",
    summary: "Seizoensset met 3 pins, ontworpen voor carnival season.",
    featured: false,
    dropLabel: "Seasonal"
  },
  {
    id: "p4",
    slug: "den-bosch-city-notebook",
    title: "Den Bosch City Notebook",
    price: 12.95,
    currency: "EUR",
    image:
      "https://images.unsplash.com/photo-1531346680769-a1d79b57de5c?auto=format&fit=crop&w=1000&q=80",
    summary: "A5 notebook voor routes, hotspots en weekendplannen.",
    featured: false
  },
  {
    id: "p5",
    slug: "local-hotspots-gift-card",
    title: "Local Hotspots Gift Card",
    price: 50,
    currency: "EUR",
    image:
      "https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&w=1000&q=80",
    summary: "Digitale kaart voor lokale ervaringen en city specials.",
    featured: true,
    externalUrl: "https://shop.denboschcity.nl"
  }
];

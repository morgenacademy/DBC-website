import type { WeekendCategory } from "@/lib/types";

interface TaxonomyRule<T extends string> {
  value: T;
  keywords: string[];
}

interface InstagramTaxonomyEnrichment {
  categories: WeekendCategory[];
  themes: string[];
  moments: string[];
}

const CATEGORY_RULES: Array<TaxonomyRule<WeekendCategory>> = [
  {
    value: "food",
    keywords: [
      "brunch",
      "ontbijt",
      "breakfast",
      "lunch",
      "diner",
      "dinner",
      "restaurant",
      "restaurants",
      "eten",
      "eet",
      "drinken",
      "koffie",
      "coffee",
      "cafe",
      "barista",
      "menu",
      "proeven",
      "cocktailbar",
      "borrelplank"
    ]
  },
  {
    value: "events",
    keywords: [
      "event",
      "events",
      "festival",
      "festivals",
      "vrijmarkt",
      "markt",
      "agenda",
      "line-up",
      "concert",
      "concerten",
      "show",
      "party",
      "parade",
      "koningsdag",
      "carnaval",
      "oeteldonk"
    ]
  },
  {
    value: "culture",
    keywords: [
      "museum",
      "musea",
      "expo",
      "expositie",
      "kunst",
      "galerie",
      "theater",
      "film",
      "bios",
      "muziek",
      "muzikale",
      "maker",
      "makers"
    ]
  },
  {
    value: "kids",
    keywords: [
      "kids",
      "kid",
      "kind",
      "kinder",
      "kinderen",
      "kindvriend",
      "gezin",
      "gezinnen",
      "family",
      "familie"
    ]
  },
  {
    value: "shopping",
    keywords: [
      "shop",
      "shopping",
      "winkelen",
      "winkel",
      "winkels",
      "boetiek",
      "boutique",
      "conceptstore",
      "concept store",
      "cadeau",
      "cadeaus",
      "outfit",
      "hoodie",
      "fashion",
      "mode",
      "collectie"
    ]
  },
  {
    value: "nightlife",
    keywords: [
      "nightlife",
      "uitgaan",
      "cocktails",
      "cocktail",
      "dj",
      "dj-set",
      "late night",
      "club",
      "wijnbar",
      "dansvloer"
    ]
  }
];

const THEME_RULES: Array<TaxonomyRule<string>> = [
  {
    value: "vegetarian",
    keywords: ["vegetarisch", "vega", "vegan", "veganistisch", "plantaardig", "plant-based"]
  },
  {
    value: "terraces",
    keywords: ["terras", "terrassen", "terrace", "rooftop", "dakterras", "zonnetje", "avondzon", "buitenzitten"]
  },
  {
    value: "shopping",
    keywords: ["shop", "shopping", "winkelen", "winkel", "winkels", "boetiek", "boutique", "conceptstore", "hoodie", "fashion", "mode"]
  },
  {
    value: "culture",
    keywords: ["museum", "musea", "expo", "expositie", "kunst", "galerie", "theater", "film", "muziek", "makers"]
  }
];

const MOMENT_RULES: Array<TaxonomyRule<string>> = [
  {
    value: "koningsdag",
    keywords: ["koningsdag", "kingsday", "oranjenacht", "vrijmarkt", "oranje"]
  },
  {
    value: "carnival",
    keywords: ["carnaval", "oeteldonk", "oetel", "kiel", "kielen"]
  },
  {
    value: "weekend-in-den-bosch",
    keywords: ["weekend", "weekendje", "weekendtips", "vrijdag", "zaterdag", "zondag"]
  },
  {
    value: "summer-in-den-bosch",
    keywords: ["zomer", "summer", "zomers", "hitte", "heatwave", "zonnig", "summerproof"]
  },
  {
    value: "christmas",
    keywords: ["kerst", "christmas", "kerstmarkt", "winter", "december", "gluhwein"]
  }
];

function normalizeForMatch(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[#@]/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function buildSearchText(caption: string, hashtags: string[]): string {
  return normalizeForMatch(`${caption} ${hashtags.join(" ")}`);
}

function matchesRule(searchText: string, keywords: string[]): boolean {
  return keywords.some((keyword) => searchText.includes(normalizeForMatch(keyword)));
}

function matchMany<T extends string>(rules: Array<TaxonomyRule<T>>, searchText: string): T[] {
  return rules.filter((rule) => matchesRule(searchText, rule.keywords)).map((rule) => rule.value);
}

function matchFirstCategory(searchText: string): WeekendCategory[] {
  const match = CATEGORY_RULES.find((rule) => matchesRule(searchText, rule.keywords));
  return [match?.value ?? "local-tips"];
}

export function enrichInstagramTaxonomy(caption: string, hashtags: string[]): InstagramTaxonomyEnrichment {
  const searchText = buildSearchText(caption, hashtags);

  return {
    categories: matchFirstCategory(searchText),
    themes: matchMany(THEME_RULES, searchText),
    moments: matchMany(MOMENT_RULES, searchText)
  };
}

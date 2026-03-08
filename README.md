<<<<<<< HEAD
# DBC-website
=======
# Den Bosch City V1

Instagram-first, editorial city platform for Den Bosch with an owned discovery layer.

## Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- In-memory repository layer (mock data, CMS-ready interfaces)

## V1 Routes

- `/`
- `/weekend-guide`
- `/discover`
- `/discover/[slug]`
- `/theme/[slug]`
- `/moment/[slug]`
- `/collection/[slug]`
- `/shop`

## Brand System

Source: `/Huisstijl` assets.

Implemented tokens:

- `--color-coral: #EA582D`
- `--color-peach: #F2B484`
- `--color-sand: #EBDEC6`
- `--color-aqua: #83B3B6`
- `--color-teal: #005A5B`

Typography:

- Display: Unica One (local)
- Body/UI: Work Sans (local)

Note: Codec files in `/Huisstijl/Fonts/codec` are trial/non-commercial and not used.

## Content Architecture

Entity types:

- `ContentItem`
- `WeekendItem`
- `Theme`
- `Collection`
- `Product`

Editorial curation fields on `ContentItem`:

- `isFeatured`
- `featuredRank`
- `editorialLabel`
- `heroVariant`
- `collectionIds`

Taxonomy is explicit (not blob-based):

- `categories`
- `themes`
- `moments`
- `tags`
- `hashtags`

## Repository Interfaces

- `ContentRepository`
  - `listContent(filters)`
  - `getContentBySlug(slug)`
  - `searchContent(query, filters)`
  - `getRelatedContent(item, limit)`
- `ThemeRepository`
  - `listThemes(kind?)`
  - `getThemeBySlug(slug)`
- `CollectionRepository`
  - `listCollections(channel?)`
  - `getCollectionBySlug(slug)`
- `WeekendRepository`
  - `listWeekendItems(dateRange?, category?)`
- `CommerceProvider`
  - `listProducts(featuredOnly?)`
  - `getProductBySlug(slug)`

All interfaces are UI-safe boundaries so data can later move to CMS/API ingestion without rewriting pages.

## Search Readiness

`lib/search-index.ts` provides normalized index shaping per content item from:

- title
- caption
- excerpt
- hashtags
- tags
- themes
- categories
- moments

Discover uses URL-driven filters (`q`, `theme`, `moment`, `category`, `type`) for scalable search evolution.

## Home vs Discover UX

- Home: curated, hierarchical, editorial storytelling.
- Discover: broad, searchable, filter-driven exploration.

## Configuration-First Setup

Centralized config/data files:

- `lib/site-config.ts`
- `lib/config/navigation.ts`
- `lib/config/homepage.ts`
- `lib/data/*.ts`

## Local Development

```bash
npm install
npm run dev
```

## Testing

Unit + component tests:

```bash
npm test
```

E2E smoke tests:

```bash
npm run test:e2e
```

## Next Integrations

- Replace in-memory repositories with CMS adapters (Sanity/Supabase/Airtable).
- Add real Instagram ingestion job feeding `normalizeInstagramRecord`.
- Replace `InMemoryCommerceProvider` with Shopify adapter.
- Extend search provider to Algolia or Postgres full-text search.
>>>>>>> abb82b2 (Initial Den Bosch City V1)

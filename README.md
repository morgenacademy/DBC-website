# Den Bosch City V1

V1 van Den Bosch City met een vereenvoudigde front-end ervaring en een sterke onderliggende contentarchitectuur.

## Kern van de UX

Topnavigatie:

- Home
- Weekend Guide
- Ontdek
- Shop

Doel per pagina:

- **Home**: curated en overzichtelijk, routeert naar de 3 kernervaringen.
- **Weekend Guide**: fase 1-rebuild van de bestaande publicatie-opzet (Hele weekend + dagblokken), maar data-driven.
- **Ontdek**: centrale instagrid + zoekbare contenthub voor social-first content.
- **Shop**: gecureerde partnerproducten met externe doorklik (geen checkout op Den Bosch City).

Themes en moments bestaan nog als landingspagina's, maar zijn gedemoteerd uit de primaire navigatie.
Collections blijven intern/editorial in de contentlaag.

## Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Repository-based data layer (mock data, CMS-ready)

## Routes

Publiek primair:

- `/`
- `/weekend-guide`
- `/discover` (label: Ontdek)
- `/discover/[slug]`
- `/shop`

Secundair/support:

- `/theme/[slug]`
- `/moment/[slug]`
- `/collection/[slug]`
- `/over`
- `/contact`

## Contentmodel (behouden)

- `ContentItem`
- `WeekendItem`
- `WeekendGuideEdition`
- `WeekendGuideEvent`
- `Theme`
- `Collection`
- `Product` (curated partner-item)

Belangrijke editorial velden op `ContentItem`:

- `isFeatured`
- `featuredRank`
- `editorialLabel`
- `heroVariant`
- `collectionIds`

Expliciete taxonomie:

- `categories`
- `themes`
- `moments`
- `tags`
- `hashtags`

Instagram-ready velden op `ContentItem`:

- `sourceId`
- `sourcePlatform`
- `sourcePermalink`
- `caption`
- `publishedAt`
- `mediaType`
- `thumbnail`
- `mediaUrls`
- `slug`
- `searchableText`
- `manualTags` (optioneel)
- `featured` / `isFeatured`

## Shop model (partner/affiliate)

Shopitems zijn geen native e-commerce producten met mandje of checkout. Het model ondersteunt:

- `title`
- `slug`
- `shortDescription`
- `priceDisplay` (optioneel)
- `image`
- `imageUrls` (volledige galerij)
- `category`
- `color` (optioneel)
- `partnerName`
- `partnerUrl`
- `badge` (optioneel)
- `isFeatured`
- `notes` (optioneel)

Bron van waarheid:

- `shop-products.csv` in de repo-root.
- `lib/data/products.ts` leest dit CSV-bestand in bij build/runtime.
- `lib/adapters/shop-csv.ts` normaliseert records.
- `image_urls` gebruikt ` | ` als scheiding; eerste URL wordt listing-afbeelding, hele lijst blijft beschikbaar in `imageUrls`.
- Lege `price_display` wordt als `undefined` opgeslagen en niet gerenderd in de card.

WordPress import-shape en normalisatie staan in:

- `lib/adapters/wordpress-shop.ts`

## Repositories

UI is losgekoppeld van data via interfaces en in-memory implementaties:

- `ContentRepository`
- `ThemeRepository`
- `CollectionRepository`
- `WeekendRepository`
- `CommerceProvider`

Hierdoor kan de data later naar CMS of ingestiepipeline zonder UI-rewrite.

## Instagram-first contentlaag

Stage 1 (nu geïmplementeerd):

- mock upstream records: `lib/data/instagram-raw-posts.ts`
- normalisatie: `normalizeInstagramPost(raw, override)` in `lib/adapters/instagram.ts`
- redactionele verrijking per post: `lib/data/instagram-post-overrides.ts`
- mock ingestiepad: `lib/ingestion/instagram-mock-ingestion.ts`
- samengestelde contentfeed: `lib/data/content-items.ts` (Instagram ingestie + editorials)

Dit simuleert de beoogde workflow:

1. publiceren op Instagram (upstream)
2. normaliseren naar eigen `ContentItem`
3. verrijken met interne taxonomie/editorial velden
4. tonen op `/discover` en `/discover/[slug]`
5. doorzoekbaar maken via `searchableText`

Stage 2 (voorbereid, nog niet live gekoppeld):

- `SupabaseContentRow` mappings in `lib/adapters/instagram.ts`:
  - `mapSupabaseContentRowToContentItem`
  - `mapContentItemToSupabaseRow`
- datasource boundary in `lib/repositories/content-data-source.ts`:
  - `InMemoryContentDataSource`
  - `SupabaseContentDataSource` (stub met fallback)
  - `SupabaseRecordContentDataSource`
- env-based datasource switch in `lib/repositories/content-data-source-factory.ts`

Hiermee kan de frontend ongewijzigd blijven terwijl de bron later naar Supabase + synclaag gaat.

### Datasource switch (mock vs supabase)

Datasource wordt gestuurd via:

- `CONTENT_DATA_SOURCE` (`mock` of `supabase`)

Default/fallback:

- als `CONTENT_DATA_SOURCE` ontbreekt of ongeldig is, draait de app op `mock`.
- als `CONTENT_DATA_SOURCE=supabase` maar Supabase-config ontbreekt, valt de app veilig terug op `mock`.

Voorbereide env vars:

- `SUPABASE_URL` (of `NEXT_PUBLIC_SUPABASE_URL`)
- `SUPABASE_ANON_KEY` (of `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
- `SUPABASE_CONTENT_ROWS_JSON` (optioneel, voor de huidige stub)

### Verwachte Supabase-pad later

Beoogde stroom (zonder frontend rewrite):

1. Instagram API -> Supabase Edge Function (normalisatie/upsert)
2. opslag in bijvoorbeeld `public.content_items` met `SupabaseContentRow`-shape
3. `SupabaseContentDataSource` leest live records (in plaats van `SUPABASE_CONTENT_ROWS_JSON`)
4. repository/UI blijven ongewijzigd

## Ontdek en zoekbaarheid

`/discover` is de hoofdlaag voor:

- latest social-first content
- zoekfunctie
- simpele filters
- thema/moment-doorverwijzingen
- archief/terugvindbaarheid

Zoekindex-shaping gebeurt in `lib/search-index.ts` op basis van title/caption/excerpt/tags/hashtags/themes/categories/moments.

## Weekend Guide fase 1

Voor de Weekend Guide is eerst bewust gekozen voor een **getrouwe rebuild** van de bestaande werkwijze, vóór verdere vernieuwing.

Wat is vertaald uit de oude GPT/HTML-flow:

- dagindeling blijft identiek: `Hele weekend`, `Donderdag`, `Vrijdag`, `Zaterdag`, `Zondag` (optioneel `Maandag` als er items zijn).
- events zijn geen losse HTML-blokken meer, maar gestructureerde records met:
  - `title`
  - `description`
  - `venue`
  - `timeLabel` (optioneel)
  - `day`
- broncontent is gebaseerd op de aangeleverde Word/PDF-output en opgeslagen in:
  - `lib/data/weekend-guide-edition.ts`
- repository-methodes voor rendering:
  - `getCurrentGuide()`
  - `listGuideSections()`

Resultaat:

- geen handmatige HTML-plakflow meer nodig;
- wel dezelfde herkenbare redactionele structuur voor bezoekers;
- klaar voor latere ingestie (bijv. Word-parser/CMS-sync) zonder UI-herschrijving.

## Brand

Bronbestanden staan in `Huisstijl/`.

Gebruikte fonts/tokens:

- Display: Unica One
- Body: Work Sans
- Kleuren: `#EA582D`, `#F2B484`, `#EBDEC6`, `#83B3B6`, `#005A5B`

Codec fonts zijn trial/non-commercial en worden niet gebruikt.

## Development

```bash
npm install
npm run dev
```

### Mailchimp nieuwsbriefkoppeling

Footer-inschrijving (`naam + e-mail`) loopt via `POST /api/newsletter-subscribe` naar Mailchimp.

Vereiste env vars:

- `MAILCHIMP_API_KEY`
- `MAILCHIMP_AUDIENCE_ID`
- `MAILCHIMP_SERVER_PREFIX` (optioneel, ondersteunt zowel `usX` als volledige host/URL; wordt automatisch genormaliseerd)

## Checks

```bash
npm run lint
npm test
npm run test:e2e
npm run build
```

## Volgende stap

Koppel de repositories aan:

1. Supabase Edge Function voor Instagram-sync (API -> normalize -> upsert)
2. Supabase Cron/job voor periodieke sync
3. `SupabaseContentDataSource` vervangen van stub/fallback naar live Supabase query
4. WordPress-shop importadapter en partnerfeed koppeling

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
- `MAILCHIMP_SERVER_PREFIX` (optioneel als je API-key suffix al `-usX` bevat)

## Checks

```bash
npm run lint
npm test
npm run test:e2e
npm run build
```

## Volgende stap

Koppel de repositories aan:

1. Instagram ingestie/sync
2. CMS (Sanity/Supabase/Airtable)
3. WordPress-shop importadapter en partnerfeed koppeling

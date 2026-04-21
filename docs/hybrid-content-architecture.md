# Den Bosch City pre-live content model

This is the lightweight pre-live model. It keeps the migration inventory URL-first and avoids building a full CMS before the site goes live.

## Three content forms

### 1. Instafirst updates

- Source: Meta/Instagram integration.
- Stored as `content_type = 'instafirst_update'`.
- Used for fast updates, short discoveries, visual tips, and social-first content.
- This flow already exists through the Instagram ingestion pipeline.

### 2. Guides

- Source: selected old-site pages or new website-native guide pages.
- Stored as `content_type = 'guide'`.
- Covers Weekendguide, Maandguide, and later Stadswijzer-style guide pages.
- Danielle only needs to mark these as `Guide` in the migration sheet.

### 3. Eigen post

- Source: website-native editorial post.
- Stored as `content_type = 'eigen_post'`.
- May be based on a press release, but the site treats it as an owned Den Bosch City post.
- Examples: Koningsdag, Vinyl Ville.
- Danielle only needs to mark these as `Eigen post` in the migration sheet.

## Migration inventory

For now, the only required migration input is:

- `URL`

Danielle only needs to collect old-site URLs that may be worth carrying forward.

After the URL inventory exists, we decide per URL whether it becomes:

- `Guide`
- `Eigen post`

Instagram-derived content does not need to be selected in this sheet, because it comes through the Meta integration as Instafirst updates.

Do not ask Danielle to classify every URL during collection. Classification is a follow-up editorial/product pass, not a required migration-sheet field.

## Data model

Keep `content_items` as the main publishable table. Phase 1 only adds:

- `content_type`
- `first_published_at`
- `last_material_update_at`
- `relevance_start_at`
- `relevance_end_at`
- `evergreen_score`
- `freshness_rank`
- `status`

Do not add spots, placements, or a CMS in this phase.

## Lightweight editor v1

New website-native content is created through a small internal editor, not a full CMS.

The editor only supports:

- `guide`
- `eigen_post`

Instafirst updates remain handled by the Meta integration.

Editor v1 supports:

- title
- slug
- excerpt
- body text
- hero image URL or upload
- extra media URLs
- optional Google Maps URL
- optional relevance start/end
- draft/published status

The Google Maps URL is stored on the existing `seo` JSON object as `googleMapsUrl` and can be rendered by the frontend as a CTA button. There is no maps API integration yet.

## Why this is enough now

This gives the site a clean distinction between:

- Instagram-driven updates
- Guides
- Eigen posts

It also gives us relevance/resurfacing fields so useful old content can become relevant again without pretending it was newly published.

The next practical step is:

1. Danielle collects the URLs.
2. We review the URL inventory.
3. We decide per URL whether it becomes `Guide` or `Eigen post`.
4. Only then do we add migrated records or any additional handling needed for those selected URLs.

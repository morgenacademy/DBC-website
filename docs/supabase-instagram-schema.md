# Supabase Schema Proposal: Instagram-First Content Layer

Dit document beschrijft het voorgestelde Supabase datamodel voor de Instagram-first architectuur, zonder live migraties uit te voeren.

Doel:

- Instagram als upstream bron
- Supabase als owned source of truth
- frontend/repository ongewijzigd laten bij datasource-switch
- 1-op-1 aansluiting op `ContentItem` en `SupabaseContentRow` in de codebase

## 1) Kernkeuze

Voor fase 1 van live-Supabase houden we `content_items` bewust dicht bij het huidige TypeScript-model:

- arrays blijven arrays (`themes`, `moments`, `tags`, `hashtags`, `collection_ids`, `related_ids`)
- `seo` blijft `jsonb`
- `searchable_text` blijft een platte tekstkolom

Dit voorkomt rewrite van de repository/UI-laag.

## 2) Hoofdtabel: `public.content_items`

```sql
-- Optioneel later voor betere zoekindexering
create extension if not exists pg_trgm;

create table if not exists public.content_items (
  id text primary key,
  slug text not null unique,
  title text not null,
  excerpt text not null,
  caption text not null,
  body text[] not null default '{}',

  source_platform text not null check (source_platform in ('instagram', 'editorial')),
  source_permalink text null,
  source_id text null,

  media_type text not null check (media_type in ('image', 'carousel', 'reel')),
  image text not null,
  thumbnail text not null,
  media_urls text[] not null default '{}',

  published_at timestamptz not null,
  searchable_text text null,

  content_layer text not null check (content_layer in ('fast', 'evergreen', 'moment')),

  categories text[] not null default '{}',
  themes text[] not null default '{}',
  moments text[] not null default '{}',
  tags text[] not null default '{}',
  hashtags text[] not null default '{}',
  manual_tags text[] not null default '{}',

  featured boolean null,
  is_featured boolean not null default false,
  featured_rank int null,
  editorial_label text null,
  hero_variant text null check (hero_variant in ('standard', 'immersive', 'split')),

  collection_ids text[] not null default '{}',
  related_ids text[] not null default '{}',
  seo jsonb null,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Instagram uniqueness: voorkom dubbele records per platformbron
create unique index if not exists content_items_source_platform_source_id_unique
  on public.content_items (source_platform, source_id)
  where source_id is not null;

create index if not exists content_items_published_at_idx on public.content_items (published_at desc);
create index if not exists content_items_is_featured_idx on public.content_items (is_featured, featured_rank);
create index if not exists content_items_categories_gin on public.content_items using gin (categories);
create index if not exists content_items_themes_gin on public.content_items using gin (themes);
create index if not exists content_items_moments_gin on public.content_items using gin (moments);
create index if not exists content_items_tags_gin on public.content_items using gin (tags);
create index if not exists content_items_hashtags_gin on public.content_items using gin (hashtags);

-- Optioneel als pg_trgm actief is
create index if not exists content_items_searchable_text_trgm
  on public.content_items using gin (searchable_text gin_trgm_ops);
```

## 3) Ondersteunende tabellen

Deze tabellen zijn aanbevolen voor sync-operaties en redactionele laag, zonder bestaande frontend-contracten te breken.

### 3.1 `public.instagram_sync_runs`

```sql
create table if not exists public.instagram_sync_runs (
  id bigint generated always as identity primary key,
  started_at timestamptz not null default now(),
  finished_at timestamptz null,
  status text not null check (status in ('running', 'success', 'failed')),
  fetched_count int not null default 0,
  upserted_count int not null default 0,
  error_count int not null default 0,
  error_details jsonb null
);
```

### 3.2 `public.instagram_sync_state`

```sql
create table if not exists public.instagram_sync_state (
  id int primary key default 1,
  last_successful_sync_at timestamptz null,
  last_cursor text null,
  updated_at timestamptz not null default now(),
  constraint instagram_sync_state_singleton check (id = 1)
);
```

### 3.3 `public.themes` en `public.collections` (optioneel maar aanbevolen)

Sluit aan op bestaande `Theme`/`Collection` entities voor landingspagina’s.

```sql
create table if not exists public.themes (
  id text primary key,
  slug text not null unique,
  title text not null,
  kind text not null check (kind in ('theme', 'moment')),
  intro text not null,
  hero_image text not null,
  accent_color text not null,
  featured_content_ids text[] not null default '{}',
  seo jsonb null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.collections (
  id text primary key,
  slug text not null unique,
  title text not null,
  intro text not null,
  channel text not null check (channel in ('newsletter', 'campaign', 'seasonal', 'editorial')),
  hero_image text not null,
  content_ids text[] not null default '{}',
  cta_label text null,
  cta_href text null,
  seo jsonb null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

## 4) Mapping naar huidige code

`lib/adapters/instagram.ts` bevat al de contracten:

- `SupabaseContentRow`
- `mapSupabaseContentRowToContentItem(row)`
- `mapContentItemToSupabaseRow(item)`

De SQL hierboven is hier direct op afgestemd.

## 5) Migratiepad (zonder live toegang)

### Stap A — DB foundation

1. Maak tabellen/indexes aan in Supabase SQL editor (of migration files)
2. Voeg minimaal read policies toe voor public content (later aanscherpen)
3. Schrijven alleen via service role / Edge Functions

### Stap B — Backfill vanuit huidige mock-data

1. Lees lokale `contentItems`
2. Zet om met `mapContentItemToSupabaseRow`
3. Upsert naar `public.content_items`

### Stap C — Datasource switch activeren

1. Zet `CONTENT_DATA_SOURCE=supabase`
2. Vervang in `SupabaseContentDataSource` de JSON-stub door echte Supabase query
3. Frontend blijft ongewijzigd; repository contracten blijven gelijk

### Stap D — Instagram sync live

1. Edge Function: Instagram ophalen -> `normalizeInstagramPost` -> upsert `content_items`
2. Sync run loggen in `instagram_sync_runs`
3. Cursor/timestamp bewaren in `instagram_sync_state`
4. Plannen via Supabase Cron

## 6) Waarom dit schema nu werkt

- Geen tijdelijke parallelarchitectuur
- Geen embed-only afhankelijkheid
- Geen frontend rewrite bij overgang naar live sync
- Zoek/filter/thema/moment blijven werken op owned records

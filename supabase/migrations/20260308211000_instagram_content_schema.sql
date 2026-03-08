-- Den Bosch City - Instagram-first content schema foundation
-- Ready-to-run migration file (not auto-executed by this repo)
-- Aligned with docs/supabase-instagram-schema.md and SupabaseContentRow mapping.

-- Optional extension for trigram search indexing.
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

-- Avoid duplicates from the same upstream source record.
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
create index if not exists content_items_searchable_text_trgm
  on public.content_items using gin (searchable_text gin_trgm_ops);

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

create table if not exists public.instagram_sync_state (
  id int primary key default 1,
  last_successful_sync_at timestamptz null,
  last_cursor text null,
  updated_at timestamptz not null default now(),
  constraint instagram_sync_state_singleton check (id = 1)
);

-- Optional but recommended supporting tables for existing theme/moment and collection entities.
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

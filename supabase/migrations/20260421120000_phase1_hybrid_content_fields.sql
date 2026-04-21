-- Den Bosch City - Phase 1 hybrid content fields
-- Extends the existing content_items table without replacing the Instagram ingestion flow.

alter table public.content_items
  add column if not exists content_type text not null default 'instafirst_update',
  add column if not exists first_published_at timestamptz null,
  add column if not exists last_material_update_at timestamptz null,
  add column if not exists relevance_start_at timestamptz null,
  add column if not exists relevance_end_at timestamptz null,
  add column if not exists evergreen_score int not null default 0,
  add column if not exists freshness_rank int null,
  add column if not exists status text not null default 'published';

update public.content_items
set
  content_type = case
    when content_type in ('instafirst_update', 'guide', 'eigen_post')
      and not (content_type = 'instafirst_update' and source_platform in ('editorial', 'press'))
      then content_type
    when source_platform = 'instagram' then 'instafirst_update'
    when source_platform in ('editorial', 'press') then 'eigen_post'
    else content_type
  end,
  first_published_at = coalesce(first_published_at, published_at)
where first_published_at is null
  or content_type not in ('instafirst_update', 'guide', 'eigen_post');

alter table public.content_items
  drop constraint if exists content_items_source_platform_check;

alter table public.content_items
  add constraint content_items_source_platform_check
  check (source_platform in ('instagram', 'editorial', 'press'));

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'content_items_content_type_check'
      and conrelid = 'public.content_items'::regclass
  ) then
    alter table public.content_items
      add constraint content_items_content_type_check
      check (content_type in ('instafirst_update', 'guide', 'eigen_post'));
  end if;
end $$;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'content_items_status_check'
      and conrelid = 'public.content_items'::regclass
  ) then
    alter table public.content_items
      add constraint content_items_status_check
      check (status in ('draft', 'review', 'published', 'archived'));
  end if;
end $$;

create index if not exists content_items_content_type_idx on public.content_items (content_type);
create index if not exists content_items_status_idx on public.content_items (status);
create index if not exists content_items_relevance_window_idx
  on public.content_items (relevance_start_at, relevance_end_at);

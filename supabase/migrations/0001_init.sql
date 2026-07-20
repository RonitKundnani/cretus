-- ============================================================================
-- CRETUS 2026 — initial schema
-- Public site tables + club-internal inventory tables, one shared database.
-- Apply in the Supabase SQL editor (or `supabase db push`).
-- ============================================================================

create extension if not exists "pgcrypto";

-- ----------------------------------------------------------------------------
-- ENUMS
-- ----------------------------------------------------------------------------
do $$ begin
  create type user_role      as enum ('admin', 'committee');
  create type event_type     as enum ('workshop', 'competition', 'event');
  create type issuance_status as enum ('issued', 'returned', 'overdue');
  create type damage_status   as enum ('reported', 'repaired', 'discarded');
  create type damage_severity as enum ('minor', 'major', 'total');
exception
  when duplicate_object then null;
end $$;

-- ----------------------------------------------------------------------------
-- PROFILES  (mirrors auth.users; source of truth for roles)
-- ----------------------------------------------------------------------------
create table if not exists profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  full_name  text,
  role       user_role not null default 'committee',
  created_at timestamptz not null default now()
);

-- helper: is the current user an inventory user (has a profile)?
create or replace function is_member() returns boolean
  language sql stable security definer set search_path = public as $$
  select exists (select 1 from profiles where id = auth.uid());
$$;

-- helper: is the current user an admin?
create or replace function is_admin() returns boolean
  language sql stable security definer set search_path = public as $$
  select exists (select 1 from profiles where id = auth.uid() and role = 'admin');
$$;

-- auto-create a profile row when a new auth user signs up
create or replace function handle_new_user() returns trigger
  language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', new.email))
  on conflict (id) do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ============================================================================
-- PUBLIC-FACING CONTENT
-- ============================================================================

create table if not exists committee_members (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  role        text not null,
  photo_url   text,
  linkedin    text,
  github      text,
  tenure_year text,
  sort_order  int not null default 0,
  created_at  timestamptz not null default now()
);

create table if not exists projects (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  slug          text not null unique,
  tagline       text,
  cover_url     text,
  status        text default 'ongoing',      -- ongoing | completed | archived
  code_repo_url text,
  demo_url      text,
  published     boolean not null default false,
  created_at    timestamptz not null default now()
);

-- flexible sections per project: Description, Components Required, Code Repo,
-- Common Issues Faced, etc. body_md is markdown.
create table if not exists project_sections (
  id         uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  heading    text not null,
  body_md    text not null default '',
  sort_order int not null default 0
);
create index if not exists idx_project_sections_project on project_sections(project_id);

create table if not exists blog_posts (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,
  slug         text not null unique,
  excerpt      text,
  cover_url    text,
  content_md   text not null default '',
  author       text,
  tags         text[] not null default '{}',
  published    boolean not null default false,
  published_at timestamptz,
  created_at   timestamptz not null default now()
);

create table if not exists achievements (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  happened_on date,
  description text,
  image_url   text,
  sort_order  int not null default 0
);

create table if not exists events (
  id                uuid primary key default gen_random_uuid(),
  title             text not null,
  slug              text not null unique,
  type              event_type not null default 'event',
  description_md    text not null default '',
  cover_url         text,
  starts_at         timestamptz,
  ends_at           timestamptz,
  location          text,
  registration_open boolean not null default true,
  capacity          int,
  published         boolean not null default false,
  created_at        timestamptz not null default now()
);

create table if not exists event_registrations (
  id         uuid primary key default gen_random_uuid(),
  event_id   uuid not null references events(id) on delete cascade,
  name       text not null,
  email      text not null,
  phone      text,
  student_id text,
  department text,
  year       text,
  notes      text,
  created_at timestamptz not null default now()
);
create index if not exists idx_registrations_event on event_registrations(event_id);

-- ============================================================================
-- INVENTORY (club-internal)
-- ============================================================================

create table if not exists components (
  id               uuid primary key default gen_random_uuid(),
  name             text not null,
  category         text,
  description      text,
  image_url        text,
  storage_location text,
  created_at       timestamptz not null default now()
);

-- adding stock: bill image + date + cost + reason + (optional) linked event
create table if not exists acquisitions (
  id            uuid primary key default gen_random_uuid(),
  component_id  uuid not null references components(id) on delete cascade,
  quantity      int not null check (quantity > 0),
  unit_cost     numeric(12,2),
  total_cost    numeric(12,2),
  vendor        text,
  bill_image_url text,
  purchased_on  date,
  reason        text,
  event_id      uuid references events(id) on delete set null,
  added_by      uuid references profiles(id) on delete set null,
  created_at    timestamptz not null default now()
);
create index if not exists idx_acquisitions_component on acquisitions(component_id);

-- who has issued what
create table if not exists issuances (
  id               uuid primary key default gen_random_uuid(),
  component_id     uuid not null references components(id) on delete cascade,
  quantity         int not null check (quantity > 0),
  issued_to_name   text not null,
  issued_to_contact text,
  purpose          text,
  event_id         uuid references events(id) on delete set null,
  issued_by        uuid references profiles(id) on delete set null,
  issued_at        timestamptz not null default now(),
  due_date         date,
  returned_at      timestamptz,
  status           issuance_status not null default 'issued'
);
create index if not exists idx_issuances_component on issuances(component_id);
create index if not exists idx_issuances_status on issuances(status);

create table if not exists damage_reports (
  id           uuid primary key default gen_random_uuid(),
  component_id uuid not null references components(id) on delete cascade,
  quantity     int not null check (quantity > 0),
  severity     damage_severity not null default 'minor',
  description  text,
  image_url    text,
  reported_by  uuid references profiles(id) on delete set null,
  reported_at  timestamptz not null default now(),
  status       damage_status not null default 'reported',
  resolution   text
);
create index if not exists idx_damage_component on damage_reports(component_id);

-- ----------------------------------------------------------------------------
-- STOCK VIEW
--   available = total acquired
--             - currently issued (status != returned)
--             - damaged & discarded
-- ----------------------------------------------------------------------------
create or replace view component_stock as
select
  c.id,
  c.name,
  c.category,
  c.image_url,
  c.storage_location,
  coalesce(a.total_acquired, 0)                                  as total_acquired,
  coalesce(i.total_issued, 0)                                    as total_issued,
  coalesce(d.total_discarded, 0)                                 as total_discarded,
  coalesce(a.total_acquired, 0)
    - coalesce(i.total_issued, 0)
    - coalesce(d.total_discarded, 0)                             as available
from components c
left join (
  select component_id, sum(quantity) total_acquired
  from acquisitions group by component_id
) a on a.component_id = c.id
left join (
  select component_id, sum(quantity) total_issued
  from issuances where status <> 'returned' group by component_id
) i on i.component_id = c.id
left join (
  select component_id, sum(quantity) total_discarded
  from damage_reports where status = 'discarded' group by component_id
) d on d.component_id = c.id;

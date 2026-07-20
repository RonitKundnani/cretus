-- CRETUS — full setup: run this whole file once in the Supabase SQL Editor.

-- ==== 0001_init.sql ====
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

-- ==== 0002_rls.sql ====
-- ============================================================================
-- CRETUS 2026 — Row Level Security
--   Public content: anon may READ published rows; anon may INSERT registrations.
--   Inventory: only authenticated members (profile) may read/write;
--              deletes + user management restricted to admins.
-- ============================================================================

-- Enable RLS everywhere
alter table profiles            enable row level security;
alter table committee_members   enable row level security;
alter table projects            enable row level security;
alter table project_sections    enable row level security;
alter table blog_posts          enable row level security;
alter table achievements        enable row level security;
alter table events              enable row level security;
alter table event_registrations enable row level security;
alter table components          enable row level security;
alter table acquisitions        enable row level security;
alter table issuances           enable row level security;
alter table damage_reports      enable row level security;

-- ----------------------------------------------------------------------------
-- PROFILES
-- ----------------------------------------------------------------------------
create policy "profiles readable by members"
  on profiles for select using (is_member());
create policy "own profile update"
  on profiles for update using (id = auth.uid());
create policy "admin manage profiles"
  on profiles for all using (is_admin()) with check (is_admin());

-- ----------------------------------------------------------------------------
-- PUBLIC CONTENT — anon reads published, members manage everything
-- ----------------------------------------------------------------------------

-- committee_members (always public)
create policy "committee public read" on committee_members for select using (true);
create policy "committee member write" on committee_members for all
  using (is_member()) with check (is_member());

-- projects
create policy "projects public read published" on projects for select
  using (published or is_member());
create policy "projects member write" on projects for all
  using (is_member()) with check (is_member());

-- project_sections — readable if parent project is readable
create policy "sections public read" on project_sections for select
  using (exists (
    select 1 from projects p
    where p.id = project_id and (p.published or is_member())
  ));
create policy "sections member write" on project_sections for all
  using (is_member()) with check (is_member());

-- blog_posts
create policy "blog public read published" on blog_posts for select
  using (published or is_member());
create policy "blog member write" on blog_posts for all
  using (is_member()) with check (is_member());

-- achievements (always public)
create policy "achievements public read" on achievements for select using (true);
create policy "achievements member write" on achievements for all
  using (is_member()) with check (is_member());

-- events
create policy "events public read published" on events for select
  using (published or is_member());
create policy "events member write" on events for all
  using (is_member()) with check (is_member());

-- event_registrations: anyone may register for an open, published event;
-- only members may read/manage the list.
create policy "registrations public insert" on event_registrations for insert
  with check (exists (
    select 1 from events e
    where e.id = event_id and e.published and e.registration_open
  ));
create policy "registrations member read" on event_registrations for select
  using (is_member());
create policy "registrations member manage" on event_registrations for delete
  using (is_member());

-- ----------------------------------------------------------------------------
-- INVENTORY — members read/write, admins delete
-- ----------------------------------------------------------------------------
-- components
create policy "components member read"  on components for select using (is_member());
create policy "components member write" on components for insert with check (is_member());
create policy "components member update" on components for update using (is_member());
create policy "components admin delete" on components for delete using (is_admin());

-- acquisitions
create policy "acq member read"   on acquisitions for select using (is_member());
create policy "acq member write"  on acquisitions for insert with check (is_member());
create policy "acq member update" on acquisitions for update using (is_member());
create policy "acq admin delete"  on acquisitions for delete using (is_admin());

-- issuances
create policy "iss member read"   on issuances for select using (is_member());
create policy "iss member write"  on issuances for insert with check (is_member());
create policy "iss member update" on issuances for update using (is_member());
create policy "iss admin delete"  on issuances for delete using (is_admin());

-- damage_reports
create policy "dmg member read"   on damage_reports for select using (is_member());
create policy "dmg member write"  on damage_reports for insert with check (is_member());
create policy "dmg member update" on damage_reports for update using (is_member());
create policy "dmg admin delete"  on damage_reports for delete using (is_admin());

-- ==== 0003_storage.sql ====
-- ============================================================================
-- CRETUS 2026 — Storage buckets + policies
--   public-read buckets for site content; private "bills" for inventory scans.
-- ============================================================================

insert into storage.buckets (id, name, public) values
  ('committee',        'committee',        true),
  ('projects',         'projects',         true),
  ('blog',             'blog',             true),
  ('events',           'events',           true),
  ('component-images', 'component-images', true),
  ('bills',            'bills',            false)
on conflict (id) do nothing;

-- Public-read buckets: anyone can read, only members can write/delete.
create policy "public buckets readable"
  on storage.objects for select
  using (bucket_id in ('committee','projects','blog','events','component-images'));

create policy "members write public buckets"
  on storage.objects for insert to authenticated
  with check (
    bucket_id in ('committee','projects','blog','events','component-images')
    and is_member()
  );

create policy "members update public buckets"
  on storage.objects for update to authenticated
  using (
    bucket_id in ('committee','projects','blog','events','component-images')
    and is_member()
  );

create policy "members delete public buckets"
  on storage.objects for delete to authenticated
  using (
    bucket_id in ('committee','projects','blog','events','component-images')
    and is_member()
  );

-- Private "bills" bucket: only members may read/write.
create policy "members read bills"
  on storage.objects for select to authenticated
  using (bucket_id = 'bills' and is_member());

create policy "members write bills"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'bills' and is_member());

create policy "members delete bills"
  on storage.objects for delete to authenticated
  using (bucket_id = 'bills' and is_member());

-- ==== seed.sql ====
-- ============================================================================
-- CRETUS 2026 — seed data (realistic placeholders)
-- Idempotent & re-runnable. Uses dollar-quoted strings ($md$…$md$) for text so
-- the Supabase SQL editor handles newlines/markdown reliably (same style the
-- migrations use). Replace with real content via the admin app later.
-- ============================================================================

-- Committee (placeholders) ---------------------------------------------------
insert into committee_members (name, role, tenure_year, sort_order)
select 'Sarthak Mehta', 'Faculty Coordinator', '2025-26', 1
where not exists (select 1 from committee_members where name = 'Sarthak Mehta');
insert into committee_members (name, role, tenure_year, sort_order)
select 'Dhruv Ribbonwala', 'Club President', '2025-26', 2
where not exists (select 1 from committee_members where name = 'Dhruv Ribbonwala');
insert into committee_members (name, role, tenure_year, sort_order)
select 'Aarav Shah', 'Vice President', '2025-26', 3
where not exists (select 1 from committee_members where name = 'Aarav Shah');
insert into committee_members (name, role, tenure_year, sort_order)
select 'Isha Patel', 'Technical Lead', '2025-26', 4
where not exists (select 1 from committee_members where name = 'Isha Patel');
insert into committee_members (name, role, tenure_year, sort_order)
select 'Rohan Desai', 'Events Head', '2025-26', 5
where not exists (select 1 from committee_members where name = 'Rohan Desai');
insert into committee_members (name, role, tenure_year, sort_order)
select 'Meera Joshi', 'Design Lead', '2025-26', 6
where not exists (select 1 from committee_members where name = 'Meera Joshi');

-- Featured project: Chess-Playing Robot -------------------------------------
insert into projects (title, slug, tagline, status, code_repo_url, published)
values (
  'Chess-Playing Robot',
  'chess-playing-robot',
  'An autonomous robot that sees the board, decides its move, and plays it with a robotic arm.',
  'ongoing',
  'https://github.com/Cretus-PDPU/',
  true
)
on conflict (slug) do nothing;

-- Project sections (one insert each; references the project directly) --------
insert into project_sections (project_id, heading, body_md, sort_order)
select p.id, 'Description', $md$The Chess-Playing Robot combines three subsystems into a single autonomous player:

- **A brain** - an AI engine that reads the current board state and decides the best move.
- **A robotic arm** - a mechanical arm that physically picks up and places pieces.
- **A sensory chessboard** - a sensor-equipped board that tracks piece positions in real time.$md$, 1
from projects p
where p.slug = 'chess-playing-robot'
  and not exists (select 1 from project_sections ps where ps.project_id = p.id and ps.heading = 'Description');

insert into project_sections (project_id, heading, body_md, sort_order)
select p.id, 'Components Required', $md$| Component | Qty | Notes |
|---|---|---|
| Arduino Mega / ESP32 | 1 | Main controller |
| Reed switches / Hall sensors | 64 | One per square |
| Stepper motors | 3 | Arm joints + gantry |
| Electromagnet | 1 | Piece pickup |
| Motor drivers (A4988) | 3 | Stepper control |
| 12V power supply | 1 | Motors |$md$, 2
from projects p
where p.slug = 'chess-playing-robot'
  and not exists (select 1 from project_sections ps where ps.project_id = p.id and ps.heading = 'Components Required');

insert into project_sections (project_id, heading, body_md, sort_order)
select p.id, 'Code & Repository', $md$The firmware and move-engine bridge live in the club GitHub org.

Repo: https://github.com/Cretus-PDPU/$md$, 3
from projects p
where p.slug = 'chess-playing-robot'
  and not exists (select 1 from project_sections ps where ps.project_id = p.id and ps.heading = 'Code & Repository');

insert into project_sections (project_id, heading, body_md, sort_order)
select p.id, 'Common Issues Faced', $md$- **Sensor cross-talk** on adjacent squares - solved with shielding and per-square debouncing.
- **Arm calibration drift** over long games - added a homing routine before each move.
- **Piece slippage** on the electromagnet - tuned magnet strength and pickup dwell time.$md$, 4
from projects p
where p.slug = 'chess-playing-robot'
  and not exists (select 1 from project_sections ps where ps.project_id = p.id and ps.heading = 'Common Issues Faced');

-- Sample blog post -----------------------------------------------------------
insert into blog_posts (title, slug, excerpt, content_md, author, tags, published, published_at)
values (
  'WAYMO - The Driverless Car Revolution',
  'waymo-driverless-car-revolution',
  'How autonomous vehicles perceive the world, plan paths, and what it means for robotics.',
  $md$# WAYMO - The Driverless Car Revolution

Autonomous vehicles fuse LiDAR, radar, and cameras to build a live model of the world, then plan safe paths through it.

## Perception
Sensor fusion turns raw signals into a labelled scene - cars, pedestrians, lanes.

## Planning
The planner predicts what everything nearby will do next, then chooses a trajectory.

*This is a placeholder post - replace it from the admin app.*$md$,
  'Cretus',
  ARRAY['autonomous','robotics','AI'],
  true, now()
)
on conflict (slug) do nothing;

-- Achievements timeline ------------------------------------------------------
insert into achievements (title, happened_on, description, sort_order)
select 'Club Founded', date '2020-01-01', 'Cretus is founded as the Robotics & Automation Club of PDEU.', 1
where not exists (select 1 from achievements where title = 'Club Founded');
insert into achievements (title, happened_on, description, sort_order)
select 'First Robotics Workshop', date '2021-09-15', 'Introductory hands-on workshop on Arduino and sensors.', 2
where not exists (select 1 from achievements where title = 'First Robotics Workshop');
insert into achievements (title, happened_on, description, sort_order)
select 'Chess Robot - Prototype', date '2024-03-10', 'First working prototype of the autonomous chess-playing robot.', 3
where not exists (select 1 from achievements where title = 'Chess Robot - Prototype');

-- Sample events --------------------------------------------------------------
insert into events (title, slug, type, description_md, location, starts_at, registration_open, capacity, published)
values (
  'Intro to Robotics Workshop',
  'intro-to-robotics-workshop',
  'workshop',
  $md$A beginner-friendly, hands-on session covering microcontrollers, sensors, and actuators. No experience required - just curiosity.$md$,
  'PDEU, Raisan, Gandhinagar',
  now() + interval '21 days',
  true, 60, true
)
on conflict (slug) do nothing;

insert into events (title, slug, type, description_md, location, starts_at, registration_open, capacity, published)
values (
  'Cretus RoboWars 2026',
  'cretus-robowars-2026',
  'competition',
  $md$The flagship robotics competition. Build a combat bot and battle it out. Teams of up to 4.$md$,
  'PDEU Main Auditorium',
  now() + interval '45 days',
  true, 32, true
)
on conflict (slug) do nothing;

-- Inventory sample components -----------------------------------------------
insert into components (name, category, description, storage_location)
select 'Arduino Uno R3', 'Microcontroller', 'ATmega328P dev board', 'Cabinet A - Shelf 1'
where not exists (select 1 from components where name = 'Arduino Uno R3');
insert into components (name, category, description, storage_location)
select 'SG90 Servo Motor', 'Actuator', '9g micro servo', 'Cabinet A - Shelf 2'
where not exists (select 1 from components where name = 'SG90 Servo Motor');
insert into components (name, category, description, storage_location)
select 'HC-SR04 Ultrasonic', 'Sensor', 'Distance sensor', 'Cabinet B - Bin 3'
where not exists (select 1 from components where name = 'HC-SR04 Ultrasonic');
insert into components (name, category, description, storage_location)
select 'NEMA 17 Stepper', 'Actuator', 'Bipolar stepper motor', 'Cabinet B - Shelf 1'
where not exists (select 1 from components where name = 'NEMA 17 Stepper');
insert into components (name, category, description, storage_location)
select 'Jumper Wires (M-M)', 'Consumable', 'Pack of 40', 'Drawer 2'
where not exists (select 1 from components where name = 'Jumper Wires (M-M)');

-- Give a couple components some acquired stock so the dashboard isn't empty.
insert into acquisitions (component_id, quantity, unit_cost, total_cost, vendor, purchased_on, reason)
select c.id, 10, 450.00, 4500.00, 'Robu.in', current_date - 60, 'General club stock'
from components c
where c.name = 'Arduino Uno R3'
  and not exists (select 1 from acquisitions a where a.component_id = c.id);

insert into acquisitions (component_id, quantity, unit_cost, total_cost, vendor, purchased_on, reason)
select c.id, 25, 75.00, 1875.00, 'Robu.in', current_date - 60, 'General club stock'
from components c
where c.name = 'SG90 Servo Motor'
  and not exists (select 1 from acquisitions a where a.component_id = c.id);

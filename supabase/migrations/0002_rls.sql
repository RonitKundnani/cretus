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

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

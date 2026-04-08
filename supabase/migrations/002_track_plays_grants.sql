-- Kør KUN hvis GET https://dit-domæne/api/play viser fejl ved insert_test
-- (service_role burde normalt springe RLS over uden dette).

grant usage on schema public to service_role;
grant all on table public.track_plays to service_role;

drop policy if exists "track_plays_service_role_all" on public.track_plays;

create policy "track_plays_service_role_all"
  on public.track_plays
  for all
  to service_role
  using (true)
  with check (true);

-- Kør dette i Supabase SQL Editor (eller via CLI), én gang pr. projekt.

create table if not exists public.track_plays (
  id uuid primary key default gen_random_uuid(),
  track_id text not null check (char_length(track_id) < 200),
  created_at timestamptz not null default now()
);

create index if not exists track_plays_track_id_idx on public.track_plays (track_id);
create index if not exists track_plays_created_at_idx on public.track_plays (created_at desc);

comment on table public.track_plays is 'Afspilnings-events fra LykkeMusik (API med service role).';

alter table public.track_plays enable row level security;

-- Ingen policies for anon/authenticated: kun service role (server) skriver/læser.

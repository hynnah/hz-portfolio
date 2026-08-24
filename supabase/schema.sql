-- hz-portfolio — Supabase schema
-- Run this once in the Supabase SQL editor (Project → SQL Editor → New query),
-- then run seed.sql to load the starting content.
--
-- Admin access model: sign-in is Supabase Auth (email + password). Anyone can
-- read all tables below (it's a public portfolio); only the allowlisted admin
-- email can write. Change ADMIN_EMAIL below to the account you'll sign in
-- with, then create that user under Authentication → Users → Add user.

-- ── 1. admin allowlist ───────────────────────────────────────────────────
-- A tiny table instead of a hardcoded string in every policy, so you can add
-- a second admin later with one INSERT instead of editing SQL everywhere.
create table if not exists admin_emails (
  email text primary key
);

alter table admin_emails enable row level security;
-- No one can read/write this table from the client; only used inside the
-- is_admin() check below (SECURITY DEFINER bypasses RLS for that lookup).

create or replace function is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from admin_emails
    where email = (auth.jwt() ->> 'email')
  );
$$;

-- Seed the allowlist with your account. Replace the placeholder below with
-- your real admin email before running this in the Supabase SQL editor —
-- don't commit your actual admin address to a public repo.
insert into admin_emails (email) values ('admin@example.com')
on conflict (email) do nothing;

-- ── 1b. table privileges ─────────────────────────────────────────────────
-- RLS policies only take effect once a role already has statement-level
-- privilege on a table. Fresh Supabase projects usually default-grant this,
-- but don't rely on it — grant explicitly so this schema works anywhere.
grant usage on schema public to anon, authenticated;
alter default privileges in schema public grant select on tables to anon;
alter default privileges in schema public grant select, insert, update, delete on tables to authenticated;

-- ── 2. content tables ────────────────────────────────────────────────────
create table if not exists profile (
  id int primary key default 1,
  story_line text not null default '',
  name text not null default '',
  subtitle text not null default '',
  about_paragraph text not null default '',
  location text not null default '',
  email text not null default '',
  github_url text not null default '',
  linkedin_url text not null default '',
  portrait_url text,
  resume_url text,
  updated_at timestamptz not null default now(),
  constraint profile_singleton check (id = 1)
);

create table if not exists skill_groups (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  items text[] not null default '{}',
  sort_order int not null default 0
);

create table if not exists education (
  id uuid primary key default gen_random_uuid(),
  school text not null,
  degree text not null,
  years text not null,
  sort_order int not null default 0
);

create table if not exists certifications (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  issuer text not null,
  year text not null,
  sort_order int not null default 0
);

create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  num text not null,
  title text not null,
  kind text not null default '',
  dates text not null default '',
  blurb text not null default '',
  stack text not null default '',
  tags text[] not null default '{}',
  full_description text not null default '',
  repo_url text,
  demo_url text,
  private_note text,
  image_url text,
  preview_url text,
  sort_order int not null default 0
);

-- If you already ran this file before preview_url existed, add it retroactively:
-- alter table projects add column if not exists preview_url text;

-- ── 3. row level security ────────────────────────────────────────────────
alter table profile enable row level security;
alter table skill_groups enable row level security;
alter table education enable row level security;
alter table certifications enable row level security;
alter table projects enable row level security;

do $$
declare
  t text;
begin
  foreach t in array array['profile', 'skill_groups', 'education', 'certifications', 'projects']
  loop
    execute format('drop policy if exists "public read" on %I', t);
    execute format('create policy "public read" on %I for select using (true)', t);

    execute format('drop policy if exists "admin write" on %I', t);
    execute format(
      'create policy "admin write" on %I for all using (is_admin()) with check (is_admin())',
      t
    );
  end loop;
end $$;

-- ── 4. storage bucket for portrait / project screenshots / résumé ───────
insert into storage.buckets (id, name, public)
values ('portfolio-assets', 'portfolio-assets', true)
on conflict (id) do nothing;

drop policy if exists "public read portfolio-assets" on storage.objects;
create policy "public read portfolio-assets" on storage.objects
  for select using (bucket_id = 'portfolio-assets');

drop policy if exists "admin write portfolio-assets" on storage.objects;
create policy "admin write portfolio-assets" on storage.objects
  for all using (bucket_id = 'portfolio-assets' and is_admin())
  with check (bucket_id = 'portfolio-assets' and is_admin());

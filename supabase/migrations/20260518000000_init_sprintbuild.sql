-- SprintBuild initial schema
-- Sets up the profiles table, on-signup trigger, and storage buckets with RLS.

-- ──────────────────────────────────────────────────────────────────────────
-- profiles
-- ──────────────────────────────────────────────────────────────────────────

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  display_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Hide the table from the anon GraphQL schema. RLS already filters rows,
-- but there's no reason for unauthenticated callers to discover the schema.
revoke select on public.profiles from anon;

drop policy if exists "profiles are readable by owner"
  on public.profiles;
create policy "profiles are readable by owner"
  on public.profiles
  for select
  to authenticated
  using ((select auth.uid()) = id);

drop policy if exists "profiles are updatable by owner"
  on public.profiles;
create policy "profiles are updatable by owner"
  on public.profiles
  for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

drop policy if exists "profiles are insertable by owner"
  on public.profiles;
create policy "profiles are insertable by owner"
  on public.profiles
  for insert
  to authenticated
  with check ((select auth.uid()) = id);

-- Touch updated_at on every update
create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row
  execute function public.set_updated_at();

-- Auto-create a profile row when a new auth.user is created
create or replace function public.handle_new_user()
returns trigger
security definer
set search_path = public
language plpgsql
as $$
begin
  insert into public.profiles (id, email, display_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'name', new.email)
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- handle_new_user runs only from the trigger above. Keep it out of the
-- exposed REST/GraphQL surface so /rest/v1/rpc/handle_new_user is locked.
revoke execute on function public.handle_new_user() from anon, authenticated, public;

-- ──────────────────────────────────────────────────────────────────────────
-- projects
-- A user-owned project record. Each project's files live under
-- storage://project-files/<user_id>/<project_id>/...
-- ──────────────────────────────────────────────────────────────────────────

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  description text,
  sandbox_id text,
  preview_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists projects_user_updated_idx
  on public.projects (user_id, updated_at desc);

alter table public.projects enable row level security;

-- Same as profiles: don't expose the schema to anon. Authenticated keeps
-- SELECT so signed-in users can query their own rows (RLS restricts which).
revoke select on public.projects from anon;

drop policy if exists "projects are readable by owner"
  on public.projects;
create policy "projects are readable by owner"
  on public.projects
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "projects are insertable by owner"
  on public.projects;
create policy "projects are insertable by owner"
  on public.projects
  for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "projects are updatable by owner"
  on public.projects;
create policy "projects are updatable by owner"
  on public.projects
  for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists "projects are deletable by owner"
  on public.projects;
create policy "projects are deletable by owner"
  on public.projects
  for delete
  to authenticated
  using ((select auth.uid()) = user_id);

drop trigger if exists projects_set_updated_at on public.projects;
create trigger projects_set_updated_at
  before update on public.projects
  for each row
  execute function public.set_updated_at();

-- ──────────────────────────────────────────────────────────────────────────
-- Storage buckets
--   avatars: public-readable user avatars
--   project-files: private per-user project file storage
-- ──────────────────────────────────────────────────────────────────────────

insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('project-files', 'project-files', false)
on conflict (id) do nothing;

-- Avatars: bucket is public, so files are served via the public URL endpoint
-- without RLS. We deliberately do NOT add a SELECT policy here — that would
-- let clients list bucket contents, which we don't want. Owner can write.
drop policy if exists "avatars owner write" on storage.objects;
create policy "avatars owner write"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

drop policy if exists "avatars owner update" on storage.objects;
create policy "avatars owner update"
  on storage.objects
  for update
  to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  )
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

drop policy if exists "avatars owner delete" on storage.objects;
create policy "avatars owner delete"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

-- Project files: full owner-only access scoped to a per-user folder prefix.
drop policy if exists "project-files owner read" on storage.objects;
create policy "project-files owner read"
  on storage.objects
  for select
  to authenticated
  using (
    bucket_id = 'project-files'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

drop policy if exists "project-files owner write" on storage.objects;
create policy "project-files owner write"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'project-files'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

drop policy if exists "project-files owner update" on storage.objects;
create policy "project-files owner update"
  on storage.objects
  for update
  to authenticated
  using (
    bucket_id = 'project-files'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  )
  with check (
    bucket_id = 'project-files'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

drop policy if exists "project-files owner delete" on storage.objects;
create policy "project-files owner delete"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'project-files'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

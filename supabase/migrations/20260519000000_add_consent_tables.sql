-- Consent and legal acceptance tracking
--
-- Tables:
--   legal_documents     - versioned Terms / Privacy documents
--   legal_acceptances   - immutable per-user acceptance audit log
--   cookie_consents     - latest cookie consent state per user or visitor

-- ──────────────────────────────────────────────────────────────────────────
-- legal_documents
-- A simple lookup so we always know which version was current when a user
-- accepted. Seeded with the current versions; later versions are inserts.
-- ──────────────────────────────────────────────────────────────────────────

create table if not exists public.legal_documents (
  id uuid primary key default gen_random_uuid(),
  document text not null check (document in ('terms', 'privacy')),
  version text not null,
  effective_at timestamptz not null default now(),
  url text,
  unique (document, version)
);

create index if not exists legal_documents_document_effective_idx
  on public.legal_documents (document, effective_at desc);

alter table public.legal_documents enable row level security;

-- Anyone can read the current legal documents (used to render the version
-- string on signup pages and to look up the active version server-side).
drop policy if exists "legal_documents are world-readable" on public.legal_documents;
create policy "legal_documents are world-readable"
  on public.legal_documents
  for select
  to anon, authenticated
  using (true);

-- No insert/update/delete policies — only service_role can mutate.

insert into public.legal_documents (document, version, url) values
  ('terms', '2026-05-18', '/terms'),
  ('privacy', '2026-05-18', '/privacy')
on conflict (document, version) do nothing;

-- ──────────────────────────────────────────────────────────────────────────
-- legal_acceptances
-- Immutable audit log. One row per (user, document, version) acceptance.
-- ──────────────────────────────────────────────────────────────────────────

create table if not exists public.legal_acceptances (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  document text not null check (document in ('terms', 'privacy')),
  document_version text not null,
  accepted_at timestamptz not null default now(),
  ip inet,
  user_agent text,
  source text check (source in ('signup_password', 'signup_oauth', 'reaccept', 'admin'))
);

create index if not exists legal_acceptances_user_doc_idx
  on public.legal_acceptances (user_id, document, accepted_at desc);

-- One acceptance per user/document/version. Re-accepting after a version
-- bump creates a new row with the new version.
create unique index if not exists legal_acceptances_user_doc_version_unique
  on public.legal_acceptances (user_id, document, document_version);

alter table public.legal_acceptances enable row level security;

revoke select on public.legal_acceptances from anon;

drop policy if exists "legal_acceptances readable by owner"
  on public.legal_acceptances;
create policy "legal_acceptances readable by owner"
  on public.legal_acceptances
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "legal_acceptances insertable by owner"
  on public.legal_acceptances;
create policy "legal_acceptances insertable by owner"
  on public.legal_acceptances
  for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

-- No update or delete policies. Acceptances are immutable from the client
-- side; only service_role can correct mistakes.

-- ──────────────────────────────────────────────────────────────────────────
-- cookie_consents
-- Latest consent state per user (when authenticated) or per visitor_id
-- (when anonymous). Updated on each change; we don't keep history.
-- ──────────────────────────────────────────────────────────────────────────

create table if not exists public.cookie_consents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  visitor_id text,
  necessary boolean not null default true,
  preferences boolean not null default false,
  analytics boolean not null default false,
  policy_version int not null default 1,
  user_agent text,
  ip inet,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  -- Exactly one of (user_id, visitor_id) must be set.
  constraint cookie_consents_subject_check check (
    (user_id is not null and visitor_id is null)
    or (user_id is null and visitor_id is not null)
  )
);

-- One row per user, and one row per anonymous visitor. Upsert against these.
create unique index if not exists cookie_consents_user_unique
  on public.cookie_consents (user_id) where user_id is not null;
create unique index if not exists cookie_consents_visitor_unique
  on public.cookie_consents (visitor_id) where user_id is null;

alter table public.cookie_consents enable row level security;

revoke select on public.cookie_consents from anon;

-- Authenticated users can read and upsert their own row.
drop policy if exists "cookie_consents readable by owner"
  on public.cookie_consents;
create policy "cookie_consents readable by owner"
  on public.cookie_consents
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "cookie_consents insertable by owner"
  on public.cookie_consents;
create policy "cookie_consents insertable by owner"
  on public.cookie_consents
  for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "cookie_consents updatable by owner"
  on public.cookie_consents;
create policy "cookie_consents updatable by owner"
  on public.cookie_consents
  for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- Anonymous (pre-auth) consents are written exclusively by the server using
-- the service_role key — no anon policies. The /api/consent route handles
-- both cases.

drop trigger if exists cookie_consents_set_updated_at on public.cookie_consents;
create trigger cookie_consents_set_updated_at
  before update on public.cookie_consents
  for each row
  execute function public.set_updated_at();

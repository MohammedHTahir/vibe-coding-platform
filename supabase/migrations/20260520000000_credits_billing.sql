-- Credits and billing
--
-- New tables:
--   plans            - static tier catalog (free / hobby / pro / team)
--   subscriptions    - mirror of the active Stripe subscription per user
--   credit_ledger    - append-only log; balance = sum(amount)
--
-- New view:
--   user_credit_balance - per-user current balance, aggregated from ledger
--
-- Stripe price ids are NOT stored here. They're provided per-environment via
-- env vars (STRIPE_PRICE_HOBBY, STRIPE_PRICE_PRO, ...) so the same migration
-- runs untouched in dev / preview / prod.
--
-- All inserts to subscriptions and credit_ledger come from server code via
-- the service-role key (Stripe webhook handler and the agent debit path).
-- RLS only authorises owner reads.

-- ──────────────────────────────────────────────────────────────────────────
-- plans
-- ──────────────────────────────────────────────────────────────────────────

create table if not exists public.plans (
  id text primary key,
  name text not null,
  monthly_credits integer not null default 0,
  amount_cents integer not null default 0,
  is_public boolean not null default true,
  sort_order integer not null default 0,
  description text,
  created_at timestamptz not null default now()
);

alter table public.plans enable row level security;

drop policy if exists "plans are world-readable" on public.plans;
create policy "plans are world-readable"
  on public.plans
  for select
  to anon, authenticated
  using (is_public = true);

insert into public.plans (id, name, monthly_credits, amount_cents, sort_order, description) values
  ('free',   'Free',   50,     0, 1, 'Get started. 50 credits a month.'),
  ('hobby',  'Hobby',  1000, 2000, 2, 'For weekend builders. 1,000 credits a month.'),
  ('pro',    'Pro',    3000, 5000, 3, 'Daily driver. 3,000 credits a month, priority queue.'),
  ('team',   'Team',  15000,20000, 4, 'Shared workspace. 15,000 pooled credits a month.')
on conflict (id) do update
  set name = excluded.name,
      monthly_credits = excluded.monthly_credits,
      amount_cents = excluded.amount_cents,
      sort_order = excluded.sort_order,
      description = excluded.description;

-- ──────────────────────────────────────────────────────────────────────────
-- subscriptions
-- ──────────────────────────────────────────────────────────────────────────

create table if not exists public.subscriptions (
  user_id uuid primary key references auth.users(id) on delete cascade,
  plan_id text not null references public.plans(id),
  stripe_customer_id text not null,
  stripe_subscription_id text,
  status text not null,
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists subscriptions_stripe_customer_idx
  on public.subscriptions (stripe_customer_id);
create index if not exists subscriptions_stripe_subscription_idx
  on public.subscriptions (stripe_subscription_id);

alter table public.subscriptions enable row level security;
revoke select on public.subscriptions from anon;

drop policy if exists "subscriptions readable by owner" on public.subscriptions;
create policy "subscriptions readable by owner"
  on public.subscriptions
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

-- No insert/update/delete policies. Only service_role mutates this table.

drop trigger if exists subscriptions_set_updated_at on public.subscriptions;
create trigger subscriptions_set_updated_at
  before update on public.subscriptions
  for each row
  execute function public.set_updated_at();

-- ──────────────────────────────────────────────────────────────────────────
-- credit_ledger
-- ──────────────────────────────────────────────────────────────────────────

create table if not exists public.credit_ledger (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  amount integer not null,
  reason text not null check (
    reason in (
      'monthly_grant',
      'topup',
      'agent_run',
      'monthly_trim',
      'refund',
      'admin_adjust'
    )
  ),
  stripe_invoice_id text,
  stripe_payment_intent_id text,
  agent_run_id uuid,
  model text,
  metadata jsonb,
  created_at timestamptz not null default now()
);

create index if not exists credit_ledger_user_created_idx
  on public.credit_ledger (user_id, created_at desc);

-- Idempotency: a given Stripe invoice can produce at most one monthly_grant
-- row per user, no matter how many times the webhook is retried.
create unique index if not exists credit_ledger_invoice_grant_unique
  on public.credit_ledger (user_id, stripe_invoice_id, reason)
  where stripe_invoice_id is not null;

-- Same for one-off top-ups via PaymentIntent.
create unique index if not exists credit_ledger_topup_intent_unique
  on public.credit_ledger (user_id, stripe_payment_intent_id, reason)
  where stripe_payment_intent_id is not null;

alter table public.credit_ledger enable row level security;
revoke select on public.credit_ledger from anon;

drop policy if exists "credit_ledger readable by owner" on public.credit_ledger;
create policy "credit_ledger readable by owner"
  on public.credit_ledger
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

-- No insert/update/delete policies. Service-role only.

-- ──────────────────────────────────────────────────────────────────────────
-- user_credit_balance
-- A view, so we don't have to maintain a cached column. Postgres aggregates
-- this fast enough for our scale; revisit if it shows up in pg_stat.
-- ──────────────────────────────────────────────────────────────────────────

create or replace view public.user_credit_balance
  with (security_invoker = true) as
select
  user_id,
  coalesce(sum(amount), 0)::int as balance
from public.credit_ledger
group by user_id;

grant select on public.user_credit_balance to authenticated;

# Credits and billing — design

> Status: **Shipped (v1)**. Database, Stripe webhook, pricing page,
> billing page, and chat-route credit gate are live behind feature
> flags driven by env vars. This doc describes the implemented system
> and the bits still TODO.

The goal is a Lovable-style credit subscription:

- Free tier with a small monthly credit grant.
- Paid tiers with monthly credit grants and discounted top-ups.
- Credits are consumed per AI request; cost varies by model and (optionally)
  by token usage.
- Users can buy a one-off credit pack at any time without changing tier.
- The dashboard shows current balance and a clear path to "buy more".

This is deliberately a **prepaid credit model**, not a metered usage model
billed in arrears. That keeps unit economics safe — no risk of a runaway
agent burning $5,000 of inference on a free tier — and matches what Lovable,
Replit, Bolt, and v0 do today.

---

## Plans (initial proposal)

| Plan | Price | Monthly credits | Top-up rate | Notes |
| --- | --- | --- | --- | --- |
| Free | $0 | 50 | n/a — must upgrade to top up | Email-confirmed accounts only |
| Hobby | $20 / mo | 1,000 | $10 per 500 | One project at a time |
| Pro | $50 / mo | 3,000 | $10 per 600 | Unlimited projects, priority queue |
| Team | $200 / mo | 15,000 (pooled) | $10 per 700 | Shared workspace, admin role |
| Enterprise | Talk to us | Custom | Custom | SSO, audit log, custom retention |

Numbers above are placeholders. We'll calibrate after a week of real
internal traffic. The key parameters to tune:

- **Cost per credit on inference.** Today's bottleneck is Anthropic Opus
  at ~$15/M input + $75/M output tokens. A "1-credit" message at Opus is
  roughly 4–8K total tokens, which lands around $0.25–$0.55 raw cost. So
  a 1,000-credit Hobby tier costs us ~$250–550 in inference if entirely
  spent on Opus. We protect margin by:
  - charging more credits for Opus (see "Credit cost per model" below),
  - rate-limiting concurrent runs per plan,
  - caching system-prompt fragments (already enabled on Anthropic).

- **Sandbox time is bundled.** Vercel Sandbox minutes are included in
  credits, not billed separately. We'll surface a soft warning at 80%
  consumption.

## Credit cost per model

A single agent turn costs:

```
credits = base_per_model + ceil(output_tokens / 1000) * tokens_per_kilo
```

| Model | base | per 1K output tokens |
| --- | --- | --- |
| Claude Sonnet 4.6 | 1 | 0.5 |
| GPT-5.3 Codex | 1 | 0.5 |
| Grok 4.1 Reasoning | 1 | 0.4 |
| Claude Opus 4.6 | 3 | 1.5 |

So a typical Sonnet message that produces 2K tokens of output costs
`1 + 2 * 0.5 = 2 credits`. An Opus message producing 4K tokens costs
`3 + 4 * 1.5 = 9 credits`.

The exact multipliers belong in `ai/credits.ts` and read from a single
table that's easy to tune.

---

## Data model (additive — new migration)

Three new tables. None of them touch existing tables.

### `plans`

Static catalog. One row per Stripe Product. Seed data via migration; rare
to update at runtime.

```sql
create table public.plans (
  id text primary key,                      -- 'free' | 'hobby' | 'pro' | 'team'
  name text not null,
  stripe_product_id text,
  stripe_price_id_monthly text,
  monthly_credits integer not null default 0,
  amount_cents integer not null default 0,  -- monthly price in USD cents
  is_public boolean not null default true,
  created_at timestamptz not null default now()
);
```

### `subscriptions`

One row per user. Mirrors the active Stripe subscription.

```sql
create table public.subscriptions (
  user_id uuid primary key references auth.users(id) on delete cascade,
  plan_id text not null references public.plans(id),
  stripe_customer_id text not null,
  stripe_subscription_id text,
  status text not null,                     -- 'trialing'|'active'|'past_due'|'canceled'|'incomplete'|'free'
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index on public.subscriptions (stripe_customer_id);
```

### `credit_ledger`

Append-only. Every credit movement is one row. Balance = `sum(amount)
where user_id = $1`. No "balance" column — we never want a write race
between a debit and the cached number.

```sql
create table public.credit_ledger (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  amount integer not null,                  -- positive = grant, negative = debit
  reason text not null,                     -- 'monthly_grant'|'topup'|'agent_run'|'refund'|'admin_adjust'
  -- one of the following, depending on reason:
  stripe_invoice_id text,                   -- for monthly_grant, topup
  stripe_payment_intent_id text,            -- for topup, refund
  agent_run_id uuid,                        -- for agent_run debits
  model text,                               -- for agent_run debits
  metadata jsonb,                           -- free-form notes
  created_at timestamptz not null default now()
);

create index on public.credit_ledger (user_id, created_at desc);
-- Idempotency guard for Stripe-driven inserts:
create unique index credit_ledger_invoice_grant_unique
  on public.credit_ledger (user_id, stripe_invoice_id, reason)
  where stripe_invoice_id is not null;
```

### A view, for ergonomics

```sql
create or replace view public.user_credit_balance as
select user_id, coalesce(sum(amount), 0)::int as balance
from public.credit_ledger
group by user_id;
```

The dashboard reads from this. It's a simple aggregation; if it ever
becomes a hot path we can materialize it.

### RLS

- `plans`: read-only for `anon` and `authenticated`.
- `subscriptions`: row-level read for the owner only. No client-side writes.
- `credit_ledger`: row-level read for the owner only. No client-side writes.

All inserts to `subscriptions` and `credit_ledger` come from server code
using the service-role key (Stripe webhook handler and the agent debit path).

---

## Stripe wiring

### Products and prices (set up once in the Stripe dashboard)

For each plan:
1. Create a Product (`Hobby`, `Pro`, `Team`).
2. Create a recurring monthly Price.
3. Copy the `price_id` into the `plans` migration's seed data.

For top-ups:
- One Product `Credit pack` with N one-time Prices (`$10`, `$25`, `$50`, …).
  Each carries a `credits` value in metadata. The webhook reads the
  metadata to decide how many credits to grant.

### Webhook events we handle

The webhook lives at `app/api/stripe/webhook/route.ts` and verifies the
Stripe signature using `STRIPE_WEBHOOK_SECRET`. Each event maps to one or
two ledger rows.

| Event | Action |
| --- | --- |
| `checkout.session.completed` (mode `subscription`) | Upsert `subscriptions` row, set status to whatever Stripe reports. **Don't** grant credits here — wait for the invoice event. |
| `checkout.session.completed` (mode `payment`, our credit-pack Product) | Insert one positive `credit_ledger` row for `topup`, idempotency keyed on `stripe_payment_intent_id`. |
| `customer.subscription.created` / `.updated` | Sync `subscriptions` row (plan, status, period, cancel_at_period_end). |
| `customer.subscription.deleted` | Move user back to `free` plan. Do not claw back unspent credits. |
| `invoice.paid` (subscription) | Insert one positive `credit_ledger` row for `monthly_grant`. Idempotency keyed on `stripe_invoice_id`. |
| `invoice.payment_failed` | Mark subscription `past_due`. Don't grant credits. |

The **idempotency keys** matter — Stripe retries webhooks freely and we
must not double-grant. The unique partial index on `credit_ledger`
enforces this at the database level so a buggy handler can't duplicate
grants.

### Customer Portal

For self-serve cancel / payment-method updates, link to Stripe's hosted
Billing Portal. We just create a portal session via the Stripe API and
redirect. No custom UI required.

---

## App surface

### `/account/billing`

- Current plan name and price.
- Credit balance, last 10 ledger entries.
- "Upgrade" button → Checkout session.
- "Buy credits" button → Checkout session for a top-up Product.
- "Manage payment / cancel" button → Stripe Billing Portal.

### Dashboard chrome

- Compact credit balance pill in the header. Click → `/account/billing`.
- When balance hits zero mid-conversation, the agent stops gracefully:
  the next request returns a structured error and the UI shows an inline
  "Out of credits — buy more" CTA. We do **not** silently let the run
  fail with a generic error.

### Pricing page

- Public `/pricing` route. Static. Reads from `plans` (or a hardcoded
  TypeScript constant — server-rendered).

---

## Server-side enforcement

A single helper, `lib/credits.ts`:

```ts
// Reads balance from user_credit_balance view. Throws if insufficient.
export async function assertCredits(userId: string, needed: number): Promise<void>

// Atomic debit: records the negative ledger entry and returns the new balance.
// Wrapped in a transaction so two concurrent requests can't both pass the
// pre-check and overdraw.
export async function debitCredits(args: {
  userId: string
  amount: number
  agentRunId: string
  model: string
  metadata?: Record<string, unknown>
}): Promise<{ balance: number }>
```

The chat route (`app/api/chat/route.ts`) calls `assertCredits` before
starting the agent and `debitCredits` after each model turn completes.
We charge after the turn so a failed inference doesn't burn user credits.

For the concurrency-safe debit, the simplest correct shape is:

```sql
with new_entry as (
  insert into credit_ledger(...) values (..., -:amount, ...) returning amount
)
select coalesce(sum(amount), 0)::int from credit_ledger where user_id = :uid
```

If we want to **prevent** overdraw rather than detect it after the fact,
add a `before insert` trigger that checks the running balance against the
pending row. Lovable's behavior — "you went $0.04 over, your account is
locked" — is fine for v1 and avoids the trigger complexity.

---

## Free tier abuse prevention

The free tier is the riskiest surface. Mitigations:

- **Email-confirmed accounts only.** No anonymous credits.
- **Per-IP signup throttle** at the edge (Vercel firewall or BotID, which
  is already in `package.json`).
- **One active free account per Supabase `auth.users.email` domain** for
  disposable-mail providers (a small allowlist file we update over time).
- **Free tier credits do not roll over.** Reset to 50 each month.
- **Paid plan credits roll over up to 2× the monthly grant** so they
  never become hostage to "use it or lose it". Anything beyond that is
  trimmed at month boundary.

The rollover trim runs as a scheduled function (Vercel Cron) at
`02:00 UTC` on the 1st. It walks `credit_ledger` for each user, computes
balance, and inserts a negative `monthly_trim` entry to bring it back to
the cap. The cap policy lives in code, not in the DB schema, so it's
easy to tune.

---

## Environment variables

New required variables for production:

```
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...        # only if we ever ship a client-side Elements form
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PORTAL_RETURN_URL=/account/billing
```

For previews and local dev, the test-mode equivalents (`sk_test_…`).

---

## Rollout

1. ~~Land migrations and `lib/site.ts`/`lib/credits.ts` skeleton (no UI).~~ Done.
2. ~~Wire the webhook and Stripe products in test mode. Verify each event
   produces the correct ledger row.~~ Code is in place at
   `app/api/stripe/webhook/route.ts`. **You** still need to create
   Products/Prices in the Stripe dashboard and copy the price ids into
   env vars (see `.env.example`).
3. ~~Add `/pricing` + `/account/billing` UI.~~ Done.
4. ~~Add the credit-balance pill and the "out of credits" inline CTA in the
   dashboard.~~ Done. The pill is in `app/dashboard/credits-pill.tsx`,
   the toast handler is in `lib/chat-context.tsx`.
5. ~~Gate the chat route on `assertCredits`.~~ Done in
   `app/api/chat/route.ts`. Free users without a `subscriptions` row get
   their welcome grant of 50 credits at signup.
6. **TODO** — flip Stripe to live mode and announce.

### Still TODO

- **Cron for monthly rollover trim.** The "credits roll over up to 2× the
  monthly grant" rule is documented but not enforced yet. Add a Vercel
  Cron at 02:00 UTC on the 1st that walks subscribers and inserts
  `monthly_trim` rows. Keep this in code rather than the DB so we can
  tune the cap easily.
- **Per-IP signup throttle.** The cookie consent and BotID checks are in
  place, but a free-tier-only IP throttle hasn't been added.
- **Disposable-mail allowlist.** Defer until the first wave of abuse
  shows up — it's easy to ship reactively.
- **Annual plans / per-seat Team pricing.** v2 once monthly is stable.
- **Stripe Tax.** Toggle on in the dashboard before the first paid
  customer.

### Required env vars

See `.env.example`. The minimum to enable billing is:

```
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_HOBBY=price_...
STRIPE_PRICE_PRO=price_...
STRIPE_PRICE_TEAM=price_...
STRIPE_TOPUP_PACKS={"price_xxx":500,"price_yyy":1500}
```

Without `STRIPE_SECRET_KEY` the pricing page still renders, but the
upgrade buttons return an error. Without `STRIPE_PRICE_HOBBY` etc., the
corresponding plan can't be checked out (the button still shows but the
server action fails fast).

---

## Open questions

- **Annual plans?** Default discount is usually 16% (2 free months). I'd
  hold these for v2 once monthly pricing is stable.
- **Per-seat Team pricing?** Initial proposal is a flat 15K-credit pool
  for $200. Per-seat is fairer but materially more complex. Defer.
- **EU VAT / global tax.** Stripe Tax handles this with a one-checkbox
  toggle. Enable it before the first paid customer.
- **Refund policy.** I'd default to "no refunds on top-ups, prorated
  cancels for subscriptions" (Stripe's default). Document it in `/terms`.
- **Showing model cost to users.** Helpful for transparency; risky if
  the multipliers change. I'd show "Approx X credits/message" in the
  model picker tooltip rather than per-message live numbers.

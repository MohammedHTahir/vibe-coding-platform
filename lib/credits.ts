import 'server-only'

import { Models } from '@/ai/constants'
import { createAdminClient } from '@/lib/supabase/admin'
import type { Json } from '@/types/supabase'

export const FREE_PLAN_ID = 'free'
export const FREE_PLAN_GRANT = 50

/**
 * Cost of one agent turn.
 *
 *   credits = base + ceil(output_tokens / 1000) * per_kilo
 *
 * Tuned so Opus is materially more expensive than the cheaper models,
 * which protects margin without hiding access. Values are integers; we
 * round up.
 *
 * If the multipliers ever change, pricing-page copy and the chat
 * tooltip should be updated in the same PR.
 */
export const MODEL_CREDIT_COST: Record<string, { base: number; perKilo: number }> = {
  [Models.AnthropicClaudeOpus46]: { base: 3, perKilo: 1.5 },
  [Models.AnthropicClaudeSonnet46]: { base: 1, perKilo: 0.5 },
  [Models.OpenAIGPT53Codex]: { base: 1, perKilo: 0.5 },
  [Models.XaiGrok41Reasoning]: { base: 1, perKilo: 0.4 },
}

/** Default cost when the model is unknown. Conservative on the low side. */
const DEFAULT_COST = { base: 1, perKilo: 0.5 }

export function creditsForRun({
  modelId,
  outputTokens,
}: {
  modelId: string
  outputTokens: number
}): number {
  const cost = MODEL_CREDIT_COST[modelId] ?? DEFAULT_COST
  const tokenComponent = Math.ceil((outputTokens / 1000) * cost.perKilo)
  // Charge at least the base; cap at a sane ceiling so a runaway response
  // never burns 1000+ credits in one turn.
  return Math.min(cost.base + tokenComponent, 500)
}

/**
 * Reads the user's current credit balance from the user_credit_balance view.
 *
 * Returns 0 when the user has no ledger entries yet (e.g. brand-new account
 * before the welcome grant has been written).
 */
export async function getBalance(userId: string): Promise<number> {
  const admin = createAdminClient()
  const { data, error } = await admin
    .from('user_credit_balance')
    .select('balance')
    .eq('user_id', userId)
    .maybeSingle()
  if (error) {
    console.error('[credits] balance lookup failed', error)
    return 0
  }
  return data?.balance ?? 0
}

export type AssertCreditsResult =
  | { ok: true; balance: number }
  | { ok: false; balance: number; needed: number }

/**
 * Pre-check used by the chat route before kicking off an agent turn.
 * Does not write anything — caller debits via debitCredits after the
 * model finishes.
 */
export async function assertCredits(
  userId: string,
  needed: number
): Promise<AssertCreditsResult> {
  const balance = await getBalance(userId)
  if (balance < needed) return { ok: false, balance, needed }
  return { ok: true, balance }
}

/**
 * Records a debit and returns the new balance.
 *
 * Two-statement transaction: insert the negative ledger row, then re-read
 * the view. We don't try to enforce no-overdraw at the DB level here — by
 * the time we know how many credits to deduct (after the model finished),
 * the inference cost is already real money out the door, and refusing to
 * record it would just mean unbilled usage. The pre-check in
 * assertCredits keeps this from happening in the common case.
 */
export async function debitCredits(args: {
  userId: string
  amount: number
  agentRunId: string | null
  model: string
  metadata?: Json
}): Promise<{ balance: number }> {
  if (args.amount <= 0) {
    return { balance: await getBalance(args.userId) }
  }

  const admin = createAdminClient()
  const { error: insertError } = await admin.from('credit_ledger').insert({
    user_id: args.userId,
    amount: -args.amount,
    reason: 'agent_run',
    agent_run_id: args.agentRunId,
    model: args.model,
    metadata: args.metadata ?? null,
  })
  if (insertError) {
    console.error('[credits] debit failed', insertError)
  }
  return { balance: await getBalance(args.userId) }
}

/**
 * Idempotently grants the monthly credit allotment for a Stripe invoice.
 * The unique partial index on (user_id, stripe_invoice_id, reason)
 * prevents double-grants if Stripe retries the webhook.
 */
export async function grantMonthly(args: {
  userId: string
  amount: number
  stripeInvoiceId: string
  metadata?: Json
}): Promise<void> {
  if (args.amount <= 0) return
  const admin = createAdminClient()
  const { error } = await admin.from('credit_ledger').insert({
    user_id: args.userId,
    amount: args.amount,
    reason: 'monthly_grant',
    stripe_invoice_id: args.stripeInvoiceId,
    metadata: args.metadata ?? null,
  })
  if (error && !isUniqueViolation(error)) {
    console.error('[credits] monthly grant failed', error)
  }
}

/**
 * Idempotently grants credits for a one-off top-up. Keyed on the
 * PaymentIntent id so retries are safe.
 */
export async function grantTopup(args: {
  userId: string
  amount: number
  stripePaymentIntentId: string
  metadata?: Json
}): Promise<void> {
  if (args.amount <= 0) return
  const admin = createAdminClient()
  const { error } = await admin.from('credit_ledger').insert({
    user_id: args.userId,
    amount: args.amount,
    reason: 'topup',
    stripe_payment_intent_id: args.stripePaymentIntentId,
    metadata: args.metadata ?? null,
  })
  if (error && !isUniqueViolation(error)) {
    console.error('[credits] topup grant failed', error)
  }
}

/**
 * One-time welcome grant for a new free-tier user. Idempotent via a
 * synthetic invoice id so calling it twice is harmless.
 */
export async function grantWelcomeIfNeeded(userId: string): Promise<void> {
  const admin = createAdminClient()
  const { error } = await admin.from('credit_ledger').insert({
    user_id: userId,
    amount: FREE_PLAN_GRANT,
    reason: 'monthly_grant',
    stripe_invoice_id: `welcome:${userId}`,
    metadata: { kind: 'welcome' },
  })
  if (error && !isUniqueViolation(error)) {
    console.error('[credits] welcome grant failed', error)
  }
}

/**
 * Fetches the most recent ledger entries for the account billing page.
 */
export async function recentLedger(userId: string, limit = 20) {
  const admin = createAdminClient()
  const { data, error } = await admin
    .from('credit_ledger')
    .select('id, amount, reason, model, created_at, metadata')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit)
  if (error) {
    console.error('[credits] ledger lookup failed', error)
    return []
  }
  return data ?? []
}

function isUniqueViolation(error: { code?: string }): boolean {
  return error?.code === '23505'
}

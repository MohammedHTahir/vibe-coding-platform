import 'server-only'

import Stripe from 'stripe'

let cached: Stripe | null = null

/**
 * Lazily construct a Stripe SDK client. Cached after first call.
 *
 * Throws when STRIPE_SECRET_KEY is missing — billing routes are expected
 * to handle that gracefully (return 503) rather than crashing the whole
 * app at boot.
 */
export function stripe(): Stripe {
  if (cached) return cached
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) {
    throw new Error(
      'STRIPE_SECRET_KEY is not set. Billing endpoints are disabled.'
    )
  }
  cached = new Stripe(key, {
    // Pin to whatever the installed SDK considers latest. Bump the SDK
    // (and re-run typegen) to move forward; don't hand-edit a date string
    // here or we'll desync from the runtime version check.
    apiVersion: Stripe.DEFAULT_API_VERSION,
    typescript: true,
    appInfo: {
      name: 'SprintBuild',
      url: 'https://sprintbuild.ai',
    },
  })
  return cached
}

/**
 * Map of internal plan id -> Stripe Price id. Filled from env vars per
 * environment. The plans table does not store these — see the migration
 * comment for why.
 */
export function planPriceMap(): Record<string, string | undefined> {
  return {
    hobby: process.env.STRIPE_PRICE_HOBBY,
    pro: process.env.STRIPE_PRICE_PRO,
    team: process.env.STRIPE_PRICE_TEAM,
  }
}

/**
 * Resolve a Stripe Price id back to our internal plan id. Returns null
 * if the price isn't one we recognise (e.g. legacy prices, top-ups).
 */
export function planIdFromPriceId(priceId: string): string | null {
  for (const [planId, configured] of Object.entries(planPriceMap())) {
    if (configured && configured === priceId) return planId
  }
  return null
}

/**
 * Top-up credit packs. Maps Stripe Price id -> credit amount granted on
 * a successful payment.
 *
 * Configured via STRIPE_TOPUP_PACKS env var, JSON-encoded:
 *   {"price_abc":500,"price_def":1500,"price_ghi":3500}
 *
 * We use a JSON env var (rather than one var per pack) so adding a new
 * pack is a single-variable edit in Vercel.
 */
export function topupPacks(): Record<string, number> {
  const raw = process.env.STRIPE_TOPUP_PACKS
  if (!raw) return {}
  try {
    const parsed = JSON.parse(raw) as Record<string, number>
    // Defensive: drop entries whose value is not a positive integer.
    const cleaned: Record<string, number> = {}
    for (const [k, v] of Object.entries(parsed)) {
      if (typeof v === 'number' && Number.isInteger(v) && v > 0) {
        cleaned[k] = v
      }
    }
    return cleaned
  } catch (err) {
    console.error('[stripe] STRIPE_TOPUP_PACKS is not valid JSON', err)
    return {}
  }
}

export function creditsForTopupPriceId(priceId: string): number | null {
  const packs = topupPacks()
  return packs[priceId] ?? null
}

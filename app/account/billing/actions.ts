'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { planPriceMap, stripe } from '@/lib/stripe'
import { siteUrl } from '@/lib/site'

interface ActionState {
  error?: string
}

/**
 * Returns or creates the Stripe Customer for the given Supabase user,
 * stamps the subscriptions row with the customer id, and returns it.
 *
 * The first call for a new user creates a free-tier subscription row
 * alongside the customer so the rest of the app sees a consistent state.
 */
async function ensureStripeCustomer(args: {
  userId: string
  email: string | null
}): Promise<string> {
  const admin = createAdminClient()
  const { data: existing } = await admin
    .from('subscriptions')
    .select('stripe_customer_id')
    .eq('user_id', args.userId)
    .maybeSingle()

  if (existing?.stripe_customer_id) return existing.stripe_customer_id

  const customer = await stripe().customers.create({
    email: args.email ?? undefined,
    metadata: { user_id: args.userId },
  })

  await admin.from('subscriptions').upsert(
    {
      user_id: args.userId,
      plan_id: 'free',
      stripe_customer_id: customer.id,
      status: 'free',
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'user_id' }
  )

  return customer.id
}

async function requireUser() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login?redirect=/account/billing')
  return user
}

/**
 * Server action invoked from the pricing page / billing page when the
 * user clicks an upgrade button. Creates a Checkout Session for the
 * selected plan and redirects.
 */
export async function startSubscriptionCheckout(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const planId = String(formData.get('plan') ?? '')
  const priceId = planPriceMap()[planId]
  if (!priceId) {
    return { error: `Plan "${planId}" is not configured for checkout.` }
  }

  const user = await requireUser()
  const customerId = await ensureStripeCustomer({
    userId: user.id,
    email: user.email ?? null,
  })

  const base = siteUrl()
  const session = await stripe().checkout.sessions.create({
    mode: 'subscription',
    customer: customerId,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${base}/account/billing?status=success`,
    cancel_url: `${base}/pricing?status=cancelled`,
    allow_promotion_codes: true,
    subscription_data: {
      metadata: { user_id: user.id },
    },
    metadata: { user_id: user.id, plan: planId },
  })

  if (!session.url) {
    return { error: 'Stripe did not return a checkout URL.' }
  }
  redirect(session.url)
}

/**
 * Top-up checkout: charges a one-off amount for a credit pack. The Price
 * id comes straight from the form so we can show several pack sizes.
 */
export async function startTopupCheckout(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const priceId = String(formData.get('price') ?? '')
  if (!priceId) return { error: 'No top-up pack selected.' }

  const user = await requireUser()
  const customerId = await ensureStripeCustomer({
    userId: user.id,
    email: user.email ?? null,
  })

  const base = siteUrl()
  const session = await stripe().checkout.sessions.create({
    mode: 'payment',
    customer: customerId,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${base}/account/billing?status=topup-success`,
    cancel_url: `${base}/account/billing?status=topup-cancelled`,
    allow_promotion_codes: false,
    payment_intent_data: {
      metadata: { user_id: user.id, price_id: priceId },
    },
    metadata: { user_id: user.id, price_id: priceId, kind: 'topup' },
  })

  if (!session.url) {
    return { error: 'Stripe did not return a checkout URL.' }
  }
  redirect(session.url)
}

/**
 * Opens the Stripe Customer Portal so users can update payment methods,
 * cancel, or download invoices without us building any UI for it.
 */
export async function openCustomerPortal(
  _prev: ActionState,
  _formData: FormData
): Promise<ActionState> {
  const user = await requireUser()
  const customerId = await ensureStripeCustomer({
    userId: user.id,
    email: user.email ?? null,
  })

  const base = siteUrl()
  const portal = await stripe().billingPortal.sessions.create({
    customer: customerId,
    return_url: `${base}/account/billing`,
  })

  redirect(portal.url)
}

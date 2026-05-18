import { NextResponse, type NextRequest } from 'next/server'
import type Stripe from 'stripe'
import {
  creditsForTopupPriceId,
  planIdFromPriceId,
  stripe,
} from '@/lib/stripe'
import { createAdminClient } from '@/lib/supabase/admin'
import { grantMonthly, grantTopup } from '@/lib/credits'

// Stripe needs the raw body to verify the signature, so we cannot use the
// default `await req.json()` pipeline. The route runs on Node (not Edge)
// so we have access to `req.text()` returning the unparsed body.
export const runtime = 'nodejs'

/**
 * Stripe webhook handler.
 *
 * Responsibilities:
 *  - Mirror subscription state into public.subscriptions
 *  - Grant monthly credits on invoice.paid (idempotent on invoice id)
 *  - Grant top-up credits on checkout.session.completed for one-off Prices
 *    (idempotent on payment_intent id)
 *
 * Returns 200 even on internal failures so Stripe doesn't keep retrying
 * forever; we log loudly and rely on alerts.
 */
export async function POST(request: NextRequest) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET
  if (!secret) {
    console.error('[stripe webhook] STRIPE_WEBHOOK_SECRET is not set')
    return NextResponse.json({ error: 'misconfigured' }, { status: 500 })
  }

  const signature = request.headers.get('stripe-signature')
  if (!signature) {
    return NextResponse.json({ error: 'missing_signature' }, { status: 400 })
  }

  const rawBody = await request.text()

  let event: Stripe.Event
  try {
    event = stripe().webhooks.constructEvent(rawBody, signature, secret)
  } catch (err) {
    console.error('[stripe webhook] signature verification failed', err)
    return NextResponse.json({ error: 'invalid_signature' }, { status: 400 })
  }

  try {
    await handleEvent(event)
  } catch (err) {
    console.error('[stripe webhook] handler error', { type: event.type, err })
    // Swallow: returning 500 makes Stripe retry, which is rarely what we
    // want for application errors (vs. transient infra). Log + alert.
  }

  return NextResponse.json({ received: true })
}

async function handleEvent(event: Stripe.Event): Promise<void> {
  switch (event.type) {
    case 'checkout.session.completed':
      await onCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session)
      return
    case 'customer.subscription.created':
    case 'customer.subscription.updated':
      await onSubscriptionUpserted(event.data.object as Stripe.Subscription)
      return
    case 'customer.subscription.deleted':
      await onSubscriptionDeleted(event.data.object as Stripe.Subscription)
      return
    case 'invoice.paid':
      await onInvoicePaid(event.data.object as Stripe.Invoice)
      return
    case 'invoice.payment_failed':
      await onInvoicePaymentFailed(event.data.object as Stripe.Invoice)
      return
    default:
      // Unhandled event type — fine, Stripe sends a lot. No-op.
      return
  }
}

// ─────────────────────────────────────────────────────────────────────────
// Handlers
// ─────────────────────────────────────────────────────────────────────────

async function onCheckoutSessionCompleted(
  session: Stripe.Checkout.Session
): Promise<void> {
  const userId = (session.metadata?.user_id ?? '') || null
  if (!userId) {
    console.warn('[stripe webhook] checkout session has no user_id metadata', {
      session: session.id,
    })
    return
  }

  if (session.mode === 'payment') {
    // One-off top-up. Look up the Price the customer paid for and grant the
    // configured number of credits.
    const lineItems = await stripe().checkout.sessions.listLineItems(session.id, {
      limit: 5,
    })
    const priceId = lineItems.data[0]?.price?.id
    if (!priceId) return
    const credits = creditsForTopupPriceId(priceId)
    const paymentIntentId =
      typeof session.payment_intent === 'string'
        ? session.payment_intent
        : session.payment_intent?.id
    if (!credits || !paymentIntentId) return
    await grantTopup({
      userId,
      amount: credits,
      stripePaymentIntentId: paymentIntentId,
      metadata: { stripe_session_id: session.id, price_id: priceId },
    })
    return
  }

  // mode === 'subscription' -> we wait for invoice.paid before granting
  // credits. Just sync the subscription record so the dashboard can show
  // the right plan immediately.
  if (session.mode === 'subscription' && typeof session.subscription === 'string') {
    const sub = await stripe().subscriptions.retrieve(session.subscription)
    await onSubscriptionUpserted(sub)
  }
}

async function onSubscriptionUpserted(sub: Stripe.Subscription): Promise<void> {
  const customerId =
    typeof sub.customer === 'string' ? sub.customer : sub.customer.id
  const userId = await resolveUserId({ customerId, subscriptionMetadata: sub.metadata })
  if (!userId) return

  const item = sub.items.data[0]
  const priceId = item?.price.id
  const planId = priceId ? planIdFromPriceId(priceId) : null
  if (!planId) {
    console.warn('[stripe webhook] subscription has unknown price id', {
      sub: sub.id,
      priceId,
    })
    return
  }

  // Stripe moved current_period_start/end between subscription and item
  // levels across recent API versions. Read both shapes loosely so we keep
  // working through SDK upgrades.
  const itemLoose = item as unknown as {
    current_period_start?: number | null
    current_period_end?: number | null
  }
  const subLoose = sub as unknown as {
    current_period_start?: number | null
    current_period_end?: number | null
  }
  const periodStart = itemLoose?.current_period_start ?? subLoose?.current_period_start ?? null
  const periodEnd = itemLoose?.current_period_end ?? subLoose?.current_period_end ?? null

  const admin = createAdminClient()
  const { error } = await admin.from('subscriptions').upsert(
    {
      user_id: userId,
      plan_id: planId,
      stripe_customer_id: customerId,
      stripe_subscription_id: sub.id,
      status: sub.status,
      current_period_start: periodStart
        ? new Date(periodStart * 1000).toISOString()
        : null,
      current_period_end: periodEnd
        ? new Date(periodEnd * 1000).toISOString()
        : null,
      cancel_at_period_end: sub.cancel_at_period_end ?? false,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'user_id' }
  )
  if (error) {
    console.error('[stripe webhook] subscription upsert failed', error)
  }
}

async function onSubscriptionDeleted(sub: Stripe.Subscription): Promise<void> {
  const customerId =
    typeof sub.customer === 'string' ? sub.customer : sub.customer.id
  const userId = await resolveUserId({ customerId, subscriptionMetadata: sub.metadata })
  if (!userId) return

  const admin = createAdminClient()
  // Move the user back to free; keep the customer id around so resubscribes
  // still find the same Stripe Customer.
  const { error } = await admin.from('subscriptions').upsert(
    {
      user_id: userId,
      plan_id: 'free',
      stripe_customer_id: customerId,
      stripe_subscription_id: null,
      status: 'canceled',
      cancel_at_period_end: false,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'user_id' }
  )
  if (error) {
    console.error('[stripe webhook] subscription delete sync failed', error)
  }
}

async function onInvoicePaid(invoice: Stripe.Invoice): Promise<void> {
  const customerId =
    typeof invoice.customer === 'string'
      ? invoice.customer
      : invoice.customer?.id
  if (!customerId || !invoice.id) return

  // Only handle subscription invoices here. Top-ups go through the
  // checkout.session.completed path.
  const line = invoice.lines?.data?.[0]
  // The shape of "is this a subscription invoice line" has shifted across
  // Stripe API versions. Treat permissively rather than locking us to one
  // schema.
  const lineLoose = line as unknown as {
    subscription?: string | null
    parent?: { subscription_item_details?: { subscription?: string } | null } | null
    pricing?: { price_details?: { price?: string } } | null
    price?: { id?: string } | null
  }
  const isSubscriptionLine = Boolean(
    lineLoose?.subscription ?? lineLoose?.parent?.subscription_item_details?.subscription
  )
  if (!isSubscriptionLine) return

  const userId = await resolveUserId({
    customerId,
    invoiceMetadata: invoice.metadata,
  })
  if (!userId) return

  const priceId =
    lineLoose?.pricing?.price_details?.price ?? lineLoose?.price?.id ?? null
  const planId = priceId ? planIdFromPriceId(priceId) : null
  if (!planId) return

  const admin = createAdminClient()
  const { data: plan } = await admin
    .from('plans')
    .select('monthly_credits')
    .eq('id', planId)
    .maybeSingle()
  if (!plan?.monthly_credits) return

  await grantMonthly({
    userId,
    amount: plan.monthly_credits,
    stripeInvoiceId: invoice.id,
    metadata: { plan_id: planId, price_id: priceId },
  })
}

async function onInvoicePaymentFailed(invoice: Stripe.Invoice): Promise<void> {
  const customerId =
    typeof invoice.customer === 'string'
      ? invoice.customer
      : invoice.customer?.id
  if (!customerId) return

  const userId = await resolveUserId({ customerId })
  if (!userId) return

  const admin = createAdminClient()
  await admin
    .from('subscriptions')
    .update({
      status: 'past_due',
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId)
}

// ─────────────────────────────────────────────────────────────────────────
// Resolving customer -> user
// ─────────────────────────────────────────────────────────────────────────

/**
 * We carry the user id forward via three channels, in order of trust:
 *   1. Metadata on the Stripe object (set when we created it)
 *   2. The subscriptions table, keyed on stripe_customer_id
 *   3. Stripe Customer.metadata.user_id
 *
 * If none of those work the event is dropped — we'd rather lose the row
 * than attribute money to the wrong account.
 */
async function resolveUserId(args: {
  customerId: string
  subscriptionMetadata?: Stripe.Metadata | null
  invoiceMetadata?: Stripe.Metadata | null
}): Promise<string | null> {
  const fromSub = args.subscriptionMetadata?.user_id
  if (fromSub) return fromSub
  const fromInv = args.invoiceMetadata?.user_id
  if (fromInv) return fromInv

  const admin = createAdminClient()
  const { data } = await admin
    .from('subscriptions')
    .select('user_id')
    .eq('stripe_customer_id', args.customerId)
    .maybeSingle()
  if (data?.user_id) return data.user_id

  try {
    const customer = await stripe().customers.retrieve(args.customerId)
    if (customer.deleted) return null
    const metaUser = (customer.metadata as Record<string, string> | null)?.user_id
    return metaUser ?? null
  } catch {
    return null
  }
}

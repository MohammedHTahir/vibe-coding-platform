import Link from 'next/link'
import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { SprintBuildWordmark } from '@/components/marketing/logo'
import { Button } from '@/components/ui/button'
import { LogOutIcon } from 'lucide-react'
import { signOut } from '@/app/login/actions'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getBalance, recentLedger } from '@/lib/credits'
import { topupPacks } from '@/lib/stripe'
import { PortalButton } from './portal-button'
import { TopupForm } from './topup-form'

export const metadata: Metadata = { title: 'Billing' }

export default async function BillingPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    redirect('/login')
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login?redirect=/account/billing')

  const admin = createAdminClient()
  const [{ data: subscription }, balance, ledger, { data: plan }] =
    await Promise.all([
      admin
        .from('subscriptions')
        .select('plan_id, status, current_period_end, cancel_at_period_end')
        .eq('user_id', user.id)
        .maybeSingle(),
      getBalance(user.id),
      recentLedger(user.id, 15),
      // We resolve the plan separately so the page works even when the
      // subscription row hasn't been created yet (free-tier fallback).
      Promise.resolve({ data: null }),
    ])

  const planId = subscription?.plan_id ?? 'free'
  const { data: planRow } = await admin
    .from('plans')
    .select('name, monthly_credits, amount_cents')
    .eq('id', planId)
    .maybeSingle()

  const packs = topupPacks()
  const status = (await searchParams).status

  return (
    <main className="min-h-screen bg-[#f0f0ee] flex flex-col">
      <header className="px-6 sm:px-12 md:px-20 lg:px-28 pt-6 flex items-center justify-between">
        <Link href="/" aria-label="SprintBuild home">
          <SprintBuildWordmark size="md" />
        </Link>
        <div className="flex items-center gap-2">
          <Button asChild size="sm" variant="outline">
            <Link href="/account">Account</Link>
          </Button>
          <Button asChild size="sm" variant="outline">
            <Link href="/dashboard">Dashboard</Link>
          </Button>
          <form action={signOut}>
            <Button
              type="submit"
              size="sm"
              variant="outline"
              className="cursor-pointer"
            >
              <LogOutIcon className="w-3.5 h-3.5" />
              Sign out
            </Button>
          </form>
        </div>
      </header>

      <div className="flex-1 px-6 sm:px-12 md:px-20 lg:px-28 py-12">
        <div className="max-w-3xl space-y-10">
          <div>
            <h1 className="text-2xl font-medium tracking-tight text-gray-900 mb-1">
              Billing
            </h1>
            <p className="text-[13px] text-gray-500">
              Your plan, credit balance, and recent activity.
            </p>
          </div>

          {status === 'success' ? (
            <Banner kind="success">
              Subscription updated. New credits should appear within a minute.
            </Banner>
          ) : null}
          {status === 'topup-success' ? (
            <Banner kind="success">
              Top-up received. Credits added to your balance.
            </Banner>
          ) : null}
          {status === 'topup-cancelled' ? (
            <Banner kind="info">
              Top-up cancelled. Your card was not charged.
            </Banner>
          ) : null}

          {/* Current plan + balance */}
          <section className="rounded-2xl border border-black/5 bg-white p-6 grid sm:grid-cols-2 gap-6">
            <div>
              <p className="text-[11px] uppercase tracking-[0.16em] text-gray-400 font-medium mb-1">
                Current plan
              </p>
              <p className="text-[18px] font-medium text-gray-900">
                {planRow?.name ?? 'Free'}
              </p>
              <p className="text-[12px] text-gray-500 font-mono mt-0.5">
                {(planRow?.monthly_credits ?? 50).toLocaleString()} credits / mo
              </p>
              {subscription?.current_period_end ? (
                <p className="text-[11px] text-gray-400 mt-2">
                  {subscription.cancel_at_period_end
                    ? `Cancels on ${formatDate(subscription.current_period_end)}`
                    : `Renews on ${formatDate(subscription.current_period_end)}`}
                </p>
              ) : null}
              {subscription?.status === 'past_due' ? (
                <p className="text-[12px] text-red-600 mt-2">
                  Last payment failed — update your card via Manage billing.
                </p>
              ) : null}
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.16em] text-gray-400 font-medium mb-1">
                Credit balance
              </p>
              <p className="text-[28px] font-medium tracking-tight text-gray-900">
                {balance.toLocaleString()}
              </p>
              <p className="text-[11px] text-gray-400 mt-1">credits remaining</p>
            </div>
          </section>

          <section className="flex flex-wrap items-center gap-2">
            <Button asChild variant="outline">
              <Link href="/pricing">Change plan</Link>
            </Button>
            {subscription?.stripe_customer_id ?? planId !== 'free' ? (
              <PortalButton />
            ) : null}
          </section>

          {Object.keys(packs).length > 0 ? (
            <section className="space-y-3">
              <h2 className="text-[15px] font-medium text-gray-900">
                Top up credits
              </h2>
              <p className="text-[12px] text-gray-500">
                One-off purchases. Top-up credits do not expire while your
                account is active.
              </p>
              <TopupForm packs={packs} />
            </section>
          ) : null}

          {/* Ledger */}
          <section className="space-y-3">
            <h2 className="text-[15px] font-medium text-gray-900">
              Recent activity
            </h2>
            {ledger.length === 0 ? (
              <p className="text-[12px] text-gray-400">
                No activity yet. Run an agent to see credits go down.
              </p>
            ) : (
              <div className="rounded-2xl border border-black/5 bg-white divide-y divide-black/5">
                {ledger.map((entry) => (
                  <div
                    key={entry.id}
                    className="px-5 py-3 flex items-center justify-between text-[13px]"
                  >
                    <div>
                      <p className="text-gray-900">{labelFor(entry.reason)}</p>
                      <p className="text-[11px] text-gray-400 font-mono">
                        {formatDateTime(entry.created_at)}
                        {entry.model ? ` · ${entry.model}` : ''}
                      </p>
                    </div>
                    <span
                      className={
                        entry.amount >= 0
                          ? 'text-emerald-600 font-mono'
                          : 'text-gray-700 font-mono'
                      }
                    >
                      {entry.amount >= 0 ? '+' : ''}
                      {entry.amount}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  )
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

function labelFor(reason: string): string {
  switch (reason) {
    case 'monthly_grant':
      return 'Monthly credits'
    case 'topup':
      return 'Credit top-up'
    case 'agent_run':
      return 'Agent run'
    case 'monthly_trim':
      return 'Rollover trim'
    case 'refund':
      return 'Refund'
    case 'admin_adjust':
      return 'Adjustment'
    default:
      return reason
  }
}

function Banner({
  kind,
  children,
}: {
  kind: 'success' | 'info'
  children: React.ReactNode
}) {
  const cls =
    kind === 'success'
      ? 'border-emerald-500/30 bg-emerald-500/5 text-emerald-700'
      : 'border-blue-500/30 bg-blue-500/5 text-blue-700'
  return (
    <div className={`rounded-xl border px-4 py-2.5 text-[13px] ${cls}`}>
      {children}
    </div>
  )
}

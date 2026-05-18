import Link from 'next/link'
import { CoinsIcon, SparklesIcon, ZapIcon } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { getBalance } from '@/lib/credits'

/**
 * Compact credit balance shown in the dashboard header. Click → billing.
 *
 * Three states:
 *  - Zero balance: red, with "Buy credits" text
 *  - Low balance (<20): amber warning
 *  - Normal: subtle pill
 *
 * Renders nothing if Supabase isn't configured (local-dev fallback).
 */
export async function CreditsPill() {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return null
  }
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const balance = await getBalance(user.id)
  const empty = balance <= 0
  const low = balance > 0 && balance < 20

  if (empty) {
    return (
      <Link
        href="/account/billing"
        aria-label="No credits remaining. Buy credits."
        className="inline-flex items-center gap-1.5 rounded-lg border border-red-500/30 bg-red-500/10 px-3 h-8 text-[12px] font-medium text-red-600 hover:bg-red-500/20 transition-all animate-pulse"
      >
        <ZapIcon className="size-3.5" />
        <span>Buy credits</span>
      </Link>
    )
  }

  if (low) {
    return (
      <Link
        href="/account/billing"
        aria-label={`${balance} credits remaining. Top up.`}
        className="inline-flex items-center gap-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 h-8 text-[12px] font-mono font-medium text-amber-700 hover:bg-amber-500/20 transition-colors"
      >
        <CoinsIcon className="size-3.5" />
        <span>{balance.toLocaleString()}</span>
        <span className="hidden md:inline text-amber-600/70">· top up</span>
      </Link>
    )
  }

  return (
    <Link
      href="/account/billing"
      aria-label={`${balance} credits remaining. Open billing.`}
      className="inline-flex items-center gap-1.5 rounded-lg border border-border/60 bg-secondary/50 px-3 h-8 text-[12px] font-mono text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
    >
      <SparklesIcon className="size-3.5" />
      <span>{balance.toLocaleString()}</span>
      <span className="hidden md:inline opacity-60">credits</span>
    </Link>
  )
}

import Link from 'next/link'
import { CoinsIcon } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { getBalance } from '@/lib/credits'

/**
 * Compact credit balance shown in the dashboard header. Click → billing.
 *
 * Renders nothing if Supabase isn't configured (local-dev fallback) or
 * the user isn't signed in — the dashboard middleware will normally
 * have redirected by the time this runs, but we double-guard.
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
  const low = balance < 20

  return (
    <Link
      href="/account/billing"
      aria-label={`${balance} credits remaining. Open billing.`}
      className={
        'inline-flex items-center gap-1.5 rounded-md border px-2.5 h-8 text-[12px] font-mono ' +
        (low
          ? 'border-red-500/30 bg-red-500/5 text-red-600 hover:bg-red-500/10'
          : 'border-black/10 bg-white text-gray-700 hover:bg-black/5') +
        ' transition-colors'
      }
    >
      <CoinsIcon className="size-3.5" />
      <span>{balance.toLocaleString()}</span>
      <span className="hidden md:inline text-gray-400">credits</span>
    </Link>
  )
}

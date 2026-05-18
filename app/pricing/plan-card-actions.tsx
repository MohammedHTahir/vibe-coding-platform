'use client'

import Link from 'next/link'
import { useActionState } from 'react'
import { Button } from '@/components/ui/button'
import { startSubscriptionCheckout } from '@/app/account/billing/actions'

interface Props {
  planId: 'free' | 'hobby' | 'pro' | 'team'
  cta: string
}

const initial: { error?: string } = {}

/**
 * Plan card CTA. Free routes to /signup; paid plans submit a server action
 * that creates a Stripe Checkout session and redirects.
 */
export function PlanCardActions({ planId, cta }: Props) {
  const [state, action, pending] = useActionState(
    startSubscriptionCheckout,
    initial
  )

  if (planId === 'free') {
    return (
      <Button asChild className="w-full bg-blue-500 hover:bg-blue-600">
        <Link href="/signup">{cta}</Link>
      </Button>
    )
  }

  return (
    <form action={action} className="space-y-2">
      <input type="hidden" name="plan" value={planId} />
      <Button
        type="submit"
        className="w-full bg-blue-500 hover:bg-blue-600"
        disabled={pending}
      >
        {pending ? 'Redirecting…' : cta}
      </Button>
      {state.error ? (
        <p className="text-[11px] text-red-600">{state.error}</p>
      ) : null}
    </form>
  )
}

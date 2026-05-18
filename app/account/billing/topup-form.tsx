'use client'

import { useActionState } from 'react'
import { Button } from '@/components/ui/button'
import { startTopupCheckout } from './actions'

interface Props {
  packs: Record<string, number>
}

const initial: { error?: string } = {}

/**
 * Renders one button per configured top-up Price. The user picks a pack
 * and we hand off to Stripe Checkout for the rest.
 */
export function TopupForm({ packs }: Props) {
  const [state, action, pending] = useActionState(startTopupCheckout, initial)
  const entries = Object.entries(packs).sort(([, a], [, b]) => a - b)

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {entries.map(([priceId, credits]) => (
          <form key={priceId} action={action}>
            <input type="hidden" name="price" value={priceId} />
            <Button type="submit" variant="outline" disabled={pending}>
              +{credits.toLocaleString()} credits
            </Button>
          </form>
        ))}
      </div>
      {state.error ? (
        <p className="text-[11px] text-red-600">{state.error}</p>
      ) : null}
    </div>
  )
}

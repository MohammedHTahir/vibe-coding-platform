'use client'

import { useActionState } from 'react'
import { Button } from '@/components/ui/button'
import { openCustomerPortal } from './actions'

const initial: { error?: string } = {}

export function PortalButton() {
  const [state, action, pending] = useActionState(openCustomerPortal, initial)
  return (
    <form action={action}>
      <Button type="submit" variant="outline" disabled={pending}>
        {pending ? 'Opening Stripe…' : 'Manage billing'}
      </Button>
      {state.error ? (
        <span className="text-[11px] text-red-600 ml-2">{state.error}</span>
      ) : null}
    </form>
  )
}

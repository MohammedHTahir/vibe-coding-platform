'use client'

import Link from 'next/link'
import { ZapIcon, ArrowRightIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'

/**
 * Inline banner shown at the top of the chat when balance is 0.
 * Uses client-side state so it can be dismissed or shown reactively
 * when a 402 comes back from the chat route.
 */
export function CreditsBanner({ balance }: { balance: number }) {
  if (balance > 0) return null

  return (
    <div className="mx-2 mt-2 rounded-xl border border-red-500/20 bg-gradient-to-r from-red-500/5 via-orange-500/5 to-amber-500/5 p-4">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5 w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
          <ZapIcon className="size-4 text-red-500" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-[14px] font-medium text-foreground">
            You&apos;re out of credits
          </h3>
          <p className="text-[12px] text-muted-foreground mt-0.5 leading-relaxed">
            Purchase credits to keep building. Your projects and files are safe
            — they&apos;ll be here when you come back.
          </p>
          <div className="flex flex-wrap items-center gap-2 mt-3">
            <Button
              asChild
              size="sm"
              className="h-8 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white border-0 shadow-sm"
            >
              <Link href="/account/billing">
                Buy credits
                <ArrowRightIcon className="size-3.5 ml-1" />
              </Link>
            </Button>
            <Button asChild size="sm" variant="ghost" className="h-8 text-muted-foreground">
              <Link href="/pricing">View plans</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

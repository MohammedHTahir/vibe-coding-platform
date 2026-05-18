import Link from 'next/link'
import type { Metadata } from 'next'
import { CheckIcon } from 'lucide-react'
import { SprintBuildWordmark } from '@/components/marketing/logo'
import { Footer } from '@/components/marketing/footer'
import { PlanCardActions } from './plan-card-actions'

export const metadata: Metadata = {
  title: 'Pricing',
  description: 'Pick a credit subscription that matches how you build.',
}

interface PlanRow {
  id: 'free' | 'hobby' | 'pro' | 'team'
  name: string
  priceLabel: string
  cadence: string
  credits: string
  highlight?: boolean
  features: string[]
  cta: string
}

const PLANS: PlanRow[] = [
  {
    id: 'free',
    name: 'Free',
    priceLabel: '$0',
    cadence: 'forever',
    credits: '50 credits / month',
    features: [
      'All frontier models',
      'Live sandbox preview',
      'Public projects',
      'Community support',
    ],
    cta: 'Start free',
  },
  {
    id: 'hobby',
    name: 'Hobby',
    priceLabel: '$20',
    cadence: 'per month',
    credits: '1,000 credits / month',
    features: [
      'Everything in Free',
      'Top up credits any time',
      'Email support',
    ],
    cta: 'Choose Hobby',
  },
  {
    id: 'pro',
    name: 'Pro',
    priceLabel: '$50',
    cadence: 'per month',
    credits: '3,000 credits / month',
    highlight: true,
    features: [
      'Priority queue on busy days',
      'Unlimited projects',
      'Faster sandbox spin-up',
    ],
    cta: 'Choose Pro',
  },
  {
    id: 'team',
    name: 'Team',
    priceLabel: '$200',
    cadence: 'per month',
    credits: '15,000 pooled credits / month',
    features: [
      'Shared workspace',
      'Admin role and seat management',
      'Priority support',
    ],
    cta: 'Choose Team',
  },
]

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-[#f0f0ee] flex flex-col">
      <header className="px-6 sm:px-12 md:px-20 lg:px-28 pt-6 flex items-center justify-between">
        <Link href="/" aria-label="SprintBuild home">
          <SprintBuildWordmark size="md" />
        </Link>
        <nav className="hidden sm:flex items-center gap-6 text-[12px] text-gray-500">
          <Link href="/" className="hover:text-gray-900 transition-colors">
            Home
          </Link>
          <Link href="/blog" className="hover:text-gray-900 transition-colors">
            Blog
          </Link>
          <Link href="/login" className="hover:text-gray-900 transition-colors">
            Sign in
          </Link>
        </nav>
      </header>

      <section className="px-6 sm:px-12 md:px-20 lg:px-28 py-14 sm:py-20">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-[12px] uppercase tracking-[0.18em] text-blue-500 font-medium mb-3">
            Pricing
          </p>
          <h1 className="text-3xl sm:text-4xl font-medium tracking-tight text-gray-900 mb-3">
            Credits that scale with what you ship
          </h1>
          <p className="text-[14px] text-gray-500 max-w-xl mx-auto">
            Every plan includes the same models and the same sandbox.
            Upgrade for more headroom and a faster queue.
          </p>
        </div>
      </section>

      <section className="flex-1 px-6 sm:px-12 md:px-20 lg:px-28 pb-20">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={
                'flex flex-col rounded-2xl border bg-white p-6 ' +
                (plan.highlight
                  ? 'border-blue-500/40 shadow-[0_0_0_1px_rgb(59_130_246_/_0.15)]'
                  : 'border-black/5')
              }
            >
              <div className="flex items-baseline justify-between">
                <h2 className="text-[15px] font-medium tracking-tight text-gray-900">
                  {plan.name}
                </h2>
                {plan.highlight ? (
                  <span className="text-[10px] uppercase tracking-[0.16em] text-blue-500 font-medium">
                    Most popular
                  </span>
                ) : null}
              </div>

              <div className="mt-3">
                <span className="text-3xl font-medium tracking-tight text-gray-900">
                  {plan.priceLabel}
                </span>
                <span className="text-[12px] text-gray-400 ml-1">
                  {plan.cadence}
                </span>
              </div>
              <p className="text-[12px] text-gray-500 font-mono mt-1">
                {plan.credits}
              </p>

              <ul className="mt-5 space-y-2 text-[13px] text-gray-600">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <CheckIcon className="size-3.5 mt-0.5 text-blue-500 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6 pt-5 border-t border-black/5 mt-auto">
                <PlanCardActions planId={plan.id} cta={plan.cta} />
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-[12px] text-gray-400 mt-10 max-w-xl mx-auto">
          Credits buy agent runs across all four models. Heavier models like
          Claude Opus consume more credits per turn. Unused paid credits roll
          over up to 2× your monthly grant.
        </p>
      </section>

      <Footer />
    </main>
  )
}

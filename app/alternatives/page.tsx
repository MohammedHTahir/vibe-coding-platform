import Link from 'next/link'
import type { Metadata } from 'next'
import { ArrowRightIcon } from 'lucide-react'

import { Footer } from '@/components/marketing/footer'
import { MarketingNav } from '@/components/marketing/nav'
import { listCompetitors } from '@/lib/competitors'
import { JsonLd, breadcrumbLd } from '@/lib/jsonld'
import { absoluteUrl, BRAND_NAME } from '@/lib/site'

const PATH = '/alternatives'

export const metadata: Metadata = {
  title: `AI coding platform alternatives`,
  description: `Outgrown your current AI app builder? Browse alternatives \u2014 comparisons against Lovable, Bolt.new, v0, Replit Agent, and Base44.`,
  alternates: { canonical: PATH },
  openGraph: {
    title: 'AI coding platform alternatives',
    description: 'Browse AI coding platform alternatives \u2014 honest comparisons with sources cited.',
    url: absoluteUrl(PATH),
    type: 'website',
  },
}

export default function AlternativesHubPage() {
  const competitors = listCompetitors()

  return (
    <main className="min-h-screen bg-[#f0f0ee] flex flex-col">
      <JsonLd
        data={breadcrumbLd([
          { name: 'Home', path: '/' },
          { name: 'Alternatives', path: PATH },
        ])}
        id="alternatives-hub"
      />

      <MarketingNav user={null} />

      <section className="px-6 sm:px-12 md:px-20 lg:px-28 pt-10 sm:pt-14 pb-10">
        <div className="max-w-3xl mx-auto">
          <p className="text-[12px] uppercase tracking-[0.18em] text-blue-500 font-medium mb-3">
            Alternatives
          </p>
          <h1 className="text-3xl sm:text-4xl font-medium tracking-tight text-gray-900 mb-3">
            AI coding platform alternatives
          </h1>
          <p className="text-[14px] text-gray-500 max-w-xl leading-relaxed">
            If your current AI app builder is hitting a runtime ceiling, locking
            you into one model, or surprising you on the bill, here&apos;s what
            to look at next. Each page leads with what the incumbent does
            well \u2014 fair fight first.
          </p>
        </div>
      </section>

      <section className="flex-1 px-6 sm:px-12 md:px-20 lg:px-28 pb-20">
        <ul className="max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-3">
          {competitors.map((competitor) => (
            <li key={competitor.slug}>
              <Link
                href={`/alternatives/${competitor.slug}`}
                className="block rounded-2xl border border-black/5 bg-white p-5 hover:bg-white/80 transition-colors"
              >
                <p className="text-[12px] text-gray-400 font-mono mb-1">
                  Alternatives
                </p>
                <p className="text-[15px] font-medium text-gray-900">
                  {competitor.name} alternative
                </p>
                <p className="text-[12px] text-gray-500 mt-1 leading-relaxed">
                  Why teams move from {competitor.name} to {BRAND_NAME}.
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-[12px] text-blue-500 font-medium">
                  Read more
                  <ArrowRightIcon className="size-3" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <Footer />
    </main>
  )
}

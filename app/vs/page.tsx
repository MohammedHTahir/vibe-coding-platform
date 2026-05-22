import Link from 'next/link'
import type { Metadata } from 'next'
import { ArrowRightIcon } from 'lucide-react'

import { Footer } from '@/components/marketing/footer'
import { MarketingNav } from '@/components/marketing/nav'
import { listCompetitors } from '@/lib/competitors'
import { JsonLd, breadcrumbLd } from '@/lib/jsonld'
import { absoluteUrl, BRAND_NAME } from '@/lib/site'

const PATH = '/vs'

export const metadata: Metadata = {
  title: `${BRAND_NAME} vs the rest`,
  description: `Side-by-side comparisons of ${BRAND_NAME} against every major AI coding platform. Execution model, supported models, pricing, and feature-by-feature tables.`,
  alternates: { canonical: PATH },
  openGraph: {
    title: `${BRAND_NAME} vs the rest`,
    description: `Side-by-side comparisons of ${BRAND_NAME} against every major AI coding platform.`,
    url: absoluteUrl(PATH),
    type: 'website',
  },
}

export default function VsHubPage() {
  const competitors = listCompetitors()

  return (
    <main className="min-h-screen bg-[#f0f0ee] flex flex-col">
      <JsonLd
        data={breadcrumbLd([
          { name: 'Home', path: '/' },
          { name: 'Comparisons', path: PATH },
        ])}
        id="vs-hub"
      />

      <MarketingNav user={null} />

      <section className="px-6 sm:px-12 md:px-20 lg:px-28 pt-10 sm:pt-14 pb-10">
        <div className="max-w-3xl mx-auto">
          <p className="text-[12px] uppercase tracking-[0.18em] text-blue-500 font-medium mb-3">
            Comparisons
          </p>
          <h1 className="text-3xl sm:text-4xl font-medium tracking-tight text-gray-900 mb-3">
            {BRAND_NAME} vs the rest
          </h1>
          <p className="text-[14px] text-gray-500 max-w-xl leading-relaxed">
            Honest, side-by-side comparisons. Each one is verified against the
            other vendor&apos;s public docs and pricing page within the last 30
            days, with sources at the bottom.
          </p>
        </div>
      </section>

      <section className="flex-1 px-6 sm:px-12 md:px-20 lg:px-28 pb-20">
        <ul className="max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-3">
          {competitors.map((competitor) => (
            <li key={competitor.slug}>
              <Link
                href={`/vs/${competitor.slug}`}
                className="block rounded-2xl border border-black/5 bg-white p-5 hover:bg-white/80 transition-colors"
              >
                <p className="text-[12px] text-gray-400 font-mono mb-1">
                  Comparison
                </p>
                <p className="text-[15px] font-medium text-gray-900">
                  {BRAND_NAME} vs {competitor.name}
                </p>
                <p className="text-[12px] text-gray-500 mt-1 leading-relaxed">
                  {competitor.category}
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-[12px] text-blue-500 font-medium">
                  Read comparison
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

import Link from 'next/link'
import { ArrowRightIcon } from 'lucide-react'
import { listCompetitors } from '@/lib/competitors'
import { BRAND_NAME } from '@/lib/site'

/**
 * Home-page comparison strip. Surface every `/vs/[competitor]` route
 * one click from the landing page so search engines (and humans
 * comparing tools) land on the right page fast.
 */
export function CompareStrip() {
  const competitors = listCompetitors()
  return (
    <section
      id="compare"
      className="px-6 sm:px-12 md:px-20 lg:px-28 py-20 sm:py-24 bg-[#f0f0ee] border-t border-black/5"
    >
      <div className="max-w-5xl mx-auto">
        <p className="text-[12px] uppercase tracking-[0.18em] text-blue-500 font-medium mb-3">
          Comparisons
        </p>
        <h2 className="text-3xl sm:text-4xl font-medium tracking-tight text-gray-900 mb-4">
          {BRAND_NAME} vs the rest.
        </h2>
        <p className="text-[14px] text-gray-500 max-w-xl mb-10">
          Honest side-by-side comparisons against every major AI coding
          platform. Verified against each vendor&apos;s public docs.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {competitors.map((competitor) => (
            <Link
              key={competitor.slug}
              href={`/vs/${competitor.slug}`}
              className="group rounded-2xl border border-black/5 bg-white hover:bg-white/80 transition-colors p-5 flex flex-col"
            >
              <p className="text-[11px] uppercase tracking-[0.16em] text-gray-400 font-mono mb-2">
                Comparison
              </p>
              <p className="text-[15px] font-medium text-gray-900 mb-1">
                {BRAND_NAME} vs {competitor.name}
              </p>
              <p className="text-[12px] text-gray-500 leading-relaxed flex-1">
                {competitor.category}
              </p>
              <span className="mt-4 inline-flex items-center gap-1 text-[12px] font-medium text-blue-500">
                Read it
                <ArrowRightIcon className="size-3 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

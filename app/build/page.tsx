import Link from 'next/link'
import type { Metadata } from 'next'
import { ArrowRightIcon } from 'lucide-react'

import { Footer } from '@/components/marketing/footer'
import { MarketingNav } from '@/components/marketing/nav'
import { listUseCases } from '@/lib/use-cases'
import { JsonLd, breadcrumbLd } from '@/lib/jsonld'
import { absoluteUrl, BRAND_NAME } from '@/lib/site'

const PATH = '/build'

export const metadata: Metadata = {
  title: `What ${BRAND_NAME} builds`,
  description: `From SaaS apps and dashboards to internal tools and CRUD apps \u2014 see what ${BRAND_NAME} ships from a single prompt, and grab a starter prompt for each.`,
  alternates: { canonical: PATH },
  openGraph: {
    title: `What ${BRAND_NAME} builds`,
    description: `Use cases for ${BRAND_NAME} \u2014 ship SaaS, dashboards, internal tools, landing pages, MVPs, and CRUD apps from a prompt.`,
    url: absoluteUrl(PATH),
    type: 'website',
  },
}

export default function BuildHubPage() {
  const useCases = listUseCases()

  return (
    <main className="min-h-screen bg-[#f0f0ee] flex flex-col">
      <JsonLd
        data={breadcrumbLd([
          { name: 'Home', path: '/' },
          { name: 'Use cases', path: PATH },
        ])}
        id="build-hub"
      />

      <MarketingNav user={null} />

      <section className="px-6 sm:px-12 md:px-20 lg:px-28 pt-10 sm:pt-14 pb-10">
        <div className="max-w-3xl mx-auto">
          <p className="text-[12px] uppercase tracking-[0.18em] text-blue-500 font-medium mb-3">
            Use cases
          </p>
          <h1 className="text-3xl sm:text-4xl font-medium tracking-tight text-gray-900 mb-3">
            What {BRAND_NAME} builds from a prompt
          </h1>
          <p className="text-[14px] text-gray-500 max-w-xl leading-relaxed">
            Each page below covers what the agent ships, the default stack, a
            starter prompt you can paste, and the kind of builder it&apos;s
            for.
          </p>
        </div>
      </section>

      <section className="flex-1 px-6 sm:px-12 md:px-20 lg:px-28 pb-20">
        <ul className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-3">
          {useCases.map((useCase) => (
            <li key={useCase.slug}>
              <Link
                href={`/build/${useCase.slug}`}
                className="block rounded-2xl border border-black/5 bg-white p-5 hover:bg-white/80 transition-colors"
              >
                <p className="text-[12px] text-gray-400 font-mono mb-1">
                  Use case
                </p>
                <p className="text-[15px] font-medium text-gray-900">
                  {useCase.title}
                </p>
                <p className="text-[12px] text-gray-500 mt-1 leading-relaxed">
                  {useCase.metaDescription}
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-[12px] text-blue-500 font-medium">
                  See what ships
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

import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ArrowRightIcon, CheckIcon } from 'lucide-react'

import { Footer } from '@/components/marketing/footer'
import { MarketingNav } from '@/components/marketing/nav'
import { Button } from '@/components/ui/button'
import {
  getUseCase,
  listUseCaseSlugs,
  listUseCases,
} from '@/lib/use-cases'
import { JsonLd, blogPostingLd, breadcrumbLd, faqPageLd } from '@/lib/jsonld'
import { absoluteUrl, BRAND_NAME, FOUNDER } from '@/lib/site'

interface PageProps {
  params: Promise<{ type: string }>
}

export function generateStaticParams() {
  return listUseCaseSlugs().map((type) => ({ type }))
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { type } = await params
  const useCase = getUseCase(type)
  if (!useCase) return {}

  const path = `/build/${useCase.slug}`

  return {
    title: useCase.title,
    description: useCase.metaDescription,
    alternates: { canonical: path },
    openGraph: {
      title: useCase.title,
      description: useCase.metaDescription,
      url: absoluteUrl(path),
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: useCase.title,
      description: useCase.metaDescription,
    },
    keywords: [useCase.primaryKeyword, ...useCase.secondaryKeywords],
  }
}

const PUBLISHED_AT = '2026-05-23'

export default async function BuildUseCasePage({ params }: PageProps) {
  const { type } = await params
  const useCase = getUseCase(type)
  if (!useCase) notFound()

  const path = `/build/${useCase.slug}`
  const others = listUseCases().filter((u) => u.slug !== useCase.slug)

  const faqs: Array<{ q: string; a: string }> = [
    {
      q: `Can ${BRAND_NAME} really ${useCase.title.toLowerCase()} from a single prompt?`,
      a: `Yes. ${BRAND_NAME} runs every session in a real Vercel Sandbox, so the agent can install dependencies, run scripts, and start a dev server like it would on any production box. The first prompt scaffolds the project; follow-up prompts iterate on it.`,
    },
    {
      q: `What stack does the agent use to ${useCase.primaryKeyword}?`,
      a: `Default stack: ${useCase.stack.join(', ')}. The agent can swap any layer if your prompt asks for it \u2014 different ORM, different host, different auth provider.`,
    },
    {
      q: `How long does it take to ship?`,
      a: `For a typical ${useCase.title.toLowerCase()} prompt, you\u2019ll see a running app within a few minutes and a polished version after 2\u20133 prompt iterations. Heavy customisations and integrations take longer; the credit system charges per agent turn so you only pay for the actual work.`,
    },
    {
      q: `Can I export the code?`,
      a: `Yes. ${BRAND_NAME} keeps the full source visible in the file explorer during every session. You can browse, copy, and download files; native GitHub push is on the roadmap.`,
    },
  ]

  return (
    <main className="min-h-screen bg-[#f0f0ee] flex flex-col">
      <JsonLd
        data={[
          breadcrumbLd([
            { name: 'Home', path: '/' },
            { name: 'Use cases', path: '/build' },
            { name: useCase.title, path },
          ]),
          blogPostingLd({
            title: useCase.title,
            description: useCase.metaDescription,
            slug: `build/${useCase.slug}`,
            datePublished: PUBLISHED_AT,
            authorName: FOUNDER.name,
            tags: [useCase.primaryKeyword, ...useCase.secondaryKeywords],
          }),
          faqPageLd(faqs),
        ]}
        id={`build-${useCase.slug}`}
      />

      <MarketingNav user={null} />

      <section className="px-6 sm:px-12 md:px-20 lg:px-28 pt-10 sm:pt-14 pb-10">
        <div className="max-w-4xl mx-auto">
          <p className="text-[12px] uppercase tracking-[0.18em] text-blue-500 font-medium mb-3">
            Use case
          </p>
          <h1 className="text-3xl sm:text-[2.5rem] leading-[1.1] font-medium tracking-tight text-gray-900 mb-4">
            {useCase.heading}
          </h1>
          <p className="text-[15px] text-gray-600 max-w-2xl leading-relaxed mb-8">
            {useCase.subhead}
          </p>
          <Button asChild className="bg-blue-500 hover:bg-blue-600">
            <Link href="/signup">
              Start building free
              <ArrowRightIcon className="w-3.5 h-3.5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* What you ship */}
      <section className="px-6 sm:px-12 md:px-20 lg:px-28 pb-10">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-[22px] sm:text-[26px] font-medium tracking-tight text-gray-900 mb-6">
            What you ship in one session
          </h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {useCase.whatYouShip.map((item) => (
              <li
                key={item}
                className="rounded-2xl border border-black/5 bg-white p-5 flex items-start gap-3"
              >
                <CheckIcon className="size-4 mt-0.5 text-blue-500 flex-shrink-0" />
                <span className="text-[14px] text-gray-700 leading-relaxed">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Prompt template */}
      <section className="px-6 sm:px-12 md:px-20 lg:px-28 pb-10">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-[22px] sm:text-[26px] font-medium tracking-tight text-gray-900 mb-3">
            Starter prompt
          </h2>
          <p className="text-[14px] text-gray-500 mb-5 max-w-2xl leading-relaxed">
            Paste this into a fresh {BRAND_NAME} session and replace the
            bracketed values. The agent will scaffold the project and start
            shipping.
          </p>
          <pre className="rounded-2xl border border-black/5 bg-white p-6 overflow-x-auto text-[13px] leading-7 font-mono text-gray-900 whitespace-pre-wrap">
{useCase.promptTemplate}
          </pre>
        </div>
      </section>

      {/* Stack and audience */}
      <section className="px-6 sm:px-12 md:px-20 lg:px-28 pb-10">
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-black/5 bg-white p-6">
            <h3 className="text-[15px] font-medium text-gray-900 mb-3">
              Default stack
            </h3>
            <ul className="space-y-2">
              {useCase.stack.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2 text-[13px] text-gray-700"
                >
                  <CheckIcon className="size-3.5 mt-1 text-blue-500 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-[12px] text-gray-500 mt-4 leading-relaxed">
              The agent can swap any layer based on your prompt \u2014 different
              ORM, different host, different auth provider.
            </p>
          </div>
          <div className="rounded-2xl border border-black/5 bg-white p-6">
            <h3 className="text-[15px] font-medium text-gray-900 mb-3">
              Who this is for
            </h3>
            <p className="text-[13px] text-gray-700 leading-relaxed">
              {useCase.whoFor}
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 sm:px-12 md:px-20 lg:px-28 pb-10">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-[22px] sm:text-[26px] font-medium tracking-tight text-gray-900 mb-6">
            Frequently asked questions
          </h2>
          <div className="space-y-3">
            {faqs.map((item) => (
              <details
                key={item.q}
                className="group rounded-2xl border border-black/5 bg-white p-5 open:bg-white"
              >
                <summary className="cursor-pointer list-none flex items-center justify-between text-[14px] font-medium text-gray-900">
                  {item.q}
                  <span className="ml-4 text-blue-500 transition-transform duration-200 group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-[13px] text-gray-600 leading-relaxed">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Related use cases */}
      <section className="px-6 sm:px-12 md:px-20 lg:px-28 pb-10">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-[22px] sm:text-[26px] font-medium tracking-tight text-gray-900 mb-6">
            Other things {BRAND_NAME} ships from a prompt
          </h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {others.map((other) => (
              <li key={other.slug}>
                <Link
                  href={`/build/${other.slug}`}
                  className="block rounded-2xl border border-black/5 bg-white p-5 hover:bg-white/70 transition-colors"
                >
                  <p className="text-[12px] text-gray-400 font-mono mb-1">
                    Use case
                  </p>
                  <p className="text-[15px] font-medium text-gray-900">
                    {other.title}
                  </p>
                  <p className="text-[12px] text-gray-500 mt-1">
                    {other.metaDescription}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-6 sm:px-12 md:px-20 lg:px-28 pb-20">
        <div className="max-w-4xl mx-auto rounded-3xl border border-black/5 bg-white p-10 sm:p-14 text-center">
          <h2 className="text-2xl sm:text-3xl font-medium tracking-tight text-gray-900 mb-3">
            Ready to ship your {useCase.primaryKeyword.split(' ').slice(-2).join(' ')}?
          </h2>
          <p className="text-[14px] text-gray-500 max-w-xl mx-auto mb-8">
            Start with the prompt above. Watch the agent ship a running app
            inside a real sandbox. Iterate until you like it.
          </p>
          <Button asChild className="bg-blue-500 hover:bg-blue-600">
            <Link href="/signup">
              Start building free
              <ArrowRightIcon className="w-3.5 h-3.5" />
            </Link>
          </Button>
        </div>
      </section>

      <Footer />
    </main>
  )
}

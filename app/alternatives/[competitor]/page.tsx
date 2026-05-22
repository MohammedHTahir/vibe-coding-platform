import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ArrowRightIcon, CheckIcon } from 'lucide-react'

import { Footer } from '@/components/marketing/footer'
import { MarketingNav } from '@/components/marketing/nav'
import { Button } from '@/components/ui/button'
import { ComparisonTable } from '@/components/seo/comparison-table'
import {
  getCompetitor,
  listCompetitorSlugs,
  listCompetitors,
} from '@/lib/competitors'
import { JsonLd, blogPostingLd, breadcrumbLd, faqPageLd } from '@/lib/jsonld'
import { absoluteUrl, BRAND_NAME, FOUNDER } from '@/lib/site'

interface PageProps {
  params: Promise<{ competitor: string }>
}

export function generateStaticParams() {
  return listCompetitorSlugs().map((competitor) => ({ competitor }))
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { competitor: slug } = await params
  const competitor = getCompetitor(slug)
  if (!competitor) return {}

  const title = `${competitor.name} alternative: ${BRAND_NAME}`
  const description = `Looking for a ${competitor.name} alternative? Here's why teams move to ${BRAND_NAME} \u2014 a real cloud sandbox per session, multi-model access (Claude, GPT, Grok), and credit-based pricing without surprises.`
  const path = `/alternatives/${competitor.slug}`

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: `The best ${competitor.name} alternative for AI coding`,
      description,
      url: absoluteUrl(path),
      type: 'article',
      publishedTime: `${competitor.lastVerified}T00:00:00Z`,
    },
    twitter: {
      card: 'summary_large_image',
      title: `The best ${competitor.name} alternative for AI coding`,
      description,
    },
    keywords: [
      `${competitor.name.toLowerCase()} alternative`,
      `${competitor.name.toLowerCase()} alternatives`,
      `${BRAND_NAME.toLowerCase()} vs ${competitor.name.toLowerCase()}`,
      'ai coding platform',
      'ai app generator',
    ],
  }
}

export default async function AlternativesPage({ params }: PageProps) {
  const { competitor: slug } = await params
  const competitor = getCompetitor(slug)
  if (!competitor) notFound()

  const path = `/alternatives/${competitor.slug}`
  const otherCompetitors = listCompetitors().filter(
    (c) => c.slug !== competitor.slug
  )

  const switchReasons: Array<{ title: string; body: string }> = [
    {
      title: 'You\u2019ve hit the runtime ceiling',
      body: `${competitor.name}\u2019s ${describeRuntime(competitor.executionModel)} works for prototypes, but real apps eventually need a real Linux box \u2014 native dependencies, background workers, custom ports, the works. ${BRAND_NAME} runs every session in a full Vercel Sandbox so you never have to walk that back.`,
    },
    {
      title: 'You want to switch models per turn',
      body: `${competitor.name} typically runs ${competitor.models.slice(0, 2).join(' or ')}. With ${BRAND_NAME} you pick between Claude Opus 4.6, Claude Sonnet 4.6, GPT-5.3 Codex, and Grok 4.1 Reasoning per turn through the Vercel AI Gateway \u2014 the right model for the job, not just whichever one the vendor wired up.`,
    },
    {
      title: 'Pricing should be predictable',
      body: `${BRAND_NAME} is credit-based with rollover (up to 2&times; your monthly grant) and the same models on every tier. ${competitor.name} pricing: ${competitor.pricing.display}. Pricing model: ${competitor.pricing.model}`,
    },
    {
      title: 'You don\u2019t want to fight the host',
      body: `${competitor.name} \u2014 like most AI app builders \u2014 nudges you toward its own deploy target. ${BRAND_NAME} is built on Next.js with a real source tree, so the same code runs on Vercel, Netlify, or your own box without translation.`,
    },
  ]

  const faqs: Array<{ q: string; a: string }> = [
    {
      q: `What's the best ${competitor.name} alternative in ${new Date().getFullYear()}?`,
      a: `${BRAND_NAME} is a strong ${competitor.name} alternative if you want a real Linux sandbox per session, the ability to switch between Claude, GPT, and Grok per turn, and predictable credit pricing. Other platforms worth checking out: ${otherCompetitors.map((c) => c.name).join(', ')}.`,
    },
    {
      q: `Why would I switch from ${competitor.name} to ${BRAND_NAME}?`,
      a: `Most teams switch for one of three reasons: they hit the runtime ceiling of ${describeRuntime(competitor.executionModel)}, they want per-turn model choice, or they want pricing that doesn\u2019t cap them on daily limits. ${BRAND_NAME} addresses all three.`,
    },
    {
      q: `Is ${BRAND_NAME} cheaper than ${competitor.name}?`,
      a: `Pricing isn\u2019t apples-to-apples because the credit models differ. ${BRAND_NAME} starts at $20/month for 1,000 credits with all models on every tier. ${competitor.name}: ${competitor.pricing.display}. The right comparison is per-build, not per-month \u2014 if you build heavy with frontier models, ${BRAND_NAME} usually comes in cheaper.`,
    },
    {
      q: `Can I import an existing project from ${competitor.name}?`,
      a: `Yes \u2014 if you\u2019ve exported your code to GitHub from ${competitor.name}, you can paste the source into a ${BRAND_NAME} session and the agent will pick up from there. Native GitHub import is on the roadmap.`,
    },
  ]

  const lastVerifiedHuman = new Date(competitor.lastVerified).toLocaleDateString(
    'en-US',
    { month: 'long', day: 'numeric', year: 'numeric' }
  )

  return (
    <main className="min-h-screen bg-[#f0f0ee] flex flex-col">
      <JsonLd
        data={[
          breadcrumbLd([
            { name: 'Home', path: '/' },
            { name: 'Alternatives', path: '/alternatives' },
            { name: `${competitor.name} alternative`, path },
          ]),
          blogPostingLd({
            title: `${competitor.name} alternative: ${BRAND_NAME}`,
            description: `Why teams move from ${competitor.name} to ${BRAND_NAME} for AI coding.`,
            slug: `alternatives/${competitor.slug}`,
            datePublished: competitor.lastVerified,
            authorName: FOUNDER.name,
            tags: [
              `${competitor.name} alternative`,
              `${BRAND_NAME} vs ${competitor.name}`,
              'ai coding platform',
            ],
          }),
          faqPageLd(faqs),
        ]}
        id={`alt-${competitor.slug}`}
      />

      <MarketingNav user={null} />

      <section className="px-6 sm:px-12 md:px-20 lg:px-28 pt-10 sm:pt-14 pb-8">
        <div className="max-w-4xl mx-auto">
          <p className="text-[12px] uppercase tracking-[0.18em] text-blue-500 font-medium mb-3">
            {competitor.name} alternative
          </p>
          <h1 className="text-3xl sm:text-[2.5rem] leading-[1.1] font-medium tracking-tight text-gray-900 mb-4">
            Looking for a {competitor.name} alternative? Here&apos;s why teams
            move to {BRAND_NAME}.
          </h1>
          <p className="text-[15px] text-gray-600 max-w-2xl leading-relaxed">
            {competitor.name} is{' '}
            {competitor.strengths[0]?.toLowerCase() ?? 'a popular AI app builder'}.
            But once your build needs a real Linux sandbox, model choice per
            turn, and pricing that doesn&apos;t cap your daily output,{' '}
            {BRAND_NAME} is the place to land.
          </p>
          <p className="text-[12px] text-gray-400 font-mono mt-4">
            Last verified: {lastVerifiedHuman}
          </p>
        </div>
      </section>

      {/* What competitor does well — even-handed lead */}
      <section className="px-6 sm:px-12 md:px-20 lg:px-28 pb-10">
        <div className="max-w-4xl mx-auto rounded-2xl border border-black/5 bg-white p-6 sm:p-8">
          <h2 className="text-[18px] font-medium tracking-tight text-gray-900 mb-3">
            What {competitor.name} does well
          </h2>
          <ul className="space-y-2">
            {competitor.strengths.map((strength) => (
              <li
                key={strength}
                className="flex items-start gap-2 text-[13.5px] text-gray-700"
              >
                <CheckIcon className="size-3.5 mt-1 text-blue-500 flex-shrink-0" />
                <span>{strength}</span>
              </li>
            ))}
          </ul>
          <p className="text-[13px] text-gray-500 mt-4 leading-relaxed">
            If those four bullets describe what you actually need, stay on{' '}
            {competitor.name}. The rest of this page is for builders who&apos;ve
            outgrown them.
          </p>
        </div>
      </section>

      {/* Reasons to switch */}
      <section className="px-6 sm:px-12 md:px-20 lg:px-28 pb-10">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-[22px] sm:text-[26px] font-medium tracking-tight text-gray-900 mb-6">
            Four reasons builders switch to {BRAND_NAME}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {switchReasons.map((reason) => (
              <div
                key={reason.title}
                className="rounded-2xl border border-black/5 bg-white p-6"
              >
                <h3 className="text-[15px] font-medium text-gray-900 mb-2">
                  {reason.title}
                </h3>
                <p className="text-[13px] text-gray-600 leading-relaxed">
                  {reason.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison table */}
      <section className="px-6 sm:px-12 md:px-20 lg:px-28 pb-10">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-[22px] sm:text-[26px] font-medium tracking-tight text-gray-900 mb-3">
            {BRAND_NAME} vs {competitor.name}: feature snapshot
          </h2>
          <p className="text-[14px] text-gray-500 mb-6">
            Want the long version?{' '}
            <Link
              href={`/vs/${competitor.slug}`}
              className="text-blue-500 hover:text-blue-600 transition-colors"
            >
              Open the full comparison
            </Link>
            .
          </p>
          <ComparisonTable competitor={competitor} />
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

      {/* Other alternatives */}
      <section className="px-6 sm:px-12 md:px-20 lg:px-28 pb-10">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-[22px] sm:text-[26px] font-medium tracking-tight text-gray-900 mb-6">
            Other AI coding platforms worth comparing
          </h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {otherCompetitors.map((other) => (
              <li key={other.slug}>
                <Link
                  href={`/alternatives/${other.slug}`}
                  className="block rounded-2xl border border-black/5 bg-white p-5 hover:bg-white/70 transition-colors"
                >
                  <p className="text-[12px] text-gray-400 font-mono mb-1">
                    Alternatives
                  </p>
                  <p className="text-[15px] font-medium text-gray-900">
                    {other.name} alternative
                  </p>
                  <p className="text-[12px] text-gray-500 mt-1">
                    {other.category}
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
            Build the same prompt on {BRAND_NAME} and decide for yourself.
          </h2>
          <p className="text-[14px] text-gray-500 max-w-xl mx-auto mb-8">
            Free tier, all models, real sandbox. No daily caps, no surprises.
          </p>
          <Button asChild className="bg-blue-500 hover:bg-blue-600">
            <Link href="/signup">
              Start free
              <ArrowRightIcon className="w-3.5 h-3.5" />
            </Link>
          </Button>
        </div>
      </section>

      <Footer />
    </main>
  )
}

function describeRuntime(model: string): string {
  switch (model) {
    case 'browser_webcontainer':
      return 'browser-tab WebContainer'
    case 'cloud_sandbox':
      return 'cloud sandbox'
    case 'hosted_runtime':
      return 'hosted runtime'
    case 'cloud_ide':
      return 'cloud IDE'
    case 'managed_app_platform':
      return 'managed app platform'
    default:
      return 'managed runtime'
  }
}

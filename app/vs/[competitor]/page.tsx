import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ArrowRightIcon, CheckIcon, MinusIcon } from 'lucide-react'

import { Footer } from '@/components/marketing/footer'
import { MarketingNav } from '@/components/marketing/nav'
import { Button } from '@/components/ui/button'
import { ComparisonTable } from '@/components/seo/comparison-table'
import {
  getCompetitor,
  listCompetitorSlugs,
  listCompetitors,
} from '@/lib/competitors'
import {
  JsonLd,
  blogPostingLd,
  breadcrumbLd,
  faqPageLd,
} from '@/lib/jsonld'
import { absoluteUrl, BRAND_NAME, BRAND_TAGLINE, FOUNDER } from '@/lib/site'

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

  const title = `${BRAND_NAME} vs ${competitor.name}`
  const description = `${BRAND_NAME} vs ${competitor.name} (${new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' })}): execution model, models, pricing, and a feature-by-feature breakdown to help you pick.`
  const path = `/vs/${competitor.slug}`

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: `${title} \u2014 a side-by-side comparison`,
      description,
      url: absoluteUrl(path),
      type: 'article',
      publishedTime: `${competitor.lastVerified}T00:00:00Z`,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} \u2014 a side-by-side comparison`,
      description,
    },
    keywords: [
      `${BRAND_NAME.toLowerCase()} vs ${competitor.name.toLowerCase()}`,
      `${competitor.name.toLowerCase()} alternative`,
      `${competitor.name.toLowerCase()} comparison`,
      'ai coding platform comparison',
    ],
  }
}

export default async function VsCompetitorPage({ params }: PageProps) {
  const { competitor: slug } = await params
  const competitor = getCompetitor(slug)
  if (!competitor) notFound()

  const path = `/vs/${competitor.slug}`
  const otherCompetitors = listCompetitors().filter(
    (c) => c.slug !== competitor.slug
  )

  const faqs: Array<{ q: string; a: string }> = [
    {
      q: `Is ${BRAND_NAME} a good ${competitor.name} alternative?`,
      a: `${BRAND_NAME} is a good ${competitor.name} alternative if you need a real Linux sandbox per session, the ability to switch between Claude, GPT, and Grok per turn, and credit-based pricing without daily caps. ${competitor.name}'s strengths are ${competitor.strengths.slice(0, 2).join(' and ').toLowerCase()}, so the right pick depends on which trade-offs matter to your build.`,
    },
    {
      q: `What is the main difference between ${BRAND_NAME} and ${competitor.name}?`,
      a: `The biggest architectural difference is execution. ${BRAND_NAME} runs each session in a Vercel Sandbox \u2014 a real Firecracker microVM with full Linux, networking, and a real package manager. ${competitor.name} uses a ${describeExecution(competitor.executionModel)}, which trades some flexibility for faster startup or simpler hosting.`,
    },
    {
      q: `How does ${BRAND_NAME} pricing compare to ${competitor.name}?`,
      a: `${BRAND_NAME} starts at $20/month for the Hobby plan with 1,000 credits and scales to $200/month for Team with 15,000 pooled credits. ${competitor.name} pricing: ${competitor.pricing.display}. Pricing model: ${competitor.pricing.model}`,
    },
    {
      q: `Can I export my code from ${BRAND_NAME}?`,
      a: `Yes. ${BRAND_NAME} keeps the full source visible in the file explorer during every session, and projects you create are saved to your account so you can revisit them later. Native GitHub push is on the roadmap; for now you can copy or download files manually.`,
    },
    {
      q: `Which models does ${BRAND_NAME} support that ${competitor.name} doesn't?`,
      a: `${BRAND_NAME} routes through the Vercel AI Gateway, so you can pick between Claude Opus 4.6, Claude Sonnet 4.6, GPT-5.3 Codex, and Grok 4.1 Reasoning per turn. ${competitor.name} typically runs ${competitor.models.join(', ')}, so the choice is narrower or hidden behind orchestration.`,
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
            { name: 'Comparisons', path: '/vs' },
            { name: `${BRAND_NAME} vs ${competitor.name}`, path },
          ]),
          blogPostingLd({
            title: `${BRAND_NAME} vs ${competitor.name}`,
            description: `Side-by-side comparison of ${BRAND_NAME} and ${competitor.name} \u2014 execution model, models, pricing, and a feature-by-feature breakdown.`,
            slug: `vs/${competitor.slug}`,
            datePublished: competitor.lastVerified,
            authorName: FOUNDER.name,
            tags: [
              `${BRAND_NAME} vs ${competitor.name}`,
              `${competitor.name} alternative`,
              'ai coding platform',
            ],
          }),
          faqPageLd(faqs),
        ]}
        id={`vs-${competitor.slug}`}
      />

      <MarketingNav user={null} />

      <section className="px-6 sm:px-12 md:px-20 lg:px-28 pt-10 sm:pt-14 pb-8">
        <div className="max-w-4xl mx-auto">
          <p className="text-[12px] uppercase tracking-[0.18em] text-blue-500 font-medium mb-3">
            Comparison
          </p>
          <h1 className="text-3xl sm:text-[2.5rem] leading-[1.1] font-medium tracking-tight text-gray-900 mb-4">
            {BRAND_NAME} vs {competitor.name}: which AI coding platform fits
            your build?
          </h1>
          <p className="text-[15px] text-gray-600 max-w-2xl leading-relaxed">
            A side-by-side comparison of {BRAND_NAME} and {competitor.name}
            covering execution model, supported AI models, pricing, and the
            features that matter most when you ship from a prompt. Verified
            against each vendor&apos;s public docs on {lastVerifiedHuman}.
          </p>
          <p className="text-[12px] text-gray-400 font-mono mt-4">
            Last verified: {lastVerifiedHuman}
          </p>
        </div>
      </section>

      {/* TL;DR card */}
      <section className="px-6 sm:px-12 md:px-20 lg:px-28 pb-10">
        <div className="max-w-4xl mx-auto">
          <div className="rounded-2xl border border-black/5 bg-white p-6 sm:p-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <SummaryColumn
              name={BRAND_NAME}
              tone="brand"
              tagline={BRAND_TAGLINE}
              bullets={[
                'Real Vercel Sandbox per session (Linux, full shell, ports)',
                'Claude, GPT, and Grok via the Vercel AI Gateway',
                'Credit-based pricing with rollover',
                'First-class Supabase auth + RLS scaffolding',
              ]}
              ctaHref="/signup"
              ctaLabel="Try free"
            />
            <SummaryColumn
              name={competitor.name}
              tone="competitor"
              tagline={competitor.category}
              bullets={competitor.strengths.slice(0, 4)}
              ctaHref={competitor.website}
              ctaLabel="Visit site"
              external
            />
          </div>
        </div>
      </section>

      {/* Architecture */}
      <section className="px-6 sm:px-12 md:px-20 lg:px-28 pb-10">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-[22px] sm:text-[26px] font-medium tracking-tight text-gray-900 mb-6">
            How they execute generated code
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ArchCard
              title={`${BRAND_NAME}: cloud sandbox`}
              body={`Every session boots a Vercel Sandbox \u2014 a Firecracker microVM with full Linux, real networking, and up to 2 exposed ports. The agent installs dependencies, runs scripts, and starts a dev server like it would on any production box. What you see in preview is what would actually ship.`}
            />
            <ArchCard
              title={`${competitor.name}: ${describeExecutionTitle(
                competitor.executionModel
              )}`}
              body={describeExecutionBody(competitor.executionModel, competitor.name)}
            />
          </div>
        </div>
      </section>

      {/* Feature matrix */}
      <section className="px-6 sm:px-12 md:px-20 lg:px-28 pb-10">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-[22px] sm:text-[26px] font-medium tracking-tight text-gray-900 mb-3">
            Feature-by-feature comparison
          </h2>
          <p className="text-[14px] text-gray-500 max-w-2xl leading-relaxed mb-6">
            Pulled from {competitor.name}&apos;s public docs and pricing page on{' '}
            {lastVerifiedHuman}. &ldquo;Partial&rdquo; means the capability
            exists with caveats; hover for the qualifier.
          </p>
          <ComparisonTable competitor={competitor} />
        </div>
      </section>

      {/* Pros / cons */}
      <section className="px-6 sm:px-12 md:px-20 lg:px-28 pb-10">
        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ProConCard
            heading={`Where ${competitor.name} shines`}
            tone="positive"
            items={competitor.strengths}
          />
          <ProConCard
            heading={`Where ${competitor.name} struggles (vs ${BRAND_NAME})`}
            tone="negative"
            items={competitor.weaknesses}
          />
        </div>
      </section>

      {/* Pricing snapshot */}
      <section className="px-6 sm:px-12 md:px-20 lg:px-28 pb-10">
        <div className="max-w-4xl mx-auto rounded-2xl border border-black/5 bg-white p-6 sm:p-8">
          <h2 className="text-[20px] font-medium tracking-tight text-gray-900 mb-3">
            Pricing snapshot
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <p className="text-[11px] uppercase tracking-[0.16em] text-blue-500 font-medium mb-2">
                {BRAND_NAME}
              </p>
              <p className="text-[14px] text-gray-700 leading-relaxed">
                Free, Hobby $20/mo (1,000 credits), Pro $50/mo (3,000 credits),
                Team $200/mo (15,000 pooled credits). All models on every tier.
                Unused paid credits roll over up to 2&times; the monthly grant.
              </p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.16em] text-gray-500 font-medium mb-2">
                {competitor.name}
              </p>
              <p className="text-[14px] text-gray-700 leading-relaxed">
                {competitor.pricing.display}.{' '}
                <span className="text-gray-500">{competitor.pricing.model}</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* When to pick which */}
      <section className="px-6 sm:px-12 md:px-20 lg:px-28 pb-10">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-[22px] sm:text-[26px] font-medium tracking-tight text-gray-900 mb-6">
            When to pick {BRAND_NAME} vs {competitor.name}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <PickCard
              tone="brand"
              heading={`Pick ${BRAND_NAME} if`}
              items={[
                'You want a real Linux sandbox per session, not a hosted runtime.',
                'You want Claude, GPT, or Grok per turn, not a fixed backend.',
                'Predictable credit pricing without daily caps matters.',
                'Supabase auth + RLS scaffolding is part of your stack.',
              ]}
            />
            <PickCard
              tone="competitor"
              heading={`Pick ${competitor.name} if`}
              items={describeWhenToPick(competitor)}
            />
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

      {/* Other comparisons */}
      <section className="px-6 sm:px-12 md:px-20 lg:px-28 pb-10">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-[22px] sm:text-[26px] font-medium tracking-tight text-gray-900 mb-6">
            Compare against other AI coding platforms
          </h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {otherCompetitors.map((other) => (
              <li key={other.slug}>
                <Link
                  href={`/vs/${other.slug}`}
                  className="block rounded-2xl border border-black/5 bg-white p-5 hover:bg-white/70 transition-colors"
                >
                  <p className="text-[12px] text-gray-400 font-mono mb-1">
                    Comparison
                  </p>
                  <p className="text-[15px] font-medium text-gray-900">
                    {BRAND_NAME} vs {other.name}
                  </p>
                  <p className="text-[12px] text-gray-500 mt-1">
                    {other.category}
                  </p>
                </Link>
              </li>
            ))}
            <li>
              <Link
                href={`/alternatives/${competitor.slug}`}
                className="block rounded-2xl border border-blue-500/30 bg-white p-5 hover:bg-blue-50/40 transition-colors"
              >
                <p className="text-[12px] text-blue-500 font-mono mb-1">
                  Looking to switch?
                </p>
                <p className="text-[15px] font-medium text-gray-900">
                  {competitor.name} alternatives
                </p>
                <p className="text-[12px] text-gray-500 mt-1">
                  See why teams move from {competitor.name} to {BRAND_NAME}.
                </p>
              </Link>
            </li>
          </ul>
        </div>
      </section>

      {/* Sources */}
      <section className="px-6 sm:px-12 md:px-20 lg:px-28 pb-10">
        <div className="max-w-4xl mx-auto rounded-2xl border border-black/5 bg-white p-6">
          <p className="text-[12px] uppercase tracking-[0.16em] text-gray-400 font-medium mb-3">
            Sources
          </p>
          <ul className="text-[12px] text-gray-500 leading-relaxed space-y-1">
            {competitor.sources.map((source) => (
              <li key={source}>
                <a
                  href={source}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-600 transition-colors break-all"
                >
                  {source}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-6 sm:px-12 md:px-20 lg:px-28 pb-20">
        <div className="max-w-4xl mx-auto rounded-3xl border border-black/5 bg-white p-10 sm:p-14 text-center">
          <h2 className="text-2xl sm:text-3xl font-medium tracking-tight text-gray-900 mb-3">
            Try {BRAND_NAME} on the same prompt you&apos;d give {competitor.name}.
          </h2>
          <p className="text-[14px] text-gray-500 max-w-xl mx-auto mb-8">
            Start with a prompt. Watch the agent ship a running app inside a
            real sandbox. Decide which tool fits with your own eyes.
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

interface SummaryColumnProps {
  name: string
  tone: 'brand' | 'competitor'
  tagline: string
  bullets: string[]
  ctaHref: string
  ctaLabel: string
  external?: boolean
}

function SummaryColumn({
  name,
  tone,
  tagline,
  bullets,
  ctaHref,
  ctaLabel,
  external,
}: SummaryColumnProps) {
  const accent =
    tone === 'brand'
      ? 'text-blue-500'
      : 'text-gray-500'
  return (
    <div>
      <p className={`text-[11px] uppercase tracking-[0.16em] ${accent} font-medium mb-2`}>
        {name}
      </p>
      <p className="text-[14px] text-gray-700 leading-relaxed mb-4">
        {tagline}
      </p>
      <ul className="space-y-2 mb-5">
        {bullets.map((bullet) => (
          <li
            key={bullet}
            className="flex items-start gap-2 text-[13px] text-gray-700"
          >
            <CheckIcon
              className={`size-3.5 mt-1 ${tone === 'brand' ? 'text-blue-500' : 'text-gray-400'} flex-shrink-0`}
            />
            <span>{bullet}</span>
          </li>
        ))}
      </ul>
      {external ? (
        <a
          href={ctaHref}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[13px] font-medium text-gray-700 hover:text-gray-900 transition-colors inline-flex items-center gap-1"
        >
          {ctaLabel}
          <ArrowRightIcon className="size-3.5" />
        </a>
      ) : (
        <Link
          href={ctaHref}
          className="text-[13px] font-medium text-blue-500 hover:text-blue-600 transition-colors inline-flex items-center gap-1"
        >
          {ctaLabel}
          <ArrowRightIcon className="size-3.5" />
        </Link>
      )}
    </div>
  )
}

function ArchCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-black/5 bg-white p-6">
      <h3 className="text-[15px] font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-[13px] text-gray-600 leading-relaxed">{body}</p>
    </div>
  )
}

function ProConCard({
  heading,
  tone,
  items,
}: {
  heading: string
  tone: 'positive' | 'negative'
  items: string[]
}) {
  const Icon = tone === 'positive' ? CheckIcon : MinusIcon
  const iconClass =
    tone === 'positive' ? 'text-blue-500' : 'text-rose-400'
  return (
    <div className="rounded-2xl border border-black/5 bg-white p-6">
      <h3 className="text-[15px] font-medium text-gray-900 mb-3">{heading}</h3>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2 text-[13px] text-gray-700">
            <Icon className={`size-3.5 mt-1 ${iconClass} flex-shrink-0`} />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function PickCard({
  heading,
  tone,
  items,
}: {
  heading: string
  tone: 'brand' | 'competitor'
  items: string[]
}) {
  const accent = tone === 'brand' ? 'border-blue-500/40' : 'border-black/5'
  const headingColor = tone === 'brand' ? 'text-blue-600' : 'text-gray-900'
  return (
    <div className={`rounded-2xl border ${accent} bg-white p-6`}>
      <h3 className={`text-[15px] font-medium mb-3 ${headingColor}`}>{heading}</h3>
      <ul className="space-y-2">
        {items.map((item) => (
          <li
            key={item}
            className="flex items-start gap-2 text-[13px] text-gray-700"
          >
            <CheckIcon className="size-3.5 mt-1 text-blue-500 flex-shrink-0" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function describeExecution(model: string): string {
  switch (model) {
    case 'browser_webcontainer':
      return 'browser-based WebContainer that runs Node.js inside your tab'
    case 'cloud_sandbox':
      return 'cloud sandbox per session'
    case 'hosted_runtime':
      return 'hosted runtime that abstracts the underlying environment'
    case 'cloud_ide':
      return 'cloud IDE with a long-lived Linux container per project'
    case 'managed_app_platform':
      return 'managed app platform that builds and hosts the app for you'
    default:
      return 'managed environment'
  }
}

function describeExecutionTitle(model: string): string {
  switch (model) {
    case 'browser_webcontainer':
      return 'browser WebContainer'
    case 'cloud_sandbox':
      return 'cloud sandbox'
    case 'hosted_runtime':
      return 'hosted runtime'
    case 'cloud_ide':
      return 'cloud IDE'
    case 'managed_app_platform':
      return 'managed app platform'
    default:
      return 'managed environment'
  }
}

function describeExecutionBody(model: string, name: string): string {
  switch (model) {
    case 'browser_webcontainer':
      return `${name} runs a Node.js environment inside your browser tab using WebContainers. Startup is instant and there's nothing to install, but the environment can\u2019t run native binaries, has tighter resource ceilings, and behaves differently from a real Linux box.`
    case 'cloud_sandbox':
      return `${name} runs each session in a cloud sandbox similar to Vercel Sandbox \u2014 you get a full Linux environment with the trade-off of slightly slower startup than in-browser execution.`
    case 'hosted_runtime':
      return `${name} runs your generated app on a managed runtime that abstracts the underlying server. It's simpler, but you have less control over the environment and what can run inside it.`
    case 'cloud_ide':
      return `${name} runs your project inside a long-lived Linux container in a full cloud IDE. Plenty of flexibility, but the IDE adds surface area you may not need if you only want the agent.`
    case 'managed_app_platform':
      return `${name} builds and hosts your app on its own managed platform. Deploy is one click, but the platform itself owns the runtime, so portability and customisation are limited.`
    default:
      return `${name} runs your generated app on a managed environment. See their docs for the specifics of what's allowed.`
  }
}

function describeWhenToPick(
  competitor: ReturnType<typeof getCompetitor>
): string[] {
  if (!competitor) return []
  // Top three strengths, with a tiny rewrite to make them buyer-facing.
  return competitor.strengths.slice(0, 4)
}

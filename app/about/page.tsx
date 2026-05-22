import Link from 'next/link'
import type { Metadata } from 'next'
import { ArrowRightIcon } from 'lucide-react'
import { SprintBuildWordmark } from '@/components/marketing/logo'
import { Footer } from '@/components/marketing/footer'
import { Button } from '@/components/ui/button'
import {
  BRAND_NAME,
  BRAND_TAGLINE,
  CONTACT_EMAILS,
  FOUNDER,
  SOCIAL_LINKS,
  absoluteUrl,
} from '@/lib/site'
import {
  JsonLd,
  breadcrumbLd,
  founderPersonLd,
} from '@/lib/jsonld'

export const metadata: Metadata = {
  title: `About ${BRAND_NAME}`,
  description: `${BRAND_NAME} is an end-to-end AI coding platform built by ${FOUNDER.name}. Learn about the team, the technology, and why we run every session in a real Vercel Sandbox.`,
  alternates: { canonical: '/about' },
  openGraph: {
    title: `About ${BRAND_NAME}`,
    description: `${BRAND_NAME} is an end-to-end AI coding platform built by ${FOUNDER.name}.`,
    url: absoluteUrl('/about'),
    type: 'profile',
  },
}

const PRINCIPLES = [
  {
    title: 'Run code, don\u2019t just generate it.',
    body: `Every ${BRAND_NAME} session boots a real Vercel Sandbox. The agent installs dependencies, runs scripts, and starts a dev server — so what you preview is what would actually ship, not a hallucinated output.`,
  },
  {
    title: 'Pick the right model for the job.',
    body: 'Claude Opus, Claude Sonnet, GPT Codex, and Grok Reasoning are all wired through the Vercel AI Gateway. Switch models per turn; pay for what you use.',
  },
  {
    title: 'Treat errors as input, not failure.',
    body: 'Build failures and runtime errors stream back to the agent. The auto-fix loop closes most regressions in one or two turns without human escalation.',
  },
  {
    title: 'Keep the source visible.',
    body: 'No black box. The file explorer is always live and every command the agent runs streams its stdout and stderr.',
  },
]

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#f0f0ee] flex flex-col">
      <JsonLd
        data={[
          founderPersonLd(),
          breadcrumbLd([
            { name: 'Home', path: '/' },
            { name: 'About', path: '/about' },
          ]),
        ]}
        id="about"
      />

      <header className="px-6 sm:px-12 md:px-20 lg:px-28 pt-6 flex items-center justify-between">
        <Link href="/" aria-label={`${BRAND_NAME} home`}>
          <SprintBuildWordmark size="md" />
        </Link>
        <nav className="hidden sm:flex items-center gap-6 text-[12px] text-gray-500">
          <Link href="/" className="hover:text-gray-900 transition-colors">
            Home
          </Link>
          <Link
            href="/blog"
            className="hover:text-gray-900 transition-colors"
          >
            Blog
          </Link>
          <Link
            href="/pricing"
            className="hover:text-gray-900 transition-colors"
          >
            Pricing
          </Link>
          <Link
            href="/login"
            className="hover:text-gray-900 transition-colors"
          >
            Sign in
          </Link>
        </nav>
      </header>

      <section className="px-6 sm:px-12 md:px-20 lg:px-28 py-14 sm:py-20">
        <div className="max-w-3xl mx-auto">
          <p className="text-[12px] uppercase tracking-[0.18em] text-blue-500 font-medium mb-3">
            About
          </p>
          <h1 className="text-3xl sm:text-4xl font-medium tracking-tight text-gray-900 mb-4">
            We build software by describing it.
          </h1>
          <p className="text-[15px] leading-relaxed text-gray-600 max-w-2xl">
            {BRAND_TAGLINE} {BRAND_NAME} is the end-to-end version of that
            promise: an agent, a real sandbox, a live preview, and the file
            tree always visible while it works.
          </p>
        </div>
      </section>

      <section className="px-6 sm:px-12 md:px-20 lg:px-28 pb-14">
        <div className="max-w-3xl mx-auto rounded-2xl border border-black/5 bg-white p-8 sm:p-10 grid grid-cols-1 sm:grid-cols-[88px_1fr] gap-6 sm:gap-8 items-start">
          <div className="size-[88px] rounded-full bg-gradient-to-br from-[#1F1F1F] to-blue-500 flex items-center justify-center text-white text-[28px] font-medium tracking-tight">
            {FOUNDER.name
              .split(' ')
              .map((part) => part[0])
              .filter(Boolean)
              .slice(0, 2)
              .join('')}
          </div>
          <div className="space-y-2">
            <p className="text-[12px] uppercase tracking-[0.16em] text-gray-400 font-medium">
              Founder
            </p>
            <h2 className="text-[20px] font-medium tracking-tight text-gray-900">
              {FOUNDER.name}
            </h2>
            <p className="text-[13px] text-gray-500">{FOUNDER.jobTitle}</p>
            <p className="text-[14px] text-gray-700 leading-relaxed pt-1">
              {FOUNDER.bio}
            </p>
            <div className="flex flex-wrap gap-x-4 gap-y-1 pt-2 text-[13px]">
              {SOCIAL_LINKS.twitter ? (
                <a
                  href={SOCIAL_LINKS.twitter}
                  target="_blank"
                  rel="noopener noreferrer me"
                  className="text-blue-500 hover:text-blue-600 transition-colors"
                >
                  Twitter / X
                </a>
              ) : null}
              {SOCIAL_LINKS.github ? (
                <a
                  href={SOCIAL_LINKS.github}
                  target="_blank"
                  rel="noopener noreferrer me"
                  className="text-blue-500 hover:text-blue-600 transition-colors"
                >
                  GitHub
                </a>
              ) : null}
              {SOCIAL_LINKS.linkedin ? (
                <a
                  href={SOCIAL_LINKS.linkedin}
                  target="_blank"
                  rel="noopener noreferrer me"
                  className="text-blue-500 hover:text-blue-600 transition-colors"
                >
                  LinkedIn
                </a>
              ) : null}
              <a
                href={`mailto:${CONTACT_EMAILS.general}`}
                className="text-blue-500 hover:text-blue-600 transition-colors"
              >
                {CONTACT_EMAILS.general}
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 sm:px-12 md:px-20 lg:px-28 pb-14">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-[22px] sm:text-[26px] font-medium tracking-tight text-gray-900 mb-6">
            What we believe
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {PRINCIPLES.map((principle) => (
              <div
                key={principle.title}
                className="rounded-2xl border border-black/5 bg-white p-6"
              >
                <h3 className="text-[15px] font-medium text-gray-900 mb-2 tracking-tight">
                  {principle.title}
                </h3>
                <p className="text-[13px] leading-relaxed text-gray-600">
                  {principle.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 sm:px-12 md:px-20 lg:px-28 pb-14">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-[22px] sm:text-[26px] font-medium tracking-tight text-gray-900 mb-6">
            How {BRAND_NAME} is built
          </h2>
          <div className="rounded-2xl border border-black/5 bg-white p-8 space-y-4 text-[14px] leading-relaxed text-gray-700">
            <p>
              {BRAND_NAME} runs on Next.js with the App Router, the AI SDK
              for streaming agent responses, and the Vercel AI Gateway for
              model routing. Each generated app boots inside a Vercel
              Sandbox — an ephemeral Firecracker microVM with isolated
              networking, file system, and process tree.
            </p>
            <p>
              Authentication, project history, and per-user file storage
              are backed by Supabase with row-level security, so a user
              can only ever see and modify their own work.
            </p>
            <p>
              The full source for the underlying agent runtime is
              open-source. If you&apos;d like to see how a specific feature
              works, the{' '}
              <a
                href="https://github.com/MohammedHTahir/vibe-coding-platform"
                className="text-blue-500 hover:text-blue-600 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                vibe-coding-platform repo
              </a>{' '}
              is the place to start.
            </p>
          </div>
        </div>
      </section>

      <section className="px-6 sm:px-12 md:px-20 lg:px-28 pb-20">
        <div className="max-w-3xl mx-auto rounded-2xl border border-black/5 bg-white p-8 text-center">
          <h2 className="text-[18px] font-medium tracking-tight text-gray-900 mb-2">
            Build your next app in a sprint
          </h2>
          <p className="text-[14px] text-gray-500 max-w-md mx-auto mb-6">
            Start with a prompt. Get a running app. Keep iterating until it
            ships.
          </p>
          <Button asChild className="bg-blue-500 hover:bg-blue-600">
            <Link href="/signup">
              Try {BRAND_NAME} free
              <ArrowRightIcon className="w-3.5 h-3.5" />
            </Link>
          </Button>
        </div>
      </section>

      <Footer />
    </main>
  )
}

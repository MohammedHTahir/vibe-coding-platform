import Link from 'next/link'
import type { Metadata } from 'next'
import { SprintBuildWordmark } from '@/components/marketing/logo'
import { Footer } from '@/components/marketing/footer'

export const metadata: Metadata = {
  title: 'Terms and Conditions',
  description:
    'The terms and conditions that govern your use of SprintBuild and its services.',
}

const LAST_UPDATED = 'May 18, 2026'

export default function TermsPage() {
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
            Legal
          </p>
          <h1 className="text-3xl sm:text-4xl font-medium tracking-tight text-gray-900 mb-3">
            Terms and Conditions
          </h1>
          <p className="text-[12px] text-gray-400 font-mono">
            Last updated: {LAST_UPDATED}
          </p>
        </div>
      </section>

      <section className="flex-1 px-6 sm:px-12 md:px-20 lg:px-28 pb-20">
        <article className="max-w-3xl mx-auto space-y-10 text-[14px] leading-relaxed text-gray-700">
          <p>
            These Terms and Conditions (&ldquo;Terms&rdquo;) govern your access
            to and use of SprintBuild (&ldquo;SprintBuild&rdquo;,
            &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;), including
            our website, dashboard, AI agent, sandboxed code execution, and
            any related services (collectively, the &ldquo;Service&rdquo;). By
            creating an account, accessing, or using the Service, you agree to
            be bound by these Terms. If you do not agree, do not use the
            Service.
          </p>

          <section className="space-y-3">
            <h2 className="text-[18px] font-medium tracking-tight text-gray-900">
              1. Eligibility and accounts
            </h2>
            <p>
              You must be at least 13 years old (or the age of digital consent
              in your jurisdiction) to use SprintBuild. You are responsible for
              maintaining the confidentiality of your credentials and for all
              activity that occurs under your account. Notify us immediately if
              you suspect unauthorized use.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-[18px] font-medium tracking-tight text-gray-900">
              2. Acceptable use
            </h2>
            <p>You agree not to use the Service to:</p>
            <ul className="list-disc pl-6 space-y-1.5">
              <li>
                Violate any law, regulation, or third-party right, including
                intellectual property and privacy rights.
              </li>
              <li>
                Generate, host, or distribute malware, exploits, phishing
                content, or material designed to harass or harm others.
              </li>
              <li>
                Attempt to reverse-engineer the Service, bypass usage limits,
                or interfere with sandbox isolation.
              </li>
              <li>
                Use the Service to build applications that violate the terms of
                upstream providers (e.g., Vercel AI Gateway, Anthropic, OpenAI,
                xAI, Supabase).
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-[18px] font-medium tracking-tight text-gray-900">
              3. Your content
            </h2>
            <p>
              You retain ownership of the prompts, code, and content you submit
              to or generate through SprintBuild (&ldquo;Your Content&rdquo;).
              You grant us a worldwide, non-exclusive, royalty-free license to
              host, process, and display Your Content solely as needed to
              operate and improve the Service. You are solely responsible for
              Your Content and for ensuring you have the rights to use and
              share it.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-[18px] font-medium tracking-tight text-gray-900">
              4. AI-generated output
            </h2>
            <p>
              SprintBuild orchestrates third-party large language models to
              generate code and other artifacts. AI output may be incorrect,
              insecure, or infringe third-party rights. You are responsible for
              reviewing, testing, and validating any output before relying on
              it in production. SprintBuild makes no warranty that AI output
              will be accurate, fit for a particular purpose, or free of
              defects.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-[18px] font-medium tracking-tight text-gray-900">
              5. Subscriptions, billing, and trials
            </h2>
            <p>
              Some features may require a paid subscription. Fees are billed in
              advance and are non-refundable except where required by law.
              Trials, if offered, automatically convert to paid plans unless
              cancelled before the trial ends. We may change pricing with
              reasonable notice; price changes apply to the next billing cycle.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-[18px] font-medium tracking-tight text-gray-900">
              6. Third-party services
            </h2>
            <p>
              The Service integrates with third-party providers including but
              not limited to Vercel, Supabase, GitHub, Anthropic, OpenAI, and
              xAI. Your use of those services through SprintBuild is also
              subject to their terms and privacy policies. We are not
              responsible for third-party services or outages.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-[18px] font-medium tracking-tight text-gray-900">
              7. Termination
            </h2>
            <p>
              You may stop using the Service at any time. We may suspend or
              terminate your access if you violate these Terms, create risk or
              legal exposure for us, or if continued provision is no longer
              commercially viable. On termination, your right to use the
              Service ends immediately. Sections that by their nature should
              survive termination will survive.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-[18px] font-medium tracking-tight text-gray-900">
              8. Disclaimers
            </h2>
            <p>
              THE SERVICE IS PROVIDED &ldquo;AS IS&rdquo; AND &ldquo;AS
              AVAILABLE&rdquo; WITHOUT WARRANTIES OF ANY KIND, WHETHER EXPRESS
              OR IMPLIED, INCLUDING IMPLIED WARRANTIES OF MERCHANTABILITY,
              FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
              SPRINTBUILD DOES NOT WARRANT THAT THE SERVICE WILL BE
              UNINTERRUPTED, SECURE, OR ERROR-FREE.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-[18px] font-medium tracking-tight text-gray-900">
              9. Limitation of liability
            </h2>
            <p>
              To the maximum extent permitted by law, SprintBuild and its
              affiliates will not be liable for any indirect, incidental,
              special, consequential, or punitive damages, or any loss of
              profits, revenue, data, or goodwill arising out of or related to
              your use of the Service. Our total aggregate liability for any
              claim arising out of or related to the Service will not exceed
              the greater of (a) the fees you paid us in the 12 months before
              the claim, or (b) USD $100.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-[18px] font-medium tracking-tight text-gray-900">
              10. Changes to these Terms
            </h2>
            <p>
              We may update these Terms from time to time. If we make material
              changes, we will notify you via the Service or by email at least
              7 days before they take effect. Continued use of the Service
              after the effective date constitutes acceptance of the updated
              Terms.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-[18px] font-medium tracking-tight text-gray-900">
              11. Contact
            </h2>
            <p>
              Questions about these Terms? Email{' '}
              <a
                href="mailto:hello@sprintbuild.ai"
                className="text-blue-500 hover:text-blue-600 transition-colors"
              >
                hello@sprintbuild.ai
              </a>
              .
            </p>
          </section>

          <p className="text-[12px] text-gray-400">
            See also our{' '}
            <Link
              href="/privacy"
              className="text-blue-500 hover:text-blue-600 transition-colors"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </article>
      </section>

      <Footer />
    </main>
  )
}

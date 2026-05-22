/**
 * Typed competitor data for the programmatic comparison surface
 * (`/vs/[competitor]`, `/alternatives/[competitor]`, the
 * "Best AI coding tools" listicle, comparison tables in blog posts).
 *
 * The yaml at `.seo-engine/data/competitors.yaml` is the SEO engine's
 * source of truth — it's what the content/SEO process maintains. This
 * module is the *runtime* mirror: the same shape, but typed and
 * importable at build time without YAML parsing.
 *
 * When updating, change BOTH files. The values below were verified
 * against each vendor's public docs/pricing pages between May 2026 and
 * the current refresh date — see `lastVerified` per competitor.
 */

import type { ReactNode } from 'react'

export type FeatureSupport = 'yes' | 'partial' | 'no' | 'unknown'

export interface CompetitorFeatureCell {
  support: FeatureSupport
  /** Short qualifier shown in the cell. Keep terse. */
  detail?: string
}

export interface CompetitorPricing {
  /** "$X/mo", "Free", "$X/user/mo". Display string. */
  display: string
  /** Numeric monthly price for the cheapest paid tier (USD). 0 = free only. */
  startingMonthlyUsd: number
  /** Quick description of the credit / token model. */
  model: string
}

export interface Competitor {
  id: string
  /** URL slug used at /vs/<slug> and /alternatives/<slug>. */
  slug: string
  /** Display name. */
  name: string
  /** Vendor's public site, full URL. */
  website: string
  /** One-liner used by search engines and OG cards. */
  category: string
  /** Two-to-three sentences describing the product objectively. */
  description: string
  /** What the vendor does best. */
  strengths: string[]
  /** Honest weaknesses or constraints (relative to SprintBuild's value prop). */
  weaknesses: string[]
  pricing: CompetitorPricing
  /**
   * Underlying execution model — the most important architectural axis
   * for comparison content. SprintBuild is `cloud_sandbox`.
   */
  executionModel:
    | 'browser_webcontainer'
    | 'cloud_sandbox'
    | 'hosted_runtime'
    | 'cloud_ide'
    | 'managed_app_platform'
  /** Underlying LLM(s) the vendor is known to use. */
  models: string[]
  /** Supported deploy targets. */
  deployTargets: string[]
  /** Per-feature cells — keyed by the same feature ids as features.yaml. */
  features: Record<string, CompetitorFeatureCell>
  /** Date we last verified the public claims against vendor sources. */
  lastVerified: string
  /** Sources we used to fill the cells. */
  sources: string[]
}

/**
 * Features we track in the comparison matrix. Keep this list in sync
 * with `.seo-engine/data/features.yaml` — these are the user-visible
 * capabilities that buyers care about, not the full product surface.
 */
export interface FeatureRow {
  id: string
  label: string
  /** Short tooltip-style explanation rendered next to the row. */
  description: string
}

export const FEATURES: FeatureRow[] = [
  {
    id: 'feat_prompt_to_app',
    label: 'Prompt to full-stack app',
    description:
      'Describe an app in natural language and the agent scaffolds, runs, and previews it.',
  },
  {
    id: 'feat_multi_model',
    label: 'Multi-model support',
    description:
      'Choose between Claude, GPT, Grok, and others without leaving the product.',
  },
  {
    id: 'feat_sandbox_execution',
    label: 'Real cloud sandbox per session',
    description:
      'Each session runs in an isolated, ephemeral VM with full Linux, networking, and a real package manager.',
  },
  {
    id: 'feat_live_preview',
    label: 'Live iframe preview',
    description:
      'See the running app the moment a dev server boots; reload as the agent edits files.',
  },
  {
    id: 'feat_file_explorer',
    label: 'File explorer',
    description: 'Browse the generated source tree and read any file.',
  },
  {
    id: 'feat_command_logs',
    label: 'Streaming command logs',
    description: 'Real-time stdout/stderr for every command the agent runs.',
  },
  {
    id: 'feat_auto_fix_errors',
    label: 'Auto-fix loop on errors',
    description:
      'Build failures and runtime errors stream back to the agent, which patches them without manual prompting.',
  },
  {
    id: 'feat_github_export',
    label: 'GitHub export',
    description: 'Push generated source to your own GitHub repo.',
  },
  {
    id: 'feat_one_click_deploy',
    label: 'One-click deploy',
    description: 'Ship the running sandbox to a publicly accessible URL.',
  },
  {
    id: 'feat_supabase_integration',
    label: 'Supabase integration',
    description:
      'First-class hooks for Supabase auth, database, and storage in generated apps.',
  },
  {
    id: 'feat_credit_pricing',
    label: 'Transparent credit-based pricing',
    description:
      'Pay for what you use, with rollover and the same models on every tier.',
  },
]

/**
 * `sprintbuild`'s own row — used as the "us" column in every
 * comparison table. Keep details accurate; this is the page Google
 * will use to extract feature claims about us.
 */
export const SPRINTBUILD_ROW: Record<string, CompetitorFeatureCell> = {
  feat_prompt_to_app: { support: 'yes', detail: 'Native, every session.' },
  feat_multi_model: {
    support: 'yes',
    detail: 'Claude Opus 4.6, Sonnet 4.6, GPT-5.3 Codex, Grok 4.1 via Vercel AI Gateway.',
  },
  feat_sandbox_execution: {
    support: 'yes',
    detail: 'Vercel Sandbox (Firecracker microVM) per session.',
  },
  feat_live_preview: { support: 'yes', detail: 'Streamed from the sandbox dev server.' },
  feat_file_explorer: { support: 'yes' },
  feat_command_logs: { support: 'yes', detail: 'Live stdout/stderr per command.' },
  feat_auto_fix_errors: { support: 'yes', detail: 'Errors stream back into the agent loop.' },
  feat_github_export: { support: 'partial', detail: 'Manual export today; native push on roadmap.' },
  feat_one_click_deploy: {
    support: 'partial',
    detail: 'Sandbox preview URLs are public; native Vercel deploy on roadmap.',
  },
  feat_supabase_integration: {
    support: 'yes',
    detail: 'Auth, Postgres, and Storage with RLS scaffolded by the agent.',
  },
  feat_credit_pricing: {
    support: 'yes',
    detail: 'All models on every tier; credits roll over up to 2×.',
  },
}

const VERIFIED_AT = '2026-05-23'

const COMPETITORS: Competitor[] = [
  {
    id: 'comp_lovable',
    slug: 'lovable',
    name: 'Lovable',
    website: 'https://lovable.dev',
    category: 'AI app generator with hosted runtime',
    description:
      'Lovable is a web-based AI app builder that generates full-stack apps and hosts them on Lovable Cloud. It pairs a chat-driven build flow with a Dev Mode for direct code editing and ships with first-class Supabase and GitHub integrations.',
    strengths: [
      'Polished Supabase integration for auth, database, and storage.',
      'Dev Mode lets you edit generated code without leaving the product.',
      'GitHub sync so you can take ownership of the source.',
      'Strong template gallery and an active community.',
    ],
    weaknesses: [
      'Hosted runtime — less flexibility than a real Linux sandbox.',
      'Single-model under the hood; no per-turn model choice.',
      'Free tier is heavily metered (5 daily credits, max 30/month).',
    ],
    pricing: {
      display: 'Free, Pro $25/mo, Business $50/mo',
      startingMonthlyUsd: 25,
      model:
        'Credit-based. Free = 5 daily / 30 monthly. Pro = 100 monthly + 5 daily. Business adds SSO and data opt-out.',
    },
    executionModel: 'hosted_runtime',
    models: ['Claude Sonnet (default)'],
    deployTargets: ['Lovable Cloud', 'Custom domain (paid)', 'GitHub export'],
    features: {
      feat_prompt_to_app: { support: 'yes' },
      feat_multi_model: { support: 'no', detail: 'Single model under the hood.' },
      feat_sandbox_execution: {
        support: 'partial',
        detail: 'Hosted runtime, not a per-session Linux sandbox.',
      },
      feat_live_preview: { support: 'yes' },
      feat_file_explorer: { support: 'yes', detail: 'Via Dev Mode.' },
      feat_command_logs: {
        support: 'partial',
        detail: 'Build logs only; no per-command stream.',
      },
      feat_auto_fix_errors: { support: 'yes', detail: 'Auto-fix loop on errors.' },
      feat_github_export: { support: 'yes', detail: 'Bidirectional sync.' },
      feat_one_click_deploy: { support: 'yes', detail: 'Lovable Cloud, included.' },
      feat_supabase_integration: { support: 'yes', detail: 'First-class.' },
      feat_credit_pricing: {
        support: 'yes',
        detail: 'Credits but with hard daily/monthly caps.',
      },
    },
    lastVerified: VERIFIED_AT,
    sources: [
      'https://lovable.dev/pricing',
      'https://docs.lovable.dev/integrations/supabase',
      'https://lovable.dev/blog/lovable-2-0',
      'https://docs.lovable.dev/integrations/cloud',
    ],
  },
  {
    id: 'comp_bolt',
    slug: 'bolt-new',
    name: 'Bolt.new',
    website: 'https://bolt.new',
    category: 'Browser-based AI dev environment',
    description:
      'Bolt.new is StackBlitz\u2019s in-browser AI app builder. It uses WebContainers to run a Node.js environment directly inside your tab, so the generated app boots and runs without leaving the page. The architecture trades server flexibility for instant startup and zero local setup.',
    strengths: [
      'Zero install — everything runs in your tab via WebContainers.',
      'Fast time-to-preview thanks to in-browser execution.',
      'GitHub export plus deploy to Netlify or download.',
      'Strong template ecosystem inherited from StackBlitz.',
    ],
    weaknesses: [
      'WebContainer environment limits what can run (no native binaries, limited concurrency).',
      'Token-based usage that can burn through credits unpredictably during long sessions.',
      'No per-turn model choice; runs Bolt\u2019s configured backend model.',
    ],
    pricing: {
      display: 'Free trial, Pro from $20/mo, scales with token usage',
      startingMonthlyUsd: 20,
      model:
        'Token-based. Pro tiers add monthly tokens; heavy generation can burn the budget quickly.',
    },
    executionModel: 'browser_webcontainer',
    models: ['Claude (Bolt-managed)'],
    deployTargets: ['Netlify', 'GitHub export', 'Download'],
    features: {
      feat_prompt_to_app: { support: 'yes' },
      feat_multi_model: { support: 'no', detail: 'Single backend model.' },
      feat_sandbox_execution: {
        support: 'partial',
        detail: 'WebContainer in your browser tab \u2014 no real Linux.',
      },
      feat_live_preview: { support: 'yes', detail: 'Native; runs in the same tab.' },
      feat_file_explorer: { support: 'yes' },
      feat_command_logs: {
        support: 'yes',
        detail: 'Terminal panel for in-browser commands.',
      },
      feat_auto_fix_errors: { support: 'partial', detail: 'Error feedback prompts the model.' },
      feat_github_export: { support: 'yes' },
      feat_one_click_deploy: { support: 'yes', detail: 'Deploy to Netlify.' },
      feat_supabase_integration: {
        support: 'partial',
        detail: 'Manual setup; works but not first-class.',
      },
      feat_credit_pricing: { support: 'partial', detail: 'Token-based, not credit-based.' },
    },
    lastVerified: VERIFIED_AT,
    sources: [
      'https://bolt.new/pricing',
      'https://support.bolt.new/faqs/account-and-subscription/overview',
      'https://github.com/stackblitz/bolt.new',
      'https://posthog.com/newsletter/inside-bolt-dot-new',
    ],
  },
  {
    id: 'comp_v0',
    slug: 'v0',
    name: 'v0 by Vercel',
    website: 'https://v0.dev',
    category: 'AI UI generator and app builder by Vercel',
    description:
      'v0 is Vercel\u2019s AI app builder. It started as a UI generator and has grown into a chat-based product that can ship full applications, with deep GitHub branching, Vercel preview deployments, and tiered v0 Mini/Pro/Max models for different cost-vs-quality tradeoffs.',
    strengths: [
      'Tightest integration with Vercel hosting and preview URLs.',
      'Automatic GitHub branching with auto-commits per chat message.',
      'Multiple in-house model tiers (Mini, Pro, Max, Max Fast).',
      'Frequent product updates from a well-resourced team.',
    ],
    weaknesses: [
      'Heavily Vercel-centric \u2014 if you want a different host you\u2019re swimming upstream.',
      'No support for switching to Claude, GPT, or Grok per turn.',
      'Free credits are very limited ($5/month).',
    ],
    pricing: {
      display:
        'Free ($5 credits), Premium $20/mo, Team $30/user/mo, Business $100/user/mo',
      startingMonthlyUsd: 20,
      model:
        'Credit-based. Each plan ships monthly credits; v0 Mini/Pro/Max consume different rates per token.',
    },
    executionModel: 'managed_app_platform',
    models: ['v0 Mini', 'v0 Pro', 'v0 Max', 'v0 Max Fast'],
    deployTargets: ['Vercel (native)', 'GitHub'],
    features: {
      feat_prompt_to_app: { support: 'yes' },
      feat_multi_model: {
        support: 'partial',
        detail: 'Choose v0 Mini/Pro/Max; no third-party Claude/GPT/Grok.',
      },
      feat_sandbox_execution: {
        support: 'partial',
        detail: 'Cloud build pipeline; not a real per-session sandbox.',
      },
      feat_live_preview: { support: 'yes', detail: 'Preview URLs on every change.' },
      feat_file_explorer: { support: 'yes' },
      feat_command_logs: { support: 'partial', detail: 'Build logs, not free-form shell.' },
      feat_auto_fix_errors: { support: 'yes' },
      feat_github_export: {
        support: 'yes',
        detail: 'Auto-branching and auto-commits.',
      },
      feat_one_click_deploy: { support: 'yes', detail: 'Vercel deploy is native.' },
      feat_supabase_integration: {
        support: 'partial',
        detail: 'Works via Vercel Marketplace; not chat-native.',
      },
      feat_credit_pricing: { support: 'yes' },
    },
    lastVerified: VERIFIED_AT,
    sources: [
      'https://v0.dev/pricing',
      'https://v0.dev/docs/faqs',
      'https://v0.app/docs/github',
      'https://vercel.com/blog/improved-v0-pricing',
    ],
  },
  {
    id: 'comp_replit_agent',
    slug: 'replit-agent',
    name: 'Replit Agent',
    website: 'https://replit.com',
    category: 'AI coding agent inside Replit\u2019s cloud IDE',
    description:
      'Replit Agent runs inside Replit\u2019s cloud IDE. It can scaffold a project, set up a Linux shell, install dependencies, configure backends, and deploy with one click \u2014 all on top of Replit\u2019s long-standing dev environment. Agent 3 added more autonomy and self-correction.',
    strengths: [
      'Real Linux environment with full shell access from day one.',
      'One-click deploy to Replit\u2019s hosting (with custom domains on paid).',
      'Native mobile app builds on Replit Mobile.',
      'Established community and template library.',
    ],
    weaknesses: [
      'Pricing is layered (subscription + Agent credits + deploy compute).',
      'Editor UX is broader than just AI \u2014 can feel heavy if you only want the agent.',
      'Model exposure is opaque (Agent composes multiple models internally).',
    ],
    pricing: {
      display: 'Free, Core $20/mo, Pro $100/mo',
      startingMonthlyUsd: 20,
      model:
        'Subscription + usage-based Agent credits. Pro adds rollover and higher caps; Agent compute is metered separately.',
    },
    executionModel: 'cloud_ide',
    models: ['Replit Agent (multi-model orchestration)'],
    deployTargets: [
      'Replit Deployments (native)',
      'Custom domains (paid)',
      'iOS / Android via Replit Mobile',
    ],
    features: {
      feat_prompt_to_app: { support: 'yes' },
      feat_multi_model: { support: 'partial', detail: 'Internal orchestration, not user-selectable.' },
      feat_sandbox_execution: { support: 'yes', detail: 'Full Linux Repl per project.' },
      feat_live_preview: { support: 'yes' },
      feat_file_explorer: { support: 'yes', detail: 'Full IDE.' },
      feat_command_logs: { support: 'yes' },
      feat_auto_fix_errors: { support: 'yes', detail: 'Agent self-corrects on errors.' },
      feat_github_export: { support: 'yes' },
      feat_one_click_deploy: { support: 'yes', detail: 'Replit Deployments.' },
      feat_supabase_integration: {
        support: 'partial',
        detail: 'Works via env vars; not a built-in flow.',
      },
      feat_credit_pricing: {
        support: 'partial',
        detail: 'Subscription + separately metered Agent credits.',
      },
    },
    lastVerified: VERIFIED_AT,
    sources: [
      'https://replit.com/pricing',
      'https://replit.com/blog/pro-plan',
      'https://docs.replit.com/core-concepts/agent',
      'https://docs.replit.com/replitai/web-apps',
    ],
  },
  {
    id: 'comp_base44',
    slug: 'base44',
    name: 'Base44',
    website: 'https://base44.com',
    category: 'AI app builder with managed hosting',
    description:
      'Base44 is a managed AI app builder that pairs chat-driven generation with one-click hosting and a library of 20+ pre-built integrations. It composes Claude Sonnet, Gemini Pro, and GPT under the hood and emphasizes transparent credit-based pricing.',
    strengths: [
      'Multi-model orchestration (Claude, Gemini, GPT) with no extra setup.',
      'One-click deploy included on every plan, even free.',
      '20+ pre-built integrations for common SaaS tools.',
      'Clear credit-based pricing without surprises.',
    ],
    weaknesses: [
      'GitHub export only on paid plans.',
      'Hosted runtime \u2014 no real Linux sandbox.',
      'Smaller third-party ecosystem than Replit or Lovable.',
    ],
    pricing: {
      display: 'Free, Starter from $16/mo (annual), up to Elite $160/mo',
      startingMonthlyUsd: 16,
      model:
        'Credit-based. Message credits cost more for build prompts than discussion. Integration usage is metered separately.',
    },
    executionModel: 'managed_app_platform',
    models: ['Claude Sonnet', 'Gemini 2.5 Pro', 'GPT-5'],
    deployTargets: ['Base44 hosting (one-click)', 'GitHub export (paid)'],
    features: {
      feat_prompt_to_app: { support: 'yes' },
      feat_multi_model: {
        support: 'yes',
        detail: 'Internal Claude/Gemini/GPT routing.',
      },
      feat_sandbox_execution: {
        support: 'partial',
        detail: 'Managed runtime, not a real per-session VM.',
      },
      feat_live_preview: { support: 'yes' },
      feat_file_explorer: { support: 'partial', detail: 'Limited; full code on paid plans.' },
      feat_command_logs: { support: 'partial', detail: 'Activity log, not raw stdout.' },
      feat_auto_fix_errors: { support: 'yes', detail: 'Automatic error correction.' },
      feat_github_export: { support: 'partial', detail: 'Paid plans only.' },
      feat_one_click_deploy: { support: 'yes', detail: 'Included on every plan.' },
      feat_supabase_integration: {
        support: 'partial',
        detail: 'Available via integrations panel.',
      },
      feat_credit_pricing: { support: 'yes' },
    },
    lastVerified: VERIFIED_AT,
    sources: [
      'https://base44.com/pricing',
      'https://base44.com/blog/how-much-does-base44-cost',
      'https://docs.base44.com/Getting-Started/Billing-and-plans',
    ],
  },
]

const BY_SLUG: Record<string, Competitor> = Object.fromEntries(
  COMPETITORS.map((c) => [c.slug, c])
)

export function listCompetitors(): Competitor[] {
  return COMPETITORS
}

export function getCompetitor(slug: string): Competitor | null {
  return BY_SLUG[slug] ?? null
}

export function listCompetitorSlugs(): string[] {
  return COMPETITORS.map((c) => c.slug)
}

/**
 * Convenience flag checker for the ReactNode badge in tables. Keeps
 * the JSX in pages free of nested ternaries.
 */
export function supportLabel(support: FeatureSupport): {
  label: string
  tone: 'positive' | 'mixed' | 'negative' | 'neutral'
} {
  switch (support) {
    case 'yes':
      return { label: 'Yes', tone: 'positive' }
    case 'partial':
      return { label: 'Partial', tone: 'mixed' }
    case 'no':
      return { label: 'No', tone: 'negative' }
    default:
      return { label: 'Unknown', tone: 'neutral' }
  }
}

/**
 * Render-helper: small badge JSX hint. Pages can use this directly
 * inside a table cell.
 */
export function supportBadgeProps(support: FeatureSupport): {
  className: string
  children: ReactNode
} {
  const { label, tone } = supportLabel(support)
  const className =
    'inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium tracking-tight ' +
    (tone === 'positive'
      ? 'bg-blue-50 text-blue-600'
      : tone === 'mixed'
        ? 'bg-amber-50 text-amber-700'
        : tone === 'negative'
          ? 'bg-rose-50 text-rose-600'
          : 'bg-gray-100 text-gray-500')
  return { className, children: label }
}

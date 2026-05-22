/**
 * Use-case landing page data. One row per `/build/[slug]` page. Each
 * targets a high-intent commercial keyword that buyers actually type
 * when shopping for an AI app builder for a specific job.
 *
 * Update both `keywords` and `metaDescription` when you tune for SERP
 * intent — they affect title tags and OG descriptions on the rendered
 * page. Keep `metaDescription` under 160 chars.
 */

export interface UseCase {
  slug: string
  title: string
  /** H1 on the page; can be the same as `title` or expanded. */
  heading: string
  /** Two-to-three sentences below the H1. */
  subhead: string
  /** Primary keyword this page targets. */
  primaryKeyword: string
  /** Long-tail variants that should appear naturally in body copy. */
  secondaryKeywords: string[]
  /** Up to 6 short bullets describing what the agent will scaffold. */
  whatYouShip: string[]
  /** Step-by-step prompt template the user can paste. */
  promptTemplate: string
  /** Stack the agent typically defaults to for this use case. */
  stack: string[]
  /** Two-line story of who this is for. */
  whoFor: string
  /** Closest matching cluster id from .seo-engine/data/topic-clusters.yaml. */
  clusterId: string
  /** Meta description (≤160 chars). */
  metaDescription: string
}

export const USE_CASES: UseCase[] = [
  {
    slug: 'saas',
    title: 'AI SaaS Builder',
    heading: 'Build a SaaS app from a single prompt.',
    subhead:
      'Auth, billing, dashboard, marketing site, and a database — generated in one session and running in a real sandbox.',
    primaryKeyword: 'ai saas builder',
    secondaryKeywords: [
      'ai saas generator',
      'build saas with ai',
      'saas mvp builder',
      'ai saas starter',
    ],
    whatYouShip: [
      'Marketing landing page with hero, pricing, and FAQ',
      'Email + GitHub auth backed by a real database',
      'Stripe Checkout and a credit ledger',
      'Tenant-scoped dashboard with row-level security',
      'Webhooks for subscriptions and invoices',
      'Deploy preview URL ready to share',
    ],
    promptTemplate:
      'Build a B2B SaaS for {your audience} that lets them {core job}. Use Next.js, Tailwind, and Supabase. Include email + GitHub auth, a Stripe-powered subscription with three tiers, and a dashboard that respects RLS so each tenant only sees their own data.',
    stack: ['Next.js 16', 'Tailwind CSS v4', 'Supabase', 'Stripe', 'Vercel Sandbox'],
    whoFor:
      'Indie founders shipping a v1, agencies prototyping a SaaS for a client, and engineers who want a credible scaffold before going deep.',
    clusterId: 'tc_ai_app_generator',
    metaDescription:
      'Generate a working SaaS — auth, billing, dashboard, database — from a single prompt. Real sandbox, live preview, full source.',
  },
  {
    slug: 'dashboard',
    title: 'AI Dashboard Generator',
    heading: 'Generate a real dashboard, not a static mock.',
    subhead:
      'Charts, tables, filters, and CRUD wired into a live database. The agent runs the dev server so you click through the actual UI, not a screenshot.',
    primaryKeyword: 'ai dashboard generator',
    secondaryKeywords: [
      'ai dashboard builder',
      'generate dashboard with ai',
      'admin dashboard ai',
      'analytics dashboard generator',
    ],
    whatYouShip: [
      'Tabular and chart-based views with shadcn/ui primitives',
      'Filtering, search, and pagination wired to a Postgres backend',
      'CRUD modals for the entities the prompt describes',
      'Role-based access (viewer / editor / admin)',
      'Export to CSV and a public share link per record',
      'Responsive layout that works on tablets and phones',
    ],
    promptTemplate:
      'Build an admin dashboard for {entity} with table and chart views. Show {three or four columns}. Add filtering by {two filters}, full CRUD, and a viewer/editor/admin role split. Use Next.js, shadcn/ui, Recharts, and Supabase.',
    stack: ['Next.js 16', 'shadcn/ui', 'Tailwind CSS v4', 'Recharts', 'Supabase'],
    whoFor:
      'Operators who need an internal admin tool, founders who want a real dashboard before pitching, and PMs who want clickable proof of a feature.',
    clusterId: 'tc_ai_app_generator',
    metaDescription:
      'AI dashboard generator that ships a clickable dashboard — charts, tables, CRUD, role-based access — wired to a live database.',
  },
  {
    slug: 'internal-tool',
    title: 'AI Internal Tool Builder',
    heading: 'Internal tools that beat the spreadsheet.',
    subhead:
      'Replace fragile spreadsheets and Notion views with a typed, multi-user, role-aware app — generated from your description and running in a sandbox in minutes.',
    primaryKeyword: 'ai internal tool builder',
    secondaryKeywords: [
      'internal tool generator',
      'replace spreadsheet with ai',
      'ai retool alternative',
      'ai admin panel builder',
    ],
    whatYouShip: [
      'Login flow with team membership and role gates',
      'Forms with validation and audit logging',
      'A live activity feed of who changed what',
      'CSV import with a typed schema check',
      'Slack or webhook notifications on key events',
      'Self-hosted under your domain',
    ],
    promptTemplate:
      'Build an internal tool that replaces our {process} spreadsheet. The team needs {three actions} with role-based access (viewer / editor / admin), audit logging, and a Slack webhook on each create/update/delete. Use Next.js, Tailwind, and Supabase.',
    stack: ['Next.js 16', 'Tailwind CSS v4', 'Supabase', 'Vercel Sandbox'],
    whoFor:
      'Ops teams drowning in spreadsheets, technical PMs who want to ship a real internal tool without a full sprint, and engineers replacing legacy admin panels.',
    clusterId: 'tc_ai_app_generator',
    metaDescription:
      'AI internal tool builder. Replace spreadsheets with a typed, multi-user, role-aware app generated from a single prompt.',
  },
  {
    slug: 'landing-page',
    title: 'AI Landing Page Generator',
    heading: 'Ship a landing page that actually converts.',
    subhead:
      'A real Next.js project with a hero, features, social proof, FAQ, and a working signup flow — not a copy-pasted template.',
    primaryKeyword: 'ai landing page generator',
    secondaryKeywords: [
      'landing page builder ai',
      'generate landing page with ai',
      'ai marketing site builder',
      'ai landing page template',
    ],
    whatYouShip: [
      'Hero with headline, sub-headline, and primary CTA',
      'Features grid backed by your real product copy',
      'Social proof, logo strip, and a 3-tier pricing table',
      'FAQ with FAQPage schema for richer SERPs',
      'Email capture wired to your provider of choice',
      'OG image and metadata generated for sharing',
    ],
    promptTemplate:
      'Build a landing page for {product} aimed at {audience}. Include a hero, a features grid with three benefits, a social proof strip with placeholder logos, a 3-tier pricing table, a FAQ with five questions, and an email capture wired to {provider}.',
    stack: ['Next.js 16', 'Tailwind CSS v4', 'shadcn/ui', 'Vercel Sandbox'],
    whoFor:
      'Indie hackers launching a side project, founders running a quick test, and marketing teams who need a real coded page rather than a Webflow export.',
    clusterId: 'tc_ai_app_generator',
    metaDescription:
      'AI landing page generator that ships a real Next.js project — hero, pricing, FAQ, signup — with proper schema and a working CTA.',
  },
  {
    slug: 'mvp',
    title: 'AI MVP Builder',
    heading: 'From idea to running MVP in one sitting.',
    subhead:
      'Skip the boilerplate week. Describe the product, pick the models, and watch the agent ship a working MVP into a real sandbox.',
    primaryKeyword: 'ai mvp builder',
    secondaryKeywords: [
      'build mvp with ai',
      'ai mvp generator',
      'fastest way to build mvp',
      'mvp prompt to app',
    ],
    whatYouShip: [
      'Auth and a tenant-scoped database',
      'The two or three core flows your idea needs',
      'A landing page that explains the value prop',
      'Stripe checkout if the idea has a price',
      'Public share link your investors or beta users can hit today',
      'A README the next engineer can pick up cleanly',
    ],
    promptTemplate:
      'Build an MVP for {one-line idea}. Target user is {audience}. Required flows are {flow 1}, {flow 2}, and {flow 3}. Include auth, a database, a landing page, and a public preview link. Default stack: Next.js, Tailwind, Supabase.',
    stack: ['Next.js 16', 'Tailwind CSS v4', 'Supabase', 'Stripe', 'Vercel Sandbox'],
    whoFor:
      'First-time founders validating an idea, hackathon teams who need a real artifact by demo time, and seasoned engineers who want a credible v1 without 40 hours of scaffolding.',
    clusterId: 'tc_ai_app_generator',
    metaDescription:
      'AI MVP builder. Describe your idea, pick the models, and ship a real running MVP — auth, database, landing page, and a share link — in one sitting.',
  },
  {
    slug: 'crud-app',
    title: 'AI CRUD App Builder',
    heading: 'Working CRUD in minutes, not days.',
    subhead:
      'List, detail, create, update, delete — for whatever entity you describe. With a typed database, real validation, and a UI that doesn\u2019t look like a wireframe.',
    primaryKeyword: 'ai crud app builder',
    secondaryKeywords: [
      'generate crud app with ai',
      'ai crud generator',
      'crud app from prompt',
      'ai resource manager',
    ],
    whatYouShip: [
      'Schema and migration for your entity',
      'List page with search, sort, and pagination',
      'Detail page with related records and actions',
      'Create and edit forms with zod validation',
      'Delete with a confirmation dialog and audit trail',
      'Auth + RLS so users only see their own rows',
    ],
    promptTemplate:
      'Build a CRUD app for {entity} with fields {field 1}, {field 2}, {field 3}. Include list, detail, create, edit, and delete pages. Use zod for validation, shadcn/ui for the UI, and Supabase with RLS so each user only sees their own rows.',
    stack: ['Next.js 16', 'shadcn/ui', 'Tailwind CSS v4', 'zod', 'Supabase'],
    whoFor:
      'Engineers who would otherwise scaffold this by hand for the 50th time, and non-technical founders who want a real CRUD app behind their landing page.',
    clusterId: 'tc_ai_app_generator',
    metaDescription:
      'AI CRUD app builder. List, detail, create, update, delete \u2014 with a typed database, validation, RLS, and a polished UI from a single prompt.',
  },
]

export function listUseCaseSlugs(): string[] {
  return USE_CASES.map((u) => u.slug)
}

export function getUseCase(slug: string): UseCase | null {
  return USE_CASES.find((u) => u.slug === slug) ?? null
}

export function listUseCases(): UseCase[] {
  return USE_CASES
}

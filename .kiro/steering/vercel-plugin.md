# Vercel plugin (vendored skills, agents, commands)

The `vercel/vercel-plugin` content has been vendored into
`.kiro/vercel-plugin/` so its guidance is available even though the
`npx plugins` installer doesn't support Kiro yet.

This file is the always-on index. It deliberately stays small: it tells
you *what's available* and *where to read it on demand*. Do not paste
the full contents of skills into context unless they're relevant to the
task at hand.

## When to use

When working on anything Vercel-adjacent in this repo (deployment, env
vars, Next.js App Router, AI SDK, Vercel storage, sandboxes, marketplace
integrations, middleware, caching, CLI usage), open the matching skill
before answering or coding. The skills carry March 2026-current product
knowledge and override older training data.

The ecosystem graph at `.kiro/vercel-plugin/vercel.md` is the master
reference for how Vercel products relate, decision matrices, and migration
awareness for sunset products. Read it first when you don't know which
skill applies.

## How to read a skill

Each skill lives at `.kiro/vercel-plugin/skills/<name>/SKILL.md`. The
frontmatter includes:

- `metadata.pathPatterns` / `bashPatterns` / `importPatterns` — concrete
  signals that the skill applies to the current task.
- `chainTo` — other skills you should also load when certain patterns
  show up.
- `validate` — anti-patterns to flag in the user's code.

Read the frontmatter quickly, then read the body for the actual rules.

## Skill catalog

| Skill | When to load |
| --- | --- |
| `ai-gateway` | Vercel AI Gateway — unified model API, provider routing, failover, cost tracking. |
| `ai-sdk` | AI SDK v6 — text/object generation, streaming, tool calling, agents, MCP, embeddings. |
| `auth` | Auth integrations — Clerk, Descope, Auth0 setup for Next.js with Marketplace provisioning. |
| `bootstrap` | First-time repo setup — `vercel link`, env provisioning, db setup, first-run commands. |
| `chat-sdk` | Multi-platform chat bots — Slack, Telegram, Teams, Discord, Google Chat, GitHub, Linear. |
| `deployments-cicd` | Deploy, promote, rollback, `--prebuilt`, CI workflow files. |
| `env-vars` | `.env` files, `vercel env` commands, OIDC tokens. |
| `knowledge-update` | Plugin/knowledge update guidance (rarely needed at task time). |
| `marketplace` | Integration discovery, install, auto-provisioned env vars, unified billing. |
| `next-cache-components` | Next.js 16 Cache Components — PPR, `use cache`, `cacheLife`, `cacheTag`, `updateTag`. |
| `next-forge` | next-forge monorepo starter — Turborepo, Clerk, Prisma/Neon, Stripe, shadcn/ui. |
| `next-upgrade` | Next.js version upgrades — codemods, migration guides, dependency updates. |
| `nextjs` | App Router, Server Components, Server Actions, routing, rendering strategies. |
| `react-best-practices` | 64 React/Next.js performance and correctness rules across 8 categories. |
| `routing-middleware` | Request interception before cache, rewrites, redirects, personalization. |
| `runtime-cache` | Ephemeral per-region KV cache, tag-based invalidation. |
| `shadcn` | shadcn/ui CLI, component installation, custom registries, theming, Tailwind. |
| `turbopack` | Next.js bundler, HMR, configuration, Turbopack vs Webpack. |
| `vercel-agent` | AI-powered code review, incident investigation, PR analysis. |
| `vercel-cli` | All `vercel` CLI commands — deploy, env, dev, domains, cache, MCP, marketplace. |
| `vercel-firewall` | Vercel Firewall rules, bot protection, rate limiting. |
| `vercel-functions` | Serverless, Edge, Fluid Compute, streaming, Cron Jobs, configuration. |
| `vercel-sandbox` | Ephemeral Firecracker microVMs for running untrusted/AI-generated code. |
| `vercel-storage` | Blob, Edge Config, Neon Postgres, Upstash Redis, sunset-package migration. |
| `verification` | End-to-end verification — user story → browser → API → data → response. |
| `workflow` | Workflow DevKit — durable execution, DurableAgent, steps, Worlds, pause/resume. |

## Specialist agents

Read these `.kiro/vercel-plugin/agents/*.md` files when the task fits
their specialty — they aren't separate runnable agents in Kiro, but the
checklists and decision frameworks they ship with are useful prompts.

- `deployment-expert.md` — CI/CD pipelines, deploy strategies, troubleshooting, env vars.
- `performance-optimizer.md` — Core Web Vitals, rendering strategies, caching, asset optimization.
- `ai-architect.md` — AI application design, model selection, streaming architecture, MCP.

## Workflow playbooks

The `.kiro/vercel-plugin/commands/*.md` files are the original slash
commands. They document multi-step workflows that pair with the skills:

- `bootstrap.md` — full project bootstrap orchestration.
- `deploy.md` — deploy to preview or production.
- `env.md` — environment variable management.
- `marketplace.md` — discover and install marketplace integrations.
- `status.md` — project status overview.

Treat them as runbooks. Walk through their steps in order rather than
free-styling deployments or env edits.

## Repo-specific notes

- This project also has a `lib/site.ts` canonical-URL rule
  (see `.kiro/steering/site-url.md`). When a Vercel skill suggests
  hardcoding origins, defer to the site-url rule.
- Commands in skills assume a POSIX shell. On this Windows + cmd shell
  setup, adapt syntax (`comm`, heredocs, `$( ... )`) before running.

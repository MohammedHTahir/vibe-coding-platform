# Phase 3 — Block 2 definitional cluster (2026-05-23)

Ships the definitional cluster from `.seo-engine/data/content-queue.yaml`.
Three new long-form posts plus a major refresh of the existing
vibe-coding entry, totalling four canonical pillars across the SEO
engine's five clusters.

Block 2 is the connective tissue between the comparison posts (Phase 2)
and the eventual Block 3 architecture pillars: it covers the
"what is X?" intent for every major head term in the keyword set
(`vibe coding`, `ai app generator`, `prompt to app`, `how to generate
apps with ai`).

## New / refreshed posts

| Slug | Title | Cluster | Word count | Targets | Status |
| --- | --- | --- | --- | --- | --- |
| `what-is-vibe-coding` | Vibe Coding: A Practical Guide to AI-Driven Build Sessions in 2026 | `tc_vibe_coding` | ~2,200 | `vibe coding`, `what is vibe coding`, `vibe coding workflow` | Refreshed (originally 2026-05-15) |
| `what-is-an-ai-app-generator` | What Is an AI App Generator? A 2026 Primer for Builders | `tc_ai_app_generator` | ~1,900 | `ai app generator`, `what is an ai app generator` | New |
| `what-is-prompt-to-app` | What Is Prompt to App? The Loop Between Intent and a Live Preview | `tc_prompt_to_app` | ~1,900 | `prompt to app`, `what is prompt to app` | New |
| `how-to-generate-apps-with-ai` | How to Generate an App With AI in Under 10 Minutes | `tc_ai_app_generator` | ~2,200 | `how to generate apps with ai`, `build app with ai in 10 minutes` | New |

All four posts share the structural pillars established in Phase 2:
honest opening, decision matrices, FAQ, sources block, "Last reviewed"
stamp, and aggressive cross-linking into the `/blog/sprintbuild-vs-*`
posts and the `/vs` and `/build` programmatic hubs.

## What each post covers

### `what-is-vibe-coding` (refresh)

The original 2026-05-15 post was a definitional explainer with the
legacy `vibe-coding-101` cluster id. Phase 3 rewrites it into the
formal pillar for `tc_vibe_coding`:

- Leads with the 5-step loop (describe → run → preview → auto-fix → ship)
- Walks through the 5 runtime architectures with deep links to the
  comparison posts
- Covers per-turn model choice as an underrated productivity lever
- Includes a 30-minute worked SaaS example
- Cites Karpathy's original X post as the primary source

Consolidates `q_001` (the pillar) and `q_008` (the cluster page) into
one canonical URL to avoid keyword cannibalisation. Both queue entries
now point at `/blog/what-is-vibe-coding`.

### `what-is-an-ai-app-generator` (new pillar)

Pillar for `tc_ai_app_generator`. Defines the category in one sentence,
then unpacks the four required pieces (prompt surface, agent, runtime,
preview), the architectural axis (5 runtime types), what the category
ships and doesn't ship, and a production-readiness checklist (auth,
RLS, error handling, observability, secrets, Stripe webhook signatures).

The unique angle from the queue (`q_003`): production-readiness as a
checklist most posts dodge.

### `what-is-prompt-to-app` (new pillar)

Pillar for `tc_prompt_to_app`. Walks through the four moving parts of
a prompt-to-app product, the anatomy of a session (the actual tool
calls the agent emits), the execution-model decision matrix, why model
choice matters, and the 30-minute test for evaluating any tool in the
category.

The unique angle from the queue (`q_004`): walks through what's
*actually happening* on every keystroke, not just the user-facing UI.

### `how-to-generate-apps-with-ai` (new tutorial)

Cluster page for `tc_ai_app_generator`. Timestamped 0:00–10:00
walkthrough of generating a real SaaS prompt (restaurant shift
scheduling). Includes the prompt template, what's working at 10
minutes, what's missing or partial, a 7-item pre-launch verification
checklist, and recommended follow-up prompts.

The unique angle from the queue (`q_010`): timestamps and an honest
"what's done vs what's not" breakdown.

## Internal-link graph after Phase 3

The full graph as of this phase:

```
            ┌───────────────────────────────────────────┐
            │  /blog/best-ai-coding-tools-2026 (listicle)│
            └───────────────┬───────────────────────────┘
                            │
       ┌────────────────────┼────────────────────┐
       │                    │                    │
       ▼                    ▼                    ▼
 sprintbuild-vs-      what-is-vibe-       what-is-an-ai-
 {lovable, bolt-new,   coding (pillar)    app-generator
  v0, replit-agent,                       (pillar)
  base44}              what-is-prompt-     how-to-generate-
                       to-app (pillar)     apps-with-ai
                                           (tutorial)
       │                    │                    │
       └────────────────────┼────────────────────┘
                            │
                            ▼
                  /vs/{competitor}
                  /alternatives/{competitor}
                  /build/{type}
```

Every Block 1 post (Phase 2) links to every Block 2 post, and vice
versa. Every cluster pillar links to all five comparison posts. Every
post includes a stable bottom-of-page "Related reading" section so
internal-link credit flows around the cluster.

## SEO engine state

- `.seo-engine/data/content-queue.yaml`:
  - `q_001` (vibe coding pillar) → `published`, points at `/blog/what-is-vibe-coding`, `last_refreshed_at: 2026-05-23`
  - `q_003` (ai app generator pillar) → `published`, points at `/blog/what-is-an-ai-app-generator`
  - `q_004` (prompt to app pillar) → `published`, points at `/blog/what-is-prompt-to-app`
  - `q_008` (what is vibe coding cluster) → `published` and consolidated into `q_001` to avoid cannibalisation
  - `q_010` (how to generate apps with ai cluster) → `published`, points at `/blog/how-to-generate-apps-with-ai`
- `.seo-engine/data/content-map.yaml`:
  - `what-is-vibe-coding` entry refreshed with new title, expanded keyword targets, and Phase 3 refresh note
  - Three new entries added for `what-is-an-ai-app-generator`,
    `what-is-prompt-to-app`, `how-to-generate-apps-with-ai` with full
    metadata, sources arrays, and `queue_id` back-references

## Status across the original content queue

Original queue items (`q_001` through `q_010`):

- `q_001` Vibe coding pillar — **published** (Phase 3 refresh)
- `q_002` AI coding platform pillar — planned (Block 3)
- `q_003` AI app generator pillar — **published** (Phase 3)
- `q_004` Prompt to app pillar — **published** (Phase 3)
- `q_005` Next.js AI agent pillar — planned (Block 4 / engineering audience)
- `q_006` SprintBuild vs Lovable — published (Phase 2)
- `q_006b` SprintBuild vs v0 — published (Phase 2)
- `q_007` SprintBuild vs Bolt.new — published (Phase 2)
- `q_007b` SprintBuild vs Replit Agent — published (Phase 2)
- `q_007c` SprintBuild vs Base44 — published (Phase 2)
- `q_008` What is vibe coding (cluster) — published, consolidated into q_001
- `q_009` Best AI coding tools listicle — published (Phase 2 refresh)
- `q_010` How to generate apps with AI — **published** (Phase 3)

## What this leaves for Phase 4

Block 3 from the SEO plan: the remaining cluster pillars and their
satellite cluster pages. Specifically:

- `q_002` "AI Coding Platform: How They Work and How to Choose One" — the broadest pillar in the topic set. Best handled with a SERP analysis pass first per the queue's `serp_analyzed` flag.
- Cluster pages for `tc_vibe_coding`: "Vibe Coding Tools" (comparative roundup), "A Vibe Coding Workflow That Actually Ships".
- Cluster pages for `tc_ai_coding_platform`: "Best AI Coding Platforms for Startups", "Sandboxed vs Local AI Coding".
- Cluster pages for `tc_ai_app_generator`: "AI App Generators for Non-Technical Founders", "Are AI-Generated Apps Production-Ready?".
- Cluster pages for `tc_prompt_to_app`: "Prompt to Full-Stack App", "Prompt Engineering for App Generation", "Prompt Templates for Common App Types".

Block 4 (engineering pillars) targets the `tc_nextjs_ai_agent` cluster
and is the highest-leverage path for backlinks since the audience is
likely to actually link to high-quality engineering content.

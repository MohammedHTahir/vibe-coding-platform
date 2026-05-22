# Phase 4 — Cornerstone pillar + cluster pages (2026-05-23)

Ships the architecture-level cornerstone pillar (`q_002`) plus four
satellite cluster pages spanning two clusters. This is the connective
tissue between Phase 2 (5 comparisons) and Phase 3 (4 definitional
pillars) — a buyer-grade architectural argument with deep links to
everything published so far.

## New posts

| Slug | Title | Cluster | Word count |
| --- | --- | --- | --- |
| `ai-coding-platform` | AI Coding Platform: How They Work and How to Choose One in 2026 | `tc_ai_coding_platform` (pillar) | ~2,400 |
| `vibe-coding-tools` | Vibe Coding Tools: A 2026 Comparison Across Every Execution Model | `tc_vibe_coding` | ~1,700 |
| `sandboxed-vs-local-ai-coding` | Sandboxed vs Local AI Coding: Why Execution Matters in 2026 | `tc_ai_coding_platform` | ~1,900 |
| `ai-coding-platforms-for-startups` | AI Coding Platforms for Startups: A 2026 Buyer's Guide | `tc_ai_coding_platform` | ~2,100 |
| `are-ai-generated-apps-production-ready` | Are AI-Generated Apps Production-Ready? A 2026 Honest Assessment | `tc_ai_app_generator` | ~2,300 |

Total: ~10,400 words across 5 posts. All five share the structural
template established in Phases 2 and 3: honest opening, decision
matrices, FAQ, sources block, "Last reviewed" stamp, aggressive
cross-linking.

## Why this set, in this order

The cornerstone pillar (`ai-coding-platform`) is the broadest keyword
in the SEO engine's seeded set. It needed to ship before the satellite
cluster pages because every cluster page links back to it as the
canonical authority on the topic.

Three of the four cluster pages (`sandboxed-vs-local-ai-coding`,
`ai-coding-platforms-for-startups`, `vibe-coding-tools`) are
intentionally architectural rather than feature-driven. They argue
SprintBuild's category positioning at the architectural level — real
Linux per session, frontier-model choice — without rehashing the
already-published comparison content.

The fourth (`are-ai-generated-apps-production-ready`) is a reassurance
piece that addresses the biggest objection in the AI-coding category:
"can I trust this?" The 10-item checklist is the answer; the post is
also the most likely link target from external developer-audience
content because it's directly useful as a pre-launch reference.

## SEO engine state

- `.seo-engine/data/content-queue.yaml`:
  - `q_002` (AI coding platform pillar) → `published`, points at `/blog/ai-coding-platform`
  - 4 new entries added: `q_011` (vibe coding tools), `q_012` (sandboxed vs local), `q_013` (startups), `q_014` (production-ready)
- `.seo-engine/data/content-map.yaml`:
  - 5 new `blogs` entries with full metadata, target keywords, sources arrays, and `queue_id` back-references

## Coverage by cluster after Phase 4

```
tc_ai_coding_platform:
  Pillar:          ai-coding-platform              ✅ Phase 4
  Cluster pages:   sandboxed-vs-local-ai-coding    ✅ Phase 4
                   ai-coding-platforms-for-startups ✅ Phase 4
  Comparisons:     5 /blog/sprintbuild-vs-* posts  ✅ Phase 2
  Listicle:        best-ai-coding-tools-2026        ✅ Phase 2 refresh

tc_vibe_coding:
  Pillar:          what-is-vibe-coding              ✅ Phase 3 refresh (on phase-3 branch)
  Cluster pages:   vibe-coding-tools                ✅ Phase 4
                   (vibe-coding-workflow)            🟡 planned

tc_ai_app_generator:
  Pillar:          what-is-an-ai-app-generator     ✅ Phase 3 (on phase-3 branch)
  Cluster pages:   how-to-generate-apps-with-ai    ✅ Phase 3 (on phase-3 branch)
                   are-ai-generated-apps-production-ready ✅ Phase 4
                   (ai-app-generators-non-technical) 🟡 planned

tc_prompt_to_app:
  Pillar:          what-is-prompt-to-app            ✅ Phase 3 (on phase-3 branch)
  Cluster pages:   (prompt-to-full-stack-app)       🟡 planned
                   (prompt-engineering-for-app-generation) 🟡 planned
                   (prompt-templates-for-apps)      🟡 planned

tc_nextjs_ai_agent (engineering audience):
  Pillar:          (nextjs-ai-agent)                🟡 planned (Block 5)
  Cluster pages:   all planned                      🟡 planned (Block 5)
```

## Branch sequencing note

This Phase 4 branch was cut from `main`, which currently has Phases 0,
1, and 2 merged but **not** Phase 3. The Phase 4 posts cross-link to
Phase 3 slugs (`what-is-an-ai-app-generator`, `what-is-prompt-to-app`,
`how-to-generate-apps-with-ai`, the refreshed `what-is-vibe-coding`).

Consequences:
- The build succeeds — Next.js doesn't validate internal MDX links at
  build time
- In production after merge, those links resolve correctly only once
  Phase 3 is also on main
- **Recommended merge order**: Phase 3 first, then Phase 4

If Phase 4 is merged before Phase 3, four cross-links per post will
404 until Phase 3 ships. Not catastrophic but worth getting right.

## What this leaves for Phase 5

The remaining content from the SEO plan:

- `q_005` Building an AI Agent with Next.js — the engineering pillar
  for the highest-leverage backlink-friendly cluster
- 3 cluster pages under `tc_prompt_to_app`: prompt-to-full-stack-app,
  prompt-engineering-for-app-generation, prompt-templates-for-apps
- 1 cluster page under `tc_vibe_coding`: a vibe-coding-workflow post
- 1 cluster page under `tc_ai_app_generator`: ai-app-generators-non-technical

Phase 5 should also include the engineering-audience long-tail posts
that aren't in the original queue but were called out in the SEO plan:

- Streaming Tool Calls in Next.js with the AI SDK
- Running Agent Code Inside a Next.js Sandbox
- Vercel Sandbox vs WebContainer (a builder's comparison)
- Building Multi-Model Agents with Vercel AI Gateway
- Edge Session Refresh with Supabase + Next.js Proxy

These are the posts most likely to attract real backlinks since the
audience is technical and the content is unusually specific.

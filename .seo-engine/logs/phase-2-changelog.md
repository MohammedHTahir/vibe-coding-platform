# Phase 2 — Block 1 content sprint (2026-05-23)

Ships the comparison block from `.seo-engine/data/content-queue.yaml`.
Five long-form MDX posts plus a refreshed listicle, all targeting Tier-A
keywords from the SEO plan: `[brand] vs [competitor]`, `[competitor]
alternative`, `best ai coding tools`.

Each post is sourced against the competing vendor's own docs and pricing
page, has a "Last verified" stamp, and deep-links into the corresponding
`/vs/[competitor]` programmatic page from Phase 1.

## New posts

| Slug | Title | Word count | Targets |
| --- | --- | --- | --- |
| `sprintbuild-vs-lovable` | SprintBuild vs Lovable: Which AI App Generator Should You Pick in 2026? | ~1,800 | `sprintbuild vs lovable`, `lovable alternative` |
| `sprintbuild-vs-bolt-new` | SprintBuild vs Bolt.new: Cloud Sandbox vs WebContainer in 2026 | ~1,800 | `sprintbuild vs bolt new`, `bolt new alternative` |
| `sprintbuild-vs-v0` | SprintBuild vs v0 by Vercel: Multi-Model AI Coding vs Vercel-Native | ~1,800 | `sprintbuild vs v0`, `v0 alternative` |
| `sprintbuild-vs-replit-agent` | SprintBuild vs Replit Agent: Cloud Sandbox vs Cloud IDE in 2026 | ~1,800 | `sprintbuild vs replit agent`, `replit agent alternative` |
| `sprintbuild-vs-base44` | SprintBuild vs Base44: Cloud Sandbox vs Managed App Platform in 2026 | ~1,800 | `sprintbuild vs base44`, `base44 alternative` |

All five posts share the same structural template:

1. Honest opening with the architectural diff
2. TL;DR (when to pick which)
3. Architecture deep-dive
4. Model story
5. Pricing snapshot
6. Feature matrix
7. When the competitor is the right pick
8. When SprintBuild is the right pick
9. Migration notes (if applicable)
10. FAQ (5 questions)
11. Sources (4–5 verified URLs)
12. Related reading (5 cross-links)
13. "Last reviewed" stamp

## Refreshed post

`best-ai-coding-tools-2026.mdx` (originally shipped 2026-05-12) was
rewritten end-to-end:

- Expanded from 4 platforms to 6 (added v0 and Base44)
- Picks now grouped by persona instead of generic ranking
- Added an architectural-diff table at the top
- Replaced the loose pricing list with a "cheapest paid tier" table
- Replaced the loose feature comparison with the canonical matrix used
  on the `/vs/[competitor]` pages so claims stay consistent
- Added 5 FAQ entries with the most common queries
- Added 14 sources cited inline
- Deep-links into all 5 `/blog/sprintbuild-vs-*` posts and the
  `/vs` hub

## Internal-link graph

Phase 2 establishes a tight loop between the programmatic surface and
the long-form blog posts:

```
/blog/best-ai-coding-tools-2026
  ↔ /blog/sprintbuild-vs-{lovable, bolt-new, v0, replit-agent, base44}
  ↔ /vs/{lovable, bolt-new, v0, replit-agent, base44}
  ↔ /alternatives/{lovable, bolt-new, v0, replit-agent, base44}
```

Every blog post links to the matching programmatic page and to all four
sibling comparison posts. Every programmatic page links to the matching
blog post (via the existing /vs/* routes from Phase 1).

## SEO engine state

- `.seo-engine/data/content-queue.yaml` — queue items `q_006`, `q_007`,
  `q_009` flipped to `status: published` with `published_slug`,
  `published_at`, `serp_analyzed: true`. Three new entries added
  (`q_006b`, `q_007b`, `q_007c`) for the v0 / Replit Agent / Base44
  comparisons that weren't originally in the queue.
- `.seo-engine/data/content-map.yaml` — five new `blogs` entries (one
  per comparison post) with full metadata and a `sources` array. The
  refreshed listicle entry is updated with `needs_refresh: false` and a
  Phase 2 refresh note.

## What this leaves for Phase 3

Block 1 of the content queue is done. Block 2 (definitional cluster
pages) is next:

- `q_008` "What Is Vibe Coding?" — refresh of the existing post to
  match the formal pillar treatment per the queue.
- `q_010` "How to Generate an App with AI in Under 10 Minutes" —
  still planned.
- New: "What Is an AI App Generator" (definitional twin).
- New: "What Is Prompt-to-App?" (definitional twin).

Block 3 (pillar pages) requires real SERP analysis per the queue's
own `serp_analyzed: false` flag — that's a manual step that should
happen before Phase 3 starts.

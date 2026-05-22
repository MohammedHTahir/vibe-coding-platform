# Phase 1 — Programmatic surface area (2026-05-23)

Builds the programmatic SEO surface that turns the keyword research in
`.seo-engine/data/seo-keywords.csv` into actual indexable URLs. The
emphasis is on Tier-A keywords from the SEO plan: `[competitor]
alternative`, `[brand] vs [competitor]`, and use-case keywords like
`ai saas builder` / `ai dashboard generator`.

## New routes

### Comparison pages

- Hub: `/vs` — lists all comparisons.
- Detail: `/vs/[competitor]` — five generated pages:
  - `/vs/lovable`
  - `/vs/bolt-new`
  - `/vs/v0`
  - `/vs/replit-agent`
  - `/vs/base44`

Each detail page emits BlogPosting + BreadcrumbList + FAQPage JSON-LD,
shows a TL;DR card, an architecture diff explainer, the typed feature
matrix, pros/cons cards, a pricing snapshot, a "when to pick which"
section, an FAQ, cross-links to the other comparisons + the matching
`/alternatives/[competitor]` page, and a sources block citing the
vendor docs we verified against.

### Alternative pages

- Hub: `/alternatives` — lists all alternative routes.
- Detail: `/alternatives/[competitor]` — same five competitors. Different
  intent angle: leads with what the incumbent does well ("if these four
  bullets describe what you need, stay on them"), then four reasons
  builders switch, the comparison table, FAQ, cross-links.

### Use-case pages

- Hub: `/build` — lists all use cases.
- Detail: `/build/[type]` — six generated pages:
  - `/build/saas`
  - `/build/dashboard`
  - `/build/internal-tool`
  - `/build/landing-page`
  - `/build/mvp`
  - `/build/crud-app`

Each detail page emits BlogPosting + BreadcrumbList + FAQPage JSON-LD,
shows what ships in one session, a starter prompt the user can paste,
the default stack, who the use case is for, an FAQ, and cross-links to
the other use cases.

## New modules

### `lib/competitors.ts`

Typed data layer for every comparison page. Mirrors
`.seo-engine/data/competitors.yaml` (the SEO engine's source of truth)
in TypeScript so pages don't need YAML parsing at build time. Exports:

- `Competitor`, `CompetitorFeatureCell`, `FeatureSupport` types
- `FEATURES` — the row schema for the comparison table
- `SPRINTBUILD_ROW` — our own column on every comparison
- `listCompetitors()`, `getCompetitor(slug)`, `listCompetitorSlugs()`
- `supportLabel()`, `supportBadgeProps()` — render helpers

Five competitors fully populated with verified data (last verified
2026-05-23): Lovable, Bolt.new, v0, Replit Agent, Base44. Each row
captures execution model, models, deploy targets, pricing, strengths,
weaknesses, an 11-feature matrix, and a `sources` array with the URLs
we cited.

### `lib/use-cases.ts`

Typed data for `/build/[type]` pages. Six entries: saas, dashboard,
internal-tool, landing-page, mvp, crud-app. Each row carries primary
keyword, secondary keywords, what ships, starter prompt template,
default stack, target audience, cluster id, and meta description.

### `components/seo/comparison-table.tsx`

Single shared table component used on `/vs/[competitor]` and
`/alternatives/[competitor]`. Reads `FEATURES` from
`lib/competitors.ts` so adding a row propagates everywhere.

### Home-page sections

- `components/marketing/use-cases.tsx` — six-card grid linking into
  `/build/[type]` pages.
- `components/marketing/compare.tsx` — five-card grid linking into
  `/vs/[competitor]` pages.

Both wired into `app/page.tsx` between Models and FAQ.

## Updated routes / files

- `app/page.tsx` — added the `UseCases` and `CompareStrip` sections.
- `app/sitemap.ts` — added `/vs`, `/alternatives`, `/build` hubs and
  every generated child page.
- `app/pricing/page.tsx` — added an 8-question pricing FAQ with
  `FAQPage` JSON-LD.
- `components/marketing/footer.tsx` — added "Use cases" and "Compare"
  to the link list.
- `.seo-engine/data/competitors.yaml` — full Phase 1 verification pass.
  Every competitor now has populated strengths, weaknesses, pricing
  notes, plus a verified date. The `feature_matrix` is fully populated
  across all 10 features and 5 competitors with confidence and
  `last_verified` per cell.
- `.seo-engine/data/content-map.yaml` — added a `programmatic_pages`
  section listing all 16 new routes with target keywords, kind, and
  cluster id.

## Trade-offs and follow-ups

- **GitHub export status.** SprintBuild's row claims `partial` on
  `feat_github_export` and `feat_one_click_deploy`. This matches the
  current product (file explorer + manual export, sandbox preview URL).
  When native push and one-click deploy ship, flip both to `yes` in
  `lib/competitors.ts` AND `.seo-engine/data/competitors.yaml`.
- **Real screenshots and demo videos.** Every comparison and use-case
  page would convert better with embedded screenshots from the
  product. This phase deliberately skipped media so the routes ship
  fast and indexable; Phase 2 should layer in `/public/seo/<slug>.png`
  hero images plus a short MP4 per use case.
- **Listicle migration.** The existing
  `src/content/blog/best-ai-coding-tools-2026.mdx` post overlaps with
  the comparison hub. Phase 2 should rewrite that post to deep-link
  into the `/vs/[competitor]` pages and lean on the typed data.
- **Re-verification cadence.** Each competitor row has a
  `lastVerified` timestamp. Set a quarterly hook to re-check vendor
  docs and bump it; SEO trust degrades quickly when comparison content
  goes stale.

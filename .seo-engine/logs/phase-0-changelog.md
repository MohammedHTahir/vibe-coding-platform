# Phase 0 — Foundation (2026-05-23)

Implements the Phase 0 work from the SEO ranking plan. Goal: ship the
indexability fixes, structured data, measurement, and E-E-A-T scaffolding
*before* writing any new content. None of this should affect runtime
behaviour for signed-in users.

## What changed

### Structured data (JSON-LD)

New module `lib/jsonld.ts` exposes:

- `JsonLd` — server-safe component that renders one or many JSON-LD nodes
- `organizationLd()` — Organization with logo + sameAs from `SOCIAL_LINKS`
- `websiteLd()` — WebSite with `SearchAction` pointed at `/blog?q=`
- `breadcrumbLd(items)` — BreadcrumbList for nested pages
- `founderPersonLd()` — Person schema for the founder
- `blogPostingLd(args)` — BlogPosting with publisher + author refs
- `faqPageLd(items)` — FAQPage from a list of `{ q, a }` pairs
- `productLd(offers)` — Product with one Offer per pricing tier

Wired up:

- `app/layout.tsx` — emits Organization + WebSite on every page
- `components/marketing/faq.tsx` — emits FAQPage for the home FAQ
- `app/pricing/page.tsx` — emits Product + BreadcrumbList
- `app/blog/page.tsx` — emits BreadcrumbList
- `app/blog/[slug]/page.tsx` — emits BlogPosting + BreadcrumbList
- `app/about/page.tsx` (new) — emits Person + BreadcrumbList

### Per-page canonicals

The root layout sets `alternates.canonical: '/'`. Without per-page
overrides, marketing pages were inheriting "/" as their canonical, which
would silently de-index them. Fixed:

- `/pricing` — `alternates: { canonical: '/pricing' }`
- `/privacy` — `alternates: { canonical: '/privacy' }`
- `/terms` — `alternates: { canonical: '/terms' }`
- `/blog` — `alternates: { canonical: '/blog' }`
- `/blog/[slug]` — already set; now also emits OG `tags` and `authors`
- `/about` — `alternates: { canonical: '/about' }` (new)

### Measurement

- `components/analytics/google-analytics.tsx` — GA4 with Consent Mode v2.
  Defaults `analytics_storage`, `ad_storage`, etc. to `denied`. The
  cookie banner flips them to `granted` on opt-in and replays the consent
  state on every subsequent page load. `send_page_view: false` so we
  control the route-change events ourselves via `usePathname` /
  `useSearchParams`.
- `lib/site.ts` — `googleAnalyticsId()`, `verificationIds()` helpers.
- `app/layout.tsx` — emits `<meta name="google-site-verification">` /
  `<meta name="msvalidate.01">` when env vars are set.
- `.env.example` — documents `NEXT_PUBLIC_GA_ID`,
  `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`, `NEXT_PUBLIC_BING_SITE_VERIFICATION`.
- `.env.local` — populated `NEXT_PUBLIC_GA_ID=G-JNKWKDGB0R`.

### E-E-A-T scaffolding

- `app/about/page.tsx` (new) — founder bio, principles, "How we build it"
  section, social links, CTA. Emits Person JSON-LD with `worksFor` ref to
  the Organization node.
- `app/sitemap.ts` — added `/about` (priority 0.7, monthly).
- `components/marketing/footer.tsx` — added `/about` to the link list.
- `lib/site.ts` — added `FOUNDER`, `SOCIAL_LINKS`, `BRAND_TAGLINE`,
  `BRAND_DESCRIPTION`, `absoluteUrl()`, `socialSameAs()`. Hardened the
  primary mailbox to `hello@trendweaver.ai` (was `hero@…` in
  `.seo-engine/config.yaml`).

### PWA manifest

- `app/manifest.ts` (new) — `name`, `short_name`, theme/background
  colours, references `/icon` and `/apple-icon` so the favicon, OG image,
  and PWA icon all share one source.

### Cookie banner — Consent Mode v2 integration

`components/consent/cookie-consent.tsx`:

- Reads stored consent on mount and replays it into `gtag('consent',
  'update', …)` so returning visitors don't have to re-opt-in.
- On accept/reject, flips `analytics_storage`, `functionality_storage`,
  `personalization_storage`. Fires a manual `page_view` after a fresh
  opt-in so GA gets the current page rather than waiting for the next
  route change.

### Content reconciliation

- 5 published MDX posts in `src/content/blog/` were using legacy
  `cluster_id` values (`vibe-coding-101`, `model-selection`,
  `build-with-ai`) that didn't exist in
  `.seo-engine/data/topic-clusters.yaml`. Remapped to canonical clusters:
  - `what-is-vibe-coding` → `tc_vibe_coding`
  - `best-ai-coding-tools-2026` → `tc_ai_coding_platform`
  - `claude-vs-gpt-for-coding` → `tc_ai_coding_platform`
  - `how-to-build-saas-with-ai` → `tc_ai_app_generator`
  - `ai-coding-for-non-developers` → `tc_vibe_coding`
- `.seo-engine/data/content-map.yaml` backfilled with all 5 posts +
  `needs_refresh: true` flags so the next content sprint knows which
  posts to revisit and why.
- `.seo-engine/config.yaml` — fixed founder email
  (`hero@` → `hello@`), set `analytics: "google-analytics"`.

## What still needs to happen externally (not in code)

Phase 0 ships the *code*. These items still need a human:

1. **Verify Search Console** for `https://trendweaver.ai`. Use either the
   DNS TXT method (preferred) or the HTML meta-tag method. If you go with
   the meta tag, paste the value into
   `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` in every Vercel environment.
2. **Verify Bing Webmaster Tools.** Same pattern with
   `NEXT_PUBLIC_BING_SITE_VERIFICATION`.
3. **Submit the sitemap** at `https://trendweaver.ai/sitemap.xml` in both
   tools after verification.
4. **Set `NEXT_PUBLIC_GA_ID=G-JNKWKDGB0R`** in Vercel for production,
   preview, and any other env you want analytics in.
5. **Domain migration.** Confirm a 301 from `sprintbuild.ai` →
   `trendweaver.ai` exists at the Vercel domain level (not in code).
   Spot-check 3 representative URLs. When you flip back to
   `sprintbuild.ai`, the order is:
   1. Update `DEFAULT_SITE_URL` in `lib/site.ts`
   2. Update `NEXT_PUBLIC_SITE_URL` in every Vercel environment
   3. Update Supabase Auth Site URL + additional redirect URLs
   4. Submit a Change of Address in Search Console (only works if both
      domains are verified)
6. **Search Console verification token** — once you have the meta value
   from GSC, paste into `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`.
7. **Re-validate structured data** with the Rich Results Test once
   deployed:
   - `https://trendweaver.ai/` → Organization, WebSite, FAQPage
   - `https://trendweaver.ai/pricing` → Product
   - `https://trendweaver.ai/blog/<any-slug>` → BlogPosting, BreadcrumbList
   - `https://trendweaver.ai/about` → Person

## Phase 1 hand-off

Phase 1 (next) is the programmatic surface area expansion:

- `/vs/[competitor]` for `lovable`, `bolt-new`, `v0`, `replit-agent`, `base44`
- `/alternatives/[competitor]` (same five)
- `/build/[type]` use-case landing pages
- Home page expansion (use-case blocks, social proof slots, expanded FAQ)
- Pricing FAQ + Pricing-page schema validated against the new Stripe
  prices

The competitor research pass (filling in the `null` cells in
`.seo-engine/data/competitors.yaml feature_matrix`) is a Phase 1
prerequisite and will happen alongside the `/vs/[competitor]` template.

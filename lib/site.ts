/**
 * Single source of truth for the public origin of the deployment.
 *
 * Order of precedence:
 *   1. NEXT_PUBLIC_SITE_URL (set this in Vercel for prod)
 *   2. Default constant below
 *
 * Anything user-facing that needs an absolute URL — metadataBase, blog
 * canonicals, OAuth redirects, sitemap entries, og-image text — should
 * import from here. Do not hardcode the domain elsewhere.
 *
 * To change the canonical domain: update DEFAULT_SITE_URL and update the
 * NEXT_PUBLIC_SITE_URL env var in every deployment environment.
 */

const DEFAULT_SITE_URL = 'https://trendweaver.ai'

/**
 * Returns the public origin without a trailing slash.
 */
export function siteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL
  return raw.replace(/\/+$/, '')
}

/**
 * Bare hostname, e.g. `trendweaver.ai` — useful for og-image text and
 * `http-referer`-style headers.
 */
export function siteHost(): string {
  try {
    return new URL(siteUrl()).host
  } catch {
    return DEFAULT_SITE_URL.replace(/^https?:\/\//, '')
  }
}

/**
 * Build an absolute URL from a path. Always uses the canonical origin
 * resolved by `siteUrl()` so JSON-LD, sitemaps, and metadata stay in
 * sync when the domain flips.
 */
export function absoluteUrl(pathname = '/'): string {
  const path = pathname.startsWith('/') ? pathname : `/${pathname}`
  return `${siteUrl()}${path === '/' ? '' : path}`
}

/**
 * Brand name shown in the UI. Kept here so a future rename only touches
 * this file.
 */
export const BRAND_NAME = 'SprintBuild'

/**
 * Short brand tagline used by JSON-LD and OG fallbacks.
 */
export const BRAND_TAGLINE =
  'Sprint from idea to running app, powered by AI and a real sandbox.'

/**
 * Long brand description used by Organization JSON-LD and root metadata.
 * Kept in one place so the structured data and the `<meta>` description
 * never drift.
 */
export const BRAND_DESCRIPTION =
  `${BRAND_NAME} is an end-to-end AI coding platform where you describe what you want and an agent ships a full-stack application. ` +
  `It uses Vercel's AI Cloud services like Sandbox for secure code execution, AI Gateway for Claude, GPT, and other model support, Fluid Compute for efficient rendering and streaming, and it's built with Next.js and the AI SDK.`

/**
 * Founder / primary author. Used by JSON-LD `Person` references on
 * blog posts and the `/about` page. Keep `worksFor` keyed off
 * `BRAND_NAME` so the rename only ever touches this file.
 */
export const FOUNDER = {
  name: 'Mohammed Tahir',
  jobTitle: `Founder, ${BRAND_NAME}`,
  bio: `Founder of ${BRAND_NAME}. Building tools that turn prompts into production apps.`,
  // Optional avatar URL — relative paths resolve against `siteUrl()`.
  // Leave empty until a real headshot is shipped under /public.
  image: '',
} as const

/**
 * Public social profiles surfaced in the footer and the
 * Organization/Person JSON-LD `sameAs` array. Use full URLs only.
 * Add or remove entries here; everything else picks them up automatically.
 */
export const SOCIAL_LINKS = {
  twitter: 'https://twitter.com/sprintbuild',
  github: 'https://github.com/MohammedHTahir/vibe-coding-platform',
  linkedin: '',
  productHunt: '',
} as const

/**
 * `sameAs` values for Organization / Person JSON-LD. Filters out
 * empty entries so we only emit live profiles.
 */
export function socialSameAs(): string[] {
  const all: string[] = Object.values(SOCIAL_LINKS)
  return all.filter((url) => url.length > 0)
}

/**
 * Contact mailboxes. Update these when the corresponding mailboxes are
 * provisioned on the new domain.
 */
export const CONTACT_EMAILS = {
  general: 'hello@trendweaver.ai',
  privacy: 'privacy@trendweaver.ai',
  legal: 'legal@trendweaver.ai',
} as const

/**
 * Search engine verification tokens. Set these as Vercel env vars and
 * they'll be emitted as `<meta>` tags by the root layout. Leave blank
 * to skip — the metadata helper drops empty fields cleanly.
 */
export function verificationIds() {
  const google = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || ''
  const bing = process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION || ''
  return { google, bing }
}

/**
 * Google Analytics 4 measurement id (`G-XXXXXXXXXX`). Set
 * `NEXT_PUBLIC_GA_ID` in every Vercel environment that should emit
 * analytics. Returns an empty string when unset; the GA component
 * no-ops on empty.
 */
export function googleAnalyticsId(): string {
  return process.env.NEXT_PUBLIC_GA_ID || ''
}

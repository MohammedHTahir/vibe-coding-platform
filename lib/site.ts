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
 * Brand name shown in the UI. Kept here so a future rename only touches
 * this file.
 */
export const BRAND_NAME = 'SprintBuild'

/**
 * Contact mailboxes. Update these when the corresponding mailboxes are
 * provisioned on the new domain.
 */
export const CONTACT_EMAILS = {
  general: 'hello@trendweaver.ai',
  privacy: 'privacy@trendweaver.ai',
  legal: 'legal@trendweaver.ai',
} as const

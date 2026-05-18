import { headers } from 'next/headers'

/**
 * Current Terms / Privacy versions. Bump these when you publish a new
 * revision; users will need to re-accept to satisfy auditing.
 *
 * Keep these in sync with the seeded rows in
 * `supabase/migrations/20260519000000_add_consent_tables.sql`.
 */
export const LEGAL_VERSIONS = {
  terms: '2026-05-18',
  privacy: '2026-05-18',
} as const

export type LegalDocument = keyof typeof LEGAL_VERSIONS

/**
 * Best-effort extraction of the client IP from forwarded headers. Returns
 * null when nothing useful is present so we don't store junk in the audit
 * log.
 */
export async function getRequestIp(): Promise<string | null> {
  const h = await headers()
  const forwarded = h.get('x-forwarded-for')
  if (forwarded) {
    const first = forwarded.split(',')[0]?.trim()
    if (first) return first
  }
  return h.get('x-real-ip') ?? null
}

export async function getRequestUserAgent(): Promise<string | null> {
  const h = await headers()
  return h.get('user-agent')
}

import { NextResponse, type NextRequest } from 'next/server'
import { cookies } from 'next/headers'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

const VISITOR_COOKIE = 'sb_visitor_id'
const POLICY_VERSION = 1

const BodySchema = z.object({
  preferences: z.boolean(),
  analytics: z.boolean(),
})

/**
 * Records the user's cookie-consent choice in the database.
 *
 * - Authenticated users: keyed by user_id (one row per user, upserted).
 * - Anonymous visitors: keyed by a `sb_visitor_id` cookie (issued on first
 *   call). The browser cookie is still the source of truth for the banner;
 *   this is the audit copy.
 *
 * `necessary` is always true and not negotiable.
 */
export async function POST(request: NextRequest) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 })
  }

  const parsed = BodySchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'invalid_body' }, { status: 400 })
  }
  const { preferences, analytics } = parsed.data

  const userAgent = request.headers.get('user-agent')
  const forwarded = request.headers.get('x-forwarded-for')
  const ip = forwarded?.split(',')[0]?.trim() || request.headers.get('x-real-ip')

  const supabase = await createClient()
  const { data: userData } = await supabase.auth.getUser()
  const userId = userData.user?.id ?? null

  const cookieStore = await cookies()
  let visitorId: string | null = null
  if (!userId) {
    visitorId = cookieStore.get(VISITOR_COOKIE)?.value ?? null
    if (!visitorId) {
      visitorId = crypto.randomUUID()
      cookieStore.set(VISITOR_COOKIE, visitorId, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 60 * 60 * 24 * 365, // 1 year
      })
    }
  }

  const admin = createAdminClient()
  const row = {
    user_id: userId,
    visitor_id: userId ? null : visitorId,
    necessary: true,
    preferences,
    analytics,
    policy_version: POLICY_VERSION,
    user_agent: userAgent,
    ip: ip ?? null,
    updated_at: new Date().toISOString(),
  }

  const { error } = await admin
    .from('cookie_consents')
    .upsert(row, {
      onConflict: userId ? 'user_id' : 'visitor_id',
    })

  if (error) {
    console.error('[consent] upsert failed', error)
    return NextResponse.json({ error: 'persist_failed' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}

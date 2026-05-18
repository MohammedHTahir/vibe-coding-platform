import { NextResponse, type NextRequest } from 'next/server'
import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { recordLegalAcceptance } from '@/lib/legal-server'
import { grantWelcomeIfNeeded } from '@/lib/credits'

const OAUTH_TERMS_COOKIE = 'sb_oauth_terms_accept'

/**
 * OAuth + email-confirmation callback.
 * Exchanges the `code` query param for a session and redirects to `next`.
 *
 * If the request originated from /signup (signalled by a short-lived
 * `sb_oauth_terms_accept` cookie), records the user's Terms/Privacy
 * acceptance after the session is established.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      const cookieStore = await cookies()
      const termsCookie = cookieStore.get(OAUTH_TERMS_COOKIE)
      if (termsCookie?.value === '1') {
        const { data } = await supabase.auth.getUser()
        if (data.user?.id) {
          await recordLegalAcceptance({
            userId: data.user.id,
            source: 'signup_oauth',
          })
          await grantWelcomeIfNeeded(data.user.id)
        }
        cookieStore.delete(OAUTH_TERMS_COOKIE)
      }

      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  return NextResponse.redirect(`${origin}/login?error=oauth`)
}

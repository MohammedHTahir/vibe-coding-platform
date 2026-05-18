import 'server-only'

import { createAdminClient } from '@/lib/supabase/admin'
import { LEGAL_VERSIONS, getRequestIp, getRequestUserAgent } from '@/lib/legal'

/**
 * Inserts both Terms and Privacy acceptance rows for a user.
 *
 * Uses the service-role client so it works even before the email is
 * confirmed (when the new user has no session yet) and so the audit log
 * cannot be falsified by the client.
 *
 * Marked `server-only` so this never accidentally ships to the browser —
 * and crucially, this is NOT a server action, so it cannot be invoked
 * directly by client code with a forged userId.
 *
 * Best-effort: failures are logged but do not block the signup flow.
 */
export async function recordLegalAcceptance({
  userId,
  source,
}: {
  userId: string
  source: 'signup_password' | 'signup_oauth' | 'reaccept' | 'admin'
}): Promise<void> {
  try {
    const ip = await getRequestIp()
    const userAgent = await getRequestUserAgent()
    const admin = createAdminClient()

    const rows = (['terms', 'privacy'] as const).map((document) => ({
      user_id: userId,
      document,
      document_version: LEGAL_VERSIONS[document],
      ip,
      user_agent: userAgent,
      source,
    }))

    const { error } = await admin.from('legal_acceptances').upsert(rows, {
      onConflict: 'user_id,document,document_version',
      ignoreDuplicates: true,
    })

    if (error) {
      console.error('[legal] failed to record acceptance', error)
    }
  } catch (e) {
    console.error('[legal] unexpected error recording acceptance', e)
  }
}

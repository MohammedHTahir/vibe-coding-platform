import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

// Next.js 16 renamed `middleware` to `proxy`. The function name must be
// `proxy` (or `default`) for the runtime to discover it.
export async function proxy(request: NextRequest) {
  return updateSession(request)
}

export const config = {
  // Run on app routes; skip Next.js internals, static assets, and API routes
  // (auth callbacks have their own dedicated route handlers).
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|mp4|webm|ico)$|api/).*)',
  ],
}

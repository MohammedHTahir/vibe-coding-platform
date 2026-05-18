'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { recordLegalAcceptance } from '@/lib/legal-server'

interface ActionState {
  error?: string
}

function getSiteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
}

/**
 * Cookie used to carry the "I accepted Terms" intent through a GitHub OAuth
 * round-trip. Set when the user kicks off the OAuth flow from /signup, then
 * read in the auth callback to record the acceptance against the new user.
 *
 * Short-lived and scoped to the OAuth flow only.
 */
const OAUTH_TERMS_COOKIE = 'sb_oauth_terms_accept'

export async function signInWithPassword(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const email = String(formData.get('email') ?? '').trim()
  const password = String(formData.get('password') ?? '')
  const redirectTo = String(formData.get('redirect') ?? '/dashboard')

  if (!email || !password) {
    return { error: 'Email and password are required.' }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect(redirectTo)
}

export async function signUpWithPassword(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const email = String(formData.get('email') ?? '').trim()
  const password = String(formData.get('password') ?? '')
  const termsAccepted = String(formData.get('terms_accepted') ?? '') === 'true'

  if (!email || !password) {
    return { error: 'Email and password are required.' }
  }

  if (!termsAccepted) {
    return {
      error: 'You must accept the Terms and Privacy Policy to create an account.',
    }
  }

  const supabase = await createClient()
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${getSiteUrl()}/auth/callback?next=/dashboard`,
    },
  })

  if (error) {
    return { error: error.message }
  }

  // Record the acceptance even though the email isn't confirmed yet — the
  // user agreed at this moment in time, and that's what we need to prove.
  if (data.user?.id) {
    await recordLegalAcceptance({
      userId: data.user.id,
      source: 'signup_password',
    })
  }

  redirect('/login?signup=check-email')
}

/**
 * GitHub OAuth used from /login. No terms gate — existing users.
 */
export async function signInWithGitHub(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  return startGitHubOAuth(formData, { acceptTerms: false })
}

/**
 * GitHub OAuth used from /signup. Server-side enforces the terms checkbox
 * and stamps a short-lived cookie so the auth callback can record the
 * acceptance once the new user row exists.
 */
export async function signUpWithGitHub(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const termsAccepted = String(formData.get('terms_accepted') ?? '') === 'true'
  if (!termsAccepted) {
    return {
      error: 'You must accept the Terms and Privacy Policy to create an account.',
    }
  }
  return startGitHubOAuth(formData, { acceptTerms: true })
}

async function startGitHubOAuth(
  formData: FormData,
  { acceptTerms }: { acceptTerms: boolean }
): Promise<ActionState> {
  const supabase = await createClient()
  const redirectTo = String(formData.get('redirect') ?? '/dashboard')

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: {
      redirectTo: `${getSiteUrl()}/auth/callback?next=${encodeURIComponent(
        redirectTo
      )}`,
    },
  })

  if (error || !data?.url) {
    return { error: error?.message ?? 'Could not start GitHub sign-in.' }
  }

  if (acceptTerms) {
    const cookieStore = await cookies()
    cookieStore.set(OAUTH_TERMS_COOKIE, '1', {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 10, // 10 minutes
    })
  }

  redirect(data.url)
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/')
}


import Link from 'next/link'
import { redirect } from 'next/navigation'
import { LoginForm } from './login-form'
import { SprintBuildWordmark } from '@/components/marketing/logo'
import { createClient } from '@/lib/supabase/server'

export const metadata = { title: 'Sign in' }

interface PageProps {
  searchParams: Promise<{ redirect?: string; signup?: string; error?: string }>
}

export default async function LoginPage({ searchParams }: PageProps) {
  const sp = await searchParams

  if (
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (user) redirect(sp.redirect || '/dashboard')
  }

  return (
    <main className="min-h-screen bg-[#f0f0ee] flex flex-col">
      <header className="px-6 sm:px-12 md:px-20 lg:px-28 pt-6">
        <Link href="/" aria-label="SprintBuild home">
          <SprintBuildWordmark size="md" />
        </Link>
      </header>

      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <h1 className="text-2xl font-medium tracking-tight text-gray-900 mb-1">
            Welcome back
          </h1>
          <p className="text-[13px] text-gray-500 mb-8">
            Sign in to keep building. Don&apos;t have an account?{' '}
            <Link
              href="/signup"
              className="text-blue-500 hover:text-blue-600 transition-colors"
            >
              Create one
            </Link>
            .
          </p>

          {sp.signup === 'check-email' ? (
            <div className="mb-6 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-[13px] text-blue-700">
              Check your inbox to confirm your email, then sign in.
            </div>
          ) : null}
          {sp.error === 'oauth' ? (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-700">
              We couldn&apos;t complete that sign-in. Please try again.
            </div>
          ) : null}

          <LoginForm redirectTo={sp.redirect ?? '/dashboard'} />
        </div>
      </div>
    </main>
  )
}

import Link from 'next/link'
import { redirect } from 'next/navigation'
import { SignupForm } from './signup-form'
import { SprintBuildWordmark } from '@/components/marketing/logo'
import { createClient } from '@/lib/supabase/server'

export const metadata = { title: 'Create an account' }

export default async function SignupPage() {
  if (
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (user) redirect('/dashboard')
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
            Create your account
          </h1>
          <p className="text-[13px] text-gray-500 mb-8">
            Start building in a sandbox. Already have an account?{' '}
            <Link
              href="/login"
              className="text-blue-500 hover:text-blue-600 transition-colors"
            >
              Sign in
            </Link>
            .
          </p>

          <SignupForm />
        </div>
      </div>
    </main>
  )
}

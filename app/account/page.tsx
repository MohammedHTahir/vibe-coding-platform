import Link from 'next/link'
import { redirect } from 'next/navigation'
import { AccountForms } from './account-forms'
import { SprintBuildWordmark } from '@/components/marketing/logo'
import { Button } from '@/components/ui/button'
import { LogOutIcon } from 'lucide-react'
import { signOut } from '@/app/login/actions'
import { createClient } from '@/lib/supabase/server'

export const metadata = { title: 'Account' }

export default async function AccountPage() {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    redirect('/login')
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login?redirect=/account')

  const { data: profile } = await supabase
    .from('profiles')
    .select('email, display_name, avatar_url')
    .eq('id', user.id)
    .single()

  return (
    <main className="min-h-screen bg-[#f0f0ee] flex flex-col">
      <header className="px-6 sm:px-12 md:px-20 lg:px-28 pt-6 flex items-center justify-between">
        <Link href="/" aria-label="SprintBuild home">
          <SprintBuildWordmark size="md" />
        </Link>

        <div className="flex items-center gap-2">
          <Button asChild size="sm" variant="outline">
            <Link href="/dashboard">Dashboard</Link>
          </Button>
          <form action={signOut}>
            <Button
              type="submit"
              size="sm"
              variant="outline"
              className="cursor-pointer"
            >
              <LogOutIcon className="w-3.5 h-3.5" />
              Sign out
            </Button>
          </form>
        </div>
      </header>

      <div className="flex-1 px-6 sm:px-12 md:px-20 lg:px-28 py-12">
        <div className="max-w-2xl">
          <h1 className="text-2xl font-medium tracking-tight text-gray-900 mb-1">
            Account
          </h1>
          <p className="text-[13px] text-gray-500 mb-10">
            Manage how you appear inside SprintBuild.
          </p>

          <AccountForms
            profile={{
              email: profile?.email ?? user.email ?? null,
              displayName: profile?.display_name ?? null,
              avatarUrl: profile?.avatar_url ?? null,
            }}
          />
        </div>
      </div>
    </main>
  )
}

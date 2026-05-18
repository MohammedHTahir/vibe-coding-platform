import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ProjectRow } from './project-row'
import { Button } from '@/components/ui/button'
import { SprintBuildWordmark } from '@/components/marketing/logo'
import { LogOutIcon, PlusIcon, SparklesIcon, UserIcon } from 'lucide-react'
import { signOut } from '@/app/login/actions'
import { createClient } from '@/lib/supabase/server'

export const metadata = { title: 'Projects' }

export default async function ProjectsPage() {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    redirect('/login?redirect=/dashboard/projects')
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login?redirect=/dashboard/projects')

  const { data: projects } = await supabase
    .from('projects')
    .select('id, name, description, sandbox_id, preview_url, created_at, updated_at')
    .order('updated_at', { ascending: false })
    .limit(50)

  return (
    <main className="min-h-screen bg-[#f0f0ee] flex flex-col">
      <header className="px-6 sm:px-12 md:px-20 lg:px-28 pt-6 flex items-center justify-between">
        <Link href="/" aria-label="SprintBuild home">
          <SprintBuildWordmark size="md" />
        </Link>

        <div className="flex items-center gap-2">
          <Button asChild size="sm" variant="outline">
            <Link href="/account">
              <UserIcon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Account</span>
            </Link>
          </Button>
          <form action={signOut}>
            <Button type="submit" size="sm" variant="outline">
              <LogOutIcon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign out</span>
            </Button>
          </form>
        </div>
      </header>

      <div className="flex-1 px-6 sm:px-12 md:px-20 lg:px-28 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
            <div>
              <p className="text-[12px] uppercase tracking-[0.18em] text-blue-500 font-medium mb-2">
                Your sprints
              </p>
              <h1 className="text-2xl sm:text-3xl font-medium tracking-tight text-gray-900">
                Projects
              </h1>
              <p className="text-[13px] text-gray-500 mt-1.5">
                Pick up where you left off, or kick off a new build.
              </p>
            </div>
            <Button asChild className="bg-blue-500 hover:bg-blue-600">
              <Link href="/dashboard">
                <PlusIcon className="w-3.5 h-3.5" />
                New sprint
              </Link>
            </Button>
          </div>

          {!projects || projects.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-black/15 bg-white p-10 text-center">
              <div className="w-10 h-10 rounded-full bg-[#EDEDED] flex items-center justify-center mx-auto mb-4">
                <SparklesIcon className="w-4 h-4 text-gray-700" />
              </div>
              <h2 className="text-[15px] font-medium text-gray-900 mb-1">
                No projects yet
              </h2>
              <p className="text-[13px] text-gray-500 mb-6 max-w-sm mx-auto">
                Start a session, give the agent a prompt, and your project will
                appear here once a sandbox is up.
              </p>
              <Button asChild className="bg-blue-500 hover:bg-blue-600">
                <Link href="/dashboard">
                  <PlusIcon className="w-3.5 h-3.5" />
                  Start your first sprint
                </Link>
              </Button>
            </div>
          ) : (
            <ul className="space-y-3">
              {projects.map((project) => (
                <ProjectRow key={project.id} project={project} />
              ))}
            </ul>
          )}
        </div>
      </div>
    </main>
  )
}

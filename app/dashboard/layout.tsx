import type { ReactNode } from 'react'
import { redirect } from 'next/navigation'
import { ChatProvider } from '@/lib/chat-context'
import { CommandLogsStream } from '@/components/commands-logs/commands-logs-stream'
import { ErrorMonitor } from '@/components/error-monitor/error-monitor'
import { SandboxState } from '@/components/modals/sandbox-state'
import { ProjectsRecorder } from './projects-recorder'
import { createClient } from '@/lib/supabase/server'

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode
}) {
  // Server-side guard. The middleware also redirects unauthenticated users,
  // but we double-check here to keep the dashboard tree gated.
  if (
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      redirect('/login?redirect=/dashboard')
    }
  }

  return (
    <ChatProvider>
      <ErrorMonitor>
        {children}
        <CommandLogsStream />
        <SandboxState />
        <ProjectsRecorder />
      </ErrorMonitor>
    </ChatProvider>
  )
}

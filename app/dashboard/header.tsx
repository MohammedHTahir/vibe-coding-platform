import Link from 'next/link'
import { ToggleWelcome } from '@/components/modals/welcome'
import { SprintBuildMark } from '@/components/marketing/logo'
import { Button } from '@/components/ui/button'
import { FolderIcon, LogOutIcon, UserIcon } from 'lucide-react'
import { signOut } from '@/app/login/actions'
import { cn } from '@/lib/utils'
import { CreditsPill } from './credits-pill'

interface Props {
  className?: string
}

export async function Header({ className }: Props) {
  return (
    <header className={cn('flex items-center justify-between', className)}>
      <Link
        href="/"
        className="flex items-center gap-2 ml-1 md:ml-2.5"
        aria-label="SprintBuild home"
      >
        <SprintBuildMark size={20} fill="#0A0A0A" />
        <span className="hidden md:inline text-sm uppercase font-mono font-bold tracking-tight">
          SprintBuild
        </span>
      </Link>
      <div className="flex items-center ml-auto space-x-1.5">
        <CreditsPill />
        <ToggleWelcome />
        <Button asChild variant="outline" size="sm" className="cursor-pointer">
          <Link href="/dashboard/projects">
            <FolderIcon className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">Projects</span>
          </Link>
        </Button>
        <Button asChild variant="outline" size="sm" className="cursor-pointer">
          <Link href="/account">
            <UserIcon className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">Account</span>
          </Link>
        </Button>
        <form action={signOut}>
          <Button
            type="submit"
            variant="outline"
            size="sm"
            className="cursor-pointer"
          >
            <LogOutIcon className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">Sign out</span>
          </Button>
        </form>
      </div>
    </header>
  )
}

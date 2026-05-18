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
    <header
      className={cn(
        'flex items-center justify-between px-3 py-2 rounded-xl bg-secondary/40 border border-border/40 backdrop-blur-sm',
        className
      )}
    >
      {/* Logo */}
      <Link
        href="/"
        className="flex items-center gap-2.5 group"
        aria-label="SprintBuild home"
      >
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
          <SprintBuildMark size={16} fill="#fff" />
        </div>
        <span className="hidden md:inline text-[13px] font-semibold tracking-tight text-foreground">
          SprintBuild
        </span>
      </Link>

      {/* Right actions */}
      <div className="flex items-center gap-1.5">
        <CreditsPill />
        <ToggleWelcome />
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="h-8 px-2.5 text-muted-foreground hover:text-foreground"
        >
          <Link href="/dashboard/projects">
            <FolderIcon className="w-3.5 h-3.5" />
            <span className="hidden lg:inline ml-1.5 text-[12px]">Projects</span>
          </Link>
        </Button>
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="h-8 px-2.5 text-muted-foreground hover:text-foreground"
        >
          <Link href="/account">
            <UserIcon className="w-3.5 h-3.5" />
            <span className="hidden lg:inline ml-1.5 text-[12px]">Account</span>
          </Link>
        </Button>
        <form action={signOut}>
          <Button
            type="submit"
            variant="ghost"
            size="sm"
            className="h-8 px-2.5 text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <LogOutIcon className="w-3.5 h-3.5" />
          </Button>
        </form>
      </div>
    </header>
  )
}

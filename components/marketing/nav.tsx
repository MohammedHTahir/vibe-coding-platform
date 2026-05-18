import Link from 'next/link'
import { SprintBuildMark } from './logo'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface Props {
  user: { email?: string | null } | null
  className?: string
}

const links = [
  { label: 'Features', href: '#features' },
  { label: 'Models', href: '#models' },
  { label: 'How it works', href: '#how' },
  { label: 'Blog', href: '/blog' },
  { label: 'FAQ', href: '#faq' },
]

export function MarketingNav({ user, className }: Props) {
  return (
    <nav
      className={cn(
        'flex items-center justify-center pt-4 sm:pt-6 px-4 sm:px-8 gap-2 sm:gap-3',
        className
      )}
    >
      <Link
        href="/"
        aria-label="SprintBuild home"
        className="flex items-center justify-center rounded-full w-10 h-10 sm:w-11 sm:h-11 shrink-0 backdrop-blur"
        style={{ backgroundColor: '#EDEDED' }}
      >
        <SprintBuildMark gradient idSuffix="nav" />
      </Link>

      <div
        className="flex items-center gap-4 sm:gap-10 rounded-xl px-4 sm:px-8 py-2.5 sm:py-3 backdrop-blur"
        style={{ backgroundColor: '#EDEDED' }}
      >
        {links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="text-[12px] sm:text-[14px] font-medium text-gray-700 hover:text-gray-900 transition-colors duration-200"
          >
            {link.label}
          </a>
        ))}
      </div>

      <div className="hidden sm:flex items-center gap-2 ml-2">
        {user ? (
          <Button asChild size="sm">
            <Link href="/dashboard">Open dashboard</Link>
          </Button>
        ) : (
          <>
            <Button asChild size="sm" variant="ghost">
              <Link href="/login">Sign in</Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/signup">Get started</Link>
            </Button>
          </>
        )}
      </div>
    </nav>
  )
}

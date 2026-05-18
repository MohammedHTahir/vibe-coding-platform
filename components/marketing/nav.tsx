'use client'

import Link from 'next/link'
import { useState } from 'react'
import { SprintBuildMark } from './logo'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { MenuIcon, XIcon } from 'lucide-react'

interface Props {
  user: { email?: string | null } | null
  className?: string
}

const links = [
  { label: 'Features', href: '/#features' },
  { label: 'Models', href: '/#models' },
  { label: 'How it works', href: '/#how' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Blog', href: '/blog' },
  { label: 'FAQ', href: '/#faq' },
]

export function MarketingNav({ user, className }: Props) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <nav
      className={cn(
        'flex items-center justify-center pt-4 sm:pt-6 px-4 sm:px-8 gap-2 sm:gap-3 relative',
        className
      )}
    >
      {/* Logo */}
      <Link
        href="/"
        aria-label="SprintBuild home"
        className="flex items-center justify-center rounded-full w-10 h-10 sm:w-11 sm:h-11 shrink-0 backdrop-blur"
        style={{ backgroundColor: '#EDEDED' }}
      >
        <SprintBuildMark gradient idSuffix="nav" />
      </Link>

      {/* Desktop nav */}
      <div
        className="hidden md:flex items-center gap-4 lg:gap-10 rounded-xl px-4 lg:px-8 py-2.5 sm:py-3 backdrop-blur"
        style={{ backgroundColor: '#EDEDED' }}
      >
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-[13px] lg:text-[14px] font-medium text-gray-700 hover:text-gray-900 transition-colors duration-200 whitespace-nowrap"
          >
            {link.label}
          </Link>
        ))}
      </div>

      {/* Desktop auth buttons */}
      <div className="hidden md:flex items-center gap-2 ml-2">
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

      {/* Mobile hamburger button */}
      <button
        type="button"
        onClick={() => setMobileOpen(!mobileOpen)}
        className="md:hidden flex items-center justify-center rounded-full w-10 h-10 backdrop-blur ml-auto"
        style={{ backgroundColor: '#EDEDED' }}
        aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={mobileOpen}
      >
        {mobileOpen ? (
          <XIcon className="w-5 h-5 text-gray-700" />
        ) : (
          <MenuIcon className="w-5 h-5 text-gray-700" />
        )}
      </button>

      {/* Mobile dropdown */}
      {mobileOpen ? (
        <div
          className="absolute top-full left-4 right-4 mt-2 rounded-2xl border border-black/5 bg-white shadow-lg p-4 z-50 md:hidden"
          style={{ animation: 'fadeIn 0.15s ease-out' }}
        >
          <div className="flex flex-col gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="px-3 py-2.5 rounded-lg text-[14px] font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="border-t border-black/5 mt-3 pt-3 flex flex-col gap-2">
            {user ? (
              <Button asChild className="w-full">
                <Link href="/dashboard" onClick={() => setMobileOpen(false)}>
                  Open dashboard
                </Link>
              </Button>
            ) : (
              <>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/login" onClick={() => setMobileOpen(false)}>
                    Sign in
                  </Link>
                </Button>
                <Button asChild className="w-full bg-blue-500 hover:bg-blue-600">
                  <Link href="/signup" onClick={() => setMobileOpen(false)}>
                    Get started
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>
      ) : null}
    </nav>
  )
}

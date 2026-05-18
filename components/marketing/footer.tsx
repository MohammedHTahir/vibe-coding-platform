import Link from 'next/link'
import { SprintBuildWordmark } from './logo'

// Use absolute paths with hashes so the in-page links work from any page
// the footer is rendered on (landing, /terms, /privacy, /blog/*, etc.).
const links = [
  { label: 'Features', href: '/#features' },
  { label: 'How it works', href: '/#how' },
  { label: 'Models', href: '/#models' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'FAQ', href: '/#faq' },
  { label: 'Blog', href: '/blog' },
  { label: 'Terms', href: '/terms' },
  { label: 'Privacy', href: '/privacy' },
  { label: 'Sign in', href: '/login' },
] as const

export function Footer() {
  return (
    <footer className="px-6 sm:px-12 md:px-20 lg:px-28 pt-12 pb-10 bg-[#f0f0ee] border-t border-black/5">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <Link href="/" aria-label="SprintBuild home">
          <SprintBuildWordmark size="sm" />
        </Link>

        <nav
          aria-label="Footer"
          className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[12px] text-gray-500"
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:text-gray-900 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <p className="text-[12px] text-gray-400">
          © {new Date().getFullYear()} SprintBuild
        </p>
      </div>
    </footer>
  )
}

import Link from 'next/link'
import { SprintBuildWordmark } from './logo'

export function Footer() {
  return (
    <footer className="px-6 sm:px-12 md:px-20 lg:px-28 pt-12 pb-10 bg-[#f0f0ee] border-t border-black/5">
      <div className="max-w-5xl mx-auto flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <Link href="/" aria-label="SprintBuild home">
            <SprintBuildWordmark size="sm" />
          </Link>

          <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[12px] text-gray-500">
            <a
              href="#features"
              className="hover:text-gray-900 transition-colors"
            >
              Features
            </a>
            <a href="#models" className="hover:text-gray-900 transition-colors">
              Models
            </a>
            <Link
              href="/blog"
              className="hover:text-gray-900 transition-colors"
            >
              Blog
            </Link>
            <a href="#faq" className="hover:text-gray-900 transition-colors">
              FAQ
            </a>
            <Link
              href="/login"
              className="hover:text-gray-900 transition-colors"
            >
              Sign in
            </Link>
          </nav>

          <p className="text-[12px] text-gray-400">
            © {new Date().getFullYear()} SprintBuild
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] text-gray-400 border-t border-black/5 pt-5">
          <Link
            href="/terms"
            className="hover:text-gray-900 transition-colors"
          >
            Terms and Conditions
          </Link>
          <Link
            href="/privacy"
            className="hover:text-gray-900 transition-colors"
          >
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  )
}

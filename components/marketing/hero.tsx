import Link from 'next/link'
import { ArrowRightIcon } from 'lucide-react'
import { MarketingNav } from './nav'

const VIDEO_URL =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260508_215831_c6a8989c-d716-4d8d-8745-e972a2eec711.mp4'

interface Props {
  user: { email?: string | null } | null
}

export function Hero({ user }: Props) {
  return (
    <section className="relative min-h-screen overflow-hidden bg-[#f0f0ee]">
      {/* Fullscreen autoplay background video */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        src={VIDEO_URL}
        autoPlay
        muted
        loop
        playsInline
      />
      {/* Soft scrim so the bottom-left text stays legible over any frame */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#f0f0ee]/40 via-transparent to-[#f0f0ee]/70" />

      {/* Foreground content (nav + bottom-aligned hero copy) */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <MarketingNav user={user} />

        <div className="flex-1 flex items-end pb-10 sm:pb-16 lg:pb-20 px-6 sm:px-12 md:px-20 lg:px-28">
          <div className="max-w-md">
            <a
              href="#features"
              className="inline-flex items-center gap-1.5 text-[11.5px] font-medium text-blue-500 hover:text-blue-600 transition-colors mb-3 group"
            >
              New · ship full-stack apps from a prompt
              <span className="inline-block transition-transform duration-200 group-hover:translate-x-0.5">
                →
              </span>
            </a>
            <h1 className="text-[1.5rem] sm:text-[1.75rem] leading-[1.15] font-medium text-gray-900 tracking-tight mb-3">
              Sprint from idea to running app, powered by AI and a real
              sandbox.
            </h1>
            <p className="text-[13px] text-gray-500 font-normal mb-3">
              Describe what you want. Watch SprintBuild generate, run, and
              preview your app in seconds.
            </p>
            <Link
              href={user ? '/dashboard' : '/signup'}
              className="inline-flex items-center gap-2 text-[13px] font-medium text-blue-500 border border-blue-400 rounded-full px-5 py-2.5 hover:bg-blue-500 hover:text-white hover:border-blue-500 transition-all duration-200 group"
            >
              {user ? 'Open dashboard' : 'Start building free'}
              <ArrowRightIcon className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

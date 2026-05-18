import Link from 'next/link'
import { ArrowRightIcon } from 'lucide-react'

export function FinalCta({ authed }: { authed: boolean }) {
  return (
    <section className="px-6 sm:px-12 md:px-20 lg:px-28 py-20 sm:py-28 bg-[#f0f0ee]">
      <div className="max-w-4xl mx-auto rounded-3xl border border-black/5 bg-white p-10 sm:p-14 text-center">
        <h2 className="text-3xl sm:text-4xl font-medium tracking-tight text-gray-900 mb-3">
          Build your next app in a sprint, not a sprint cycle.
        </h2>
        <p className="text-[14px] text-gray-500 max-w-xl mx-auto mb-8">
          Start with a prompt. Get a running app. Keep iterating until it ships.
        </p>
        <Link
          href={authed ? '/dashboard' : '/signup'}
          className="inline-flex items-center gap-2 text-[13px] font-medium text-white bg-blue-500 hover:bg-blue-600 border border-blue-500 rounded-full px-6 py-3 transition-colors duration-200 group"
        >
          {authed ? 'Open dashboard' : 'Start building free'}
          <ArrowRightIcon className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
        </Link>
      </div>
    </section>
  )
}

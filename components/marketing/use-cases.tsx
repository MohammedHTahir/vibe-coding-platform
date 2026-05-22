import Link from 'next/link'
import { ArrowRightIcon } from 'lucide-react'
import { listUseCases } from '@/lib/use-cases'

/**
 * Home-page use-cases section. Mirrors `/build` but condensed.
 * Each card deep-links into a `/build/[type]` page so every
 * use-case keyword has a destination, and so the home page itself
 * carries internal links into the programmatic surface.
 */
export function UseCases() {
  const useCases = listUseCases()
  return (
    <section
      id="use-cases"
      className="px-6 sm:px-12 md:px-20 lg:px-28 py-20 sm:py-28 bg-white border-t border-black/5"
    >
      <div className="max-w-5xl mx-auto">
        <p className="text-[12px] uppercase tracking-[0.18em] text-blue-500 font-medium mb-3">
          Use cases
        </p>
        <h2 className="text-3xl sm:text-4xl font-medium tracking-tight text-gray-900 mb-4">
          What you can ship from a prompt.
        </h2>
        <p className="text-[14px] text-gray-500 max-w-xl mb-12">
          The agent doesn&apos;t pretend to be every tool ever made. These are
          the builds it&apos;s tuned for, with starter prompts you can paste
          and run today.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {useCases.map((useCase) => (
            <Link
              key={useCase.slug}
              href={`/build/${useCase.slug}`}
              className="group rounded-2xl border border-black/5 bg-[#f7f7f5] hover:bg-white transition-colors p-6 flex flex-col"
            >
              <h3 className="text-[15px] font-medium text-gray-900 mb-1.5 tracking-tight">
                {useCase.title}
              </h3>
              <p className="text-[13px] text-gray-500 leading-relaxed flex-1">
                {useCase.subhead}
              </p>
              <span className="mt-4 inline-flex items-center gap-1 text-[12px] font-medium text-blue-500">
                Starter prompt
                <ArrowRightIcon className="size-3 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

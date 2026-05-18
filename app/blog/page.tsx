import Link from 'next/link'
import type { Metadata } from 'next'
import { listPosts } from '@/lib/blog'
import { SprintBuildWordmark } from '@/components/marketing/logo'
import { Footer } from '@/components/marketing/footer'
import { Button } from '@/components/ui/button'
import { ArrowRightIcon } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Blog',
  description:
    'Notes on AI coding platforms, vibe coding, and shipping apps from prompts. From the SprintBuild team.',
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export default async function BlogIndex() {
  const posts = await listPosts()

  return (
    <main className="min-h-screen bg-[#f0f0ee] flex flex-col">
      <header className="px-6 sm:px-12 md:px-20 lg:px-28 pt-6 flex items-center justify-between">
        <Link href="/" aria-label="SprintBuild home">
          <SprintBuildWordmark size="md" />
        </Link>
        <nav className="hidden sm:flex items-center gap-6 text-[12px] text-gray-500">
          <Link href="/" className="hover:text-gray-900 transition-colors">
            Home
          </Link>
          <Link href="/blog" className="text-gray-900">
            Blog
          </Link>
          <Link
            href="/dashboard"
            className="hover:text-gray-900 transition-colors"
          >
            Dashboard
          </Link>
        </nav>
      </header>

      <section className="px-6 sm:px-12 md:px-20 lg:px-28 py-14 sm:py-20">
        <div className="max-w-3xl mx-auto">
          <p className="text-[12px] uppercase tracking-[0.18em] text-blue-500 font-medium mb-3">
            Field notes
          </p>
          <h1 className="text-3xl sm:text-4xl font-medium tracking-tight text-gray-900 mb-3">
            The SprintBuild blog
          </h1>
          <p className="text-[14px] text-gray-500 max-w-xl">
            Thoughts on AI coding platforms, vibe coding workflows, and what
            it takes to ship apps from prompts.
          </p>
        </div>
      </section>

      <section className="flex-1 px-6 sm:px-12 md:px-20 lg:px-28 pb-20">
        <div className="max-w-3xl mx-auto">
          {posts.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-black/15 bg-white p-10 text-center">
              <h2 className="text-[15px] font-medium text-gray-900 mb-1">
                Nothing here yet
              </h2>
              <p className="text-[13px] text-gray-500 mb-6 max-w-sm mx-auto">
                The first post is on the way. In the meantime, take SprintBuild
                for a spin.
              </p>
              <Button asChild className="bg-blue-500 hover:bg-blue-600">
                <Link href="/signup">
                  Try SprintBuild free
                  <ArrowRightIcon className="w-3.5 h-3.5" />
                </Link>
              </Button>
            </div>
          ) : (
            <ul className="space-y-3">
              {posts.map((post) => (
                <li
                  key={post.slug}
                  className="rounded-2xl border border-black/5 bg-white p-6 hover:bg-white/80 transition-colors"
                >
                  <Link href={`/blog/${post.slug}`} className="block">
                    <p className="text-[11px] uppercase tracking-[0.16em] text-gray-400 font-mono mb-2">
                      {formatDate(post.frontmatter.date)}
                    </p>
                    <h2 className="text-[18px] font-medium tracking-tight text-gray-900 mb-1.5 group-hover:text-blue-600">
                      {post.frontmatter.title}
                    </h2>
                    <p className="text-[14px] text-gray-500 leading-relaxed">
                      {post.frontmatter.description}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}

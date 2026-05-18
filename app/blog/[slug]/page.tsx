import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote-client/rsc'
import rehypeSlug from 'rehype-slug'
import remarkGfm from 'remark-gfm'

import { getPost, listSlugs } from '@/lib/blog'
import { mdxComponents } from '@/components/blog/mdx-components'
import { SprintBuildWordmark } from '@/components/marketing/logo'
import { Footer } from '@/components/marketing/footer'
import { Button } from '@/components/ui/button'
import { ArrowRightIcon } from 'lucide-react'
import { siteUrl } from '@/lib/site'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return (await listSlugs()).map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) return {}

  const fm = post.frontmatter
  const canonical = fm.canonical ?? `${siteUrl()}/blog/${fm.slug}`

  return {
    title: fm.title,
    description: fm.description,
    alternates: { canonical },
    openGraph: {
      title: fm.title,
      description: fm.description,
      url: canonical,
      type: 'article',
      publishedTime: fm.date,
    },
    twitter: {
      card: 'summary_large_image',
      title: fm.title,
      description: fm.description,
    },
  }
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

export default async function BlogPost({ params }: PageProps) {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) notFound()

  const fm = post.frontmatter

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
          <Link href="/blog" className="hover:text-gray-900 transition-colors">
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

      <article className="flex-1 px-6 sm:px-12 md:px-20 lg:px-28 py-14 sm:py-20">
        <div className="max-w-3xl mx-auto">
          <div className="mb-12">
            <p className="text-[11px] uppercase tracking-[0.18em] text-blue-500 font-mono mb-3">
              {formatDate(fm.date)}
              {fm.author ? ` · ${fm.author}` : ''}
            </p>
            <h1 className="text-3xl sm:text-4xl font-medium tracking-tight text-gray-900 mb-4">
              {fm.title}
            </h1>
            <p className="text-[15px] text-gray-500 leading-relaxed max-w-2xl">
              {fm.description}
            </p>
          </div>

          <div className="prose-sprintbuild">
            <MDXRemote
              source={post.content}
              components={mdxComponents}
              options={{
                mdxOptions: {
                  remarkPlugins: [remarkGfm],
                  rehypePlugins: [rehypeSlug],
                },
              }}
            />
          </div>

          <hr className="my-14 border-black/10" />

          <section className="rounded-2xl border border-black/5 bg-white p-8 text-center">
            <h2 className="text-[18px] font-medium tracking-tight text-gray-900 mb-2">
              Build your next app in a sprint
            </h2>
            <p className="text-[14px] text-gray-500 max-w-md mx-auto mb-6">
              Start with a prompt. Get a running app. Keep iterating until it
              ships.
            </p>
            <Button asChild className="bg-blue-500 hover:bg-blue-600">
              <Link href="/signup">
                Try SprintBuild free
                <ArrowRightIcon className="w-3.5 h-3.5" />
              </Link>
            </Button>
          </section>
        </div>
      </article>

      <Footer />
    </main>
  )
}

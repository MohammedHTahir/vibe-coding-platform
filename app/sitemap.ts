import type { MetadataRoute } from 'next'
import { siteUrl } from '@/lib/site'
import { listPosts } from '@/lib/blog'

/**
 * Generated sitemap. Includes:
 *  - Marketing pages: /, /blog, /terms, /privacy
 *  - Every published blog post under /blog/[slug]
 *
 * Excluded by design: /login, /signup, /dashboard, /account, /auth/*, /api/*
 * (auth-walled, transactional, or not useful for search).
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl()
  const now = new Date()

  const staticEntries: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${base}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/terms`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${base}/privacy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ]

  let posts: Awaited<ReturnType<typeof listPosts>> = []
  try {
    posts = await listPosts()
  } catch {
    // Blog directory missing or unreadable at build time. Don't fail the
    // whole sitemap — return the static entries we already have.
  }

  const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url:
      post.frontmatter.canonical ?? `${base}/blog/${post.frontmatter.slug}`,
    lastModified: new Date(post.frontmatter.date),
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  return [...staticEntries, ...postEntries]
}

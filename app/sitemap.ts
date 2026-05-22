import type { MetadataRoute } from 'next'
import { siteUrl } from '@/lib/site'
import { listPosts } from '@/lib/blog'
import { listCompetitorSlugs } from '@/lib/competitors'
import { listUseCaseSlugs } from '@/lib/use-cases'

/**
 * Generated sitemap. Includes:
 *  - Marketing pages: /, /about, /blog, /pricing, /terms, /privacy
 *  - Programmatic SEO surfaces: /vs, /alternatives, /build hubs and
 *    every generated page underneath them
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
    { url: `${base}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/pricing`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/vs`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/alternatives`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/build`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/terms`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${base}/privacy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ]

  const competitorEntries: MetadataRoute.Sitemap = listCompetitorSlugs().flatMap(
    (slug) => [
      {
        url: `${base}/vs/${slug}`,
        lastModified: now,
        changeFrequency: 'monthly' as const,
        priority: 0.75,
      },
      {
        url: `${base}/alternatives/${slug}`,
        lastModified: now,
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      },
    ]
  )

  const useCaseEntries: MetadataRoute.Sitemap = listUseCaseSlugs().map(
    (slug) => ({
      url: `${base}/build/${slug}`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    })
  )

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

  return [
    ...staticEntries,
    ...competitorEntries,
    ...useCaseEntries,
    ...postEntries,
  ]
}

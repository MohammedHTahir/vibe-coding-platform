import type { MetadataRoute } from 'next'
import { siteUrl } from '@/lib/site'

/**
 * robots.txt. Disallow auth-walled and transactional surfaces; allow
 * everything marketing-facing. Sitemap pointer lets Google and friends
 * find the post list.
 */
export default function robots(): MetadataRoute.Robots {
  const base = siteUrl()
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/'],
        disallow: ['/api/', '/auth/', '/dashboard', '/account', '/login', '/signup'],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  }
}

import type { MetadataRoute } from 'next'
import { BRAND_NAME, BRAND_TAGLINE } from '@/lib/site'

/**
 * PWA manifest. Mostly informational for browsers; also picked up by
 * Google for branding consistency in mobile SERPs. Icons reference
 * the build-time generated `/icon` and `/apple-icon` routes so the
 * manifest, favicon, and OG image all share one source.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: BRAND_NAME,
    short_name: BRAND_NAME,
    description: BRAND_TAGLINE,
    start_url: '/',
    display: 'standalone',
    background_color: '#f0f0ee',
    theme_color: '#2563eb',
    icons: [
      {
        src: '/icon',
        sizes: '64x64',
        type: 'image/png',
      },
      {
        src: '/apple-icon',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  }
}

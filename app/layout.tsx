import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { Toaster } from '@/components/ui/sonner'
import { CookieConsent } from '@/components/consent/cookie-consent'
import { GoogleAnalytics } from '@/components/analytics/google-analytics'
import { JsonLd, organizationLd, websiteLd } from '@/lib/jsonld'
import type { ReactNode } from 'react'
import type { Metadata } from 'next'
import { Suspense } from 'react'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import {
  BRAND_DESCRIPTION,
  BRAND_NAME,
  googleAnalyticsId,
  siteUrl,
  verificationIds,
} from '@/lib/site'
import './globals.css'

const url = siteUrl()
const verification = verificationIds()

export const metadata: Metadata = {
  metadataBase: new URL(url),
  title: {
    default: BRAND_NAME,
    template: `%s · ${BRAND_NAME}`,
  },
  description: BRAND_DESCRIPTION,
  // The root canonical points to the homepage. Every other page MUST
  // override this in its own metadata export — Next merges metadata
  // from the layout into pages, so an unset `alternates.canonical`
  // would otherwise inherit "/" and silently de-index the page.
  alternates: {
    canonical: '/',
  },
  applicationName: BRAND_NAME,
  authors: [{ name: 'Mohammed Tahir' }],
  creator: 'Mohammed Tahir',
  publisher: BRAND_NAME,
  category: 'technology',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: BRAND_NAME,
    description: BRAND_DESCRIPTION,
    url,
    siteName: BRAND_NAME,
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: BRAND_NAME,
    description: BRAND_DESCRIPTION,
    creator: '@sprintbuild',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  ...(verification.google || verification.bing
    ? {
        verification: {
          ...(verification.google ? { google: verification.google } : {}),
          ...(verification.bing
            ? { other: { 'msvalidate.01': verification.bing } }
            : {}),
        },
      }
    : {}),
}

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const gaId = googleAnalyticsId()

  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable}`}
    >
      <body className="antialiased">
        <JsonLd data={[organizationLd(), websiteLd()]} id="root" />
        <Suspense fallback={null}>
          <NuqsAdapter>{children}</NuqsAdapter>
        </Suspense>
        <CookieConsent />
        <Toaster />
        {gaId ? (
          <Suspense fallback={null}>
            <GoogleAnalytics measurementId={gaId} />
          </Suspense>
        ) : null}
      </body>
    </html>
  )
}

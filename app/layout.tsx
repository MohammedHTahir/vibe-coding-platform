import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { Toaster } from '@/components/ui/sonner'
import { CookieConsent } from '@/components/consent/cookie-consent'
import type { ReactNode } from 'react'
import type { Metadata } from 'next'
import { Suspense } from 'react'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { BRAND_NAME, siteUrl } from '@/lib/site'
import './globals.css'

const title = BRAND_NAME
const description = `${BRAND_NAME} is an end-to-end AI coding platform where you describe what you want and an agent ships a full-stack application. It uses Vercel's AI Cloud services like Sandbox for secure code execution, AI Gateway for Claude, GPT, and other model support, Fluid Compute for efficient rendering and streaming, and it's built with Next.js and the AI SDK.`

const url = siteUrl()

export const metadata: Metadata = {
  metadataBase: new URL(url),
  title: {
    default: title,
    template: `%s · ${title}`,
  },
  description,
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title,
    description,
    url,
    siteName: title,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
  },
}

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable}`}
    >
      <body className="antialiased">
        <Suspense fallback={null}>
          <NuqsAdapter>{children}</NuqsAdapter>
        </Suspense>
        <CookieConsent />
        <Toaster />
      </body>
    </html>
  )
}

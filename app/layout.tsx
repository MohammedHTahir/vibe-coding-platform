import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { Toaster } from '@/components/ui/sonner'
import { CookieConsent } from '@/components/consent/cookie-consent'
import type { ReactNode } from 'react'
import type { Metadata } from 'next'
import { Suspense } from 'react'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'

const title = 'SprintBuild'
const description = `SprintBuild is an end-to-end AI coding platform where you describe what you want and an agent ships a full-stack application. It uses Vercel's AI Cloud services like Sandbox for secure code execution, AI Gateway for Claude, GPT, and other model support, Fluid Compute for efficient rendering and streaming, and it's built with Next.js and the AI SDK.`

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://sprintbuild.ai'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: title,
    template: `%s · ${title}`,
  },
  description,
  openGraph: {
    title,
    description,
    url: siteUrl,
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

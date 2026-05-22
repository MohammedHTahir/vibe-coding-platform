'use client'

import Script from 'next/script'
import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

/**
 * Google Analytics 4 with Consent Mode v2.
 *
 * Why the bootstrap script runs on every visit even before consent:
 * Consent Mode v2 specifically asks you to load gtag with all storage
 * defaults set to `denied`. Loading happens; *measurement* doesn't,
 * until the user accepts the analytics category in the cookie banner.
 * The CookieConsent component is responsible for calling
 * `window.gtag('consent', 'update', { analytics_storage: 'granted', ... })`
 * when the user opts in.
 *
 * This component is no-op if `NEXT_PUBLIC_GA_ID` isn't set, so dev
 * environments stay clean.
 */
interface Props {
  measurementId: string
}

export function GoogleAnalytics({ measurementId }: Props) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (!measurementId) return
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const gtag = (window as any).gtag as
      | ((...args: unknown[]) => void)
      | undefined
    if (!gtag) return
    const query = searchParams?.toString()
    const page = query ? `${pathname}?${query}` : pathname
    gtag('event', 'page_view', {
      page_path: page,
      page_location: window.location.href,
      page_title: document.title,
    })
  }, [pathname, searchParams, measurementId])

  if (!measurementId) return null

  return (
    <>
      {/* Bootstrap. Defaults all storage to denied per Consent Mode v2. */}
      <Script id="ga-consent-default" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('consent', 'default', {
            ad_storage: 'denied',
            ad_user_data: 'denied',
            ad_personalization: 'denied',
            analytics_storage: 'denied',
            functionality_storage: 'denied',
            personalization_storage: 'denied',
            security_storage: 'granted',
            wait_for_update: 500
          });
          gtag('js', new Date());
          gtag('config', '${measurementId}', {
            anonymize_ip: true,
            send_page_view: false
          });
        `}
      </Script>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
    </>
  )
}

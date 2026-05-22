/**
 * Centralised JSON-LD builders. Everything that emits structured data
 * imports from here so the schema, brand strings, and canonical URLs
 * stay in sync.
 *
 * Usage:
 *   import { JsonLd, organizationLd, websiteLd } from '@/lib/jsonld'
 *
 *   <JsonLd data={[organizationLd(), websiteLd()]} />
 *
 * The `JsonLd` component is render-safe in both server and client
 * components; it serialises with `JSON.stringify` and emits a single
 * `<script type="application/ld+json">` per `data` element.
 */

import type { ReactNode } from 'react'
import {
  BRAND_DESCRIPTION,
  BRAND_NAME,
  BRAND_TAGLINE,
  FOUNDER,
  absoluteUrl,
  siteUrl,
  socialSameAs,
} from '@/lib/site'

// Loose JSON-LD type — schema.org permits arbitrary keys per type.
export type JsonLdNode = Record<string, unknown>

interface JsonLdProps {
  data: JsonLdNode | JsonLdNode[]
  /**
   * Render id useful when a page emits multiple JSON-LD blocks. Keeps
   * dev-tools tidy; not required for validity.
   */
  id?: string
}

/**
 * Renders one or more JSON-LD payloads as inline script tags. Always
 * emits compact JSON (no whitespace) to keep page weight minimal.
 */
export function JsonLd({ data, id }: JsonLdProps): ReactNode {
  const blocks = Array.isArray(data) ? data : [data]
  return blocks.map((node, i) => (
    <script
      key={`${id ?? 'ld'}-${i}`}
      type="application/ld+json"
      // Schema.org JSON-LD must be inlined verbatim.
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(node) }}
    />
  ))
}

/**
 * Organization schema for the brand. Lives on the root layout so every
 * page emits it — Google needs it on the homepage but emitting it
 * everywhere is cheap and keeps Knowledge Panel signals consistent.
 */
export function organizationLd(): JsonLdNode {
  const url = siteUrl()
  const sameAs = socialSameAs()
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${url}/#organization`,
    name: BRAND_NAME,
    url,
    logo: {
      '@type': 'ImageObject',
      url: `${url}/icon`,
      width: 64,
      height: 64,
    },
    description: BRAND_DESCRIPTION,
    ...(sameAs.length > 0 ? { sameAs } : {}),
  }
}

/**
 * Website schema with a SearchAction so Google can render a sitelinks
 * search box in branded SERPs. Pointed at /blog?q= today; if a sitewide
 * search ships later, swap the target URL.
 */
export function websiteLd(): JsonLdNode {
  const url = siteUrl()
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${url}/#website`,
    name: BRAND_NAME,
    url,
    description: BRAND_TAGLINE,
    publisher: { '@id': `${url}/#organization` },
    potentialAction: {
      '@type': 'SearchAction',
      target: `${url}/blog?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  }
}

/**
 * Breadcrumb schema. Pass an ordered list of `{ name, path }` segments.
 * Last item is treated as the current page; `path` is resolved against
 * the canonical origin.
 */
export function breadcrumbLd(
  items: Array<{ name: string; path: string }>
): JsonLdNode {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  }
}

/**
 * Person schema for the founder/author. Used on /about and as the
 * `author` value on every BlogPosting.
 */
export function founderPersonLd(): JsonLdNode {
  const url = siteUrl()
  const sameAs = socialSameAs()
  const founderImage: string = FOUNDER.image
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${url}/#founder`,
    name: FOUNDER.name,
    url: `${url}/about`,
    jobTitle: FOUNDER.jobTitle,
    description: FOUNDER.bio,
    ...(founderImage
      ? {
          image: founderImage.startsWith('http')
            ? founderImage
            : absoluteUrl(founderImage),
        }
      : {}),
    worksFor: { '@id': `${url}/#organization` },
    ...(sameAs.length > 0 ? { sameAs } : {}),
  }
}

interface BlogPostingArgs {
  title: string
  description: string
  slug: string
  datePublished: string
  dateModified?: string
  authorName?: string
  imageUrl?: string
  tags?: string[]
}

/**
 * BlogPosting schema for /blog/[slug]. `imageUrl` is optional but
 * highly recommended — Google requires an `image` for the rich result
 * carousel. When absent, we fall back to the dynamic OG image so
 * something always renders.
 */
export function blogPostingLd(args: BlogPostingArgs): JsonLdNode {
  const url = siteUrl()
  const canonical = absoluteUrl(`/blog/${args.slug}`)
  const image = args.imageUrl
    ? args.imageUrl.startsWith('http')
      ? args.imageUrl
      : absoluteUrl(args.imageUrl)
    : `${url}/blog/${args.slug}/opengraph-image`
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `${canonical}#article`,
    headline: args.title,
    description: args.description,
    url: canonical,
    mainEntityOfPage: { '@type': 'WebPage', '@id': canonical },
    datePublished: args.datePublished,
    dateModified: args.dateModified ?? args.datePublished,
    image,
    author: args.authorName
      ? {
          '@type': 'Person',
          name: args.authorName,
          url: `${url}/about`,
        }
      : { '@id': `${url}/#founder` },
    publisher: { '@id': `${url}/#organization` },
    ...(args.tags && args.tags.length > 0 ? { keywords: args.tags.join(', ') } : {}),
  }
}

/**
 * FAQPage schema. Strips Markdown-y characters from answers so the
 * structured data matches the rendered text Google sees.
 */
export function faqPageLd(items: Array<{ q: string; a: string }>): JsonLdNode {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
  }
}

interface OfferArgs {
  name: string
  price: number
  priceCurrency?: string
  url: string
  description?: string
  /**
   * Use 'P1M' for monthly subscriptions, 'P1Y' for annual, or omit for
   * one-time offers. Schema.org expects ISO 8601 durations.
   */
  billingDuration?: string
}

/**
 * Product schema for the /pricing page. Each plan becomes a separate
 * Offer. We flatten to one Product (the platform itself) with multiple
 * offers because Google handles that more reliably than emitting one
 * Product per plan.
 */
export function productLd(offers: OfferArgs[]): JsonLdNode {
  const url = siteUrl()
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${url}/#product`,
    name: BRAND_NAME,
    description: BRAND_DESCRIPTION,
    url: `${url}/pricing`,
    brand: { '@id': `${url}/#organization` },
    offers: offers.map((offer) => ({
      '@type': 'Offer',
      name: offer.name,
      price: offer.price.toFixed(2),
      priceCurrency: offer.priceCurrency ?? 'USD',
      url: offer.url,
      availability: 'https://schema.org/InStock',
      ...(offer.description ? { description: offer.description } : {}),
      ...(offer.billingDuration
        ? {
            priceSpecification: {
              '@type': 'UnitPriceSpecification',
              price: offer.price.toFixed(2),
              priceCurrency: offer.priceCurrency ?? 'USD',
              billingDuration: offer.billingDuration,
            },
          }
        : {}),
    })),
  }
}

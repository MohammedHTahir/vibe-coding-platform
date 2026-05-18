# Canonical site URL and brand

## Domain

The canonical public origin is **`https://trendweaver.ai`**.

The previous domain `sprintbuild.ai` has been retired. New code must not
hardcode either domain.

## How to use it

Always import from `lib/site.ts`:

```ts
import { siteUrl, siteHost, BRAND_NAME, CONTACT_EMAILS } from '@/lib/site'
```

- `siteUrl()` — full origin without trailing slash. Use for `metadataBase`,
  blog canonicals, OAuth redirects, sitemap entries, anywhere that needs
  an absolute URL.
- `siteHost()` — bare hostname (`trendweaver.ai`). Use for OG image text,
  display strings, `http-referer` headers.
- `BRAND_NAME` — display name shown in UI. Currently `"SprintBuild"`; will
  follow when the brand rename happens.
- `CONTACT_EMAILS.{general, privacy, legal}` — published contact addresses.

## Forbidden

Do not write any of these in new code:

- `'https://sprintbuild.ai'` (any string literal)
- `'https://trendweaver.ai'` (any string literal)
- `'sprintbuild.ai'` / `'trendweaver.ai'` as bare hosts
- `process.env.NEXT_PUBLIC_SITE_URL` directly — call `siteUrl()` instead

The env var `NEXT_PUBLIC_SITE_URL` is read inside `lib/site.ts` and nowhere
else. This keeps the fallback default and the env-var precedence in one place.

## When the domain changes again

Update three things, in this order:

1. `DEFAULT_SITE_URL` in `lib/site.ts`
2. `NEXT_PUBLIC_SITE_URL` in every Vercel environment
3. The Supabase Auth Site URL and additional redirect URLs

`README.md`, `SETUP.md`, and `.seo-engine/config.yaml` carry copies that
should also be updated for documentation accuracy, but they don't affect
runtime.

## Brand rename

The codebase still ships components named `SprintBuildWordmark`, copy that
references "SprintBuild", and a project name of `sprintbuild` in
`package.json`. When the brand is officially renamed, do not rename
component identifiers or `package.json` in the same PR as visible-copy
changes — keep them as separate commits so the diff stays reviewable.

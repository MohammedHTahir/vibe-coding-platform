# SprintBuild · Setup

This project ships with a Next.js 16 + Tailwind v4 frontend, a Supabase auth
layer (`@supabase/ssr`), and Vercel Sandbox + AI Gateway for the agent runtime.

## Routes

- `/` — marketing landing page (hero with autoplay video, features, models, FAQ, CTA, footer)
- `/login` — email + GitHub sign-in
- `/signup` — email + GitHub sign-up
- `/auth/callback` — OAuth and email-confirmation exchange handler
- `/auth/signout` — POST endpoint to sign out
- `/dashboard` — the existing AI agent UI, gated behind Supabase auth

## Prerequisites

- Node.js 22.x
- pnpm or npm
- (For local Supabase) [Docker Desktop](https://www.docker.com/products/docker-desktop) + the [Supabase CLI](https://supabase.com/docs/guides/cli)

## Environment variables

Copy `.env.example` to `.env.local` and fill in:

| Variable | Required | Notes |
| --- | --- | --- |
| `AI_GATEWAY_API_KEY` | Yes for agent | Vercel AI Gateway key |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes for auth | Project REST URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes for auth | Anon (publishable) key |
| `SUPABASE_SERVICE_ROLE_KEY` | Optional | Only for server-side admin tasks |
| `NEXT_PUBLIC_SITE_URL` | Yes | Public origin used by auth redirects (`http://localhost:3000` locally, `https://sprintbuild.ai` in prod) |

The marketing site renders even when Supabase env vars are empty — the layout
gates auth checks behind a presence test. Hitting `/dashboard` without env vars
falls through to the middleware redirect.

## Running locally

```bash
npm install
npm run dev
```

App runs at http://localhost:3000.

## Supabase

### Option A · Local Supabase stack (recommended for development)

Requires Docker Desktop and the Supabase CLI.

```bash
# from the project root
supabase init --yes        # only needed once, the supabase/ folder is already committed
supabase start             # boots Postgres, Auth, Storage, Studio in Docker
```

`supabase start` will print the local API URL and anon key — paste them into
`.env.local`. The committed migration in `supabase/migrations/` will apply
automatically on first start. It creates:

- `public.profiles` table (one row per `auth.users`, auto-created via trigger)
- `public.projects` table (per-user project metadata)
- `avatars` storage bucket (public read, owner-only write)
- `project-files` storage bucket (private, owner-only)
- RLS policies on every table and bucket so users only see their own data

Useful commands:

```bash
supabase status            # see local URLs and keys
supabase db reset          # wipe and re-apply migrations
supabase gen types typescript --local > types/supabase.ts
```

### Option B · Hosted Supabase project (production)

1. Create a project at https://supabase.com.
2. In the Auth settings, set the Site URL to `https://sprintbuild.ai` and add `https://sprintbuild.ai/auth/callback` as an additional redirect URL.
3. Enable the GitHub provider (optional) with `https://<project>.supabase.co/auth/v1/callback` as the OAuth callback URL on GitHub.
4. From the project root, link the CLI and push the migrations:

   ```bash
   supabase link --project-ref <your-project-ref>
   supabase db push
   ```

5. Copy the project's URL and anon key into your Vercel environment variables.

### What the migration sets up

Storage buckets:

- `avatars` — public read; only the owning user can upload to `<uid>/...`
- `project-files` — fully private; only the owning user can read/write under `<uid>/<project_id>/...`

Tables:

- `public.profiles` (id ↔ `auth.users.id`, email, display_name, avatar_url)
- `public.projects` (user_id, name, description, sandbox_id, preview_url)

RLS is enabled on both tables and on `storage.objects` for both buckets.

## Deploying to Vercel

The dashboard relies on the Vercel Sandbox runtime, which is enabled
automatically on Vercel deployments. Set these env vars in the Vercel project:

```
AI_GATEWAY_API_KEY
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
NEXT_PUBLIC_SITE_URL=https://sprintbuild.ai
```

Then `vc deploy` (or `vercel --prod`).

## Project layout

```
app/
  page.tsx                  marketing landing
  layout.tsx                root layout (Geist font + global providers)
  login/                    sign-in flow
  signup/                   sign-up flow
  auth/callback/            OAuth + email confirmation handler
  auth/signout/             POST sign-out endpoint
  dashboard/                gated agent UI (was the original /)
  api/                      AI agent + sandbox routes
components/
  marketing/                landing page sections (hero, features, models, faq, cta, footer)
  ui/                       shadcn primitives
  ...                       existing dashboard components
lib/
  supabase/
    client.ts               browser client (use in client components)
    server.ts               server client (use in server components, server actions, route handlers)
    middleware.ts           shared session-refresh logic for the proxy
proxy.ts                    Next.js 16 proxy (formerly middleware) — refreshes session and gates /dashboard
supabase/
  config.toml               local CLI config
  migrations/               SQL migrations applied by `supabase start` or `supabase db push`
```

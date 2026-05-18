# SprintBuild

SprintBuild is an end-to-end AI coding platform where you describe what you
want, and an agent generates a full-stack application in a sandboxed
environment with live preview, file explorer, and command logs.

Production domain: [trendweaver.ai](https://trendweaver.ai)

## Features

- Marketing landing page with autoplay hero video, features, models, FAQ, CTA
- Supabase auth (email + GitHub OAuth) wired with `@supabase/ssr`
- Gated `/dashboard` route running the original Vibe Coding agent UI
- Multi-model support via Vercel AI Gateway (Claude, GPT, Grok)
- Secure code execution with Vercel Sandbox
- Real-time preview, file explorer, command logs, error monitor
- Storage buckets (`avatars`, `project-files`) with per-user RLS

## Tech Stack

- [Next.js 16](https://nextjs.org) with Turbopack and the new `proxy` runtime
- [AI SDK](https://ai-sdk.dev) v6 + [Vercel AI Gateway](https://vercel.com/docs/ai-gateway)
- [Vercel Sandbox](https://vercel.com/docs/vercel-sandbox)
- [Supabase](https://supabase.com) (Auth, Postgres, Storage)
- [Tailwind CSS v4](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com)
- [Geist](https://vercel.com/font) typography

## Quick start

```bash
npm install
cp .env.example .env.local
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

For full setup (including Supabase migrations and storage buckets), see
[SETUP.md](./SETUP.md).

## Supported Models

- Claude Opus 4.6
- Claude Sonnet 4.6
- GPT-5.3 Codex
- Grok 4.1 Reasoning

## Deploy

```bash
vc deploy
```

Set the env vars listed in [SETUP.md](./SETUP.md#deploying-to-vercel) before
your first production deploy.

## Credits

Originally based on the open-source [vibe-coding-platform](https://github.com/MohammedHTahir/vibe-coding-platform).

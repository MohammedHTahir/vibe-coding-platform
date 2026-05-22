# Vercel plugin — vendored copy

This folder is a vendored snapshot of [vercel/vercel-plugin](https://github.com/vercel/vercel-plugin)
adapted for Kiro. The upstream `npx plugins add vercel/vercel-plugin`
installer only supports Claude Code, Cursor, and Codex, so the content
lives here directly and is referenced from `.kiro/steering/vercel-plugin.md`.

## What's included

- `vercel.md` — the ecosystem graph (master reference for product
  relationships, decision matrices, sunset awareness).
- `skills/` — 26 skill packages, each with a `SKILL.md` and any
  reference files. The `upstream/` and `*.tmpl` files were excluded
  because `SKILL.md` is the merged build output and templates aren't
  needed at runtime.
- `agents/` — three specialist persona docs (deployment, performance, AI).
- `commands/` — five workflow playbooks (bootstrap, deploy, env,
  marketplace, status).
- `README.md`, `CLAUDE.md` — upstream documentation, kept as-is.

The runtime hook source (`hooks/`, `src/`, `scripts/`, `tests/`,
`generated/`) was deliberately not vendored — those drive automatic
skill injection in Claude Code/Cursor and aren't useful in Kiro, where
the steering file in `.kiro/steering/vercel-plugin.md` plays that role
instead.

## Refreshing the snapshot

When you want to pull a newer version of the plugin:

```cmd
git clone https://github.com/vercel/vercel-plugin.git %TEMP%\vercel-plugin
robocopy %TEMP%\vercel-plugin .kiro\vercel-plugin vercel.md README.md CLAUDE.md
robocopy %TEMP%\vercel-plugin\skills .kiro\vercel-plugin\skills /E /XD upstream /XF *.tmpl
robocopy %TEMP%\vercel-plugin\agents .kiro\vercel-plugin\agents /E /XF *.tmpl
robocopy %TEMP%\vercel-plugin\commands .kiro\vercel-plugin\commands /E /XF *.tmpl
rmdir /s /q %TEMP%\vercel-plugin
```

Then re-check `.kiro/steering/vercel-plugin.md` — if upstream added or
removed skills, update the catalog table there to match.

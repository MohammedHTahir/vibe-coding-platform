━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📖 SEO ENGINE — USAGE GUIDE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Type these into Claude Code (or any AI assistant). You can also describe
what you want in plain English; the engine instructions live in CLAUDE.md.

─── WRITING ─────────────────────────────────────

"Write the next blog"
   → Picks top priority from content-queue.yaml, runs SERP research,
     drafts, saves to src/content/blog/{slug}.mdx as human-review.

"Write a blog about [topic]"
   → Cannibalization check first, then writes.

"Write a comparison: SprintBuild vs Lovable"
   → Uses competitor data from competitors.yaml.

"Write the pillar page for [cluster name]"
   → Comprehensive pillar (definition / why it matters / types / how-to /
     best practices / mistakes / tools / FAQ).

"Approve blog [slug]"
   → Marks as published in content-map.yaml.

"Blog [slug] needs changes: [feedback]"
   → Revises and keeps in review.

─── SERP RESEARCH ───────────────────────────────

Before every blog, the engine needs real SERP data from Google.
It will NEVER use built-in web search — that produces generic data.

If a dedicated SEO MCP tool (Semrush, Ahrefs) is connected, the engine
uses that.

Otherwise the engine asks YOU to search Google and provide:
   1. Top 3-5 ranking page titles + URLs
   2. People Also Ask questions
   3. Related searches at the bottom of Google
   4. Related keywords from your SEO tools (optional)

─── NEW DOCS & FEATURES ─────────────────────────

"Scan new docs at [path]"
"New feature: [name] at [doc path]"

─── COMPETITORS ─────────────────────────────────

"Update competitor: Lovable now supports [feature]"
"Bolt raised pricing. Update."

─── KEYWORDS ────────────────────────────────────

"Import keywords: [paste data]"
"Pull keywords via MCP for [topic]"

─── TOPIC CLUSTERS ──────────────────────────────

"Show topic cluster status"
"Create cluster for [topic]"
"What cluster pages should I write next?"

─── AUDITS ──────────────────────────────────────

"Run a content audit"
"Check keyword cannibalization"
"What should I write next?"
"Which blogs need updating?"

─── CONFIG ──────────────────────────────────────

Edit `.seo-engine/config.yaml` anytime to change:
- Author info, trust signals, testimonials, review links
- CTA text/URL, word count limits
- Add/remove competitors
- Change publishing cadence

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

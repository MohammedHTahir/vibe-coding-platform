# SprintBuild — Working Notes for AI Agents

This file is read by AI assistants working on this repo. Keep it current.

---

## SEO Content Engine

SEO engine lives in `.seo-engine/`. Use it for all blog and SEO tasks.

**UNIVERSAL RULE: For ANY task involving blogs, content, SEO, keywords, competitors, or documentation in this project — ALWAYS read `.seo-engine/config.yaml` and the relevant data files FIRST before responding.** This includes writing, evaluating, reviewing, editing, auditing, planning, or answering questions about content. Never rely on your default behavior — always check the engine data.

**Sub-Agent Rule:** Parallelize independent tasks. Don't do sequentially what can run simultaneously.

### File Reference

| File | Purpose | When |
|------|---------|------|
| `config.yaml` | Settings, author, trust signals | Before any task |
| `data/features.yaml` | Feature registry | Before writing |
| `data/competitors.yaml` | Competitor matrix | Before comparisons |
| `data/seo-keywords.csv` | Keywords + SERP data | Before choosing topics |
| `data/content-map.yaml` | Blog ↔ feature ↔ keyword map | Before writing |
| `data/content-queue.yaml` | Prioritized ideas | When deciding what to write |
| `data/topic-clusters.yaml` | Pillar/cluster architecture | Before writing |
| `templates/blog-frontmatter.yaml` | Frontmatter format | When generating |
| `templates/blog-structures.yaml` | Outlines by type | When structuring |
| `templates/tone-guide.md` | Style + E-E-A-T rules | Before writing |
| `logs/changelog.md` | Audit trail | After every action |

### Core Rules

1. **Read before writing.** Always read: config, features, content-map, content-queue, topic-clusters, tone-guide.
2. **Never fabricate features.** Only reference what's in features.yaml.
3. **Competitor claims need confidence.** If "unverified" or 90+ days old → caveat or direct reader to competitor's page.
4. **No web search for SERP data.** NEVER use built-in web search to research keywords or SERP results. It produces generic data that leads to generic content. ALWAYS ask the user to provide real Google SERP data (top results, PAA, related searches). The ONLY exception is if a dedicated SEO MCP tool (Semrush, Ahrefs) is connected.
5. **Cannibalization check before every blog.** Search content-map for overlapping keywords. If conflict → recommend updating existing blog. Only proceed if angle is genuinely different.
6. **Every blog needs a unique angle.** Define what's different from what ranks. "More comprehensive" is NOT an angle.
7. **E-E-A-T mandatory.** Every blog must include at least one: testimonial, metric, experience, or review link from config.trust_signals. If config has no trust signals yet, ask user to provide one before publishing.
8. **Human review required.** Save all blogs as `status: "human-review"`. Never auto-publish. Alert user to review.
9. **Respect pillar/cluster linking.** Cluster pages → link to pillar. Pillar → link to all cluster pages. Non-negotiable.
10. **Update all files after writing:**
   - content-map.yaml (register blog)
   - features.yaml (blog_refs)
   - seo-keywords.csv (mapped_blog_slugs)
   - content-queue.yaml (status)
   - topic-clusters.yaml (if cluster blog)
   - changelog.md (log action)
11. **Never delete data.** Add or update only.
12. **Log everything** to changelog.md.

### SERP Intent Interpretation Rules

When analyzing SERP data, classify intent BEFORE deciding content structure:

- **All product/tool/template pages in top results** → TRANSACTIONAL. Provide tool/template/CTA first, educational depth below. Do NOT write a pure guide.
- **Mix of guides + product pages** → BLENDED. Comprehensive guide with embedded tool/template CTAs.
- **All informational guides in top results** → INFORMATIONAL. Thorough guide; product mentions natural, not forced.
- **All comparison/listicle pages** → COMMERCIAL INVESTIGATION. Comparison or listicle, not a how-to.

**Rule: NEVER fight the SERP.** Match the dominant intent, then add unique value on top.

### Blog Writing Workflow

**STEP 1 — Pre-writing research (sub-agents for parallel tasks)**

a) Read all data files
b) Pick topic from queue (highest priority "planned") or user request
c) **Cannibalization check** against content-map; document why if proceeding
d) **SERP analysis — CRITICAL RULE:** never use built-in web search; if no SEO MCP tool is connected, ask the user for top-5 results, People Also Ask, and related searches; wait for the response
e) **Define unique angle** in one sentence; if no genuine gap, tell the user

**STEP 2 — Draft (sub-agents for long sections)**

a) Pick structure from blog-structures.yaml. Pillar pages MUST cover:
   - Definition (what is X)
   - Why it matters
   - Types/categories (these become cluster pages — link to each)
   - How-to / step-by-step
   - Best practices
   - Common mistakes
   - Tools/templates (include SprintBuild naturally)
   - FAQ (real People Also Ask)
   For transactional intent, lead with tools/templates section. For informational, lead with definition and how-to.
b) Read tone-guide.md; match the voice for the blog type
c) Build frontmatter using templates/blog-frontmatter.yaml (≤60 char title, ≤160 char description, ≤5-word slug)
d) Write the body:
   - Primary keyword in title, first paragraph, one H2, description, slug
   - At least 2 internal links with varied anchor text
   - 1-2 external authoritative links (no competitor links unless explicitly cited)
   - FAQ from real PAA data
e) **Inject E-E-A-T:** author, testimonial/metric/experience, review link if available
f) Save to `src/content/blog/{slug}.mdx` with status `human-review`

**STEP 3 — Post-writing (sub-agents — parallel)**

a) Update content-map.yaml, features.yaml blog_refs, seo-keywords.csv mapped_blog_slugs, content-queue.yaml status, topic-clusters.yaml if cluster blog, logs/changelog.md
b) Alert user with file path, word count, link count, cluster, and a "Approve blog {slug}" prompt

### Audit Workflow

1. Feature coverage gaps (empty `blog_refs`)
2. Keyword gaps (high priority, no blog)
3. Cluster completion (% per cluster)
4. Keyword cannibalization
5. Stale content (90+ days)
6. Competitor data freshness (90+ days)
7. Internal linking gaps
8. E-E-A-T gaps
9. Report → update queue → log

### Evaluate / Review Blog Workflow

1. Read the blog
2. Read config.yaml, features.yaml, competitors.yaml, content-map.yaml, topic-clusters.yaml, tone-guide.md
3. Score against:
   - SEO (keyword placement, lengths)
   - Cannibalization
   - Feature accuracy (every claim in features.yaml)
   - Competitor accuracy (confidence + recency)
   - E-E-A-T signals
   - Cluster alignment + pillar linking
   - Internal/external linking
   - Unique angle
   - Tone/voice match
   - Specificity (no AI filler)
   - Word count vs config
   - Pillar completeness (if pillar)
   - SERP intent match
   - FAQ quality (real PAA)
4. Output structured report with score /10, strengths, issues, fixes, approve/reject

### Create Topic Cluster Workflow

1. Read features.yaml + topic-clusters.yaml
2. Design cluster pages from features + topic knowledge
3. Ask user for SERP data on the pillar keyword; wait for response
4. Apply SERP Intent Interpretation Rules to pick pillar format
5. Pillar must cover all mandatory sections
6. Save cluster
7. Add pages to content-queue.yaml (with cannibalization check)
8. Add keywords to seo-keywords.csv
9. Log to changelog.md

### New Feature Workflow

1. Add to features.yaml
2. Add row to competitors.yaml (unverified)
3. Generate keywords → seo-keywords.csv
4. Assign to cluster or create one in topic-clusters.yaml
5. Mark existing blogs needing updates
6. Queue blog ideas (with cannibalization check)
7. Log

### SEO Data Import Workflow

1. Merge into seo-keywords.csv (no dupes)
2. Map to features
3. Update SERP fields
4. Assign to clusters
5. Recalculate queue priorities
6. Generate new queue items (with cannibalization check)
7. Log

### Changelog Format

```
## {YYYY-MM-DD HH:MM}
**Action:** {what}
**Files:** {list}
**Summary:** {1-2 sentences}
**Triggered by:** {user / audit / detection / import}
```

---

## Project context (non-SEO)

- **Stack:** Next.js 16 (App Router, Turbopack), Tailwind v4, Supabase (Auth + Postgres + Storage), Vercel AI Gateway, Vercel Sandbox.
- **Entry points:** `app/page.tsx` (marketing), `app/dashboard/page.tsx` (gated agent UI).
- **Auth:** `@supabase/ssr` 0.10. Server client at `lib/supabase/server.ts`. Browser client at `lib/supabase/client.ts`. Session refresh + protected-route gating in `proxy.ts` + `lib/supabase/middleware.ts`.
- **Blog:** lives at `app/blog/` with content under `src/content/blog/*.mdx`.
- **Do not break the dashboard agent loop.** The Vercel Sandbox + AI Gateway pipeline (`app/api/chat/route.ts`, `ai/tools/*`, `app/api/sandboxes/*`) is the original working flow. Any new feature should compose around it, not replace it.

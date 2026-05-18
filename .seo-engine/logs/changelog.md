# SprintBuild SEO Engine — Changelog

## 2026-05-18 00:00
**Action:** Initialised SEO content engine
**Files:**
- `.seo-engine/config.yaml`
- `.seo-engine/data/features.yaml`
- `.seo-engine/data/competitors.yaml`
- `.seo-engine/data/seo-keywords.csv`
- `.seo-engine/data/topic-clusters.yaml`
- `.seo-engine/data/content-map.yaml`
- `.seo-engine/data/content-queue.yaml`
- `.seo-engine/templates/blog-frontmatter.yaml`
- `.seo-engine/templates/blog-structures.yaml`
- `.seo-engine/templates/comparison-template.md`
- `.seo-engine/templates/tone-guide.md`
- `.seo-engine/USAGE-GUIDE.md`
- `CLAUDE.md`
**Summary:** Auto-detected SprintBuild as a Next.js 16 project; scanned
`README.md`, `SETUP.md`, `app/`, `ai/`, and `components/` to register 24
features across 6 categories; seeded 5 competitors (Lovable, Bolt.new,
Replit Agent, Base44, v0) with `unverified` status; built 5 topic clusters
from the user's primary topics; queued 10 ideas (5 pillars + 2 high-priority
competitor comparisons + 3 mid-priority cluster pages). Author set to
"Mohammed Tahir &lt;hero@sprintbuild.ai&gt;". Blog scaffold to be added at
`app/blog` with content under `src/content/blog/`. Pillar pages await real
SERP data before their structures are finalised — see CLAUDE.md SERP rule.
**Triggered by:** user (`seo-engine-setup-prompt.md`)

# Blog content

MDX files in this directory are rendered at `/blog/[slug]`.

The SEO engine in `.seo-engine/` writes into this folder when you ask it to
draft a new blog. Don't write blog posts by hand without going through the
engine — they'll skip the cannibalization check, E-E-A-T injection, and
content-map registration.

## Frontmatter

```mdx
---
title: "Title here (≤ 60 chars)"
description: "Meta description (≤ 160 chars)"
date: "YYYY-MM-DD"
slug: "kebab-case-slug"
author: "Mohammed Tahir"
tags: ["topic-1", "topic-2"]
blog_type: "tutorial"           # comparison | listicle | tutorial | how_to | review | thought_leadership
content_type: "cluster"          # pillar | cluster | supporting | standalone
cluster_id: "tc_vibe_coding"     # optional
draft: false                     # set true to hide
---
```

See `.seo-engine/templates/blog-frontmatter.yaml` for the full schema.

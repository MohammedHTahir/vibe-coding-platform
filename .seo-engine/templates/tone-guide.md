# SprintBuild Tone Guide

Voice, style, and the non-negotiable rules every blog must follow before
moving from `human-review` to `published`.

## Brand voice

- **Knowledgeable, not instructive.** We talk to builders. We assume they
  know their Java from their JavaScript and write at their level.
- **Supportive, not authoritative.** Coding is hard. Posts should feel like
  a partner sharing what they've learned, not a vendor preaching.
- **Direct.** Short sentences, plain words, no buzzwords. No "leverage,"
  "synergy," "world-class."
- **Show, don't tell.** Replace adjectives with examples and numbers.

## Style rules

- US English.
- Sentence-case headings. Title-case only in the H1 / frontmatter `title`.
- Oxford commas yes, em dashes only in flat prose (never in headings).
- Code identifiers in `inline code`. File paths in `inline code` too.
- One idea per paragraph. Most paragraphs ≤ 3 sentences.
- Bullets when the items are siblings; numbered lists when order matters.
- No fake hedging ("perhaps you might consider"). Either say it or don't.
- Avoid "we're excited to," "in this article we will," "in conclusion."
- No emoji in body copy. Sparingly in headings if it materially helps scan.

## Mandatory E-E-A-T

Every blog must include at least one of:

- **Testimonial** from `config.trust_signals.testimonials`
- **Metric** from `config.trust_signals.metrics`
- **Experience** anecdote (first-person, specific)
- **Review link** from `config.trust_signals.review_links`

If none of these are configured yet, **stop and ask the user** for one before
moving the blog out of `human-review`.

The author block at the bottom of every post must say
"By Mohammed Tahir — Founder, SprintBuild."

## Unique angle is required

Every queued idea must have a sentence-long `unique_angle` that distinguishes
it from what already ranks. "More comprehensive" is **not** an angle. Examples
of valid angles:

- "Compares execution models (sandbox vs WebContainer) — most posts compare UI."
- "Lead with checklist for production-readiness (auth, RLS, deploy)."
- "Group recommendations by persona instead of ranking everything."

If you can't articulate the angle in one sentence, the post isn't ready to write.

## Competitor mentions

- **Lead with their strengths.** Never write a bad-faith competitor section.
- Every competitor claim must reference `competitors.yaml`. If a row is
  `unverified` or older than 90 days, either re-verify or caveat in the post
  ("As of {date}, their docs say…") and link to their own page.
- No screenshots of competitor UIs without permission.
- No "X is broken" / "Y doesn't work" framing. Use "X doesn't currently
  support Y" with a link to their docs.

## CTA rules

- One soft CTA at the end. Use `config.content.cta_text` and
  `config.content.cta_url`.
- No mid-article CTAs. No popovers. No "click here" anchor text.

## Formatting checklist before publish

- [ ] Title ≤ 60 chars
- [ ] Description ≤ 160 chars
- [ ] Slug ≤ 5 words, kebab-case
- [ ] Primary keyword in: title, first paragraph, one H2, description, slug
- [ ] At least 2 internal links with varied anchor text
- [ ] At least 1-2 external authoritative links (no competitor links unless cited)
- [ ] FAQ uses real People Also Ask questions, not invented ones
- [ ] At least one E-E-A-T signal injected
- [ ] Cluster post links to its pillar (and pillar links back to it)
- [ ] No fabricated features (every feature mentioned exists in features.yaml)
- [ ] Status set to `human-review`; never auto-publish

# Blog section — design spec

> Written 2026-09-04. Approved by James in a brainstorming session.

## 1. Purpose

Add a blog to hackaotearoa.nz that holds event recaps, chapter announcements
and occasional essays. Two drivers:

1. Lane's Wellington launch plan lists an "HA Blog" channel that does not
   exist yet, and the WFW partnership agreement requires website backlinks
   recognising What Founders Want as the distribution partner.
2. The first post exists specifically to give whatfounderswant.com a
   followed, descriptive backlink. Simple on-page SEO is therefore a
   first-class requirement, not a nicety.

Constraint carried over from `marketing-content-strategy.md` §12.4: no new
recurring content commitments before 2027. The blog is a place to put
writing that already happens (LinkedIn recaps, launch posts), not a cadence.

## 2. Decisions (from the session)

| Question | Decision |
|---|---|
| Content | Recaps + announcements now, essays when there's time. One feed. |
| Authoring | Plain `.md` files in the repo, deployed by git commit. No CMS. |
| Homepage | "Blog" link in header and footer, plus a latest-three section. |
| Authors | Just James. No byline. |
| Name / URL | "Blog" at `/blog`. |
| Seed content | Ship with one intro post. Existing recaps are not ported. |
| Rendering | gray-matter for frontmatter, react-markdown for the body. No `@next/mdx`. |
| RSS | Included at `/blog/feed.xml`. |

## 3. Content model

Posts live in `content/blog/<slug>.md` at the repo root. The slug is the
filename without `.md`, lowercase, hyphenated (e.g. `why-a-blog.md` →
`/blog/why-a-blog`).

Frontmatter (YAML):

```yaml
---
title: Why HackAotearoa has a blog
date: 2026-09-04          # YYYY-MM-DD, required
description: One sentence used in listings, meta description and the feed.
draft: true               # optional; omit for published posts
---
```

Rules:

- `title`, `date`, `description` are required strings. `date` must match
  `YYYY-MM-DD`. Anything else fails the build with an error naming the file
  and the missing or malformed key.
- `draft: true` hides the post from the listing, homepage section, sitemap,
  feed and static params in production (`NODE_ENV === "production"`). In dev
  the post is visible so it can be previewed.
- Body is plain markdown. Headings inside a post start at `##` — the page
  supplies the single `<h1>`.
- External links are written as normal markdown links. They render as plain
  followed `<a href>` with no `rel="nofollow"` and no `target="_blank"`.
  Anchor text should describe the destination (SEO requirement).

## 4. Library — `src/lib/posts.ts`

```ts
export type Post = {
  slug: string;
  title: string;
  date: string;        // YYYY-MM-DD as written
  description: string;
  content: string;     // markdown body
};

export function getAllPosts(): Post[];   // sorted newest first, drafts filtered per §3
export function getPost(slug: string): Post | undefined;
export function formatDate(iso: string): string; // "4 September 2026", en-NZ, parsed as UTC
```

- Reads the directory synchronously with `node:fs` at build time. All
  callers are server components or route handlers.
- Validation throws `Error` with a message like
  `content/blog/foo.md: frontmatter "date" must be YYYY-MM-DD`.
- `formatDate` appends `T00:00:00Z` before parsing so the day never shifts
  with the build machine's timezone.

Tests: `src/lib/posts.test.ts` using Bun's built-in runner (`bun test`).
Covers: required-key validation error messages, date format validation,
draft filtering in production vs development, newest-first ordering, and
`formatDate`. Tests point the reader at a fixture directory under
`src/lib/__fixtures__/` rather than the real `content/blog`.

## 5. Shared layout components

The header and footer are currently inlined in `src/app/page.tsx`. Extract
them so `/` and `/blog*` share one implementation:

- `src/components/SiteHeader.tsx` — wordmark, nav links, Events button.
  Links become `/#day`, `/#questions`, `/blog`. The wordmark links to `/`.
- `src/components/SiteFooter.tsx` — brand block, links (Calendar, Blog,
  LinkedIn, Contact), meta line.
- `src/components/CalendarIcon.tsx` — moved out of page.tsx since header,
  homepage and post CTA all use it.

No visual change to the homepage beyond the added "Blog" links. The
`section#wellington` id and all other ids stay as they are.

## 6. Routes

### `/blog` — `src/app/blog/page.tsx`

- Metadata: title "Blog — HackAotearoa", description "Recaps, chapter news
  and occasional notes from HackAotearoa.", canonical `/blog`, OpenGraph
  type `website`.
- Body: `.label` heading "Blog", one-line intro, then a list of every
  published post. Each item is a single `<a>` containing the formatted date
  (small uppercase, `--muted`), the title (Archivo Black, same scale as
  `.faq-q`) and the description (`--muted`). Rows separated by
  `1px solid var(--border)` like `.schedule-row`.
- Empty state (no published posts): a single muted line "Nothing here yet."
  Not expected to be seen but cheap.

### `/blog/[slug]` — `src/app/blog/[slug]/page.tsx`

- `generateStaticParams` returns every published slug;
  `dynamicParams = false` so unknown slugs return the 404 page.
- `generateMetadata`: title `${post.title} — HackAotearoa`, description from
  frontmatter, canonical `/blog/${slug}`, OpenGraph type `article` with
  `publishedTime`, twitter card `summary_large_image`. The root
  `opengraph-image.tsx` is inherited.
- JSON-LD `BlogPosting` in a `<script type="application/ld+json">`:
  `headline`, `datePublished`, `description`, `url`, `author` and
  `publisher` both `{ "@type": "Organization", "name": "HackAotearoa" }`.
- Page structure, top to bottom, inside `.column`:
  1. Back link "← All posts" to `/blog`.
  2. `<time>` with the formatted date (small uppercase label style).
  3. `<h1>` title (Archivo Black, ~34px, matching `.closing-question`).
  4. Description as a lead paragraph (`--muted`, 18px).
  5. `<article class="post-body">` rendered by react-markdown.
  6. Closing row reusing `.closing-row` styling: "Coming to the next one?"
     and the existing RSVP button to `LUMA_URL`.
- `.post-body` CSS covers `h2`, `h3`, `p`, `ul`, `ol`, `li`, `a`,
  `blockquote`, `code`, `pre`, `hr`, `img` (max-width 100%, rounded 12px
  like `.calendar-well`), `strong`, `em`. Body text 17px / 1.7 like
  `.prose`; links use `.inline-link` colour and weight. Everything scoped
  under `.post-body` so nothing leaks into the homepage.

### `/blog/feed.xml` — `src/app/blog/feed.xml/route.ts`

- RSS 2.0, built with a template string, no dependency. Channel title
  "HackAotearoa Blog", link `${SITE_URL}/blog`, description as the blog
  page. One `<item>` per published post with `title`, `link`, `guid`
  (the URL), `pubDate` (RFC 822, from the ISO date at 00:00 UTC) and
  `description` (frontmatter description, XML-escaped). Content-Type
  `application/rss+xml; charset=utf-8`. The route is static.
- Every page's metadata includes `alternates.types["application/rss+xml"]`
  pointing at the feed so browsers and readers discover it. It lives per
  page, not in the root layout, because Next replaces a child's whole
  `alternates` object rather than merging it, and each page already needs
  its own canonical there.

### Homepage — `src/app/page.tsx`

- New `section#blog` between Questions and About. `.label` "Blog", then up
  to three latest posts as date + title links (same row styling as the
  listing but without descriptions), then an "All posts →" `.inline-link`
  to `/blog`. If there are no published posts the section is omitted.
- Header and footer swapped for the shared components (§5).

### Sitemap — `src/app/sitemap.ts`

Adds `/blog` (changeFrequency weekly, priority 0.6) and one entry per
published post with `lastModified` set from the post date (priority 0.5).

### Canonical fix — `src/app/layout.tsx`

The root layout currently sets `alternates.canonical: "/"`, which every
child route inherits. Move that to `page.tsx`'s own metadata so `/blog*`
pages can set their own canonicals without fighting the root.

## 7. First post

`content/blog/why-a-blog.md`, titled "Why HackAotearoa has a blog". Voice: same as the homepage — plain, short sentences, no hype.
Roughly 250–400 words covering:

- What this blog is for: recaps, chapter news, the odd longer note. Not a
  newsletter.
- The Wellington chapter and who runs it, with a followed link to
  https://whatfounderswant.com/hackaotearoa using descriptive anchor text
  (e.g. "the HackAotearoa page on What Founders Want") and a second link to
  https://whatfounderswant.com describing what WFW is.
- Where to find dates: the Luma calendar.

This satisfies the agreement's "website backlinks" obligation on its own,
independent of the homepage links that already exist.

## 8. SEO checklist (what "simple SEO" means here)

- Every page is statically rendered HTML at build time.
- One `<h1>` per page; post body headings start at `<h2>`.
- Per-page `<title>`, meta description, canonical, OpenGraph and Twitter
  tags. Post pages add `article:published_time` and `BlogPosting` JSON-LD.
- External links are followed and use descriptive anchor text.
- `/blog` and every post are in the sitemap; the feed is linked from the
  document head.
- Existing OG image is inherited so shares still get the branded card.

Out of scope: tags/categories, pagination, search, comments, reading time,
per-post OG images, MDX/JSX in posts, multiple authors.

## 9. Error handling

| Case | Behaviour |
|---|---|
| Missing/invalid frontmatter | Build fails; error names file and key. |
| Unknown slug | 404 via `dynamicParams = false`. |
| Empty content dir | `/blog` shows empty state; homepage section omitted; feed and sitemap contain no posts. Build still passes. |
| Draft post | Visible in dev, absent everywhere in production. |

## 10. Dependencies

- `gray-matter` — frontmatter parsing.
- `react-markdown` — markdown to React elements, used in a server component.

Installed with `bun add`. No changes to `next.config.ts`.

## 11. Verification

1. `bun test` passes (posts lib).
2. `bun run build` passes with zero warnings about the new routes.
3. In the browser preview: `/` shows the Blog section and nav links;
   `/blog` lists the post; `/blog/why-a-blog` renders the body, the WFW
   links are plain followed anchors, JSON-LD is present; `/blog/nope`
   returns 404; `/sitemap.xml` and `/blog/feed.xml` include the post.
4. Check at desktop and 375px widths; the header link hides below 560px as
   the others do, and the footer link plus homepage section cover discovery.

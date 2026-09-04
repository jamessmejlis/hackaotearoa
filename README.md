# hackaotearoa

Landing page and blog for HackAotearoa — a free fortnightly co-working day for builders. Auckland at GridAKL, Wellington run by What Founders Want.

Next.js (App Router) + plain CSS + Bun. See docs/SHIP-PLAN.md for the roadmap.

## Blog

Posts are markdown files in `content/blog/`. The filename is the URL slug, so `content/blog/my-post.md` is served at `/blog/my-post`.

```md
---
title: Post title
date: 2026-09-04
description: One sentence used in listings, meta tags and the RSS feed.
---

Body in markdown. Start headings at `##`.
```

- Add `draft: true` to hide a post in production. Drafts still show in `bun run dev`.
- Missing or malformed frontmatter fails the build with a message naming the file.
- Commit and push to publish. Vercel deploys from `main`.
- The listing is at `/blog`, the RSS feed at `/blog/feed.xml`, and the homepage shows the latest three posts.

## Commands

```bash
bun install      # dependencies
bun run dev      # http://localhost:3000
bun test         # posts loader tests
bun run build    # production build
```

Session date and time live in `src/lib/site.ts`. Update them there after each event.

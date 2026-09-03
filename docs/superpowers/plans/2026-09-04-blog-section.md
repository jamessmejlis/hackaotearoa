# Blog Section Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a markdown-file blog at `/blog` (listing, post pages, RSS feed, sitemap entries, homepage section, nav links) with one seed post that backlinks What Founders Want.

**Architecture:** Posts are `.md` files in `content/blog/` read with `node:fs` at build time by `src/lib/posts.ts`; every route is statically rendered. The homepage header and footer are extracted into shared components so `/` and `/blog*` share them. Markdown renders through react-markdown into a `.post-body` CSS scope; no MDX plugin, no next.config change.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, plain CSS in `src/app/globals.css`, Bun (`bun add`, `bun test`, `bun run build`), gray-matter, react-markdown.

**Spec:** `docs/superpowers/specs/2026-09-04-blog-design.md`

**Conventions for every task:**
- Package manager is Bun. Never run `npm` or `npx`.
- Styling is hand-written CSS in `src/app/globals.css` with CSS variables (`--ink`, `--paper`, `--surface`, `--accent`, `--accent-text`, `--muted`, `--border`). There is no Tailwind despite the README. Reuse existing class names where the spec says so.
- `@/` maps to `src/`.
- Commit messages: imperative subject line, then a blank line, then `Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>`.
- Read `node_modules/next/dist/docs/01-app/...` if any Next API is unfamiliar; this Next version differs from older training data.

---

## File map

| Path | Responsibility |
|---|---|
| `content/blog/why-a-blog.md` | First post (markdown + frontmatter). |
| `src/lib/posts.ts` | Read, validate, sort posts; `formatDate`. |
| `src/lib/posts.test.ts` | Bun tests for the above. |
| `src/lib/__fixtures__/posts/*.md` | Good fixtures (2 published, 1 draft). |
| `src/lib/__fixtures__/bad-missing/missing-date.md` | Fixture with no `date`. |
| `src/lib/__fixtures__/bad-format/bad-date.md` | Fixture with a non-ISO `date`. |
| `src/lib/site.ts` | Add `BLOG_DESCRIPTION`, `FEED_URL`. |
| `src/components/CalendarIcon.tsx` | Icon moved out of page.tsx. |
| `src/components/SiteHeader.tsx` | Shared header with Blog link. |
| `src/components/SiteFooter.tsx` | Shared footer with Blog link. |
| `src/app/layout.tsx` | Remove root canonical. |
| `src/app/page.tsx` | Use shared components, own canonical, Blog section. |
| `src/app/blog/page.tsx` | Listing. |
| `src/app/blog/[slug]/page.tsx` | Post page with metadata + JSON-LD. |
| `src/app/blog/feed.xml/route.ts` | RSS 2.0. |
| `src/app/sitemap.ts` | Add blog URLs. |
| `src/app/globals.css` | Blog listing, post, and `.post-body` styles. |

---

### Task 1: Install dependencies

**Files:**
- Modify: `package.json`, `bun.lock`

- [ ] **Step 1: Add runtime and dev dependencies**

Run:
```bash
bun add gray-matter@4.0.3 react-markdown@10.1.0 && bun add -d @types/bun
```
Expected: `package.json` gains `gray-matter` and `react-markdown` under `dependencies` and `@types/bun` under `devDependencies`. `bun.lock` updates.

- [ ] **Step 2: Confirm the build still passes**

Run: `bun run build`
Expected: exits 0, route table shows `/` only.

- [ ] **Step 3: Commit**

```bash
git add package.json bun.lock
git commit -m "Add gray-matter, react-markdown and Bun test types

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 2: Posts library (TDD)

**Files:**
- Create: `src/lib/posts.ts`
- Create: `src/lib/posts.test.ts`
- Create: `src/lib/__fixtures__/posts/alpha.md`, `src/lib/__fixtures__/posts/beta.md`, `src/lib/__fixtures__/posts/gamma-draft.md`
- Create: `src/lib/__fixtures__/bad-missing/missing-date.md`
- Create: `src/lib/__fixtures__/bad-format/bad-date.md`

- [ ] **Step 1: Create fixtures**

`src/lib/__fixtures__/posts/alpha.md`:
```md
---
title: Alpha post
date: 2026-08-01
description: The oldest post.
---

Alpha body.
```

`src/lib/__fixtures__/posts/beta.md`:
```md
---
title: Beta post
date: "2026-09-01"
description: A newer post with a quoted date.
---

Beta body.
```

`src/lib/__fixtures__/posts/gamma-draft.md`:
```md
---
title: Gamma draft
date: 2026-09-03
description: Not published yet.
draft: true
---

Gamma body.
```

`src/lib/__fixtures__/bad-missing/missing-date.md`:
```md
---
title: No date here
description: Missing the date key.
---

Body.
```

`src/lib/__fixtures__/bad-format/bad-date.md`:
```md
---
title: Bad date
date: 4 September 2026
description: Date is not YYYY-MM-DD.
---

Body.
```

Note: `alpha.md` uses an unquoted date on purpose. YAML parses that into a JavaScript `Date`; the loader must normalise it back to `YYYY-MM-DD`. `beta.md` uses a quoted string. Both must work.

- [ ] **Step 2: Write the failing tests**

`src/lib/posts.test.ts`:
```ts
import { describe, expect, test } from "bun:test";
import path from "node:path";
import { formatDate, getAllPosts, getPost } from "./posts";

const FIXTURES = path.join(import.meta.dir, "__fixtures__");
const GOOD = path.join(FIXTURES, "posts");

describe("getAllPosts", () => {
  test("returns published posts newest first, drafts excluded", () => {
    const posts = getAllPosts({ dir: GOOD, includeDrafts: false });
    expect(posts.map((p) => p.slug)).toEqual(["beta", "alpha"]);
  });

  test("includes drafts when asked", () => {
    const posts = getAllPosts({ dir: GOOD, includeDrafts: true });
    expect(posts.map((p) => p.slug)).toEqual(["gamma-draft", "beta", "alpha"]);
  });

  test("normalises unquoted YAML dates to YYYY-MM-DD", () => {
    const alpha = getAllPosts({ dir: GOOD, includeDrafts: false }).find(
      (p) => p.slug === "alpha",
    );
    expect(alpha?.date).toBe("2026-08-01");
  });

  test("exposes title, description and markdown body", () => {
    const beta = getAllPosts({ dir: GOOD, includeDrafts: false })[0];
    expect(beta.title).toBe("Beta post");
    expect(beta.description).toBe("A newer post with a quoted date.");
    expect(beta.content.trim()).toBe("Beta body.");
  });

  test("throws naming the file when a required key is missing", () => {
    expect(() =>
      getAllPosts({ dir: path.join(FIXTURES, "bad-missing"), includeDrafts: true }),
    ).toThrow(/missing-date\.md: frontmatter "date" is required/);
  });

  test("throws naming the file when the date is not YYYY-MM-DD", () => {
    expect(() =>
      getAllPosts({ dir: path.join(FIXTURES, "bad-format"), includeDrafts: true }),
    ).toThrow(/bad-date\.md: frontmatter "date" must be YYYY-MM-DD/);
  });

  test("returns an empty array for a directory that does not exist", () => {
    expect(getAllPosts({ dir: path.join(FIXTURES, "nope"), includeDrafts: true })).toEqual([]);
  });
});

describe("getPost", () => {
  test("finds a post by slug", () => {
    const post = getPost("alpha", { dir: GOOD, includeDrafts: false });
    expect(post?.title).toBe("Alpha post");
  });

  test("returns undefined for an unknown slug", () => {
    expect(getPost("nope", { dir: GOOD, includeDrafts: false })).toBeUndefined();
  });

  test("hides drafts unless includeDrafts is true", () => {
    expect(getPost("gamma-draft", { dir: GOOD, includeDrafts: false })).toBeUndefined();
    expect(getPost("gamma-draft", { dir: GOOD, includeDrafts: true })?.title).toBe("Gamma draft");
  });
});

describe("formatDate", () => {
  test("formats as day month year in en-NZ", () => {
    expect(formatDate("2026-09-04")).toBe("4 September 2026");
  });

  test("does not shift the day across timezones", () => {
    expect(formatDate("2026-01-01")).toBe("1 January 2026");
  });
});
```

- [ ] **Step 3: Run the tests to verify they fail**

Run: `bun test src/lib/posts.test.ts`
Expected: FAIL, error resolving `./posts` (module not found).

- [ ] **Step 4: Implement `src/lib/posts.ts`**

```ts
/**
 * Blog posts are markdown files in `content/blog/<slug>.md` with YAML
 * frontmatter. This module is the only place that reads them. Everything
 * here runs at build time in server components and route handlers.
 */

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export type Post = {
  slug: string;
  title: string;
  /** YYYY-MM-DD exactly as written in frontmatter. */
  date: string;
  description: string;
  /** Markdown body, frontmatter stripped. */
  content: string;
};

type Options = {
  /** Directory to read. Defaults to `content/blog` under the repo root. */
  dir?: string;
  /** Defaults to true outside production so drafts can be previewed in dev. */
  includeDrafts?: boolean;
};

export const POSTS_DIR = path.join(process.cwd(), "content", "blog");

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const REQUIRED = ["title", "date", "description"] as const;

function readPost(dir: string, file: string): Post & { draft: boolean } {
  const filePath = path.join(dir, file);
  const label = path.relative(process.cwd(), filePath);
  const { data, content } = matter(fs.readFileSync(filePath, "utf8"));

  // YAML turns an unquoted `date: 2026-09-04` into a Date at UTC midnight.
  // Bring it back to the string form so validation and display agree.
  if (data.date instanceof Date) {
    data.date = data.date.toISOString().slice(0, 10);
  }

  for (const key of REQUIRED) {
    const value = data[key];
    if (typeof value !== "string" || value.trim() === "") {
      throw new Error(
        `${label}: frontmatter "${key}" is required and must be a non-empty string`,
      );
    }
  }
  if (!DATE_RE.test(data.date)) {
    throw new Error(`${label}: frontmatter "date" must be YYYY-MM-DD`);
  }

  return {
    slug: file.replace(/\.md$/, ""),
    title: data.title.trim(),
    date: data.date,
    description: data.description.trim(),
    content,
    draft: data.draft === true,
  };
}

export function getAllPosts(options: Options = {}): Post[] {
  const dir = options.dir ?? POSTS_DIR;
  const includeDrafts =
    options.includeDrafts ?? process.env.NODE_ENV !== "production";

  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".md"))
    .map((file) => readPost(dir, file))
    .filter((post) => includeDrafts || !post.draft)
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))
    .map(({ draft: _draft, ...post }) => post);
}

export function getPost(slug: string, options: Options = {}): Post | undefined {
  return getAllPosts(options).find((post) => post.slug === slug);
}

/** "2026-09-04" -> "4 September 2026". Parsed as UTC so the day never shifts. */
export function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-NZ", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}
```

- [ ] **Step 5: Run the tests to verify they pass**

Run: `bun test src/lib/posts.test.ts`
Expected: `12 pass, 0 fail`.

- [ ] **Step 6: Confirm the type-check is clean**

Run: `bunx tsc --noEmit`
Expected: no output, exit 0. (If `bun:test` cannot be resolved, `@types/bun` from Task 1 is missing.)

- [ ] **Step 7: Commit**

```bash
git add src/lib/posts.ts src/lib/posts.test.ts src/lib/__fixtures__
git commit -m "Add posts library for markdown blog content

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 3: Site constants for the blog

**Files:**
- Modify: `src/lib/site.ts`

- [ ] **Step 1: Append blog constants**

Add at the end of `src/lib/site.ts`:
```ts

/** Blog listing page meta description and RSS channel description. */
export const BLOG_DESCRIPTION =
  "Recaps, chapter news and occasional notes from HackAotearoa.";

/** Absolute feed URL — used in <head> alternates and the feed's self link. */
export const FEED_URL = `${SITE_URL}/blog/feed.xml`;
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/site.ts
git commit -m "Add blog description and feed URL constants

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 4: Extract shared header, footer and icon

**Files:**
- Create: `src/components/CalendarIcon.tsx`
- Create: `src/components/SiteHeader.tsx`
- Create: `src/components/SiteFooter.tsx`
- Modify: `src/app/page.tsx`
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Create `src/components/CalendarIcon.tsx`**

```tsx
export function CalendarIcon() {
  return (
    <svg
      className="btn-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M3 10h18" />
    </svg>
  );
}
```

- [ ] **Step 2: Create `src/components/SiteHeader.tsx`**

Anchor links are written as `/#day` so they work from `/blog` as well as `/`.
```tsx
import Link from "next/link";
import { LUMA_URL } from "@/lib/site";
import { CalendarIcon } from "./CalendarIcon";

export function SiteHeader() {
  return (
    <header className="header">
      <div className="column header-inner">
        <Link href="/" className="wordmark header-wordmark">
          <span>
            HackAotearoa
            <span className="star" aria-hidden="true">
              *
            </span>
          </span>
        </Link>
        <nav className="header-nav">
          <a href="/#day" className="header-link">
            The day
          </a>
          <a href="/#questions" className="header-link">
            Questions
          </a>
          <Link href="/blog" className="header-link">
            Blog
          </Link>
          <a href={LUMA_URL} className="header-rsvp">
            <CalendarIcon />
            Events
          </a>
        </nav>
      </div>
    </header>
  );
}
```

- [ ] **Step 3: Create `src/components/SiteFooter.tsx`**

```tsx
import Link from "next/link";
import { CONTACT_EMAIL, LINKEDIN_URL, LUMA_URL } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="footer">
      <div className="column footer-inner">
        <div className="footer-top">
          <div className="footer-brand">
            <div className="wordmark footer-wordmark">
              HackAotearoa
              <span className="star" aria-hidden="true">
                *
              </span>
            </div>
            <p className="footer-tagline">
              The co-working community for NZ startup builders.
            </p>
          </div>
          <nav className="footer-links">
            <a href={LUMA_URL} className="footer-link">
              Calendar
            </a>
            <Link href="/blog" className="footer-link">
              Blog
            </Link>
            <a href={LINKEDIN_URL} className="footer-link">
              LinkedIn
            </a>
            <a href={`mailto:${CONTACT_EMAIL}`} className="footer-link">
              Contact
            </a>
          </nav>
        </div>
        <div className="footer-bottom">
          <span className="footer-meta">
            Est. March 2026 · Auckland + Wellington
          </span>
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 4: Update `src/app/page.tsx` to use them**

Replace the import statement at the top of the file (`import { CONTACT_EMAIL, ... } from "@/lib/site";`) with the following. `LINKEDIN_URL` is gone because only the footer used it; `CONTACT_EMAIL` stays because the About section still uses it.
```tsx
import type { Metadata } from "next";
import { CalendarIcon } from "@/components/CalendarIcon";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import {
  CONTACT_EMAIL,
  LUMA_EMBED_URL,
  LUMA_URL,
  SESSION_DATE,
  SESSION_TIME,
  WFW_URL,
} from "@/lib/site";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};
```

Delete the whole `function CalendarIcon() { ... }` definition from page.tsx.

Replace the entire `<header className="header"> ... </header>` block (everything from `<header` to `</header>`) with:
```tsx
      <SiteHeader />
```

Replace the entire `<footer className="footer"> ... </footer>` block with:
```tsx
      <SiteFooter />
```

- [ ] **Step 5: Remove the root canonical from `src/app/layout.tsx`**

In the `metadata` object, delete the line:
```ts
  alternates: { canonical: "/" },
```
Every page now sets its own canonical (the homepage did so in Step 4).

- [ ] **Step 6: Build and check**

Run: `bun run build`
Expected: exit 0. Then run `bunx tsc --noEmit` and expect no errors (an unused-import error means Step 4's import list is wrong).

- [ ] **Step 7: Commit**

```bash
git add src/components src/app/page.tsx src/app/layout.tsx
git commit -m "Extract shared header and footer, add Blog links

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 5: First post

**Files:**
- Create: `content/blog/why-a-blog.md`

- [ ] **Step 1: Write the post**

Voice matches the homepage: short sentences, no hype, no exclamation marks. The two What Founders Want links are the point of the post; keep them as plain markdown links with descriptive anchor text and no tracking parameters.

```md
---
title: Why HackAotearoa has a blog
date: 2026-09-04
description: Recaps, chapter news and the occasional longer note. Not a newsletter.
---

HackAotearoa is a free co-working day for people building their own thing. Every second Friday, founders, indie hackers, designers and makers take a full day to ship, next to other people doing the same. It started in Auckland in March 2026. Wellington is chapter two.

Most of what happens on those Fridays gets written up somewhere: a recap on LinkedIn, a note in the group chat, a line in someone else's newsletter. Those posts scatter. This is the place they will live.

## What goes here

- **Recaps.** What people were building, what shipped, what got someone unstuck.
- **Chapter news.** New cities, new venues, changes to the format.
- **The odd longer note.** What we are learning about running a community of solo builders in New Zealand.

## What doesn't

This is not a newsletter. There is no cadence, no signup, no issue number. When something is worth writing down, it will be here. If you want dates in your inbox, the [HackAotearoa calendar on Luma](https://luma.com/hackaotearoa) already does that.

## Wellington

Chapter two is run by [What Founders Want](https://whatfounderswant.com), a free, neutral guidance service for New Zealand founders, and HackAotearoa's distribution partner. Wellington dates, co-host signups and the vote for city number three all live on the [HackAotearoa page on What Founders Want](https://whatfounderswant.com/hackaotearoa).

Same format, same price. Free.

## Coming to one?

Auckland runs every second Friday at GridAKL in Wynyard Quarter. [RSVP on Luma](https://luma.com/hackaotearoa), bring whatever you are building, and say hello.
```

- [ ] **Step 2: Confirm the loader accepts it**

Run: `bun -e 'import { getAllPosts } from "./src/lib/posts"; console.log(getAllPosts().map(p => [p.slug, p.date, p.title]))'`
Expected: `[ [ "why-a-blog", "2026-09-04", "Why HackAotearoa has a blog" ] ]`

- [ ] **Step 3: Commit**

```bash
git add content/blog/why-a-blog.md
git commit -m "Add first blog post

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 6: Blog listing page and shared blog CSS

**Files:**
- Create: `src/app/blog/page.tsx`
- Modify: `src/app/globals.css` (insert before the `/* Focus ---` block)

- [ ] **Step 1: Add listing styles to `src/app/globals.css`**

Insert this block immediately before the line `/* Focus ---------------------------------------------------------------- */`:
```css
/* Blog listing (used on /blog and the homepage section) ---------------- */

.blog-intro {
  margin: 0;
  font-size: 17px;
  line-height: 1.7;
  color: var(--muted);
}

.post-list {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
}

.post-list-item {
  border-bottom: 1px solid var(--border);
}

.post-list-item:last-child {
  border-bottom: 0;
}

.post-link {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 18px 0;
  text-decoration: none;
}

.post-link:hover .post-title {
  text-decoration: underline;
  text-underline-offset: 3px;
}

.post-date {
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--muted);
}

.post-title {
  font-family: var(--font-archivo-black), sans-serif;
  font-weight: 400;
  font-size: 19px;
  line-height: 1.3;
  letter-spacing: -0.02em;
}

.post-summary {
  font-size: 16.5px;
  line-height: 1.65;
  color: var(--muted);
}

.all-posts {
  align-self: flex-start;
  text-decoration: none;
}

.all-posts:hover {
  text-decoration: underline;
  text-underline-offset: 3px;
}
```

- [ ] **Step 2: Create `src/app/blog/page.tsx`**

The root layout's `openGraph` and `twitter` objects are inherited whole unless a page replaces them, so this page defines complete replacements rather than partial overrides.
```tsx
import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { formatDate, getAllPosts } from "@/lib/posts";
import { BLOG_DESCRIPTION, FEED_URL, SITE_NAME } from "@/lib/site";

const TITLE = `Blog — ${SITE_NAME}`;

export const metadata: Metadata = {
  title: TITLE,
  description: BLOG_DESCRIPTION,
  alternates: {
    canonical: "/blog",
    types: { "application/rss+xml": FEED_URL },
  },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "en_NZ",
    url: "/blog",
    title: TITLE,
    description: BLOG_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: BLOG_DESCRIPTION,
  },
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <>
      <SiteHeader />
      <main className="column main">
        <section className="section">
          <h1 className="label">Blog</h1>
          <p className="blog-intro">{BLOG_DESCRIPTION}</p>
          {posts.length === 0 ? (
            <p className="blog-intro">Nothing here yet.</p>
          ) : (
            <ul className="post-list">
              {posts.map((post) => (
                <li key={post.slug} className="post-list-item">
                  <Link href={`/blog/${post.slug}`} className="post-link">
                    <time dateTime={post.date} className="post-date">
                      {formatDate(post.date)}
                    </time>
                    <span className="post-title">{post.title}</span>
                    <span className="post-summary">{post.description}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
```

- [ ] **Step 3: Build**

Run: `bun run build`
Expected: exit 0; route table now lists `/blog` as static (○).

- [ ] **Step 4: Commit**

```bash
git add src/app/blog/page.tsx src/app/globals.css
git commit -m "Add /blog listing page

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 7: Post page with metadata and JSON-LD

**Files:**
- Create: `src/app/blog/[slug]/page.tsx`
- Modify: `src/app/globals.css` (insert after the block added in Task 6, still before `/* Focus`), and add two rules inside the existing `@media (max-width: 700px)` block

- [ ] **Step 1: Add post styles to `src/app/globals.css`**

Insert immediately after the `.all-posts:hover { ... }` rule from Task 6:
```css
/* Blog post ------------------------------------------------------------ */

.post {
  display: flex;
  flex-direction: column;
  gap: 36px;
}

.post-header {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.back-link {
  align-self: flex-start;
  font-size: 14px;
  font-weight: 600;
  color: var(--accent-text);
  text-decoration: none;
}

.back-link:hover {
  text-decoration: underline;
  text-underline-offset: 3px;
}

.post-h1 {
  margin: 0;
  font-family: var(--font-archivo-black), sans-serif;
  font-weight: 400;
  font-size: 34px;
  line-height: 1.1;
  letter-spacing: -0.028em;
}

.post-lead {
  margin: 0;
  font-size: 18px;
  line-height: 1.6;
  color: var(--muted);
}

/* Everything react-markdown emits is scoped here so nothing leaks out. */
.post-body {
  font-size: 17px;
  line-height: 1.7;
}

.post-body > :first-child {
  margin-top: 0;
}

.post-body > :last-child {
  margin-bottom: 0;
}

.post-body p {
  margin: 0 0 1.2em;
}

.post-body h2 {
  margin: 2em 0 0.6em;
  font-family: var(--font-archivo-black), sans-serif;
  font-weight: 400;
  font-size: 24px;
  line-height: 1.2;
  letter-spacing: -0.02em;
}

.post-body h3 {
  margin: 1.6em 0 0.5em;
  font-size: 19px;
  font-weight: 700;
  line-height: 1.3;
}

.post-body ul,
.post-body ol {
  margin: 0 0 1.2em;
  padding-left: 1.4em;
}

.post-body li {
  margin-bottom: 0.4em;
}

.post-body a {
  color: var(--accent-text);
  font-weight: 600;
}

.post-body strong {
  font-weight: 700;
}

.post-body blockquote {
  margin: 0 0 1.2em;
  padding: 4px 0 4px 20px;
  border-left: 3px solid var(--accent);
  color: var(--muted);
  font-style: italic;
}

.post-body code {
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 0.9em;
  background: var(--surface);
  padding: 0.15em 0.4em;
  border-radius: 4px;
}

.post-body pre {
  margin: 0 0 1.2em;
  padding: 18px 20px;
  background: var(--ink);
  color: var(--paper);
  border-radius: 12px;
  overflow-x: auto;
}

.post-body pre code {
  background: none;
  padding: 0;
  color: inherit;
  font-size: 14px;
}

.post-body hr {
  border: 0;
  border-top: 1.5px solid var(--border);
  margin: 2em 0;
}

.post-body img {
  display: block;
  max-width: 100%;
  height: auto;
  border-radius: 12px;
}
```

Then inside the existing `@media (max-width: 700px) { ... }` block, add after the `.closing-question { font-size: 26px; }` rule:
```css
  .post-h1 {
    font-size: 28px;
  }

  .post-body h2 {
    font-size: 21px;
  }
```

- [ ] **Step 2: Create `src/app/blog/[slug]/page.tsx`**

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Markdown from "react-markdown";
import { CalendarIcon } from "@/components/CalendarIcon";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { formatDate, getAllPosts, getPost } from "@/lib/posts";
import { FEED_URL, LUMA_URL, SITE_NAME, SITE_URL } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

// Anything not returned by generateStaticParams is a 404.
export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};

  const title = `${post.title} — ${SITE_NAME}`;
  const url = `/blog/${slug}`;

  return {
    title,
    description: post.description,
    alternates: {
      canonical: url,
      types: { "application/rss+xml": FEED_URL },
    },
    openGraph: {
      type: "article",
      siteName: SITE_NAME,
      locale: "en_NZ",
      url,
      title,
      description: post.description,
      publishedTime: `${post.date}T00:00:00.000Z`,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: post.description,
    },
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const url = `${SITE_URL}/blog/${slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    url,
    mainEntityOfPage: url,
    author: { "@type": "Organization", name: SITE_NAME },
    publisher: { "@type": "Organization", name: SITE_NAME },
  };

  return (
    <>
      <SiteHeader />
      <main className="column main">
        <article className="post">
          <script
            type="application/ld+json"
            // Per Next docs: escape "<" so a title can't break out of the tag.
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
            }}
          />
          <div className="post-header">
            <Link href="/blog" className="back-link">
              ← All posts
            </Link>
            <time dateTime={post.date} className="post-date">
              {formatDate(post.date)}
            </time>
            <h1 className="post-h1">{post.title}</h1>
            <p className="post-lead">{post.description}</p>
          </div>
          <div className="post-body">
            <Markdown>{post.content}</Markdown>
          </div>
          <div className="closing-row">
            <p className="closing-question">Coming to the next one?</p>
            <a href={LUMA_URL} className="btn btn-ink">
              <CalendarIcon />
              RSVP to the next event
            </a>
          </div>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
```

- [ ] **Step 3: Build**

Run: `bun run build`
Expected: exit 0; route table lists `/blog/[slug]` with `/blog/why-a-blog` prerendered (●).

- [ ] **Step 4: Commit**

```bash
git add "src/app/blog/[slug]/page.tsx" src/app/globals.css
git commit -m "Add blog post page with article metadata and JSON-LD

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 8: Homepage Blog section

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Import the posts helpers**

Add to the imports at the top of `src/app/page.tsx`:
```tsx
import Link from "next/link";
import { formatDate, getAllPosts } from "@/lib/posts";
```

- [ ] **Step 2: Read the latest three posts**

Change the component signature and first line to:
```tsx
export default function Home() {
  const latestPosts = getAllPosts().slice(0, 3);

  return (
```

- [ ] **Step 3: Insert the section**

Between the closing `</section>` of `<section id="questions" ...>` and the opening `<section className="section about-section">`, insert:
```tsx
        {latestPosts.length > 0 && (
          <section id="blog" className="section">
            <h2 className="label">Blog</h2>
            <ul className="post-list">
              {latestPosts.map((post) => (
                <li key={post.slug} className="post-list-item">
                  <Link href={`/blog/${post.slug}`} className="post-link">
                    <time dateTime={post.date} className="post-date">
                      {formatDate(post.date)}
                    </time>
                    <span className="post-title">{post.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
            <Link href="/blog" className="inline-link all-posts">
              All posts →
            </Link>
          </section>
        )}
```

- [ ] **Step 4: Build**

Run: `bun run build`
Expected: exit 0.

- [ ] **Step 5: Commit**

```bash
git add src/app/page.tsx
git commit -m "Show latest posts on the homepage

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 9: Sitemap and RSS feed

**Files:**
- Modify: `src/app/sitemap.ts`
- Create: `src/app/blog/feed.xml/route.ts`

- [ ] **Step 1: Replace `src/app/sitemap.ts`**

```ts
import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/posts";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();

  return [
    {
      url: SITE_URL,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/blog`,
      changeFrequency: "weekly",
      priority: 0.6,
    },
    ...posts.map((post) => ({
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: new Date(`${post.date}T00:00:00Z`),
      priority: 0.5,
    })),
  ];
}
```

- [ ] **Step 2: Create `src/app/blog/feed.xml/route.ts`**

```ts
import { getAllPosts } from "@/lib/posts";
import { BLOG_DESCRIPTION, FEED_URL, SITE_NAME, SITE_URL } from "@/lib/site";

// No request data is read, so this is rendered once at build time.
export const dynamic = "force-static";

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function GET() {
  const items = getAllPosts()
    .map((post) => {
      const url = `${SITE_URL}/blog/${post.slug}`;
      const pubDate = new Date(`${post.date}T00:00:00Z`).toUTCString();
      return [
        "    <item>",
        `      <title>${escapeXml(post.title)}</title>`,
        `      <link>${url}</link>`,
        `      <guid>${url}</guid>`,
        `      <pubDate>${pubDate}</pubDate>`,
        `      <description>${escapeXml(post.description)}</description>`,
        "    </item>",
      ].join("\n");
    })
    .join("\n");

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    "  <channel>",
    `    <title>${escapeXml(SITE_NAME)} Blog</title>`,
    `    <link>${SITE_URL}/blog</link>`,
    `    <atom:link href="${FEED_URL}" rel="self" type="application/rss+xml" />`,
    `    <description>${escapeXml(BLOG_DESCRIPTION)}</description>`,
    "    <language>en-nz</language>",
    items,
    "  </channel>",
    "</rss>",
    "",
  ].join("\n");

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
```

- [ ] **Step 3: Build**

Run: `bun run build`
Expected: exit 0; `/blog/feed.xml` and `/sitemap.xml` appear as static routes. Content is checked in the browser in Task 10.

- [ ] **Step 4: Commit**

```bash
git add src/app/sitemap.ts src/app/blog/feed.xml/route.ts
git commit -m "Add blog entries to the sitemap and an RSS feed

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 10: Browser verification

**Files:** none (verification only)

Use the Browser pane tools: `preview_start` with `name: "hackaotearoa"` (the config in `.claude/launch.json`, which runs `bun run dev` on port 3000).

- [ ] **Step 1: Start the dev server and open `/`**

Check: header shows "The day · Questions · Blog · Events"; a "Blog" section sits between Questions and About with "4 September 2026 / Why HackAotearoa has a blog" and an "All posts →" link; footer links read Calendar, Blog, LinkedIn, Contact. Read the console for errors (expect none).

- [ ] **Step 2: Open `/blog`**

Check: label "Blog", intro line, one row with date, title, description. Click it.

- [ ] **Step 3: On `/blog/why-a-blog`**

Check with `read_page`: one `<h1>`; body headings are `<h2>`; the three links to whatfounderswant.com and luma.com are plain `<a href>` with no `rel` attribute (run `javascript_tool`: `[...document.querySelectorAll('.post-body a')].map(a => [a.href, a.rel, a.target])` and expect empty `rel` and `target` on every entry). Confirm `document.querySelector('script[type="application/ld+json"]').textContent` parses as JSON with `"@type":"BlogPosting"`. Confirm `document.querySelector('link[rel=canonical]').href` ends with `/blog/why-a-blog` and `document.querySelector('link[type="application/rss+xml"]')` exists.

- [ ] **Step 4: Open `/blog/does-not-exist`**

Expected: Next's 404 page.

- [ ] **Step 5: Open `/sitemap.xml` and `/blog/feed.xml`**

Expected: sitemap contains `/blog` and `/blog/why-a-blog`; feed is valid XML with one `<item>` and `Content-Type: application/rss+xml`.

- [ ] **Step 6: Mobile**

`resize_window` to the mobile preset, reload `/` and `/blog/why-a-blog`. Expected: header text links (including Blog) hidden below 560px as before, the Events button remains; post title at 28px; no horizontal scroll (`document.documentElement.scrollWidth <= window.innerWidth`). Reset with the desktop preset.

- [ ] **Step 7: Screenshot `/blog/why-a-blog` at desktop and share it**

- [ ] **Step 8: Final checks and push decision**

Run: `bun test && bun run build`
Expected: all tests pass, build exits 0. Do not push; report to James with the screenshot and the list of commits.

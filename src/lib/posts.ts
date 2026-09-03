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

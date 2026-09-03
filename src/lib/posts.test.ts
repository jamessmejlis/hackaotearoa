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

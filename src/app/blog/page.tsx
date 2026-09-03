import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { formatDate, getAllPosts } from "@/lib/posts";
import { BLOG_DESCRIPTION, FEED_URL, OG_IMAGE, SITE_NAME } from "@/lib/site";

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
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: BLOG_DESCRIPTION,
    images: [OG_IMAGE],
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

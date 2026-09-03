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

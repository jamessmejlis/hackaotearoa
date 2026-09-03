import type { Metadata } from "next";
import Link from "next/link";
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
import { formatDate, getAllPosts } from "@/lib/posts";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const SCHEDULE = [
  { time: "9:00", lead: "Doors open.", rest: " Coffee, grab a desk, settle in." },
  {
    time: "9:30",
    lead: "Intros.",
    rest: " Who you are, what you're building, what you want to get done today.",
  },
  {
    time: "All day",
    lead: "Build.",
    rest: " Heads down on your own thing, alongside everyone doing the same — ask for help when you're stuck.",
  },
  { time: "12:00", lead: "Lunch.", rest: " Together, if you want." },
  {
    time: "4:00",
    lead: "Demos.",
    rest: " Five minutes each, optional. Progress, not polish.",
  },
  {
    time: "5:00",
    lead: "Wrap up.",
    rest: " Or keep working if you're in the zone.",
  },
];

const QUESTIONS = [
  {
    q: "Is this a hackathon?",
    a: "No. No shared challenge, no teams, no prize, nothing to prepare. Bring whatever you're already building, or just an idea and a laptop.",
  },
  {
    q: "Is this an incubator or accelerator?",
    a: "Also no. No equity, no program, no application, no demo day. An incubator takes a slice of your company. This takes a Friday.",
  },
  {
    q: "Do I need a startup?",
    a: "No. Founders, indie hackers, freelancers, side-project builders. If you're building your own thing, you're in.",
  },
  {
    q: "I'm not a developer. Is this for me?",
    a: 'Yes. Designers, marketers, product people and writers are regulars. "Building" means making anything real: a landing page, a pitch, a first customer conversation.',
  },
  {
    q: "What's the catch?",
    a: "There isn't one. It's free, the venue is sponsored, and nobody is selling you anything.",
  },
];

const POINTS = [
  {
    lead: "Momentum.",
    rest: " A full day carved out to ship, next to people doing the same.",
  },
  {
    lead: "Getting unstuck.",
    rest: " Someone in the room has hit your problem before: pricing, landing pages, that 2pm bug.",
  },
  {
    lead: "People who get it.",
    rest: " Building your own thing is lonely. This is the fix.",
  },
];

export default function Home() {
  const latestPosts = getAllPosts().slice(0, 3);

  return (
    <>
      <SiteHeader />

      <section id="top" className="hero">
        <div className="column hero-inner">
          <div className="hero-titles">
            <h1 className="hero-h1">
              HackAotearoa
              <span className="star" aria-hidden="true">
                *
              </span>
            </h1>
            <p className="hero-descriptor">
              The co-working community for NZ startup builders.
            </p>
            <span className="hero-est">Est. March 2026</span>
            <p className="hero-tagline">Building solo, together.</p>
          </div>

          <p className="hero-detail">
            Free, every second Friday. Auckland + Wellington.
            <br />
            {/* No period here — SESSION_TIME ("9:30 a.m.") ends the sentence. */}
            Next Auckland session: <strong>{SESSION_DATE}</strong>,{" "}
            {SESSION_TIME}
            <br />
            Wellington:{" "}
            <a href={WFW_URL} className="hero-link">
              first session announcing soon →
            </a>
          </p>

          <div className="hero-actions">
            <a href={LUMA_URL} className="btn btn-accent">
              <CalendarIcon />
              RSVP to the next event
            </a>
          </div>
        </div>
      </section>

      <main className="column main">
        <section id="what" className="section">
          <h2 className="label">What it is</h2>
          <p className="prose">
            HackAotearoa is a free co-working day for startup founders, indie
            hackers, designers and makers building their own thing. Every second
            Friday: one full day, working alongside other people doing the
            same. No program, no curriculum, no pitching.
          </p>
          <p className="prose">
            On any given Friday there's someone launching a website, someone
            wiring up an AI agent, someone chasing first customers, someone
            rewriting a pitch. Different projects, same fight.
          </p>

          <ul className="points">
            {POINTS.map((point) => (
              <li key={point.lead} className="point">
                <span className="point-star" aria-hidden="true">
                  *
                </span>
                <span className="point-text">
                  <strong>{point.lead}</strong>
                  {point.rest}
                </span>
              </li>
            ))}
          </ul>

          <p className="proof">
            Over 100 builders through the door since March.
          </p>
        </section>

        <section id="day" className="section day-section">
          <h2 className="label">The day</h2>
          <p className="prose">
            No agenda to sit through. You show up, say what you're building,
            and build it. That's the whole shape of the day.
          </p>
          <dl className="schedule">
            {SCHEDULE.map((row) => (
              <div key={row.time} className="schedule-row">
                <dt className="schedule-time">{row.time}</dt>
                <dd className="schedule-what">
                  <strong>{row.lead}</strong>
                  {row.rest}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        {/* id is "wellington", not "where" — Lane's blog and the WFW page
            link to hackaotearoa.nz/#wellington. Don't rename it. */}
        <section id="wellington" className="section">
          <h2 className="label">Where</h2>
          <dl className="where">
            <div className="where-item">
              <dt className="where-city">Auckland</dt>
              <dd className="where-detail">
                GridAKL, Wynyard Quarter. Every second Friday.{" "}
                <a href={LUMA_URL} className="inline-link">
                  RSVP to the next event →
                </a>
              </dd>
            </div>
            <div className="where-item">
              <dt className="where-city">Wellington</dt>
              <dd className="where-detail">
                Run by{" "}
                <a href={WFW_URL} className="inline-link">
                  What Founders Want
                </a>
                , our national distribution partner. Same format, same price:
                free. First session announcing soon.{" "}
                <a href={LUMA_URL} className="inline-link">
                  Sign up to get notified →
                </a>
              </dd>
            </div>
            <div className="where-item">
              <dt className="where-city">Your city</dt>
              <dd className="where-detail">
                Auckland works. Wellington is starting.{" "}
                <a href={WFW_URL} className="inline-link">
                  You tell us the third city →
                </a>
              </dd>
            </div>
          </dl>
        </section>

        <section id="questions" className="section">
          <h2 className="label">Questions</h2>
          <dl className="faq">
            {QUESTIONS.map((item) => (
              <div key={item.q} className="faq-item">
                <dt className="faq-q">{item.q}</dt>
                <dd className="faq-a">{item.a}</dd>
              </div>
            ))}
          </dl>
        </section>

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

        <section className="section about-section">
          <h2 className="label">About</h2>
          <p className="about-p">
            HackAotearoa started in Auckland in March 2026. Wellington is
            chapter two, run by{" "}
            <a href={WFW_URL} className="inline-link">
              What Founders Want
            </a>
            .
          </p>
          <p className="about-p about-p-muted">
            Want it in your city?{" "}
            <a href={WFW_URL} className="inline-link">
              Vote for city number three
            </a>
            , put your hand up to run or co-host, or offer a venue — or email{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="inline-link">
              {CONTACT_EMAIL}
            </a>
            .
          </p>
        </section>

        <section className="section closing">
          <div className="closing-row">
            <p className="closing-question">Coming to the next one?</p>
            <a href={LUMA_URL} className="btn btn-ink">
              <CalendarIcon />
              RSVP to the next event
            </a>
          </div>
          <div className="calendar-well">
            <iframe
              src={LUMA_EMBED_URL}
              title="HackAotearoa events calendar"
              loading="lazy"
              allowFullScreen
            />
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}

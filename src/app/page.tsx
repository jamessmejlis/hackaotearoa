import {
  CONTACT_EMAIL,
  LINKEDIN_URL,
  LUMA_EMBED_URL,
  LUMA_URL,
  SESSION_DATE,
  SESSION_TIME,
} from "@/lib/site";

const SCHEDULE = [
  { time: "9:00", what: "doors open, coffee, grab a desk" },
  {
    time: "9:30",
    what: "intros: who you are, what you're building, what you want to get done today",
  },
  { time: "3:00", what: "demos: 5 minutes each, progress not polish" },
  { time: "3:30", what: "wrap up, or keep working if you're in the zone" },
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
  return (
    <>
      <header className="header">
        <div className="column header-inner">
          <a href="#top" className="wordmark header-wordmark">
            <span>
              HackAotearoa
              <span className="star" aria-hidden="true">
                *
              </span>
            </span>
          </a>
          <nav className="header-nav">
            <a href="#day" className="header-link">
              The day
            </a>
            <a href="#questions" className="header-link">
              Questions
            </a>
            <a href={LUMA_URL} className="header-rsvp">
              RSVP
            </a>
          </nav>
        </div>
      </header>

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
            Free, every second Friday at GridAKL, Wynyard Quarter, Auckland.
            <br />
            Next session: <strong>{SESSION_DATE}</strong>, {SESSION_TIME}.
          </p>

          <div className="hero-actions">
            <a href={LUMA_URL} className="btn btn-accent">
              RSVP on Luma →
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
            Friday in Auckland: one full day, working alongside other people
            doing the same. No program, no curriculum, no pitching.
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

          <p className="proof">80+ builders through the door since March.</p>
        </section>

        <section id="day" className="section day-section">
          <h2 className="label">The day</h2>
          <dl className="schedule">
            {SCHEDULE.map((row) => (
              <div key={row.time} className="schedule-row">
                <dt className="schedule-time">{row.time}</dt>
                <dd className="schedule-what">{row.what}</dd>
              </div>
            ))}
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

        <section className="section about-section">
          <h2 className="label">About</h2>
          <p className="about-p">
            HackAotearoa was started in Auckland in March 2026, with more cities
            coming soon.
          </p>
          <p className="about-p about-p-muted">
            If you want to run one where you are, email:{" "}
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
              RSVP on Luma →
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
              <a href={LINKEDIN_URL} className="footer-link">
                LinkedIn
              </a>
              <a href={`mailto:${CONTACT_EMAIL}`} className="footer-link">
                Contact
              </a>
            </nav>
          </div>
          <div className="footer-bottom">
            <span className="footer-meta">Est. March 2026 · Auckland</span>
          </div>
        </div>
      </footer>
    </>
  );
}

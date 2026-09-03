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

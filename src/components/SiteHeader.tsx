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

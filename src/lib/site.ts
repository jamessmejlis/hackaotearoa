/**
 * Single source of truth for the values that change between sessions.
 *
 * `SESSION_DATE` and `SESSION_TIME` are the two live values on the page —
 * update them here after each event, nowhere else.
 */

export const SESSION_DATE = "Friday, 21st of August";
export const SESSION_TIME = "9:30 a.m.";

/** Public Luma calendar — every RSVP button points here. */
export const LUMA_URL = "https://luma.com/hackaotearoa";

/**
 * Same national calendar, filtered to Wellington-tagged events.
 * Not linked anywhere yet — the Where section says "coming soon" until the
 * first Wellington session is announced. Re-link it there when that happens.
 */
export const LUMA_WELLINGTON_URL = "https://luma.com/hackaotearoa?tag=wellington";

/**
 * WFW partnership page — the primary listing for Wellington details, the
 * city-three vote, and co-host signups (agreement section 3: Wellington
 * details live there, not here).
 */
export const WFW_URL = "https://whatfounderswant.com/hackaotearoa";

/**
 * Embed source for the calendar iframe in the closing section.
 *
 * `lt=dark` is Luma's dark theme. The Auckland tag filter is NOT applied yet —
 * that parameter is Luma's to name and has to be copied out of their embed
 * dialog. Harmless while Auckland is the only chapter; add it before
 * Wellington events land on the same calendar.
 */
export const LUMA_EMBED_URL =
  "https://luma.com/embed/calendar/cal-yoCWwRWRLq8Cqnu/events?lt=dark";

export const CONTACT_EMAIL = "james@hackaotearoa.nz";
export const LINKEDIN_URL = "https://www.linkedin.com/company/hackaotearoa/";

/** Canonical origin. Vercel sets NEXT_PUBLIC_SITE_URL for preview + production. */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.hackaotearoa.nz";

export const SITE_NAME = "HackAotearoa";
export const SITE_DESCRIPTION =
  "A free co-working day for startup founders, indie hackers, designers and makers. Every second Friday in Auckland and Wellington.";

/**
 * Single source of truth for the values that change between sessions.
 *
 * `SESSION_DATE` and `SESSION_TIME` are the two live values on the page —
 * update them here after each event, nowhere else.
 */

export const SESSION_DATE = "Friday 7 August";
export const SESSION_TIME = "9:30 to 3:30";

/** Public Luma calendar — every RSVP button points here. */
export const LUMA_URL = "https://luma.com/hackaotearoa";

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
  "A free co-working day for startup founders, indie hackers, designers and makers building their own thing. Every second Friday at GridAKL, Auckland.";

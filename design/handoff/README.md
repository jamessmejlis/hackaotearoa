# Handoff: HackAotearoa homepage

Single-page marketing site for **HackAotearoa** — a free fortnightly co-working day for
startup builders in Auckland, NZ. The visitor should understand what it is, self-select,
and RSVP. Target: readable in ~30 seconds of scrolling. Tone/length references:
hackamai.com, hackagu.org, hackaboa.com.

Copy is final and signed off. **Do not rewrite it.**

## What's in this folder

- `README.md` — this spec.
- `Landing Page.dc.html` — the design reference.
- `copy.md` — every word on the page, as plain text.

## About the design file

`Landing Page.dc.html` is a **design reference built in HTML**, not production code. It
runs on a proprietary component runtime (`support.js`) using `{{ }}` template holes; that
runtime is not part of the deliverable and must not be shipped.

**Recreate this design as a real static site.** There's no existing codebase, so pick the
simplest thing that ships — a hand-written `index.html` plus one CSS file is entirely
sufficient and is the recommendation. The page is static, one column, and has no
interactivity beyond anchor links and one iframe. Astro or Next.js static export are fine
if preferred. Do not build a client-rendered SPA; this needs to be crawlable and fast.

**Fidelity: high.** Colours, type, spacing and copy are final — match them closely.
Responsive behaviour is the one thing left open (the reference is desktop-width only);
see "Responsive" below.

## Design tokens

Palette "Hi-vis carbon".

| Token | Hex | Use |
|---|---|---|
| `ink` | `#1A1B17` | Dark band backgrounds (header, hero, footer); body text on paper |
| `paper` | `#F4F4EE` | Page background; text on ink |
| `surface` | `#E9EADF` | Tinted panel (proof line), iframe well |
| `accent` | `#D8F24B` | Hi-vis. Buttons on dark, wordmark asterisk on dark, footer tagline |
| `accentText` | `#55584C` | Moss. The accent *role* on light backgrounds (schedule times, asterisk bullets, inline links) |
| `muted` | `#55584C` | Secondary text on paper |
| `mutedOnDark` | `#B9BCA9` | Secondary text on ink |
| `border` | `rgba(0,0,0,.13)` | Hairlines, section rules |

**Critical accessibility rule:** `accent` (#D8F24B) is never text on `paper` — it fails
contrast at any weight. On light backgrounds the accent role is carried by `accentText`.
Accent appears only as a *fill* (with `ink` text on it, 15.7:1) or as *text on ink* (14.9:1).

### Type

Two families, both Google Fonts:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=Archivo:wght@400;500;600;700&display=swap" rel="stylesheet">
```

- **Archivo Black** (400) — wordmark, headings, proof line, closing question.
- **Archivo** (400/500/600/700) — everything else, including the small caps labels.

No third typeface. In particular the caps labels are Archivo 600, not a monospace.

| Role | Font | Size / line-height | Tracking |
|---|---|---|---|
| H1 wordmark (hero) | Archivo Black | 58 / 1 | -.032em |
| Hero descriptor | Archivo Black | 26 / 1.15 | -.025em |
| Hero tagline (italic) | Archivo 500 italic | 20 / 1.3 | — |
| Closing question | Archivo Black | 34 / 1.1 | -.028em |
| Header wordmark | Archivo Black | 21 / 1 | -.025em |
| Footer wordmark | Archivo Black | 24 / 1 | -.025em |
| Question headings | Archivo Black | 19 / 1.3 | -.02em |
| Proof line, "One rule" line | Archivo Black | 18 / 1.4–1.5 | -.018em |
| Body paragraphs | Archivo 400 | 17 / 1.7 | — |
| Answers, secondary body | Archivo 400 | 16.5 / 1.65 | — |
| Buttons | Archivo 600 | 16 | — |
| Schedule times | Archivo 600 | 15 | — |
| Nav + footer links | Archivo 500/600 | 14 | — |
| Section labels (caps) | Archivo 600 | 12 | .14em, uppercase |
| Footer meta (caps) | Archivo 600 | 11 | .14em, uppercase |

Radii: 7px nav button, 9px primary buttons, 12px panels/iframe well.
Content column: `max-width: 720px; padding: 0 32px`, centred.
Section rhythm on `paper`: `gap: 76px` between sections; main block padding `64px 32px 104px`.

## Page structure

Seven blocks, one column, order fixed. Full-bleed `ink` bands at top and bottom;
everything between sits on `paper`.

### 1. Header — sticky, `ink`

`position:sticky; top:0; z-index:40`, bottom border `1px solid rgba(255,255,255,.14)`,
padding `14px 32px`, wordmark left / nav right.

- Wordmark "HackAotearoa" in `paper` + asterisk in `accent`, links to `#top`.
- Nav: "The day" → `#day`, "Questions" → `#questions` (14px, `mutedOnDark`).
- RSVP button: `accent` fill, `ink` text, padding `9px 15px`, radius 7px → Luma URL.

### 2. Hero — `ink`, `id="top"`

Padding `58px 32px 62px`, stack with `gap: 26px`; title group `gap: 14px`.

H1 + accent asterisk → descriptor → "Est. March 2026" (12px caps, `mutedOnDark`) →
italic tagline in `accent` → detail line (17px/1.65, `paper`) where the session date is
bold and in `accent` → "RSVP on Luma →" button (`accent` fill, `ink` text, `15px 24px`, radius 9px).

`sessionDate` ("Friday 7 August") and `sessionTime` ("9:30 to 3:30") are the only values
that change per session. Keep them as two constants at the top of the template — don't
scatter them inline.

### 3. What it is — `paper`, `id="what"`

Section label "What it is" (12px caps `muted`) over a `1.5px solid border` top rule,
`padding-top: 14px`. Then:

- Two paragraphs, 17px/1.7.
- Three bold-lead lines, `gap: 16px`. Each is a grid `18px 1fr`, `gap: 12px`,
  `align-items: baseline`: asterisk (15px Archivo Black, `accentText`) + line
  (16.5px/1.6, lead word in Archivo 700).
- Proof panel: `surface`, radius 12px, padding `24px 26px`, 18px/1.5 Archivo Black —
  one sentence only: "80+ builders through the door since March."

### 4. The day — `paper`, `id="day"`, `scroll-margin-top: 80px`

Four rows, no gap; each a grid `76px 1fr`, `gap: 18px`, `align-items: baseline`,
`padding: 14px 0`, with a `1px solid border` bottom rule on all but the last.
Time in Archivo 600 15px `accentText`, description 16.5px/1.55.
Nothing follows the four rows.

### 5. Questions — `paper`, `id="questions"`, `scroll-margin-top: 80px`

Five Q&As, `gap: 26px` between pairs, `gap: 6px` within. Question 19px Archivo Black,
answer 16.5px/1.65 `muted`. No accordion — everything is open. Order matters:
"Is this a hackathon?" is first because it's the most common misread.

### 6. About — `paper`

Section label "About". Two short paragraphs only, `gap: 18px`, 16.5px/1.7 — the first in
`ink`, the second in `muted` and ending in the email as an inline link (`accentText`,
Archivo 600). No photo-consent line, no GridAKL credit, no closing "One rule" line.

### 7. Closing RSVP + calendar — `paper`

`1.5px` top rule, `padding-top: 34px`. Closing question (34px Archivo Black) and the RSVP
button on one flex row, `gap: 22px`, wrapping. Below, full content-column width: the Luma
calendar iframe in a `surface` well, radius 12px, `1.5px solid border`, height 450px,
`border: 0`, with a `title` attribute for a11y.

### 8. Footer — `ink`

Padding `44px 32px 96px`. Top row, `space-between`: left is the wordmark (24px Archivo
Black) + accent asterisk with the descriptor beneath it in `accent` at 14px Archivo 500;
right is a link column — "Calendar" (the Luma URL), "LinkedIn"
(`https://www.linkedin.com/company/hackaotearoa/`), "Contact" (`mailto:james@hackaotearoa.nz`),
all 14px Archivo 500 in `paper`. Divider `1px solid rgba(255,255,255,.16)`, then
"Est. March 2026 · Auckland" (11px caps, `mutedOnDark`) alone on the bottom row.

## Responsive

Not designed yet — decide during build. Recommended, in keeping with the design:

- Single column already, so mostly type and padding scale.
- Below ~700px: side padding 32 → 20px; H1 58 → 38px; hero descriptor 26 → 21px;
  closing question 34 → 26px. Body stays 17px — do not shrink it.
- Header: keep the wordmark and RSVP button, drop the two nav links below ~560px.
- Schedule rows: collapse the `76px 1fr` grid to a single column with the time above
  the description at the same sizes.
- Tap targets: keep buttons ≥44px tall.
- Sticky header is fine on mobile; verify `scroll-margin-top` still clears it.

## Content

`copy.md` is the source of truth for every word — final and approved. Two live values to
wire up: the Luma URL and the session date/time.

## Deployment

1. Push the built site to a new GitHub repo.
2. Import the repo in Vercel — a static site needs no build config; framework preset "Other",
   output directory the folder containing `index.html`.
3. Point the domain at it and enable HTTPS.

Launch target: **31 July 2026**.

### Before launch

- Replace the placeholder Luma URL and the calendar embed `src` with the real ones from
  the HackAotearoa Luma account (embed with the dark theme and the Auckland filter applied,
  copied from Luma's embed dialog — the URL in the reference is a placeholder).
- Add `<title>`, meta description, and an OG image (1200×630) — none exist yet; the OG
  image should be the wordmark on `ink` with the accent asterisk.
- Add a favicon: "HA*" — asterisk in `accent` on `ink`.
- Set `lang="en-NZ"` and check the page in a screen reader once (headings run h1 → h2 only).

# Ship Plan — HackAotearoa Landing Page & Online Presence

> Written 2026-07-11 by a ship-plan session. Execute tasks top-down within
> the current milestone; each task is sized for one focused session.
>
> Context home: `/Users/james/Documents/1. Projects/Hackaotearoa/` (the "cowork
> folder"). Read `marketing-content-strategy.md` §2 (positioning), §7 (Lane
> partnership), and §10 (90-day plan) before any content work. Brand rules:
> `brand/brand-guide.md`. Design exploration brief: `brand/design-brief.md`.

## 1. Current state snapshot (2026-07-11)

- **This repo is empty.** No git init, no code, no lockfile — only `CLAUDE.md`
  and `.claude/settings.local.json`. Nothing is deployed anywhere.
- **The product exists as a prototype outside the repo:**
  `cowork/landing-page/index.html` — a complete, well-crafted single-file page
  in the v1 terminal brand (dark, monospace, `hack_aotearoa` wordmark). It has
  6 unresolved TODOs: Luma RSVP URL, WhatsApp Community invite link, waitlist
  form (currently `mailto:`), hosted OG image PNG, LinkedIn URLs, and
  testimonial consent for the three named quotes (Dani, Hannah & Hanjun, Tim).
- **Brand v1 exists:** `brand/brand-guide.md` (palette, type, voice, comms
  templates) + 6 SVGs (wordmark, badge, stacked, avatar, LinkedIn banner, OG
  card). The design brief asks for 3–4 divergent directions and explicitly says
  not to anchor on v1 — that exploration has not happened yet.
- **hackaotearoa.nz is UNREGISTERED** — verified against whois.irs.net.nz on
  2026-07-11 ("Not found"). `.co.nz` presumed also available (unverified).
- No build/test health to report — there is no code yet.

## 2. Founder context (2026-07-11)

Interview answers from James, plus context from the cowork folder:

- **Goal:** an online presence ready for the Lane Litz / What Founders Want
  Wellington partnership. Lane can't cross-promote a community with no landing
  page — the brand kit + page IS the Wellington launch kit
  (marketing-content-strategy.md §7.1).
- **Lane status:** Draft 2 reply SENT (as of 2026-07-11). No hard launch date
  agreed yet. Working target: presence ready before WFW cross-promo begins,
  ~August 2026 per the 90-day plan. WLG pilot events expected ~September.
- **Sequencing decision (REVISED by James, 2026-07-12): explore first, ship
  once.** Brand exploration in Claude Design is already underway. The v1
  terminal brand will NOT be shipped — the site launches in the winning
  direction. The prototype's copy, structure, and positioning still carry over
  (the words survive; the skin doesn't). v1 remains the documented fallback if
  exploration stalls past the decision deadline below.
- **Stack decision:** Next.js + Tailwind + Bun on Vercel. Chosen because Claude
  Design syncs to React and the roadmap implies growth (Wellington section,
  email capture, event promo pages).
- **Email capture decision:** Tally form embed. Free, no backend, CSV export.
  Explicitly NOT a newsletter — strategy §11.6 forbids new recurring content
  commitments before 2027.
- **After launch, follow the marketing strategy** (`marketing-content-strategy.md`)
  — the 90-day plan in §10 is the operating rhythm this site plugs into.
- **Capacity constraint:** First Believers block 4 Nov–16 Dec 2026 is
  protected/high-load. Everything here should be running on rails by October.
- Not a Marulho ship — no marulho.co subdomain; footer says "Run by James,"
  never "A Marulho Ventures project" (strategy §12.3).

**Addendum from `cowork/growth-plan.md` (2026-07-13):**

- **The landing page is now the relaunch gate.** Growth diagnosis: retention
  is healthy (~50% returning), acquisition is the weak leg — promo stalled
  while brand work took over. No promo push restarts until the page is live
  with new assets (growth plan §2.1). Target moved up: **brand ships end of
  July**, landing page live in July (§10 arc).
- **Verified July baseline for page copy:** avg attendance 8–10, ~50%
  returning, 60+ unique members. GridAKL is continuing post-trial on the same
  terms (retires the venue risk; terms in writing is a later nicety).
- **Page must also carry** (growth plan §7): a photo-consent line, a code of
  conduct page (adapt the Indie Hackers meetup CoC), and email capture that
  feeds an owned list with a 150-by-October target.
- **Lane Draft 2: CONFIRMED SENT** (James, 2026-07-13). The growth plan's
  "Send Lane Draft 2" ★ task is stale — ignore it. Waiting on Lane's reply.
- **Email capture: Tally confirmed** (James, 2026-07-13), overriding growth
  plan §7's ESP suggestion for now. Possible transition to Beehiiv later —
  build the form so the embed is swappable, and export Tally CSVs alongside
  Luma CSVs so the list migrates cleanly whenever that happens.

## 3. Definition of first-user-ready

- **First users:** (1) Lane Litz — needs a URL to put in WFW newsletter,
  LinkedIn, and website backlinks; (2) prospective Auckland attendees clicking
  through from LinkedIn recaps and the GridAKL newsletter feature (draft
  exists, waiting on this link); (3) Wellington founders arriving via WFW
  cross-promo who have never heard of HackAotearoa.
- **Core loop:** land on hackaotearoa.nz → immediately understand "co-working
  day for builders, NOT a hackathon" → RSVP on Luma (Auckland) or join the
  chapter waitlist (everyone else) → optionally join the WhatsApp community.
- **Channel:** LinkedIn posts (James's recaps), WFW cross-promo (Lane), GridAKL
  newsletter feature. All need one canonical link.
- **Explicitly out of scope for v1:** a newsletter, member directory, sponsor
  one-pager, per-chapter pages, CMS, analytics beyond the basics, Builders for
  Impact content. (The v1 terminal brand is also out — the site launches in
  the direction chosen from the Claude Design exploration.)

## 4. Gap analysis

- **Product:** prototype must become a deployed Next.js site; 6 TODOs in the
  prototype must be resolved with real links and consented quotes.
- **Technical:** repo not initialized; no project scaffold; OG image needs a
  PNG export from `brand/social-og-card.svg`.
- **Ops:** domain unregistered (BLOCKER for the canonical link — but Vercel
  preview URL unblocks everything else); Vercel project not created; no
  `NEXT_PUBLIC_SITE_URL`.
- **Content:** testimonial consent unconfirmed (strategy §11.3); stats should
  use the July baseline (60+ unique, 8–10 avg, ~50% returning — growth plan
  §1); FAQ block from the design brief §7 (five questions, "Is this a
  hackathon?" first) is NOT in the prototype and the brief calls it
  first-class, not footer filler; code of conduct page and photo-consent line
  (growth plan §6.7, §7) don't exist yet.
- **Distribution:** GridAKL newsletter feature is drafted and waiting on this
  link; Lane's cross-promo is waiting on the partnership agreement; Maggie
  Gray (Caffeine) follow-up wants the page in hand.
- **Design:** the 3–4 direction exploration (design-brief.md) hasn't started —
  deliberately decoupled from launch per §2.

## 5. Roadmap

### Milestone 1 — Brand direction chosen (in progress; decide by ~end of July)
Definition of done: the Claude Design exploration (already underway,
2026-07-12) has produced 3–4 divergent directions against
`brand/design-brief.md`, and James has picked one using the brief's four §9
tests. Deadline tightened from early August to ~end of July: the growth plan
(2026-07-13) makes the live page the gate for restarting all promotion.
James-errand tasks (domain, links, consent, email form) run in parallel so
nothing else blocks the build.

### Milestone 2 — Live at a real URL in the chosen brand (target: end of
July / first week of August — it gates the August relaunch blitz: GridAKL
feature, Caffeine follow-up, WFW announcement)
Definition of done: the site — prototype copy and positioning, chosen visual
direction — is live as a Next.js app at https://hackaotearoa.nz with all
prototype TODOs resolved (or consciously cut), and the link has been given to
Lane and Sinead (GridAKL).

### Milestone 3 — Wellington launch kit (target: before first WLG event, ~September)
Definition of done: Wellington section live on the page, chapter playbook
one-pager exists, launch sequence assets ready (per strategy §7.2), waitlist
collecting emails.

### Milestone 4 — Marketing engine plugged in (ongoing from August)
Definition of done: the fortnightly loop runs against the live site — recaps
link to it, Luma CSV exports happen per event, metrics table (§9 of strategy)
has a landing-page row with a baseline.

## 6. Task breakdown

### Milestone 1 — Brand direction chosen (exploration already in progress)

- [ ] **[James + Claude] Finish the Claude Design exploration** — already
      started (2026-07-12). Keep it honest to `brand/design-brief.md`: 3–4
      divergent directions, ≥2 nothing like the terminal v1, each shown as a
      full landing-page mock (not just a logo), name + descriptor designed
      together. Keep sessions per-direction so they don't converge.
- [ ] **[James] Pick the direction** — judge against the brief's §9 tests
      (sticker test, photo-adjacency test, Wellington-can-run-it test,
      ecosystem-distinctiveness test). Falling back to v1 remains a valid
      outcome if nothing beats it. Decide by early August — this gates launch.
- [ ] **[Claude] Codify the chosen direction** — update
      `cowork/brand/brand-guide.md` to v2 (palette, type, wordmark rules);
      regenerate the SVG asset set (wordmark, badge, stacked, avatar, LinkedIn
      banner, OG card) in the new direction. Acceptance: brand-guide v2 +
      six SVGs exist; the voice section and comms templates carry over
      unchanged.

Parallel James errands (none blocked by the design work — do any time):

- [ ] **[James] Register hackaotearoa.nz (and .co.nz)** — ~$25/yr each, any NZ
      registrar (or Vercel Domains). Verified available 2026-07-11. Needs a
      payment method, so this is yours. Also grab @hackaotearoa on Instagram/X
      if still free (strategy §11.1).
- [ ] **[James] Gather the live links + facts** — current Luma event URL,
      WhatsApp Community invite link, your LinkedIn profile URL, current stats
      (events held, unique builders, avg attendance). Drop them in a
      `docs/LAUNCH-FACTS.md` file or paste into a session.
- [ ] **[James] Confirm testimonial consent** — one message each to Dani,
      Hannah & Hanjun, and Tim: "can I quote this on the website?" Blocker for
      the quotes block only; page can ship with quotes hidden if needed.
- [ ] **[James] Create a Tally account + waitlist form** — fields: email,
      city. Grab the embed/share URL. (Free tier is fine.) Decision confirmed
      2026-07-13: Tally for now, possible Beehiiv transition later — so keep
      the export habit (Tally CSV alongside Luma CSV) for a clean migration.

### Milestone 2 — Live at a real URL in the chosen brand

- [ ] **[Claude] Scaffold the Next.js site and build in the chosen direction** —
      `bun create next-app` (App Router, Tailwind, TypeScript) in this repo;
      git init. Import/sync the chosen Claude Design output where possible
      (DesignSync / Vercel's import-claude-design-from-url), otherwise build
      from the mock. Carry the prototype's copy and section structure
      (`cowork/landing-page/index.html`: Hero, Format, IsIsNot, Proof, Cities,
      Footer) — the positioning copy survives even though the skin doesn't.
      Copy v2 brand SVGs into `public/`; brand tokens as Tailwind theme vars;
      `src/lib/site.ts` with `NEXT_PUBLIC_SITE_URL` fallback driving
      metadataBase/OG/sitemap/robots. Acceptance: `bun run build` passes;
      page matches the chosen mock at desktop + 375px widths; all prototype
      copy blocks present.
- [ ] **[Claude] Add the FAQ section** — design brief §7 makes this
      first-class: "Is this a hackathon?" (always first), "Do I need a
      startup?", "I'm not a developer — is this for me?", "Do I need to
      prepare anything?", "Can companies/VCs partner with us?". Write answers
      in brand voice (plain-spoken, Kiwi-understated — see brand-guide.md
      voice table). Acceptance: FAQ renders as semantic details/accordion,
      first question is the hackathon one.
- [ ] **[Claude] Wire real links + Tally embed + OG image** — resolve every
      prototype TODO using LAUNCH-FACTS; export the v2 OG-card SVG → 1200×630
      PNG into `public/og-card.png`; embed the Tally form in the Cities
      section as a swappable component (a possible Beehiiv transition later
      should only touch one file). Acceptance: zero `href="#"` or TODO
      comments in the shipped page; OG preview validates.
- [ ] **[Claude] Code of conduct page + photo-consent line** — new
      requirements from growth plan §6.7 and §7: adapt the Indie Hackers
      meetup CoC (github.com/mtlynch/indie-hackers-code-of-conduct, open
      source) into a `/conduct` page in brand voice; add the one-line photo
      notice ("we take photos for socials — tell the host if you'd rather not
      be in them") near the format section or FAQ, and mirror it on the Luma
      page. Needed before any event runs where James isn't in the room.
      Acceptance: `/conduct` linked from the footer; consent line visible on
      the page.
- [x] **DONE 2026-07-14 (partial): repo + Vercel project live.** GitHub:
      `jamessmejlis/hackaotearoa` (public); Vercel project `hackaotearoa`
      git-connected, first production deploy Ready at
      https://hackaotearoa.vercel.app (blank "coming soon" placeholder,
      Next.js 15 App Router + Tailwind + Bun, `bun run build` passing).
      Domains purchased on Cloudflare (2026-07-14).
- [ ] **[James] Attach domains + DNS** — Vercel → hackaotearoa project →
      Settings → Domains → add hackaotearoa.nz, accepting Vercel's
      recommendation: **www.hackaotearoa.nz is canonical**, apex 308-redirects
      to it (+ .co.nz as a redirect domain). Add the records Vercel shows in
      Cloudflare DNS: CNAME for www (serving), A for @ (redirect) — both set
      to "DNS only"/grey cloud (Cloudflare proxying in front of Vercel causes
      redirect/SSL loops), SSL mode Full (strict). Then set
      `NEXT_PUBLIC_SITE_URL=https://www.hackaotearoa.nz` (all environments —
      must match the canonical www form) and redeploy. Short form
      `hackaotearoa.nz` stays fine in all marketing copy; it redirects.
      Acceptance: www serves the page with valid SSL; apex and .co.nz
      redirect to it.
- [ ] **[James] Hand the link to Lane and Sinead** — Lane: as the WFW
      cross-promo target. Sinead (GridAKL): unblocks the drafted newsletter
      feature (`gridakl-newsletter-feature-draft.md`). Also update Luma page,
      LinkedIn banner, WhatsApp icon with the v2 brand assets.

### Milestone 3 — Wellington launch kit

- [ ] **[James] Close the partnership agreement with Lane** — Draft 2 sent;
      settle her Draft 2 response, confirm pilot dates and the ≥8 avg / ≥40%
      returning success bar (strategy §7.5).
- [ ] **[Claude] Wellington section + waitlist upgrade** — uncomment/build the
      WLG block: "Wellington — launching [month], in partnership with What
      Founders Want" (her named upside, strategy §7.4); Wellington-specific
      Tally field or dedicated form. Acceptance: WLG section live with WFW
      credit and working waitlist.
- [ ] **[Claude] Chapter playbook one-pager** — event format + voice + recap
      template + brand asset usage, distilled from brand-guide.md and the
      launch plan. Lives in the cowork folder, shared with Lane. This doubles
      as the bus-factor doc (strategy §11.5) and the v0 Community Playbook
      (strategy §12.6). Acceptance: one page; Lane could run session 1 from it
      without asking James anything about format or brand.
- [ ] **[James] Launch sequence** — per strategy §7.2: joint LinkedIn
      announcement (your post, her repost in her own words), WFW newsletter
      feature linking the waitlist, first WLG recap posted by you tagging her.

### Milestone 4 — Marketing engine plugged in

- [ ] **[James] Adopt the fortnightly loop against the live site** — recaps
      and promo posts (templates in brand-guide.md) always link the site;
      export Luma CSV after every event into the cowork folder.
- [ ] **[Claude] Add lightweight analytics + metrics baseline** — Vercel
      Analytics (free tier, no cookie banner needed) is enough; record the
      first month's landing-page → RSVP clickthrough as the baseline. Log it
      in the tracking sheet (growth plan §6.3 — the single system of record
      the scorecard, Lane gate, and sponsor evidence all read from), not a
      separate doc. Acceptance: analytics visible in Vercel; baseline row in
      the tracking sheet.
- [ ] **[Claude] Event promo link targets** — an upcoming-events section (or
      per-event anchor) so `anthropic-skills:event-promo-pack` output has a
      link target (per repo CLAUDE.md). Acceptance: promo posts can deep-link
      to the next event's details on the site.

## 7. Risks and open questions

| Risk / question | Recommendation |
|---|---|
| Domain squatting — name was just secured in negotiation but hackaotearoa.nz is unregistered | Register both TLDs this week; it's the cheapest risk-kill in the whole plan |
| Design exploration stalls — it gates launch AND the entire promo restart (growth plan §2.1 makes the live page the relaunch gate) | Hard decision deadline: ~end of July. If no direction has won by then, ship in v1 terminal brand (already complete) and treat the winner as a later re-skin — the August relaunch blitz can't slip for aesthetics |
| Lane responds with a launch date sooner than expected | Everything but the visual direction can be pre-staged: do all Milestone 1 James-errands now, and Claude can scaffold the Next.js app + copy + FAQ brand-agnostically so only the skin waits on the design decision |
| ~~Lane Draft 2 status contradiction~~ RESOLVED 07-13: sent | Waiting on Lane's reply; the growth plan's "Send Lane Draft 2" ★ task is stale |
| Tally now, possibly Beehiiv later (decided 07-13) means a list migration someday | Keep the form embed swappable (one component) and export Tally CSVs alongside Luma CSVs so the list moves cleanly; the growth plan's automated "next event" send waits until the ESP exists |
| Testimonial consent declined | Quotes block degrades gracefully to stats-only; never publish unconsented names (strategy §11.2–11.3) |
| Stats on the page go stale ("60+ builders since March") | Use figures that age well ("60+ in the first four months") and refresh at each milestone |
| ~~GridAKL arrangement post-trial unconfirmed~~ RESOLVED 07-13: continuing, same terms | Low-urgency: get the arrangement in writing (two-line email) before sponsor conversations reference the venue |
| Nov–Dec capacity crunch (First Believers block) | Milestones 1–3 must be done by end of October; Milestone 4 is designed to run on ~90 min/fortnight |

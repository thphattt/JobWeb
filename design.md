<!-- Hallmark · design.md · studied: yes · DNA-source: url · source: https://nguyenle.com.vn/ · extracted 2026-06-20 -->

# Design — Nguyễn Lê

Locked design system, extracted from a studied reference. Future Hallmark runs
read this file first; pages defer to it. Amend intentionally — the file is the rule.

## System
- Genre · editorial (warm corporate / event-agency)
- Macrostructure · Bento Grid (modern) — redesign 2026-06-20 · alt: Feature Stack / Photographic
- Theme · studied-DNA (source: https://nguyenle.com.vn/)
- Axes · light paper / soft-geometric-sans display / warm accent (orange + earth)

## Provenance
- Source mode · URL — `https://nguyenle.com.vn/`
- Extracted · 2026-06-20
- Attestation · (b) public reference for the user's own brand
- Confidence · Tokens are exact (pulled from the source's theme CSS). Fonts are
  exact (declared via Google Fonts + theme `--font-*` vars). Rhythm is unknown —
  HTML alone can't judge density/asymmetry. **The DNA is structural; specific
  tokens may need regenerating to match the user's brand identity rather than the
  source's.**

## Tokens (canonical · `tokens.css` is the source of truth)
```css
:root {
  /* Paper — warm/blush light surfaces  (#f8f0ed, #e9e4dc) */
  --color-paper:      oklch(96.3% 0.006 50);
  --color-paper-2:    oklch(92% 0.008 80);

  /* Ink — warm charcoal; source also declares body-text #0a1f30 (cool navy) */
  --color-ink:        oklch(28% 0.005 60);   /* #2c2926 */
  --color-ink-2:      oklch(50% 0.000 0);    /* #5e5e5e muted */
  --color-rule:       oklch(92% 0.008 80);   /* #e9e4dc hairline */

  /* Accent — orange is the interactive/CTA fill */
  --color-accent:     oklch(72% 0.170 52);   /* #f58220 orange */
  --color-accent-ink: oklch(28% 0.005 60);   /* text on accent: warm charcoal */
  --color-focus:      oklch(43% 0.080 245);  /* #204f75 slate-blue ring */

  /* Secondary brand set — warm-earth decorative + secondary actions */
  --color-blue:       oklch(43% 0.080 245);  /* #204f75 secondary action */
  --color-olive:      oklch(40% 0.025 105);  /* #565440 headings/decorative */
  --color-clay:       oklch(73% 0.045 52);   /* #c49f8a warm decorative */

  /* Type — Gilroy family (VN-subset) + Beau Rivage script eyebrow.
     Source has no mono; the mono fallback below is a Hallmark addition. */
  --font-display: "SVN-Gilroy", "Gilroy", "Axiforma", sans-serif; /* use 800 / XBold */
  --font-body:    "SVN-Gilroy", "Gilroy", sans-serif;             /* 400 / 600 */
  --font-script:  "Beau Rivage", cursive;                         /* eyebrows / subtitles */
  --font-mono:    ui-monospace, "SF Mono", Menlo, monospace;      /* Hallmark addition */

  /* 4-pt spacing scale, named: --space-3xs … --space-4xl. See tokens.css.
     Source uses a fluid --spacing (20px → 80px) on an 8/12-col grid.          */
  /* Type scale, 1.25 (major-third) ratio: --text-xs … --text-display.         */

  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --dur-fast: 180ms;  --dur-base: 240ms;  --dur-slow: 320ms;

  --radius-card:   20px;
  --radius-input:  6px;
  --radius-pill:   1000px;   /* buttons render as pills; source also uses 30px */
}
```

## CTA voice
- Primary · `--color-accent` (orange) fill · pill radius · generous horizontal padding
- Secondary · `--color-blue` fill or ghost/outline · same pill radius

## Motion stance
- Carousel-led: slick + flickity sliders, fancybox lightbox. No scroll-reveal or
  smooth-scroll library. Keep reveals to 1–2 primitives (fade-up) — do not add a
  motion library the source didn't use.
- Reduced-motion fallback · ≤150 ms opacity crossfade; pause auto-rotating carousels.

## Notes — do NOT carry over
- **`transition: all`** appears 17× in the source theme CSS — replace with explicit
  `transform`/`opacity` transitions; never animate layout properties.
- **Auto-rotating carousels** (stats + photos) — give users a pause control and
  don't auto-advance content they're reading.
- **Hover-scale on cards** risk — prefer a hairline/elevation shift over `scale()`.
- Single-family weight-split (Gilroy) is fine, but the **Beau Rivage script** is a
  decorative eyebrow only — never set it as body or running headlines.

## Exports
`tokens.css` is the source of truth. For Tailwind v4 `@theme`, DTCG `tokens.json`,
or shadcn/ui CSS variables, ask *"extend design.md with Tailwind exports"* (or the
format you want) — Hallmark will append them per `export-formats.md`.

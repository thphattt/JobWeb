<!-- Hallmark · design.md · studied: yes · source: https://nguyenle.com.vn/ (initial) → dark-industrial pivot (client Colorbond/BlueScope ref) · updated 2026-06-23 -->

# Design — Tân Châu Thành

Locked design system for the Tân Châu Thành website (Next.js + Tailwind v4).
Source of truth for tokens is `src/styles/globals.css` (`@theme`). Amend
intentionally — this file is the rule; pages defer to it.

## System

- **Genre** · dark industrial / event-agency — high-contrast, UPPERCASE, confident.
- **Macrostructure** · full-bleed sections with a **dark / light rhythm** (mostly
  dark; one light section for contrast). Modelled on a client-provided
  Colorbond/BlueScope reference.
- **Theme** · near-black warm surfaces + **brand gradient** accent (from logo).
- **Axes** · warm near-black surfaces · geometric sans (Be Vietnam Pro) · orange
  accent with an orange→pink→purple gradient.

## Provenance

- **Initial study** · `https://nguyenle.com.vn/` (light warm editorial) — **superseded**.
- **Current direction** · dark industrial, modelled on a **client-provided
  Colorbond reference** (Figma export), recoloured to the **Tân Châu Thành logo**.
- **Brand colours** · extracted from the logo mark (orange→pink→purple gradient);
  accent is the warm orange end of that gradient.

## Tokens (canonical · `src/styles/globals.css @theme` is the source of truth)

```css
@theme {
  /* Light surfaces (used by the single light "Services" band + sub-page cards origin) */
  --color-paper:      oklch(96.3% 0.006 50);  /* ≈ #F7F1EC warm off-white */
  --color-paper-2:    oklch(92% 0.008 80);    /* ≈ #E9E4DC */

  /* Ink — dark text on light surfaces */
  --color-ink:        oklch(28% 0.005 60);    /* ≈ #2C2926 */
  --color-ink-2:      oklch(50% 0 0);         /* ≈ #6E6E6E muted */
  --color-rule:       oklch(92% 0.008 80);    /* ≈ #E9E4DC hairline */

  /* Accent — ORANGE (warm end of the logo gradient) */
  --color-accent:     oklch(66% 0.18 48);     /* ≈ #E27D33 */
  --color-accent-ink: oklch(99% 0 0);         /* white — text on gradient fills */
  --color-focus:      oklch(43% 0.08 245);    /* ≈ #2A5680 slate-blue ring */

  /* Dark theme surfaces (the default — body bg is night, text is #fff) */
  --color-night:      oklch(16% 0.006 60);    /* ≈ #181613 near-black warm */
  --color-night-2:    oklch(21% 0.006 60);    /* ≈ #221F1B card/surface */
  --color-night-rule: oklch(32% 0.006 60);    /* ≈ #38332E hairline on dark */

  /* Type — single family, full Vietnamese support */
  --font-display: var(--font-sans);   /* Be Vietnam Pro · 800 for headings */
  --font-body:    var(--font-sans);   /* Be Vietnam Pro · 400–600 */

  /* Shape — SQUARE corners (industrial); only buttons-as-pills exception removed */
  --radius-card:  0px;
  --radius-input: 0px;
  --radius-pill:  1000px;   /* available but UI uses square buttons */

  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
}

/* body { background: var(--color-night); color: #fff } */

/* Brand gradient — orange → pink → purple (from the logo), 120° */
.bg-brand-gradient     { linear-gradient(120deg,
                           oklch(66% 0.18 48),   /* #E27D33 orange  */
                           oklch(57% 0.2 12),    /* #D6335A pink    */
                           oklch(48% 0.19 322)); /* #7A3B93 purple  */ }
.bg-brand-gradient-rev { same stops, reversed (purple → orange) }
```

## Signature motifs (what makes it recognizable)

1. **Large solid gradient SQUARE next to every UPPERCASE section title** (`size-16`
   → `lg:size-28` on home; `size-6` accent on sub-pages).
2. **Square corners everywhere** (radius 0) — cards, panels, inputs, image tiles.
3. **Brand gradient on big fills** — section squares, primary buttons, stat panel,
   icon boxes, footer copyright strip.
4. **Dark cards** (`night-2`) with a **gradient bottom bar** (`h-1`), often
   scale-x on hover.
5. **Hero carousel** — gradient/image slides, `01 02 03 04` pagination (active in
   orange + underline), square ◀ ▶ arrows (one outline, one gradient-filled).
6. **Dark/light section rhythm** — hero/about/why/events/CTA dark; Services light.

## CTA voice / buttons

- **Primary** · `bg-brand-gradient` fill · white **UPPERCASE** text · **square** ·
  letter-spacing ~0.15em · generous padding (`px-8 py-4`).
- **Secondary** · outline (white or accent border) · square · uppercase · hover
  fills or brightens border.
- **"XEM THÊM" style** · outline-accent square. Never pill-shaped.

## Typography

- **Be Vietnam Pro** (Google, VN subset) for everything.
- Headings: weight **800**, **UPPERCASE**, tight tracking, large (`text-4xl`–`6xl`).
- Body: 400–500. Labels/eyebrows: 600, uppercase, letter-spacing 0.25–0.3em, accent.
- Eyebrows: small uppercase kicker preceded by a short dash (`— LABEL`).

## Motion stance

- **Scroll reveal** · fade-up (translateY + opacity), ease `cubic-bezier(0.16,1,0.3,1)`,
  ~700ms, staggered; **replays each time** an element re-enters the viewport.
- **Hero carousel** · 3s auto-advance, **pause on hover/focus**, crossfade.
- **Hover** · gradient underline/bottom-bar grow; subtle `-translate-y` on buttons;
  image zoom on gallery tiles.
- Respect **`prefers-reduced-motion`** (no auto-advance, no reveal animation).
- **Never** `transition: all` — explicit `transform`/`opacity` only.

## Notes — keep in mind

- The site is **dark by default** (`body` bg = night). The only light band is the
  homepage **Services** section (`bg-paper text-ink`), kept self-contained.
- Accent is **orange**; avoid white text on a solid `bg-accent` (low contrast) —
  use `bg-brand-gradient` for filled buttons instead.
- Event gallery tiles work on both light and dark (gradient placeholder + dark
  overlay); drop real photos into `public/events/` to replace placeholders.
- Hero carousel accepts real images via `public/hero/` (`HeroSlide.image`).

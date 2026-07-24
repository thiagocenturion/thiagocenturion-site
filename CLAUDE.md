# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Static marketing/portfolio website for Thiago Centurion Apps — seven indie iOS apps built in
the `~/Documents/app-factory` monorepo (Sustain, Anchor, PawVet AI, GlucoLens, PouchDrop,
RallyLog, Gridline). Premium Apple "liquid glass" dark aesthetic: aurora gradients, glass cards,
scroll-driven reveals, and a hand-built CSS iPhone mockup per app.

## Architecture

### Tech Stack
- **Pure static HTML/CSS/JS** — no build step, no framework
- **`docs/styles.css`** — the entire design system, hand-written (the landing page does NOT
  use Tailwind)
- **Legal pages** (`privacy.html`, `terms.html`) still load Tailwind via CDN for their body
  copy, plus `styles.css` for the shared nav/background/glass chrome
- **GitHub Pages** serves from `/docs`
- **Data-driven**: all app content comes from `docs/apps.json`

### File Structure
```
/docs
  ├── index.html      # Landing page shell (sections + containers; content rendered by site.js)
  ├── styles.css      # ⭐ Design system: tokens, glass, nav, hero, showcases, phone mocks, responsive
  ├── site.js         # ⭐ Renders apps.json → rail/showcases/values/footer + all interactions
  ├── apps.json       # ⭐ Single source of truth for brand + app data
  ├── privacy.html    # Generic privacy policy (all apps)
  ├── terms.html      # Generic terms of use (all apps)
  └── assets/         # Optional real artwork (icons/screens/og) — see IMAGE-PROMPTS.md
```

### apps.json schema (per app)
`id, name, storeName, category, tagline, hook, subtitle, status (live|coming_soon), badge,
platforms[], accent, accent2, appStoreUrl, icon, screenshot, features[{title,text}]`

- `hook` is the big emotional headline of the app's showcase section; the last 2–3 words are
  automatically gradient-highlighted.
- `accent`/`accent2` drive the whole per-app theme (glyph, glow, chips, CTA) via CSS custom
  properties `--a1`/`--a2` injected on the section.
- `icon`/`screenshot` are null by default → site renders a gradient SVG glyph and a bespoke
  CSS phone mock (see `GLYPHS` and `MOCKS` in site.js, keyed by app `id`). Setting a path
  swaps in real artwork (see IMAGE-PROMPTS.md at repo root).
- When an app ships: set `status: "live"` and the real `appStoreUrl` — the CTA switches to
  "Download on the App Store" and the badge turns green. Nothing else to touch.

## Development Workflow

### Local testing
```bash
cd docs && python3 -m http.server 8000   # then open http://localhost:8000
```
`site.js` has a full embedded fallback of apps.json, so even file:// renders completely.

### Adding an app
1. Add the object to `docs/apps.json` (all fields above).
2. Add an SVG glyph and a mock template in `site.js` (`GLYPHS[id]`, `MOCKS[id]`) — otherwise
   it falls back to the Anchor glyph and an empty phone screen.
3. Commit and push (GitHub Pages auto-deploys).

## Important Constraints

### Performance (hard-won — do not regress)
- **No `backdrop-filter` on repeated cards.** True blur is reserved for the few chrome
  surfaces (`.nav.glass`, `.support-panel.glass`, `.mobile-menu`). Cards use translucent
  layered backgrounds (`.glass` is blur-free). Dozens of backdrop-filter surfaces jank
  scrolling on phones.
- **No `filter: blur()` on large elements.** The aurora orbs are "pre-blurred" via soft
  radial-gradient falloff instead. Never reintroduce 500px blurred divs.
- All scroll work goes through one rAF-throttled listener; reveals/counters use
  IntersectionObserver (with an `.top < 0` catch-up so fast scrolling can't skip them).
- `prefers-reduced-motion` disables every animation; keep new effects behind it.

### Maintainability
- **Never hardcode app content in HTML** — everything renders from `apps.json`.
- New showcase/mock markup must escape data with the `esc()` helper in site.js.
- Keep the layout scaling to 10+ apps (showcases are generated in a loop).

### Mobile
- Test at 375px: burger menu, full-width CTAs, stacked showcases (copy above phone),
  `svh` units for the hero, safe-area insets on nav/footer.
- iOS quirks already handled: `viewport-fit=cover`, `-webkit-backdrop-filter`,
  no `background-attachment: fixed`.

### Legal Pages
- Generic for all apps; cover AI features, subscriptions, analytics, skin-scan/face data.
- Update the effective date at the top when changing them.

## Style Guidelines
- Dark theme only: bg `#07070b`, text `#f5f4f7`, tokens live in `:root` of styles.css.
- Brand gradient: violet `#a78bfa` → rose `#fb7185` → sky `#38bdf8`.
- Per-app accents come from apps.json, never hardcoded in CSS.
- Type is the system stack (SF Pro on Apple) with Inter as the web fallback.

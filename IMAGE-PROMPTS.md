# Image generation prompts

The site is fully functional **without any images** — every app currently renders a
gradient glyph (icon) and a hand-built CSS phone mockup. Generate these assets whenever
you want, drop them in the paths below, and flip the matching field in `docs/apps.json`.
Nothing else needs to change.

## How to wire an image in

| Asset | Save to | Then set in `docs/apps.json` |
|---|---|---|
| App icon | `docs/assets/icons/<id>.png` | `"icon": "assets/icons/<id>.png"` |
| Phone screenshot | `docs/assets/screens/<id>.png` | `"screenshot": "assets/screens/<id>.png"` |
| Social/OG card | `docs/assets/og.png` | nothing — `index.html` already points to it |

- **Icons:** export 1024×1024 PNG, no alpha, then downscale to 512×512 for the web copy
  (keeps the page light). The site masks them to a rounded square automatically.
- **Screenshots:** portrait 9:19.5 (e.g. 1170×2532). These replace the CSS mock inside the
  phone frame. Real simulator captures will always beat generated ones — prefer those.
- **OG card:** 1200×630 PNG.

---

## 1. Social / OG card — `docs/assets/og.png` (1200×630)

> Dark premium social banner for an indie iOS app studio, 1200×630. Near-black background
> (#07070b) with a soft aurora of three glowing radial gradients: violet (#a78bfa) top right,
> rose (#fb7185) mid left, sky blue (#38bdf8) bottom center, all heavily diffused, subtle film
> grain. Centered headline in bold white SF Pro–style sans-serif: "Apps you didn't know you
> needed." Below it, smaller dimmed text: "Seven deeply-crafted iOS apps · No accounts · Privacy
> by design". At the bottom, a row of seven small rounded-square app icons in coral, amber, teal,
> indigo, mint, lime green, and warm gold, each with a soft matching glow. Apple-keynote
> aesthetic, glassmorphism hints, no photographic elements, no watermark.

## 2. App icons (1024×1024 PNG, no alpha, no text)

Shared requirements for all seven: single centered motif, ≥80px padding from every edge, must
stay legible at 60px and 29px, subtle inner glow, no text or letters anywhere, flat modern
iOS-icon style with soft top-left highlight, continuous-corner square canvas (Apple applies
the mask).

### Sustain — `docs/assets/icons/sustain.png`
> iOS app icon, 1024×1024. Deep plum background (#231B2B) with a very subtle radial vignette.
> Centered: a bold, incomplete circular progress ring in a coral-to-gold gradient (#FF7A66 →
> #F7C873), stroke about 12% of canvas width, with a small deliberate notch/gap at the 10
> o'clock position marked by a tiny solid gold tick — "a protein floor" notch. Soft coral
> outer glow. Minimal, flat, premium health-app aesthetic. No text.

### Anchor — `docs/assets/icons/anchor.png`
> iOS app icon, 1024×1024. Deep twilight-blue background (#1C2333) with a very subtle radial
> vignette toward #232A45 at the edges. Subject: a single soft candlelight-amber orb (#F5B971
> core fading to transparent), centered slightly below optical center at about 58% height —
> the feeling of "a warm lamp in a quiet room". Around the orb, one faint lavender halo ring
> (#B9B4D9 at ~12% opacity), echoing a gentle pulse. Soft glow, no hard edges, no text.

### PawVet AI — `docs/assets/icons/pawvet.png`
> iOS app icon, 1024×1024. Deep teal gradient background (#0E6B63, slightly lighter at top
> left). Centered white dog-paw print composed of a rounded pad and four toes with soft,
> continuous-corner shapes, enclosed by four thin white camera-viewfinder corner brackets.
> Very subtle inner glow on the paw. Flat, calm, trustworthy medical-adjacent aesthetic.
> Must read clearly at 60px. No text.

### GlucoLens — `docs/assets/icons/glucolens.png`
> iOS app icon, 1024×1024. Soft porcelain off-white background with a barely-visible warm
> vignette. A smooth glucose curve flows horizontally across the lower half, drawn as a thick
> line with a sage-green-to-amber gradient (#86C79F → #F0B860). Over the curve's peak sits a
> bold indigo magnifying-glass loupe (#5B63F5) with a clean circular lens that slightly
> magnifies the curve segment beneath it. Flat, precise, scientific-but-friendly. No text.

### PouchDrop — `docs/assets/icons/pouchdrop.png`
> iOS app icon, 1024×1024. Deep ink-navy background (#101422) with subtle vignette. A single
> stylized mint-green ocean wave (#5EEAD4) cresting from left to right across the center,
> clean flowing curves, with a small round gold rider dot (#F5D06F) balanced on the crest —
> "riding the craving wave". Soft mint glow beneath the crest. Flat, energetic, hopeful.
> No text.

### RallyLog — `docs/assets/icons/rallylog.png`
> iOS app icon, 1024×1024. Court-navy background (#0F1B33) with subtle vignette. A bright
> optic-yellow-green ball (#C8F04B) with two curved seam lines sits low-left of center; a
> thin rising trajectory arc sweeps from the ball up to the top-right corner, fading from
> lime (#A3E635) to sky blue (#38BDF8), ending in a small arrowless spark. Sporty, precise,
> premium. Must read at 60px. No text.

### Gridline — `docs/assets/icons/gridline.png`
> iOS app icon, 1024×1024, flat vector style with subtle paper-grain texture. A minimalist
> newspaper-puzzle aesthetic: deep ink background (#1E1E24) with a faint 3×3 grid of hairline
> rules in warm gray. ONE cell of the grid is filled solid warm gold (#C9A15A) with softly
> rounded corners, containing a small, crisp, hand-drawn five-point crown silhouette in the
> ink color. Quiet, tasteful, editorial. No text.

## 3. Optional per-app phone screenshots

The CSS mockups already sell each app's core moment, so only do this when you have real
builds: capture the seeded simulator screens listed in each app's
`app-factory/apps/<id>/metadata/app-store.md` (screenshot #1 — the hero shot), export
portrait PNG, save to `docs/assets/screens/<id>.png`, set the `screenshot` field.
Recommended hero shots:

- **sustain** — Today screen, protein ring at ~90%
- **anchor** — Session screen, orb glowing, micro-step card visible
- **pawvet** — Triage card (amber "Monitor at home" case)
- **glucolens** — Nightly Autopsy card over the day curve
- **pouchdrop** — Panic flow with the wave mid-crest
- **rallylog** — Court Mode scoreboard
- **gridline** — Today view, all three dailies with the streak flame

## 4. Optional apple-touch-icon — `docs/assets/apple-touch-icon.png` (180×180)

> A 180×180 version of the studio mark: rounded-square conic gradient sweeping through
> violet (#a78bfa), rose (#fb7185), and sky blue (#38bdf8), with the bold white letters "TC"
> centered in an SF Pro–style sans-serif. Soft inner top highlight, flat background, no
> transparency.

After generating it, add to the `<head>` of all three HTML pages:
`<link rel="apple-touch-icon" href="assets/apple-touch-icon.png">`

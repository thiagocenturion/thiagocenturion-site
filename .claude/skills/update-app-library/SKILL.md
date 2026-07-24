---
name: update-app-library
description: >-
  Sync the website's app library from the app-factory monorepo: detect apps that exist in
  ~/Documents/app-factory/apps but are missing from docs/apps.json, add them with proper
  marketing copy, and pull real assets (App Store screenshots and the AppIcon) into the site.
  Use this whenever the user asks to update/refresh/sync the app library or portfolio, add a
  new app to the website, check whether the site is up to date with app-factory, or wire in
  real app icons/screenshots — even if they don't name the skill or the folder explicitly.
---

# Update App Library

Keep `docs/apps.json` (the site's single source of truth) in sync with the apps that
actually exist in the `~/Documents/app-factory/apps` monorepo, and upgrade the site from
CSS-mock visuals to real artwork whenever an app has shipped assets.

The site renders everything from `apps.json` (see repo CLAUDE.md for the schema). Two fields
control visuals per app: `icon` (null → gradient SVG glyph) and `screenshot` (null → CSS
phone mock). This skill's job is to fill the catalog and those two fields from app-factory.

## Step 1 — Discover and diff

1. List candidate apps: directories in `~/Documents/app-factory/apps/`, **excluding
   `factory-demo`** (an internal component gallery, never a shipping product). If unsure
   whether a directory is a real app, check it has `metadata/app-store.md` — that file is
   the marker of a store-bound app.
2. Read `docs/apps.json` and compare against the candidate list by `id` (the id is the
   app-factory directory name).
3. Report the diff to the user: apps to add, apps already present, and any apps.json entry
   with no matching app-factory directory (flag it, don't delete without asking).

## Step 2 — Add missing apps

For each new app, mine `~/Documents/app-factory/apps/<id>/metadata/app-store.md` — it holds
finished App Store copy (name, subtitle, promo text, description, feature sections, icon
spec with exact colors). Build the apps.json entry from it:

- `id` = directory name · `name` = short display name · `storeName` = the full App Store name
- `hook`: the most emotionally arresting line from the promo/description opening (e.g.
  "It's 11pm and your dog is scratching a red patch…"). This becomes the section headline;
  its last 2–3 words get gradient-highlighted automatically.
- `tagline`: the punchiest one-liner (used in the hero marquee rail)
- `subtitle`: 1–2 sentence value summary · `category`: primary App Store category
- `features`: exactly 4 `{title, text}` pairs from the description's feature sections —
  benefit-led, not spec-led
- `accent` / `accent2`: pull from the icon spec / theme colors in the metadata (these drive
  the whole section theme). Pick two colors that gradient well on a dark background.
- `platforms`: "iOS" plus real capabilities mentioned (Widgets, Siri, HealthKit, Live
  Activity, Lock Screen…)
- `status`: `"coming_soon"` unless the user confirms the app is live with a real App Store
  URL — never guess `"live"`. `badge`: "Coming soon". `appStoreUrl`: "#" until live.
- `icon` / `screenshot`: leave null here; Step 3 fills them.

Then wire the rendering (see CLAUDE.md "Adding an app"):
1. Add an SVG glyph in `site.js` `GLYPHS[id]` (simple 24×24 stroke/fill motif echoing the
   icon concept) — otherwise the app falls back to the Anchor glyph.
2. Add a mock template in `site.js` `MOCKS[id]` showing the app's hero moment with the
   existing `m-*` building blocks — otherwise the phone renders empty. (If Step 3 finds a
   real screenshot the mock won't show, but build it anyway as the fallback.)
3. Mirror the new entry into `FALLBACK_DATA` in `site.js` — it is a duplicate of apps.json
   that keeps the site working over file://. **Any apps.json change must be mirrored there.**

## Step 3 — Sync real assets (icons + screenshots)

Run the bundled script from the repo root:

```bash
bash .claude/skills/update-app-library/scripts/sync-assets.sh
```

For every app id in app-factory it:
- resolves the real AppIcon file via `App/Resources/Assets.xcassets/AppIcon.appiconset/Contents.json`
  (the filename is often a UUID, so never glob for `AppIcon-1024.png`), downsizes to 512px,
  and writes `docs/assets/icons/<id>.png`
- picks the **hero App Store marketing frame** (`0-hero.png`, or the lowest-numbered
  frame) from `metadata/screenshots/en/` (falls back to any other locale), downsizes to
  750px wide, and writes `docs/assets/screens/<id>.png`. These files are finished store
  creative — caption + phone mockup on a branded backdrop — and the site knows this: when
  `screenshot` is set, the showcase renders a standalone `.store-card` instead of putting
  the image inside its CSS phone (which would double-frame it). So the hero frame, the
  strongest piece of creative, is exactly the right pick.
- prints a `SYNCED icon|screenshot <id>` line per asset and `MISSING` lines for apps
  without assets

Then update `apps.json` (and `FALLBACK_DATA`): for each `SYNCED` asset set
`"icon": "assets/icons/<id>.png"` / `"screenshot": "assets/screens/<id>.png"`. Leave the
field null when the script reported `MISSING` — the CSS glyph/mock is the designed fallback,
so a missing asset is fine, not an error.

One judgment call: many icons in app-factory are **placeholders** (the metadata usually says
so under "Icon"). Placeholder icons are still better than no icon on the website, so wire
them in — but mention in your summary which icons are placeholders per the metadata, so the
user knows the site will auto-upgrade when final art replaces the file in app-factory.

## Step 3.5 — Sweep for stale app-count copy

The hero eyebrow and the "apps in the family" stat derive the count from apps.json at
runtime, so they update themselves. But static SEO text does not: when the app count
changes, grep `docs/index.html` for the old count (e.g. "Six") and update the
`<meta name="description">`, `og:description`, and any other prose that states a number
of apps. Also refresh the counts mentioned in CLAUDE.md / IMAGE-PROMPTS.md if they've
drifted.

## Step 4 — Verify

1. `python3 -c "import json; json.load(open('docs/apps.json'))"` — valid JSON.
2. `node --check docs/site.js` if site.js changed.
3. Serve and eyeball: `cd docs && python3 -m http.server 8000` — every app section renders,
   real icons show masked to rounded squares, screenshots fill the phone frame (they're
   9:19.4 App Store captures in a 9:19.2 frame — `object-fit: cover` handles it), and no
   console errors.
4. Respect the performance constraints in CLAUDE.md (no new backdrop-filters/blurs).

## Report

End with a short summary: apps added (with the hook you chose), assets wired vs. still on
CSS fallbacks, placeholder-icon warnings, and any human-only follow-ups (App Store URL
when an app goes live, final icon artwork, screenshots for apps that lack them).

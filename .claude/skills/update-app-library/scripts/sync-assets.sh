#!/usr/bin/env bash
# Sync real app assets from the app-factory monorepo into the website.
#   icons:       apps/<id>/App/Resources/Assets.xcassets/AppIcon.appiconset/<Contents.json filename>
#   screenshots: apps/<id>/metadata/screenshots/en/0-hero.png (or best available)
# Run from the thiagocenturion-site repo root. Prints SYNCED/MISSING lines for the caller
# (the model) to wire into docs/apps.json. Idempotent — safe to re-run any time.
set -euo pipefail

FACTORY="${APP_FACTORY_DIR:-$HOME/Documents/app-factory}/apps"
SITE_DOCS="docs"
ICON_OUT="$SITE_DOCS/assets/icons"
SCREEN_OUT="$SITE_DOCS/assets/screens"

if [[ ! -d "$FACTORY" ]]; then
  echo "ERROR app-factory not found at $FACTORY (set APP_FACTORY_DIR to override)" >&2
  exit 1
fi
if [[ ! -f "$SITE_DOCS/apps.json" ]]; then
  echo "ERROR run this from the thiagocenturion-site repo root (docs/apps.json not found)" >&2
  exit 1
fi

mkdir -p "$ICON_OUT" "$SCREEN_OUT"

for APP_DIR in "$FACTORY"/*/; do
  id="$(basename "$APP_DIR")"
  [[ "$id" == "factory-demo" ]] && continue                 # internal gallery, not a product
  [[ -f "$APP_DIR/metadata/app-store.md" ]] || continue     # only store-bound apps

  # ---- icon: resolve the real filename via Contents.json (often a UUID, never glob) ----
  ICONSET="$APP_DIR/App/Resources/Assets.xcassets/AppIcon.appiconset"
  if [[ -f "$ICONSET/Contents.json" ]]; then
    ICON_FILE="$(python3 - "$ICONSET/Contents.json" <<'PY'
import json, sys
data = json.load(open(sys.argv[1]))
names = [i.get("filename") for i in data.get("images", []) if i.get("filename")]
print(names[0] if names else "")
PY
)"
    if [[ -n "$ICON_FILE" && -f "$ICONSET/$ICON_FILE" ]]; then
      sips -s format png -Z 512 "$ICONSET/$ICON_FILE" --out "$ICON_OUT/$id.png" >/dev/null
      echo "SYNCED icon $id -> assets/icons/$id.png"
    else
      echo "MISSING icon $id (Contents.json lists no existing file)"
    fi
  else
    echo "MISSING icon $id (no AppIcon.appiconset)"
  fi

  # ---- screenshot: App Store marketing frame from metadata/screenshots.
  # These files are finished store creative (caption + phone mockup on a backdrop);
  # the site renders them as a standalone "store card", NOT inside its CSS phone,
  # so the hero frame (0-hero.png) is the best pick. en first, then any locale.
  SHOT=""
  SHOTS_ROOT="$APP_DIR/metadata/screenshots"
  if [[ -d "$SHOTS_ROOT" ]]; then
    for LOCALE_DIR in "$SHOTS_ROOT/en" "$SHOTS_ROOT"/*/; do
      [[ -d "$LOCALE_DIR" ]] || continue
      if [[ -f "$LOCALE_DIR/0-hero.png" ]]; then
        SHOT="$LOCALE_DIR/0-hero.png"
      else
        SHOT="$(find "$LOCALE_DIR" -maxdepth 1 -name '*.png' | sort | head -1 || true)"
      fi
      [[ -n "$SHOT" ]] && break
    done
  fi
  if [[ -n "$SHOT" ]]; then
    sips -s format png --resampleWidth 750 "$SHOT" --out "$SCREEN_OUT/$id.png" >/dev/null
    echo "SYNCED screenshot $id -> assets/screens/$id.png ($(basename "$SHOT"))"
  else
    echo "MISSING screenshot $id (no metadata/screenshots — CSS mock stays)"
  fi
done

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a static marketing website for Thiago Centurion Apps, an indie iOS/iPadOS apps brand. The site showcases current and upcoming apps with a premium "Lovable-style" design.

## Architecture

### Tech Stack
- **Pure Static HTML/CSS/JS**: No build step required
- **Tailwind CSS**: Loaded via CDN for zero-config styling
- **GitHub Pages**: Free hosting from `/docs` folder
- **Data-Driven**: All app content comes from `docs/apps.json`

### File Structure
```
/docs                    # GitHub Pages serves from here
  ├── index.html        # Home page (hero, featured app, apps grid, support)
  ├── privacy.html      # Generic privacy policy for all apps
  ├── terms.html        # Generic terms of use for all apps
  ├── apps.json         # ⭐ Single source of truth for app data
  ├── site.js           # Dynamic rendering, animations, tilt effects
  └── assets/           # Optional static assets
```

## Development Workflow

### Local Testing
To test locally with fetch() working:
```bash
cd docs
python -m http.server 8000
# Open http://localhost:8000
```

### Updating Content
**To add or modify apps**: Edit `docs/apps.json` only. The site automatically renders from this file.

**To update brand name/tagline**: Edit `brand` section in `docs/apps.json`.

**To update contact email**: Search and replace `support@yourdomain.com` in:
- `docs/index.html`
- `docs/privacy.html`
- `docs/terms.html`

### Design Patterns

**Glass Card Components**: Use `.glass-card` class for the signature glassmorphism effect (backdrop blur, subtle borders).

**Gradient Accents**: Each app has an `accent` color in JSON that drives gradient themes.

**Reveal Animations**: Elements with `.reveal` class fade in on scroll via IntersectionObserver.

**Tilt Effect**: The featured app card has a subtle 3D tilt on hover (only on that card, not globally).

## Important Constraints

### Maintainability
- **Never hardcode app-specific content in HTML**: Always pull from `apps.json`
- The home page must scale to 10+ apps without layout issues
- Keep code readable and well-structured for future maintainability

### Legal Pages
- Privacy Policy and Terms of Use are **generic for all apps** under the brand
- They cover future apps with AI features, subscriptions, analytics, etc.
- Update effective dates when making changes to legal pages

### GitHub Pages Deployment
1. Repository Settings → Pages
2. Source: Deploy from branch
3. Branch: `main` + Folder: `/docs`
4. Site URL: `https://username.github.io/repo-name/`

## Key Features

### Dynamic App Rendering
`site.js` fetches `apps.json` and dynamically generates:
- Featured app showcase (first live app, or first app in list)
- Apps grid with status badges (Live / Coming Soon)
- Platform tags (iOS, iPadOS)
- Highlight bullets
- CTA buttons (App Store URLs)

### Status-Based UI
Apps can have `status: "live"` or `status: "coming_soon"`:
- Live apps: Green badge, "View on App Store" button
- Coming soon: Purple badge, "App Store (soon)" button with # placeholder

### Fallback for Local Testing
If `fetch('apps.json')` fails (e.g., opening index.html directly), site.js uses a minimal fallback to prevent errors.

## Common Tasks

**Add a new app**:
1. Edit `docs/apps.json`
2. Add new app object with all required fields
3. Commit and push (auto-deploys via GitHub Pages)

**Change brand name**:
1. Edit `docs/apps.json` → `brand.name`

**Update legal docs**:
1. Edit `docs/privacy.html` or `docs/terms.html`
2. Update effective date at top
3. Notify users of changes if significant

**Test animations locally**:
1. Run local server: `cd docs && python -m http.server 8000`
2. Scroll to see reveal animations
3. Hover featured card to see tilt effect

## Style Guidelines

- **Dark theme**: Background `#0a0a0a`, text `#fafafa`
- **Glass cards**: `rgba(30,30,30,0.4)` with backdrop blur
- **Gradient glows**: Background blobs with blur filters
- **Noise texture**: SVG noise overlay for subtle texture
- **Colors**: Purple and red gradient accents (customizable per app)
- **Typography**: System fonts, large headings, good spacing
- **Responsive**: Mobile-first, works on all screen sizes

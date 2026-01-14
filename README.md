# Thiago Centurion Apps - Marketing Website

A premium, "Lovable-style" static marketing website for showcasing indie iOS/iPadOS apps. Built with zero-cost deployment via GitHub Pages.

## Features

- **Data-Driven**: Update apps by editing `docs/apps.json` only
- **Premium Design**: Dark theme with gradient glows, glass cards, smooth animations
- **Responsive**: Mobile-first design that looks great on all devices
- **Zero Build Step**: Uses Tailwind CDN for instant updates
- **Free Hosting**: Deploys via GitHub Pages from `/docs` folder

## Structure

```
/docs
  ├── index.html         # Home page with hero, featured app, apps grid
  ├── privacy.html       # Privacy Policy (generic for all apps)
  ├── terms.html         # Terms of Use (generic for all apps)
  ├── apps.json          # App data (edit this to update content)
  ├── site.js           # Dynamic rendering and animations
  └── assets/           # Optional: favicon, images, etc.
```

## Updating Apps

Edit `docs/apps.json` to add or modify apps:

```json
{
  "brand": {
    "name": "Your Brand Name",
    "tagline": "Your tagline here"
  },
  "apps": [
    {
      "id": "app-id",
      "name": "App Name",
      "subtitle": "Short description",
      "status": "live",           // or "coming_soon"
      "badge": "New",
      "platforms": ["iOS", "iPadOS"],
      "accent": "#EF4444",
      "appStoreUrl": "https://apps.apple.com/...",
      "iconType": "gradient-red",
      "highlights": [
        "Feature 1",
        "Feature 2",
        "Feature 3",
        "Feature 4"
      ]
    }
  ]
}
```

## Local Development

To test locally with fetch() working:

```bash
cd docs
python -m http.server 8000
```

Then open http://localhost:8000 in your browser.

## Deploying to GitHub Pages

1. Push this repository to GitHub
2. Go to your repository Settings → Pages
3. Under "Build and deployment":
   - Source: Deploy from a branch
   - Branch: `main` (or `master`)
   - Folder: `/docs`
4. Click Save
5. Wait a few minutes for deployment
6. Your site will be live at `https://yourusername.github.io/repo-name/`

## Customization

### Update Contact Email
Replace `support@yourdomain.com` in:
- `docs/index.html` (support section)
- `docs/privacy.html` (contact section)
- `docs/terms.html` (contact section)

### Update Brand Name
Edit `docs/apps.json` → `brand.name` and `brand.tagline`

### Update Legal Effective Dates
Edit the effective dates at the top of:
- `docs/privacy.html`
- `docs/terms.html`

## Tech Stack

- **HTML/CSS/JavaScript**: Pure static files
- **Tailwind CSS**: Via CDN (no build required)
- **GitHub Pages**: Free hosting
- **IntersectionObserver API**: Scroll-based reveal animations

## License

All code is provided as-is for your use. Customize as needed for your apps.

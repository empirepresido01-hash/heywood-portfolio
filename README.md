# Portfolio Website

A refined, production-ready portfolio site for Heywood Lenwii David, designed for modern browsing, accessibility, and deployment on Vercel.

## What changed

- Rebuilt the homepage into a premium 2026-style portfolio layout with stronger hierarchy and spacing.
- Introduced a responsive, accessible component system for hero, cards, gallery, about, contact, and footer sections.
- Added SEO metadata, schema markup, a web manifest, and improved robots/sitemap configuration.
- Refactored the frontend script into maintainable, theme-aware interaction logic.
- Extracted file utility logic into a small backend module and added regression tests.
- Added security headers and deployment-friendly Vercel configuration.

## Run locally

Install dependencies:

```bash
npm install
```

Start the app:

```bash
npm run dev
```

Open:

- Portfolio: http://localhost:5500
- Upload manager: http://localhost:5500/admin.html
- Upload API health check: http://localhost:5500/api/health

## Tests

Run the automated regression tests:

```bash
npm test
```

## Upload categories

Uploaded files are saved under public/uploads/ in these folders:

- gallery
- tools
- projects
- portrait
- documents

Metadata is stored in backend/data/uploads.json.

## Production note

Local uploads work well during development. For production on Vercel, uploaded files should eventually be moved to persistent cloud storage such as Vercel Blob, Cloudinary, or S3 because serverless file storage is not permanent.

## Deploy to Vercel

1. Push the repository to GitHub.
2. Create a new project on Vercel.
3. Import the repository with the framework preset set to Other.
4. Keep the output directory as . and leave build settings empty.
5. Deploy and replace your-production-domain.com in the SEO files with the real Vercel domain.

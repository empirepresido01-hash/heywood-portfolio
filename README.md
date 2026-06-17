# Portfolio Website

A clean static portfolio site ready to deploy on Vercel.

## Backend Upload Scaffold

This project now includes a Node/Express backend for future uploads.

### Run Locally

Install dependencies:

```bash
npm install
```

Start the backend and portfolio:

```bash
npm run dev
```

Open:

- Portfolio: `http://localhost:5500`
- Upload manager: `http://localhost:5500/admin.html`
- Upload API health check: `http://localhost:5500/api/health`

### Upload Categories

Uploaded files are saved under `public/uploads/` in these folders:

- `gallery`
- `tools`
- `projects`
- `portrait`
- `documents`

Metadata is saved in `backend/data/uploads.json`.

### Production Note

Local uploads work well during development. For production on Vercel, uploaded files should later be connected to permanent cloud storage such as Vercel Blob, Cloudinary, or S3 because serverless file storage is not permanent.

## Customize

Edit `index.html` and replace:

- `Your Name`
- `YN`
- `Frontend Developer`
- `you@example.com`
- project titles and descriptions
- LinkedIn and GitHub links

## Deploy To Vercel

1. Create a GitHub repository.
2. Upload or push these files.
3. Go to Vercel and choose **Add New > Project**.
4. Import the GitHub repository.
5. Keep the framework preset as **Other**.
6. Use these settings:
   - Build Command: empty
   - Output Directory: `.`
7. Click **Deploy**.
8. After deployment, replace `https://your-vercel-url.vercel.app` in `robots.txt` and `sitemap.xml` with your real Vercel URL.

## Submit To Google

1. Go to Google Search Console.
2. Add your Vercel URL as a URL prefix property.
3. Copy the HTML tag verification code from Google.
4. Paste the verification meta tag inside the `<head>` of `index.html`.
5. Redeploy on Vercel.
6. In Search Console, submit `https://your-vercel-url.vercel.app/sitemap.xml`.
7. Use URL Inspection for your homepage and click **Request indexing**.

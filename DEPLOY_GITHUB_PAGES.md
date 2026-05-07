# Deploy to GitHub Pages (Free)

This project is built with TanStack Start (SSR-first). GitHub Pages only
serves **static files**, so to host on Pages you must build a static export
and publish the generated assets. Follow these steps exactly.

> Note: Features that require server functions (e.g. the contact form,
> Lovable Cloud) will NOT work on GitHub Pages. For full functionality keep
> using Lovable's published URL or deploy to Cloudflare/Vercel/Netlify.

## 1. Push your project to GitHub

1. Open **Connectors → GitHub → Connect project** in Lovable.
2. Authorize the Lovable GitHub App and pick the account/org.
3. Click **Create Repository** — Lovable pushes the code automatically.

## 2. Configure Vite for a project subpath

GitHub Pages serves the site at `https://<user>.github.io/<repo>/`, so the
app needs a matching base path. Edit `vite.config.ts`:

```ts
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  vite: {
    base: process.env.GITHUB_PAGES === "true" ? "/<repo-name>/" : "/",
  },
});
```

Replace `<repo-name>` with your actual repository name. If you use a custom
domain or a `<user>.github.io` repo, set `base: "/"`.

## 3. Add a build script

In `package.json` ensure you have:

```json
{
  "scripts": {
    "build": "vite build",
    "build:pages": "GITHUB_PAGES=true vite build"
  }
}
```

## 4. Add the GitHub Actions workflow

Create `.github/workflows/deploy-pages.yml`:

```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v2
      - run: bun install --frozen-lockfile
      - run: bun run build:pages
      - name: Add SPA 404 fallback
        run: cp dist/index.html dist/404.html
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

The `404.html` copy lets client-side routes deep-link correctly on Pages.

## 5. Enable Pages in repo settings

1. GitHub → **Settings → Pages**.
2. **Build and deployment → Source**: select **GitHub Actions**.
3. Push to `main`. The workflow runs and prints the live URL.

## 6. (Optional) Custom domain

1. Add a `CNAME` file in `public/` containing your domain (e.g. `example.com`).
2. In your DNS, create a `CNAME` record pointing to `<user>.github.io`.
3. Reset `base: "/"` in `vite.config.ts` since the site now lives at the root.

## Troubleshooting

- **Blank page / 404 on assets** — `base` doesn't match the repo path.
- **Refresh shows 404** — the `404.html` copy step was skipped.
- **Contact form fails** — server functions don't run on Pages; use Lovable
  publish or a Node/Cloudflare host instead.
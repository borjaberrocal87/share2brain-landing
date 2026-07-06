---
description: Build, deploy, and CI/CD standards for Chat2Brain Landing — Astro SSG on Cloudflare Pages.
globs: ["astro.config.*", "wrangler.toml", ".github/workflows/*.{yml,yaml}", "tailwind.config.*", "tsconfig.json"]
alwaysApply: true
---

# Chat2Brain Landing — Build & Deploy Standards

## Overview

This document covers the build pipeline, deployment, CI/CD, and hosting configuration for the Chat2Brain Landing site. Since this is a **static Astro site** with no backend runtime, there are no API routes, databases, or server-side logic to document. The "backend" concerns here are: build process, asset optimization, deployment, and hosting configuration.

## Technology Stack

| Component | Technology |
|-----------|-----------|
| **Build** | Astro SSG (`astro build` → `dist/`) |
| **Hosting** | Cloudflare Pages (recommended) or Vercel |
| **CI/CD** | GitHub Actions |
| **Domain** | chat2brain.app |
| **CDN** | Cloudflare global network |
| **HTTPS** | Automatic via Cloudflare |

## Project Structure

```
chat2brain-landing/
├── public/
│   ├── favicon.ico
│   ├── og-image.png           # 1200x630 for social sharing
│   ├── robots.txt
│   └── sitemap.xml
├── src/
│   ├── components/            # Astro components + React islands
│   ├── layouts/               # BaseLayout.astro
│   ├── pages/                 # File-based routing
│   │   ├── index.astro        # Home page (Hero, Features, etc.)
│   │   ├── docs/              # Documentation pages (Markdown)
│   │   └── changelog.astro
│   ├── styles/
│   │   └── global.css         # Tailwind directives + custom CSS
│   └── content/
│       └── docs/              # Markdown content collections
├── astro.config.mjs
├── tailwind.config.mjs
├── tsconfig.json
├── package.json
└── README.md
```

## Build Process

### Local Build

```bash
npm run build        # Production build → dist/
npm run preview      # Preview production build locally
```

### Build Output

- Astro generates static HTML/CSS/JS into `dist/`
- No server-side rendering at runtime
- All pages are pre-rendered at build time (SSG)
- React islands are hydrated client-side only where needed

### Asset Optimization

- **Images**: Use WebP/AVIF formats, lazy-load below the fold
- **Fonts**: Self-hosted via `@fontsource` or Astro's built-in font optimization
- **CSS**: Tailwind purges unused styles in production build
- **JS**: Minimal — only React island bundles are shipped

## Deployment

### Option A: Cloudflare Pages (Recommended)

```toml
# wrangler.toml
name = "chat2brain-landing"
compatibility_date = "2024-01-01"

[site]
bucket = "./dist"
```

**Setup Steps:**
1. Connect GitHub repo to Cloudflare Pages
2. Configure:
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Node.js version: 20
3. Configure custom domain in Cloudflare DNS
4. Auto-deploy on every push to `main`

**Advantages:**
- Global CDN with ultra-low latency
- Automatic HTTPS
- Deploy previews for PRs
- Free for static sites

### Option B: Vercel

```json
// vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "astro"
}
```

### Option C: GitHub Pages

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run build
      - uses: actions/deploy-pages@v4
        with:
          artifact_path: ./dist
```

## CI/CD Pipeline

### GitHub Actions Workflow

```yaml
name: CI/CD
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check

  build:
    runs-on: ubuntu-latest
    needs: lint
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run build

  lighthouse:
    runs-on: ubuntu-latest
    needs: build
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run build
      - uses: treosh/lighthouse-ci-action@v10
        with:
          urls: |
            http://localhost:4321
          configPath: ./lighthouserc.json
```

### CI Requirements

| Check | Tool | Threshold |
|-------|------|-----------|
| Linting | ESLint + Prettier | Pass/Fail |
| Type checking | TypeScript | Pass/Fail |
| Build | `astro build` | Pass/Fail |
| Performance | Lighthouse CI | Score ≥ 95 |
| Link checking | markdown-link-check | No broken links |

### Deployment Rules

- **Production deploy**: Only from `main` branch
- **Preview deploys**: Automatic for all PRs
- **No manual deploys**: All deployments are triggered by git push

## Domain Configuration

### DNS Records

```
Type    Name    Value                   TTL
A       @       76.76.21.21            300     # Cloudflare Pages
CNAME   www     chat2brain.pages.dev     300     # Cloudflare Pages
CNAME   docs    chat2brain.pages.dev     300     # Subdomain docs
```

### SSL/TLS

- Cloudflare handles SSL automatically
- HSTS enabled
- Minimum TLS version: 1.2

### Security Headers

Configure in Cloudflare or `_headers` file:

```
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' plausible.io; style-src 'self' 'unsafe-inline'
```

## Analytics & Monitoring

### Analytics (Privacy-Friendly)

**Plausible Analytics:**
```html
<script defer data-domain="chat2brain.app" src="https://plausible.io/js/script.js"></script>
```

**Umami (Self-hosted):**
```html
<script async defer data-website-id="YOUR_ID" src="https://analytics.chat2brain.app/script.js"></script>
```

### Metrics to Track

| Metric | Description |
|--------|-------------|
| Pageviews | Total views per page |
| Unique visitors | Unique visitors |
| Bounce rate | Bounce percentage |
| Time on page | Average time on page |
| CTA clicks | Clicks on "Get Started" and "GitHub" |
| Referrers | Traffic sources |
| Devices | Desktop vs Mobile |
| Countries | Geographic distribution |

### Uptime Monitoring

```yaml
# UptimeRobot or Uptime Kuma configuration
- Name: Chat2Brain Landing
- URL: https://chat2brain.app
- Interval: 5 minutes
- Alert: Email + Telegram
```

## Performance Budgets

| Metric | Target |
|--------|--------|
| Lighthouse Performance | ≥ 95 |
| First Contentful Paint | < 1s |
| Largest Contentful Paint | < 2.5s |
| Cumulative Layout Shift | < 0.1 |
| Time to Interactive | < 2s |
| Total Bundle Size | < 100KB (gzipped) |

## Development Scripts

```bash
npm run dev          # Start Astro dev server (http://localhost:4321)
npm run build        # Production build → dist/
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
```

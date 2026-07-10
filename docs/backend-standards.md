---
description: Build, deploy, and CI/CD standards for Share2Brain Landing — Astro SSG on Hostinger VPS with Docker.
globs: ["astro.config.*", "Dockerfile", "docker-compose*.yml", "Caddyfile", ".github/workflows/*.{yml,yaml}", "tailwind.config.*", "tsconfig.json"]
alwaysApply: true
---

# Share2Brain Landing — Build & Deploy Standards

## Overview

This document covers the build pipeline, deployment, CI/CD, and hosting configuration for the Share2Brain Landing site. Since this is a **static Astro site** with no backend runtime, there are no API routes, databases, or server-side logic to document. The "backend" concerns here are: build process, asset optimization, deployment, and hosting configuration.

## Technology Stack

| Component | Technology |
|-----------|-----------|
| **Build** | Astro SSG (`astro build` → `dist/`) |
| **Hosting** | Hostinger VPS (Docker + Nginx + Caddy) |
| **CI/CD** | GitHub Actions → GHCR → SSH deploy |
| **Domain** | share2brain.app |
| **HTTPS** | Automatic via Caddy + Let's Encrypt |

## Project Structure

```
share2brain-landing/
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

### Hostinger VPS with Docker (Production)

The deployment is fully automated via GitHub Actions (`.github/workflows/deploy-hostinger.yml`):

1. On push to `main`, the Docker image is built and pushed to GHCR (`ghcr.io/borjaberrocal87/share2brain-landing:latest`)
2. GitHub Actions copies `docker-compose.prod.yml` and `Caddyfile` to the VPS via SCP
3. SSH runs `docker compose pull` + `docker compose up -d` on the VPS
4. Caddy automatically obtains and renews the SSL certificate from Let's Encrypt

**Architecture:**

```
Internet → Caddy (80/443, SSL auto) → Nginx container (80, static files)
```

**Required GitHub Secrets:**
- `HOSTINGER_SSH_KEY` — VPS SSH private key
- `HOSTINGER_HOST` — VPS IP address
- `HOSTINGER_USER` — SSH username (typically `root`)

**Local Docker (development):**

```bash
docker compose up -d --build    # Build and start
docker compose down             # Stop
```

**Production Docker Compose (VPS):**

```bash
docker compose -f docker-compose.prod.yml pull
docker compose -f docker-compose.prod.yml up -d
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
A       @       <IP_VPS_HOSTINGER>      300
A       www     <IP_VPS_HOSTINGER>      300
```

### SSL/TLS

- Caddy handles SSL automatically via Let's Encrypt
- Auto-renewal built-in
- HSTS enabled
- Minimum TLS version: 1.2

### Security Headers

Configured in `nginx.conf`:

```
X-Frame-Options: SAMEORIGIN
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
```

## Analytics & Monitoring

### Analytics (Privacy-Friendly)

**Plausible Analytics:**
```html
<script defer data-domain="share2brain.app" src="https://plausible.io/js/script.js"></script>
```

**Umami (Self-hosted):**
```html
<script async defer data-website-id="YOUR_ID" src="https://analytics.share2brain.app/script.js"></script>
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
- Name: Share2Brain Landing
- URL: https://share2brain.app
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

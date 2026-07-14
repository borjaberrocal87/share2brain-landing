# Share2Brain Landing — Development Guide

This guide provides step-by-step instructions for setting up the development environment, running the site locally, and deploying to production.

## Prerequisites

Ensure you have the following installed:
- **Node.js** v20 or higher
- **npm** v10 or higher (or pnpm/yarn)
- **Git**

> **Note:** This is a static Astro site. No Docker, database, or backend services are required.

## 1. Clone the Repository

```bash
git clone git@github.com:borjaberrocal87/share2brain-landing.git
cd share2brain-landing
```

## 2. Install Dependencies

```bash
npm install
```

## 3. Start Development Server

```bash
npm run dev
```

The site will be available at `http://localhost:4321`.

That's it — no environment variables, no database setup, no Docker. This is a fully static site.

## 4. Project Structure

```
share2brain-landing/
├── public/                     # Static assets (favicon, og-image, robots.txt)
├── src/
│   ├── components/             # Astro components + React islands
│   │   ├── Header.astro
│   │   ├── Hero.astro
│   │   ├── Features.astro
│   │   ├── HowItWorks.astro
│   │   ├── Installation.astro
│   │   ├── Comparison.astro
│   │   ├── Footer.astro
│   │   ├── CodeBlock.tsx       # React island (syntax highlighting + copy)
│   │   ├── ThemeToggle.tsx     # React island (dark/light toggle)
│   │   └── MobileMenu.tsx      # React island (hamburger menu)
│   ├── layouts/
│   │   └── BaseLayout.astro   # HTML shell, head, fonts, analytics
│   ├── pages/
│   │   ├── index.astro        # Home page
│   │   ├── docs/              # Documentation pages
│   │   └── changelog.astro
│   ├── styles/
│   │   └── global.css         # Tailwind directives + custom properties
│   └── content/
│       └── docs/              # Markdown content collections
├── astro.config.mjs
├── tailwind.config.mjs
├── tsconfig.json
└── package.json
```

## 5. Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start Astro dev server (http://localhost:4321) |
| `npm run build` | Production build → `dist/` |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |
| `npm run type-check` | TypeScript type checking |
| `npm test` | Run Vitest unit tests |
| `npm run test:e2e` | Run Playwright E2E tests |

## 6. Local Development Workflow

### Adding a New Section to the Home Page

1. Create a new Astro component in `src/components/`:
   ```astro
   ---
   // src/components/NewSection.astro
   ---
   <section class="py-20" id="new-section">
     <h2 class="text-3xl font-bold font-heading">New Section</h2>
     <p class="text-neutral-400 mt-4">Content here...</p>
   </section>
   ```

2. Import and add it to `src/pages/index.astro`:
   ```astro
   ---
   import NewSection from '../components/NewSection.astro';
   ---
   <NewSection />
   ```

### Adding a New Documentation Page

1. Create a new Markdown file in `src/content/docs/`:
   ```markdown
   ---
   title: "New Page"
   description: "Description of the new page"
   order: 5
   ---
   
   # New Page
   
   Content here...
   ```

2. The page is automatically available at `/docs/new-page` (slug derived from filename).

### Adding a React Island (Interactive Component)

1. Create a `.tsx` file in `src/components/`:
   ```tsx
   // src/components/MyInteractive.tsx
   import { useState } from 'react';
   
   export function MyInteractive() {
     const [count, setCount] = useState(0);
     return <button onClick={() => setCount(c => c + 1)}>Count: {count}</button>;
   }
   ```

2. Import in an Astro component with a hydration directive:
   ```astro
   ---
   import { MyInteractive } from '../components/MyInteractive';
   ---
   <MyInteractive client:load />
   ```

### Modifying Design Tokens

Edit `src/styles/global.css`:
```css
:root {
  --color-primary-500: #f59e0b;  /* Change brand color */
  /* ... */
}
```

## 7. Testing

### Unit Tests (Vitest)

```bash
npm test                    # Run all unit tests
npm test -- --watch         # Run in watch mode
```

### E2E Tests (Playwright)

```bash
npm run test:e2e            # Run all E2E tests
npx playwright test --ui    # Open Playwright UI mode
npx playwright show-report  # View last test report
```

### Performance Auditing

```bash
# Build and preview, then run Lighthouse manually
npm run build
npm run preview
# In another terminal:
npx lighthouse http://localhost:4321 --output html
```

## 8. Build & Deployment

### Production Build

```bash
npm run build    # Generates static site in dist/
```

### Deploy to Hostinger VPS (Docker)

Deployment is automatic via GitHub Actions on push to `main`:

1. Docker image built and pushed to GHCR
2. `docker-compose.prod.yml` and `Caddyfile` copied to VPS via SSH
3. `docker compose pull` + `docker compose up -d` executed on VPS
4. Caddy handles SSL automatically via Let's Encrypt

**Required GitHub Secrets:**
- `HOSTINGER_SSH_KEY` — VPS SSH private key
- `HOSTINGER_HOST` — VPS IP address
- `HOSTINGER_USER` — SSH username

## 9. Environment Variables

This project has **no required environment variables**. The site is fully static.

Optional variables (if added later):
- `PUBLIC_ANALYTICS_ID` — Analytics tracking ID (Plausible/Umami)
- `PUBLIC_GITHUB_URL` — GitHub repository URL (default: `https://github.com/borjaberrocal87/share2brain-landing`)

Site-wide external URLs are kept as constants in `src/config/site.ts` (not env vars).
The primary "live demo" CTA links to `DEMO_URL` (`https://demo.share2brain.app/`);
this is an external dependency — that hosted instance must be reachable in production.

## 10. Troubleshooting

### Port Already in Use

If port 4321 is occupied:
```bash
lsof -ti:4321 | xargs kill -9
```

### Build Fails with TypeScript Errors

```bash
npm run type-check    # See detailed type errors
```

### Styles Not Applying

Ensure Tailwind directives are in `src/styles/global.css` and imported in `BaseLayout.astro`.

### React Island Not Hydrating

Check that you're using the correct hydration directive (`client:load`, `client:visible`, `client:idle`).

### Fonts Not Loading

Verify fonts are loaded in `BaseLayout.astro` `<head>` and `font-display: swap` is set.

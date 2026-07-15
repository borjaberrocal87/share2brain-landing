---
description: Frontend development standards for Share2Brain Landing — Astro components, React islands, Tailwind CSS, and static site architecture.
globs: ["src/**/*.{astro,tsx,ts,css}", "src/content/**/*.{md,mdx}"]
alwaysApply: true
---

# Share2Brain Landing — Frontend Standards

## Table of Contents

- [Overview](#overview)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Coding Standards](#coding-standards)
  - [Naming Conventions](#naming-conventions)
  - [Component Conventions](#component-conventions)
  - [Astro Components vs React Islands](#astro-components-vs-react-islands)
- [Styling Standards](#styling-standards)
- [UI/UX Standards](#uiux-standards)
- [SEO Standards](#seo-standards)
- [Performance Standards](#performance-standards)
- [Testing Standards](#testing-standards)
- [Development Workflow](#development-workflow)

---

## Overview

This document defines the frontend standards for the Share2Brain Landing site. The site is built with **Astro 4+** (SSG) with **React islands** for interactive components, **Tailwind CSS** for styling, and **Framer Motion** for animations. It is a **static site** — no server-side rendering at runtime, no database, no authentication.

## Technology Stack

### Core Technologies
- **Astro 4+**: Static site generation, file-based routing, content collections
- **React 18**: Islands for interactive components only
- **TypeScript 5+**: Strict mode, full type coverage

### Styling
- **Tailwind CSS 3+**: Utility-first CSS framework
- **CSS Custom Properties**: Design tokens for colors, typography
- **Dark mode**: Native support via CSS class strategy

### Interactive Components (React Islands)
- **Framer Motion**: Scroll animations, page transitions, micro-interactions
- **Lucide React**: Icon library
- **Syntax highlighting**: For code blocks (Prism or Shiki via Astro)

### Typography
- **Inter**: Body text (legible, modern, free)
- **Space Grotesk**: Headings (techy, modern)
- **JetBrains Mono**: Code blocks (monospace, ligatures)

### Testing
- **Vitest**: Unit testing for utility functions
- **Playwright**: E2E testing for critical user flows
- **Lighthouse CI**: Performance auditing in CI

### Development Tools
- **ESLint**: Linting for TypeScript/Astro
- **Prettier**: Code formatting
- **GitHub Actions**: CI/CD pipeline

## Project Structure

```
share2brain-landing/
├── public/
│   ├── favicon.ico
│   ├── og-image.png           # 1200x630 for social sharing
│   ├── robots.txt
│   └── sitemap.xml
├── src/
│   ├── components/
│   │   ├── Header.astro       # Sticky header with nav
│   │   ├── Hero.astro         # Hero section
│   │   ├── Features.astro     # Feature cards grid
│   │   ├── HowItWorks.astro   # Architecture diagram
│   │   ├── Installation.astro # Quick-start code snippet
│   │   ├── Comparison.astro   # Feature comparison table
│   │   ├── Footer.astro       # Footer with links
│   │   ├── CodeBlock.tsx       # React island — syntax highlighting + copy button
│   │   ├── ThemeToggle.tsx     # React island — dark/light mode toggle
│   │   └── MobileMenu.tsx      # React island — responsive hamburger menu
│   ├── config/
│   │   └── site.ts            # Site-wide constants (e.g. DEMO_URL)
│   ├── layouts/
│   │   └── BaseLayout.astro   # HTML shell, head, fonts, analytics
│   ├── pages/
│   │   ├── index.astro        # Home page (assembles sections)
│   │   ├── docs/
│   │   │   ├── getting-started.md
│   │   │   ├── configuration.md
│   │   │   ├── architecture.md
│   │   │   └── security.md
│   │   └── changelog.astro
│   ├── styles/
│   │   └── global.css         # Tailwind directives + custom properties
│   └── content/
│       └── docs/               # Markdown content collections
├── astro.config.mjs
├── tailwind.config.mjs
├── tsconfig.json
├── package.json
└── README.md
```

## Coding Standards

### Naming Conventions

- **Astro Components**: PascalCase, `.astro` extension (`Header.astro`, `Hero.astro`)
- **React Islands**: PascalCase, `.tsx` extension (`ThemeToggle.tsx`, `CodeBlock.tsx`)
- **Pages**: kebab-case for Markdown (`getting-started.md`), PascalCase for Astro (`changelog.astro`)
- **Utilities**: camelCase (`formatDate.ts`, `slugify.ts`)
- **Styles**: `global.css` for global styles, component-specific styles inline via Tailwind
- **Content Collections**: kebab-case directory names (`docs/`)

### Component Conventions

#### Astro Components (Default)

Use Astro components for everything that does NOT need client-side interactivity:

```astro
---
// Component script (runs at build time)
interface Props {
  title: string;
  description: string;
}

const { title, description } = Astro.props;
---

<section class="py-20">
  <h2 class="text-3xl font-bold font-heading">{title}</h2>
  <p class="text-neutral-400 mt-4">{description}</p>
</section>
```

**When to use Astro components:**
- Static content (text, images, links)
- Layout structure
- SEO meta tags
- Sections that don't respond to user interaction

#### React Islands (When Needed)

Use React islands ONLY for components that require client-side interactivity:

```tsx
// ThemeToggle.tsx — React island
import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

export function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return (
    <button
      onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
      aria-label="Toggle theme"
      className="p-2 rounded-md hover:bg-neutral-800"
    >
      {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
}
```

**When to use React islands:**
- Theme toggle (dark/light mode)
- Code block with copy button
- Mobile hamburger menu
- Any component responding to click/scroll/input events

**Hydration directive:**
```astro
---
import { ThemeToggle } from '../components/ThemeToggle';
---

<!-- client:load = hydrate immediately -->
<ThemeToggle client:load />

<!-- client:visible = hydrate when visible in viewport -->
<CodeBlock client:visible />

<!-- client:idle = hydrate when browser is idle -->
<MobileMenu client:idle />
```

#### Call-to-Action Buttons & External Links

- **Primary vs. secondary:** the primary action uses the amber gradient
  (`linear-gradient(150deg, #FFCB6B, #F5A623)`) with `color: var(--on-accent)`,
  `font-bold`, `rounded-xl` and the primary shadow
  (`0 12px 28px -12px rgba(245,166,35,0.7)`). Secondary actions use the
  `--surface`/`--border-strong` outline style. The primary CTA must be the
  **first** action in its button group. (See the live-demo CTA in `Hero.astro`
  and `CTA.astro`.)
- **External links** (GitHub, live demo) must open safely:
  `target="_blank" rel="noopener noreferrer"` and a descriptive `aria-label`.
  Leading icons are decorative → `aria-hidden="true"`.
- **Localized labels:** render the label server-side from the page `lang`
  (`lang === 'es' ? … : …`), keeping the string in `src/i18n/{es,en}.json` too
  (dual-source copy rule). The `<span data-i18n="...">` wrapper is now only an
  optional authoring marker — language is fixed by the page's URL locale and
  rendered server-side, not swapped at runtime (see the i18n Routing section).
- **Structured localized data is single-sourced in i18n:** repeated, structured
  content (e.g. the documentation groups behind `#docs`) lives **only** in
  `src/i18n/{es,en}.json`, not hard-coded in the component. `Docs.astro` reads
  `translations[lang].docSections` and passes it to the `DocsTabs` island; each
  documentation item has the shape `{ title, description, href }` and renders as
  a two-line entry (title over a muted description) with a persistent
  external-link icon. Every `href` must target the application repository and
  resolve (see `content-accuracy`). Keep ES/EN key parity — the
  `tests/i18n-parity.spec.ts` structural check enforces it.

#### Shared Configuration Constants

Hard-coded external URLs and other site-wide constants that appear in more than
one component live in `src/config/site.ts` (e.g. `DEMO_URL`) and are imported
where needed, so a change is a single edit:

```astro
---
import { DEMO_URL } from '../config/site';
---
<a href={DEMO_URL} target="_blank" rel="noopener noreferrer">…</a>
```

### Styling Standards

#### Tailwind CSS

- Use Tailwind utility classes directly in components
- No custom CSS classes unless absolutely necessary
- Use CSS custom properties for design tokens

```astro
<!-- Good: Tailwind utilities -->
<h1 class="text-4xl font-bold font-heading text-neutral-50">
  Share2Brain — AI Agent for Discord Communities
</h1>

<!-- Avoid: Custom CSS classes -->
<h1 class="hero-title">Share2Brain — AI Agent for Discord Communities</h1>
```

#### Design Tokens (CSS Custom Properties)

Define in `global.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  /* Primary - Honey/Amber (Share2Brain brand) */
  --color-primary-50: #fffbeb;
  --color-primary-500: #f59e0b;
  --color-primary-600: #d97706;
  --color-primary-700: #b45309;

  /* Neutral */
  --color-neutral-50: #fafafa;
  --color-neutral-100: #f5f5f5;
  --color-neutral-900: #171717;

  /* Semantic */
  --color-success: #22c55e;
  --color-error: #ef4444;
  --color-warning: #f59e0b;
}

/* Dark mode (default for developer audience) */
.dark {
  --bg-primary: #0a0a0a;
  --bg-secondary: #171717;
  --text-primary: #fafafa;
  --text-secondary: #a3a3a3;
}
```

#### Typography

```css
/* Headings - Space Grotesk */
.font-heading {
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 700;
}

/* Body - Inter */
body {
  font-family: 'Inter', sans-serif;
  font-weight: 400;
  line-height: 1.6;
}

/* Code - JetBrains Mono */
code, pre {
  font-family: 'JetBrains Mono', monospace;
}
```

## UI/UX Standards

### Design Principles

| Principle | Description |
|-----------|-------------|
| **Developer-first** | Design resonates with developers and sysadmins |
| **Minimal** | No distractions; content is the hero |
| **Fast** | Instant loading; never block rendering |
| **Accessible** | WCAG 2.1 AA minimum |
| **Dark mode** | Native support (developers prefer dark mode) |

### Responsive Design

- **Mobile-first**: Design for mobile, scale up
- **Breakpoints**: `sm` (640px), `md` (768px), `lg` (1024px), `xl` (1280px), plus a
  custom `nav` (821px) screen (see below)
- **Touch targets**: Minimum 44x44px for interactive elements
- **Hamburger menu**: Mobile navigation via React island
- **Supported widths**: the layout MUST produce no horizontal overflow or clipped
  content at 320, 375, 414, 768, 820, 1024, and 1440 px.

#### Canonical navigation breakpoint (`nav`, 821px)

The desktop nav / hamburger switch happens at a **single** breakpoint, the custom
Tailwind `nav` screen (`screens: { nav: '821px' }` in `tailwind.config.mjs`). The
localized nav (logo + 5 items + language/theme toggles) does not fit below ~821px,
so `md` (768px) is not used for this switch. Drive both controls from the same
screen — `Header.astro` desktop nav uses `hidden nav:flex`, `MobileMenu.tsx` wrapper
uses `nav:hidden`. **Never** re-add competing `@media` rules in `global.css` for this
switch — a second breakpoint on the same elements creates a dead-zone where neither
control renders.

#### Grid fallback rule (avoid clipped cards)

`auto-fit` card grids MUST include an explicit single-column fallback below `md`:

```astro
<!-- Good: 1 column on phones, auto-fit from md up -->
<div class="grid grid-cols-1 md:grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-4">
```

Without the `grid-cols-1 md:` prefix, `minmax(Npx,1fr)` forces a track wider than a
narrow viewport and the card overflows/clips. This is doubly important for grids
with auto horizontal margins (`mx-auto`), which cancel flex `align-items: stretch`
and let the grid shrink-to-fit to its (wide) max-content. Reference implementation:
`Hero.astro`.

#### Anchor scroll offset

The sticky header height is a single token, `--header-h` (in `global.css :root`),
consumed by the header sizing (`h-[var(--header-h)]`) and by
`html { scroll-padding-top: var(--header-h) }`. This keeps in-page anchor targets
clear of the sticky header. Keep both tied to the token so they cannot drift.

#### No page-level overflow masking

Do **not** use page-level `overflow-x: hidden` / `max-width: 100vw` (on `html`,
`body`, or `<main>`) to hide horizontal overflow — it silently clips real content
("cut-off modules") and defeats the overflow tests. Fix the overflow **source**
instead. Off-canvas UI (e.g. the mobile drawer) may be clipped **locally** by its
own viewport-sized container (`overflow-x-hidden`), which is scoped and legitimate.
Size that container from the **viewport** (`h-[calc(100vh-var(--header-h))]`,
`w-screen`), not with `inset-0`/`bottom-0`: the header's `backdrop-filter` makes
it the containing block for `position: fixed` descendants, so viewport-relative
sizing is required. A closed off-canvas drawer MUST be `inert` (not just
`aria-hidden`, which would leave its links keyboard-focusable — an
`aria-hidden-focus` violation).

Responsive/overflow **tests** must assert per-element `getBoundingClientRect().right`
against the viewport (not `scrollWidth`, which `overflow-x: hidden` clamps) and
assert the page containers don't re-introduce the mask — otherwise the test can
pass while content is clipped.

### Accessibility

- **Semantic HTML**: `<nav>`, `<main>`, `<article>`, `<section>`, `<header>`, `<footer>`
- **ARIA labels**: For interactive elements without visible text
- **Keyboard navigation**: All interactive elements reachable via Tab
- **Focus visible**: Visible focus indicators on all focusable elements
- **Color contrast**: WCAG AA minimum (4.5:1 for normal text)
- **Skip-to-content link**: First element in `<body>`

```astro
<a href="#main-content" class="sr-only focus:not-sr-only focus:absolute focus:z-50">
  Skip to content
</a>
```

### Dark Mode

- **Default**: Dark mode (developers prefer it)
- **Toggle**: ThemeToggle React island in header
- **Persistence**: localStorage preference
- **System preference**: Respect `prefers-color-scheme` on first visit

## Internationalization (i18n) Routing

Each language is served from its **own static URL** so search engines index every
locale independently:

- **Spanish (default)** at `/`, **English** at `/en/`. Configured via Astro's
  `i18n` (`defaultLocale: 'es'`, `locales: ['es', 'en']`,
  `routing.prefixDefaultLocale: false`) in `astro.config.mjs`.
- Both pages are thin wrappers (`src/pages/index.astro`, `src/pages/en/index.astro`)
  over a shared `LandingPage.astro` that takes `lang` and renders every section
  server-side in that language. A page is **fully localized in its server HTML**
  (crawlable with JavaScript disabled) — there is no client-side language swap.
- **Language selection is by URL, not a runtime toggle.** `LanguageToggle` renders
  navigation links to each locale's page (via `localeAlternates()` in
  `src/i18n/routing.ts`) and preserves the current section anchor.
- Interactive islands (`DocsTabs`, `HowItWorksLoop`) receive the active `lang` as a
  server prop and render that locale — they do **not** subscribe to a runtime
  language-change event.
- Adding a locale: add it to the Astro `i18n` config and the sitemap `i18n` map,
  add a `src/pages/<locale>/index.astro` wrapper, and a matching `src/i18n/<locale>.json`
  (keep key parity — `tests/i18n-parity.spec.ts` enforces structure).

## SEO Standards

### Meta Tags

Per-locale metadata is emitted by `BaseLayout.astro` from its `lang` prop: a
self-referential `canonical`, reciprocal `hreflang` alternates (`es`, `en`,
`x-default`), a matching `og:locale`, and a localized `<title>`/`description`
sourced from `meta` in `src/i18n/{es,en}.json`.

```astro
---
const title = "Share2Brain — AI Agent for Discord Communities";
const description = "Index your Discord community knowledge and answer questions automatically with verifiable sources.";
const image = "/og-image.png";
---

<head>
  <title>{title}</title>
  <meta name="description" content={description} />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:image" content={image} />
  <meta property="og:type" content="website" />
  <meta name="twitter:card" content="summary_large_image" />
  <link rel="canonical" href={Astro.url.href} />
</head>
```

### Structured Data

```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Share2Brain",
  "description": "AI Agent for Discord Communities",
  "applicationCategory": "DeveloperApplication",
  "operatingSystem": "Linux, Docker",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  }
}
```

### SEO Checklist

- [ ] Meta tags optimized (title, description, OG tags)
- [ ] Schema.org JSON-LD for SoftwareApplication
- [ ] Sitemap generated automatically (`sitemap-index.xml` via `@astrojs/sitemap`, with per-locale `hreflang` alternates)
- [ ] `robots.txt` references `sitemap-index.xml`
- [ ] Self-referential canonical URLs per locale
- [ ] Reciprocal `hreflang` alternates (`es`, `en`, `x-default`) on every locale page
- [ ] Images with alt text
- [ ] Heading hierarchy correct (h1 → h2 → h3)
- [ ] No orphan pages

## Performance Standards

### Core Web Vitals Targets

| Metric | Target |
|--------|--------|
| Lighthouse Performance | ≥ 95 |
| First Contentful Paint | < 1s |
| Largest Contentful Paint | < 2.5s |
| Cumulative Layout Shift | < 0.1 |
| Time to Interactive | < 2s |

### Optimization Checklist

- [ ] Images optimized (WebP/AVIF, proper `width`/`height`)
- [ ] Lazy loading for below-the-fold images
- [ ] Fonts self-hosted with `font-display: swap`
- [ ] Tailwind purges unused CSS in production
- [ ] Minimal JavaScript (only React island bundles)
- [ ] Preload critical assets (fonts, hero image)
- [ ] No render-blocking resources

### Image Optimization

```astro
<!-- Use Astro's built-in Image component -->
---
import { Image } from 'astro:assets';
import heroImage from '../assets/hero.png';
---

<Image
  src={heroImage}
  alt="Share2Brain architecture diagram"
  width={800}
  height={400}
  loading="lazy"
  format="webp"
/>
```

## Testing Standards

### Unit Testing (Vitest)

Test utility functions and pure logic:

```typescript
// tests/utils/slugify.test.ts
import { describe, it, expect } from 'vitest';
import { slugify } from '../../src/utils/slugify';

describe('slugify', () => {
  it('should convert string to URL-safe slug', () => {
    expect(slugify('Hello World')).toBe('hello-world');
  });

  it('should handle special characters', () => {
    expect(slugify('Share2Brain & Friends!')).toBe('share2brain-friends');
  });
});
```

### E2E Testing (Playwright)

Test critical user flows:

```typescript
// tests/e2e/landing.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Landing Page', () => {
  test('should load hero section with correct heading', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('Share2Brain');
  });

  test('should toggle dark mode', async ({ page }) => {
    await page.goto('/');
    await page.click('[data-testid="theme-toggle"]');
    await expect(page.documentElement).toHaveClass(/light/);
  });

  test('should navigate to docs', async ({ page }) => {
    await page.goto('/');
    await page.click('a[href="/docs/getting-started"]');
    await expect(page).toHaveURL('/docs/getting-started');
  });
});
```

### Lighthouse CI

```json
// lighthouserc.json
{
  "ci": {
    "collect": {
      "url": ["http://localhost:4321"],
      "numberOfRuns": 1
    },
    "assert": {
      "assertions": {
        "categories:performance": ["error", { "minScore": 0.95 }],
        "categories:accessibility": ["error", { "minScore": 0.95 }],
        "categories:seo": ["error", { "minScore": 1.0 }]
      }
    }
  }
}
```

## Development Workflow

### Development Scripts

```bash
npm run dev          # Start Astro dev server (http://localhost:4321)
npm run build        # Production build → dist/
npm run preview      # Preview production build locally
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
npm test             # Run Vitest unit tests
npm run test:e2e     # Run Playwright E2E tests
```

### Git Workflow

- **Feature Branches**: `feature/<ticket-id>-description`
- **Descriptive Commits**: Conventional commits format
- **Code Review**: Required before merge
- **Small PRs**: Focused, reviewable changes

### Code Quality

- **ESLint**: Run before commits (enforced via pre-commit hooks)
- **TypeScript**: Ensure compilation without errors
- **Prettier**: Consistent formatting
- **Lighthouse**: Run performance audits before major releases

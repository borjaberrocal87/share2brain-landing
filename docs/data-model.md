# Share2Brain Landing — Data Model

This document describes the content model for the Share2Brain Landing site. Since this is a **static Astro site**, there is no database. The "data model" here defines the **content architecture**: pages, sections, content collections, and navigation structure.

## Content Architecture Overview

Share2Brain Landing uses Astro's **file-based routing** and **content collections** for its data model. All content is defined in source files and rendered at build time.

```
Content Sources:
├── src/pages/           # File-based routes (Astro pages)
├── src/content/docs/    # Markdown documentation pages
├── src/components/      # Reusable section components
└── public/              # Static assets (images, favicon, robots.txt)
```

## Page Model

### Home Page (`/`)

The home page assembles multiple sections into a single page:

| Section | Component | Content |
|---------|-----------|---------|
| **Hero** | `Hero.astro` | Title, subtitle, primary CTA ("Get Started"), secondary CTA ("View on GitHub"), visual |
| **Features** | `Features.astro` | 6 feature cards with icon, title, description |
| **How It Works** | `HowItWorks.astro` | Architecture diagram showing Discord → Bot → pgvector → Web |
| **Installation** | `Installation.astro` | Quick-start code snippet with syntax highlighting |
| **Comparison** | `Comparison.astro` | Feature comparison table (Share2Brain vs Custom Bot vs SaaS) |
| **Footer** | `Footer.astro` | Links (GitHub, Docs, Discord, License) |

### Documentation Pages (`/docs/*`)

Documentation pages use Astro's content collections with Markdown:

```yaml
# Frontmatter for each docs page
---
title: "Getting Started"
description: "Quick-start guide for installing Share2Brain"
order: 1
---
```

| Route | Content | Description |
|-------|---------|-------------|
| `/docs/getting-started` | `getting-started.md` | Installation, configuration, first run |
| `/docs/configuration` | `configuration.md` | Reference for `share2brain.config.yml` |
| `/docs/architecture` | `architecture.md` | System architecture, data flow, components |
| `/docs/security` | `security.md` | Security model, data privacy, self-hosting |

### Other Pages

| Route | Component | Content |
|-------|-----------|---------|
| `/changelog` | `changelog.astro` | Release notes and version history |

## Feature Model

Each feature displayed on the landing page has:

| Field | Type | Description |
|-------|------|-------------|
| `icon` | Lucide icon name | Visual identifier |
| `title` | string | Feature name (e.g., "Auto-indexing") |
| `description` | string | Brief explanation (1-2 sentences) |

### Feature Set

| Feature | Icon | Description |
|---------|------|-------------|
| Auto-indexing | `Database` | Reads messages from selected Discord channels automatically |
| RAG Responses | `MessageSquare` | Answers with verifiable sources (channel, author, date) |
| Self-hosted | `Server` | Your data never leaves your infrastructure |
| YAML Config | `FileCode` | Configuration as code, Git-friendly |
| Read Tracking | `BookCheck` | Each member knows what they've read and what's missing |
| Telegram Alerts | `Bell` | Notifications for indexing progress and errors |

## Comparison Model

The comparison table on the home page:

| Column | Type | Description |
|--------|------|-------------|
| `feature` | string | Feature name |
| `share2brain` | string | Share2Brain support (✅, ❌, Partial) |
| `customBot` | string | Custom bot support |
| `saas` | string | SaaS solution support |

### Comparison Entries

| Feature | Share2Brain | Custom Bot | SaaS |
|---------|----------|------------|------|
| Self-hosted | ✅ | ✅ | ❌ |
| Auto-indexing | ✅ | ❌ | ✅ |
| RAG with citations | ✅ | ❌ | Partial |
| Open source | ✅ | N/A | ❌ |
| Data privacy | ✅ | ✅ | ❌ |
| Cost | Free | Dev time | Monthly fee |

## Navigation Model

### Header Navigation

| Label | Target | Type |
|-------|--------|------|
| Logo | `/` | Link |
| Features | `/#features` | Anchor link |
| Docs | `/docs/getting-started` | Page link |
| GitHub | `https://github.com/borjaberrocal87/share2brain-landing` | External link |
| Theme Toggle | — | React island (ThemeToggle) |

### Footer Navigation

| Section | Links |
|---------|-------|
| Product | GitHub, Discord, Changelog |
| Documentation | Getting Started, Configuration, Architecture, Security |
| Legal | MIT License |

### Mobile Navigation

- Hamburger menu (React island: `MobileMenu.tsx`)
- Same links as header, stacked vertically
- Closes on link click or outside click

## Static Assets Model

| Asset | Path | Purpose |
|-------|------|---------|
| `favicon.ico` | `public/favicon.ico` | Browser tab icon |
| `og-image.png` | `public/og-image.png` | Social sharing image (1200x630) |
| `robots.txt` | `public/robots.txt` | Search engine directives |
| `sitemap.xml` | `public/sitemap.xml` | Auto-generated sitemap |

## Content Collections (Astro)

### `docs` Collection

```typescript
// src/content/config.ts
import { defineCollection, z } from 'astro:content';

const docsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    order: z.number().optional(),
  }),
});

export const collections = {
  docs: docsCollection,
};
```

### Usage in Pages

```astro
---
import { getCollection } from 'astro:content';
import DocsLayout from '../layouts/DocsLayout.astro';

const docs = await getCollection('docs');
const sortedDocs = docs.sort((a, b) => 
  (a.data.order ?? 99) - (b.data.order ?? 99)
);
---

<DocsLayout>
  {sortedDocs.map(doc => (
    <article>
      <h2>{doc.data.title}</h2>
      <Content />
    </article>
  ))}
</DocsLayout>
```

## Key Design Principles

1. **Content as Code**: All content lives in the Git repository — version controlled, reviewable, and reversible.
2. **Build-Time Rendering**: All pages are pre-rendered at build time for maximum performance and SEO.
3. **Component-Based Sections**: Each page section is an independent Astro component, composable and reusable.
4. **Minimal JavaScript**: Only React islands ship client-side JS — the rest is pure HTML/CSS.
5. **Progressive Enhancement**: The site works without JavaScript; islands add interactivity on top.

## Notes

- No database, no ORM, no migrations — content is in source files
- No authentication — all content is public
- No API endpoints — everything is static HTML
- SEO is a first-class concern (meta tags, structured data, sitemap)
- Dark mode is the default (developer audience preference)

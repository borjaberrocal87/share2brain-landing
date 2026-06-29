## Why

Hivly needs a professional landing page to communicate its value proposition to potential users. The current project has the infrastructure (Astro, Tailwind, React) but lacks the actual landing page implementation. A well-designed landing page will:
- Increase organic traffic through SEO optimization
- Convert visitors into GitHub stars and users
- Provide clear documentation for operators deploying the self-hosted solution
- Establish brand identity with consistent design language

## What Changes

- **New Landing Page**: Complete single-page landing site with 10 sections (Header, Hero, Value Props, How it Works, Use Cases, Installation, Docs, Stack + Architecture, CTA, Footer)
- **Multi-language Support**: ES/EN language toggle with full i18n system
- **Theme System**: Dark/light mode with CSS variables and persistence
- **Interactive Components**: React islands for ThemeToggle, LanguageToggle, HowItWorksLoop, DocsTabs, CodeBlock
- **Design System**: Implementation of Claude Design specification with hexagonal icons, Space Grotesk/IBM Plex typography, and amber accent color
- **SEO Optimization**: Meta tags, JSON-LD structured data, sitemap, robots.txt
- **Performance**: Static site generation with Lighthouse score ≥ 95

## Capabilities

### New Capabilities

- `landing-page-core`: Main landing page structure with all sections, responsive layout, and navigation
- `theme-system`: Dark/light mode toggle with CSS variables and user preference persistence
- `i18n-support`: Multi-language system with ES/EN translations and language toggle
- `interactive-islands`: React components for interactive features (HowItWorksLoop, DocsTabs, CodeBlock)
- `seo-optimization`: Meta tags, JSON-LD, sitemap, robots.txt, and social sharing
- `design-tokens`: CSS variables, typography system, color palette, and spacing

### Modified Capabilities

None (this is a new implementation)

## Impact

### Code Changes

- **New Components**: 10 Astro components + 5 React islands
- **Modified Files**: `BaseLayout.astro`, `index.astro`, `global.css`, `tailwind.config.mjs`
- **New Files**: i18n system, design tokens, updated component structure

### Dependencies

- **Fonts**: Google Fonts (Space Grotesk, IBM Plex Sans, IBM Plex Mono)
- **Icons**: Lucide React (existing)
- **Animations**: Framer Motion (existing)
- **Build**: Astro SSG, Tailwind CSS (existing)

### Systems Affected

- **Frontend**: Complete landing page implementation
- **Build Pipeline**: No changes (existing Astro build)
- **Deployment**: Cloudflare Pages (existing configuration)

### Performance Impact

- **Bundle Size**: Minimal increase (React islands only for interactive features)
- **Build Time**: Slight increase due to component compilation
- **Runtime**: No impact (static site, no backend calls)

### Breaking Changes

None (new implementation, no existing landing page)

## Success Criteria

1. **Visual Fidelity**: Landing page matches Claude Design specification within 5% visual tolerance
2. **Responsive Design**: Works on mobile (375px), tablet (768px), and desktop (1440px)
3. **Theme Support**: Dark/light mode toggle works correctly with persistence
4. **Language Support**: ES/EN toggle updates all text content
5. **Performance**: Lighthouse score ≥ 95
6. **Accessibility**: WCAG 2.1 AA compliance
7. **SEO**: Meta tags, JSON-LD, sitemap configured
8. **Build**: Successful build and deployment to Cloudflare Pages

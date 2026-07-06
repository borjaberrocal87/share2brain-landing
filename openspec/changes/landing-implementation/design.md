## Context

Chat2Brain is an open-source AI agent for Discord communities that indexes knowledge and answers questions with verifiable sources. The project needs a professional landing page to communicate its value proposition, documented in `context/design/design.html` (Claude Design specification).

**Current State:**
- Project has Astro + React + Tailwind infrastructure configured
- No landing page implementation exists
- Design specification available in Claude Design format
- PRD documented in `context/PRD.md`

**Constraints:**
- Static site only (no backend, database, or authentication)
- Must achieve Lighthouse score ≥ 95
- Must support dark/light mode and ES/EN languages
- Must match Claude Design specification within 5% visual tolerance
- Hosting on Cloudflare Pages

**Stakeholders:**
- Developers evaluating Chat2Brain for their Discord communities
- System administrators deploying the self-hosted solution
- Contributors interested in the open-source project

## Goals / Non-Goals

**Goals:**
- Implement complete landing page with 10 sections matching Claude Design
- Achieve responsive design across mobile (375px), tablet (768px), desktop (1440px)
- Implement dark/light mode with CSS variables and persistence
- Implement ES/EN language toggle with full i18n system
- Optimize for SEO with meta tags, JSON-LD, sitemap
- Maintain Lighthouse Performance ≥ 95
- Ensure WCAG 2.1 AA accessibility compliance

**Non-Goals:**
- Backend API implementation (static site only)
- User authentication or dashboard
- Blog functionality (future phase)
- Multi-language support beyond ES/EN
- Interactive demos or animations beyond Framer Motion basics
- Analytics integration (can be added post-launch)

## Decisions

### Decision 1: Component Architecture

**Choice:** Astro components for static sections + React islands for interactive features

**Rationale:**
- Astro components render at build time, minimizing JavaScript bundle
- React islands only load for interactive features (ThemeToggle, HowItWorksLoop, etc.)
- Aligns with existing project architecture
- Optimizes for performance (Lighthouse ≥ 95)

**Alternatives Considered:**
- Full React SPA: Rejected due to performance impact and unnecessary complexity
- Pure Astro without React: Rejected because interactive features require state management

### Decision 2: Styling Approach

**Choice:** CSS variables for design tokens + Tailwind CSS for utility classes

**Rationale:**
- CSS variables enable dynamic theming (dark/light mode)
- Tailwind provides rapid development with utility-first approach
- Design tokens from Claude Design can be directly mapped to CSS variables
- Maintains consistency across components

**Alternatives Considered:**
- Styled Components: Rejected due to runtime overhead and SSR complexity
- CSS Modules: Rejected because CSS variables are needed for theming
- Pure Tailwind without CSS variables: Rejected because dynamic theming requires CSS variables

### Decision 3: Internationalization (i18n)

**Choice:** Custom i18n system with TypeScript translations

**Rationale:**
- Lightweight solution for two languages (ES/EN)
- No external dependencies needed
- Type-safe translations with TypeScript
- Easy to maintain and extend

**Alternatives Considered:**
- i18next: Rejected as overkill for two languages
- Astro i18n: Considered but custom solution provides more control
- Static translation objects: Chosen for simplicity and type safety

### Decision 4: Theme System

**Choice:** CSS variables with `prefers-color-scheme` detection and localStorage persistence

**Rationale:**
- Respects user's system preference by default
- Allows manual override with persistence
- CSS variables enable instant theme switching
- No flash of unstyled content (FOUC) with proper implementation

**Alternatives Considered:**
- Class-based theming: Rejected because CSS variables provide better maintainability
- Server-side theme detection: Not applicable for static site

### Decision 5: Typography

**Choice:** Google Fonts with Space Grotesk (headings), IBM Plex Sans (body), IBM Plex Mono (code)

**Rationale:**
- Matches Claude Design specification exactly
- Space Grotesk provides techy, modern feel for headings
- IBM Plex Sans offers excellent readability for body text
- IBM Plex Mono ensures code blocks are legible
- All fonts are free and open-source

**Alternatives Considered:**
- Inter + JetBrains Mono: Rejected because design spec uses IBM Plex family
- Self-hosted fonts: Considered but Google Fonts provides CDN performance

### Decision 6: Component Structure

**Choice:** Flat component structure with clear separation of concerns

**Rationale:**
- 10 Astro components for static sections
- 5 React islands for interactive features
- Clear naming convention (PascalCase for components)
- Easy to locate and maintain

**Alternatives Considered:**
- Nested component hierarchy: Rejected as unnecessary for this project size
- Feature-based organization: Considered but flat structure is simpler

## Risks / Trade-offs

### Risk 1: Design Fidelity
**Risk:** Claude Design specification uses custom template syntax that may not translate perfectly to Astro/React
**Mitigation:** 
- Manual review of each section against design
- Use CSS variables to match exact colors and spacing
- Test on multiple devices and browsers

### Risk 2: Performance Impact
**Risk:** Multiple React islands could impact bundle size and performance
**Mitigation:**
- Lazy load React islands only when needed
- Use dynamic imports for interactive components
- Monitor bundle size and Lighthouse scores

### Risk 3: Theme Flash (FOUC)
**Risk:** Theme toggle may cause flash of unstyled content on page load
**Mitigation:**
- Implement theme detection in `<head>` before render
- Use inline script to set initial theme
- Test on slow connections

### Risk 4: i18n Complexity
**Risk:** Custom i18n system may have edge cases or maintenance overhead
**Mitigation:**
- Keep translations simple and type-safe
- Document i18n system clearly
- Consider external library if complexity grows

### Risk 5: Responsive Design
**Risk:** Complex layouts may not work perfectly across all breakpoints
**Mitigation:**
- Mobile-first approach
- Test on real devices
- Use Tailwind's responsive utilities
- Implement graceful degradation

## Migration Plan

### Phase 1: Setup (Day 1)
1. Configure Tailwind with design tokens from CSS variables
2. Set up i18n system with ES/EN translations
3. Create base layout with theme support

### Phase 2: Core Components (Days 2-3)
1. Implement Header with navigation and theme toggle
2. Implement Hero section with terminal code block
3. Implement Value Props section with hexagonal icons

### Phase 3: Interactive Features (Days 3-4)
1. Implement HowItWorksLoop with step selection
2. Implement DocsTabs with tab navigation
3. Implement CodeBlock with syntax highlighting

### Phase 4: Remaining Sections (Days 4-5)
1. Implement UseCases, Installation, StackArch sections
2. Implement CTA and Footer sections
3. Add animations with Framer Motion

### Phase 5: Polish & Deploy (Day 5-6)
1. SEO optimization (meta tags, JSON-LD, sitemap)
2. Accessibility audit and fixes
3. Performance optimization
4. Deploy to Cloudflare Pages

### Rollback Strategy
- Keep existing project structure intact
- New components can be removed without affecting other pages
- Git branches for feature development
- Cloudflare Pages supports instant rollback

## Open Questions

1. **Analytics Integration:** Should we add Plausible/Umami analytics in this phase or post-launch?
   - **Recommendation:** Post-launch to avoid scope creep

2. **Error Tracking:** Should we integrate Sentry for error tracking?
   - **Recommendation:** Post-launch, as this is a static site with minimal runtime errors

3. **Documentation Pages:** Should we implement the /docs pages in this change or as a separate change?
   - **Recommendation:** Separate change to keep this focused on the landing page

4. **Framer Motion Animations:** How extensive should animations be?
   - **Recommendation:** Minimal fade-in on scroll, keep performance as priority

5. **Mobile Menu:** Should we implement a hamburger menu for mobile?
   - **Recommendation:** Yes, but keep it simple with slide-in panel

## Technical Specifications

### CSS Variables Structure
```css
:root {
  /* Light mode */
  --bg: #F4F5F7;
  --surface: #FFFFFF;
  --text: #1B1F27;
  --accent: #F5A623;
  /* ... full token set */
}

[data-theme="dark"] {
  --bg: #0E1116;
  --surface: #161B22;
  --text: #E6E9EF;
  --accent: #F5A623;
  /* ... full token set */
}
```

### Component Interface
```typescript
// Astro components receive props from i18n system
interface SectionProps {
  lang: 'es' | 'en';
  translations: Translations;
}

// React islands receive state management
interface ThemeToggleProps {
  initialTheme: 'light' | 'dark';
  onThemeChange: (theme: 'light' | 'dark') => void;
}
```

### Build Configuration
```javascript
// astro.config.mjs
export default defineConfig({
  site: 'https://chat2brain.app',
  vite: {
    ssr: {
      noExternal: ['lucide-react'],
    },
  },
});
```

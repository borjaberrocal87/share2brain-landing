## 0. Feature Branch (MUST BE FIRST)

- [x] 0.1 Create and switch to feature branch `feature/add-localized-routing` from `main`

## 1. Dependencies and Astro i18n Config

- [x] 1.1 Add `@astrojs/sitemap` to `package.json` dependencies and run `npm install`
- [x] 1.2 Add Astro i18n config to `astro.config.mjs`: `i18n: { defaultLocale: 'es', locales: ['es', 'en'], routing: { prefixDefaultLocale: false } }`
- [x] 1.3 Register and configure the `@astrojs/sitemap` integration with matching i18n options (`defaultLocale: 'es'`, `locales: { es: 'es', en: 'en' }`) so alternates are emitted
- [x] 1.4 Verify `astro build` still succeeds and `dist/` contains `sitemap-index.xml`/`sitemap-0.xml`

## 2. i18n Routing Helpers

- [x] 2.1 Add a routing helper module (e.g. `src/i18n/routing.ts`) exposing the supported locales, the localized-path helper (wrapping Astro's `getRelativeLocaleUrl`), and the alternate-URL map for a given path
- [x] 2.2 Add a per-locale meta resolver returning localized `title` and `description` from `src/i18n/{es,en}.json` for the landing page
- [x] 2.3 Ensure `src/i18n/{es,en}.json` contain the localized `title`/`description` keys used by 2.2 (add if missing), keeping key parity

## 3. Locale-Aware BaseLayout (SEO)

- [x] 3.1 Add a `lang: 'es' | 'en'` prop to `BaseLayout.astro` and set `<html lang={lang}>`
- [x] 3.2 Render localized `<title>` and meta `description` per locale
- [x] 3.3 Emit a self-referential per-locale `canonical` (`Astro.site` + locale path)
- [x] 3.4 Emit reciprocal `hreflang` alternate links for `es`, `en`, and `x-default` (x-default → default locale)
- [x] 3.5 Set `og:locale` to the page locale and `og:locale:alternate` to the other locale
- [x] 3.6 Localize the JSON-LD `url` (and `softwareHelp.url` if locale-specific) to the page's own URL
- [x] 3.7 Remove the language line from the inline theme script and remove the i18n-swap `<script>` from the body

## 4. Shared Landing Component and Per-Locale Pages

- [x] 4.1 Extract the landing body from `src/pages/index.astro` into a shared component (e.g. `src/components/LandingPage.astro`) that accepts `lang` and renders all sections + `BaseLayout`
- [x] 4.2 Make `src/pages/index.astro` a thin page rendering the shared component with `lang="es"`
- [x] 4.3 Create `src/pages/en/index.astro` as a thin page rendering the shared component with `lang="en"`
- [x] 4.4 Verify `astro build` produces both `/` and `/en/` in `dist/`

## 5. Server-Side Localized Rendering in Components

- [x] 5.1 Update content sections (`Hero`, `ValueProps`, `Features`, `HowItWorks`, `UseCases`, `Installation`, `Docs`, `StackArch`, `CTA`, `Footer`, `Header`) to render copy from `translations[lang]` server-side for the page locale
- [x] 5.2 Keep `src/i18n/{es,en}.json` as the single source of truth for structured data (`docSections`, etc.); no duplicated copy in components
- [x] 5.3 Confirm the rendered HTML for each locale contains fully localized visible copy (verified with JS disabled in Step 11)

## 6. Islands Select Language from Server Prop

- [x] 6.1 Update `DocsTabs.tsx` and `HowItWorksLoop.tsx` to take the active language via prop and select copy from it (no event subscription)
- [x] 6.2 Pass `lang` to the islands from their host Astro components
- [x] 6.3 Simplify or remove `src/i18n/useLanguage.ts` (language now flows from server props)
- [x] 6.4 Remove `src/scripts/i18n-client.ts` and any references to it and to the `s2b:languagechange` event

## 7. Language Toggle as Navigation

- [x] 7.1 Convert `LanguageToggle.tsx` to render accessible `<a>` links to the equivalent page in each locale (computed via the routing helper)
- [x] 7.2 Preserve the current in-page section anchor (`location.hash`) when building the destination URL
- [x] 7.3 Mark the active locale with `aria-current`/`aria-pressed` and keep keyboard accessibility
- [x] 7.4 Update `Header.astro` to pass the current `lang` to `LanguageToggle`

## 8. Sitemap and robots

- [x] 8.1 Confirm the generated sitemap lists `/` and `/en/` with correct `hreflang` alternates
- [x] 8.2 Add or update `public/robots.txt` with a `Sitemap:` directive pointing to the generated sitemap

## 9. Review and Update Existing Tests (MANDATORY)

- [x] 9.1 Update `tests/i18n-parity.spec.ts` for the new per-locale key structure (e.g. `title`/`description`) and remove assertions tied to the runtime swap
- [x] 9.2 Update `tests/design-compliance.spec.ts` to cover both `/` and `/en/` where it currently assumes a single URL
- [x] 9.3 Add e2e coverage: for each locale assert visible localized content, `<html lang>`, self-referential `canonical`, reciprocal `hreflang` (incl. `x-default`), and that the toggle navigates to the other locale preserving the section anchor
- [x] 9.4 Add a JavaScript-disabled (crawler-view) assertion that each locale page renders fully localized content without hydration

## 10. Run Tests and Verify Build (MANDATORY) — AGENT MUST EXECUTE

- [x] 10.1 Run `npm ci` to ensure a clean dependency install
- [x] 10.2 Run the targeted/updated specs first (`npx playwright test tests/i18n-parity.spec.ts` and the new localized-routing spec) and confirm they pass
- [x] 10.3 Run the full Playwright suite (`npx playwright test`) and record passed/failed/skipped counts and runtime
- [x] 10.4 Run `npm run build` and confirm it completes without errors and `dist/` contains `/`, `/en/`, and the sitemap
- [x] 10.5 Create a report at `specs/add-localized-routing/reports/YYYY-MM-DD-step-10-test-and-build-verification.md` with commands, results, and build-output verification

## 11. Manual Visual/Functional Testing (MANDATORY) — AGENT MUST EXECUTE

- [x] 11.1 Start the dev server (`npm run dev`) and verify the site loads at `http://localhost:4321`
- [x] 11.2 Verify `/` renders fully in Spanish and `/en/` fully in English, including islands (docs tabs, how-it-works loop), with correct layout, dark/light mode, and responsive behavior
- [x] 11.3 Verify the language toggle navigates `/ ↔ /en/` and preserves the active section anchor (e.g. from `#docs`)
- [x] 11.4 Load each locale with JavaScript disabled and confirm the visible copy is fully in that locale (no post-load language change)
- [x] 11.5 Inspect each page's head for correct `<html lang>`, `canonical`, `hreflang`/`x-default`, `og:locale`, and localized `<title>`/`description`; confirm no broken links and correct heading hierarchy
- [x] 11.6 Document findings in a report under `specs/add-localized-routing/reports/`

## 12. E2E Testing with Playwright MCP (MANDATORY) — AGENT MUST EXECUTE

- [x] 12.1 Ensure the dev server is running and navigate to `/` and `/en/` via Playwright MCP
- [x] 12.2 Execute the language-switch workflow (toggle → other locale, anchor preserved) and the docs-tabs/how-it-works interactions in both locales
- [x] 12.3 Test the 404 / unknown-locale path behavior and confirm no broken navigation
- [x] 12.4 Document test scenarios and outcomes in the reports folder

## 13. Update Technical Documentation (MANDATORY)

- [x] 13.1 Update `docs/frontend-standards.md` (i18n/SEO sections) to describe per-locale routing, the toggle-as-navigation model, and removal of the runtime swap
- [x] 13.2 Update `docs/data-model.md` page model to list the `/` (es) and `/en/` (en) routes
- [x] 13.3 Update `docs/development_guide.md` / `docs/backend-standards.md` if the build output, sitemap, or deploy notes changed
- [x] 13.4 Note the Google Search Console sitemap resubmission step for `/en/` discovery

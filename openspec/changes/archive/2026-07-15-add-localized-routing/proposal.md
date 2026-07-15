## Why

Each language currently lives at a single URL (`/`), server-rendered in Spanish, with English produced only client-side by swapping `[data-i18n]` text after JavaScript runs. Search engines therefore index only the Spanish content and never see a distinct, crawlable English page — the English variant has no URL, no ranking, and cannot be linked or shared. To be indexed correctly, each language needs its own statically rendered URL with reciprocal `hreflang`/canonical metadata.

## What Changes

- Introduce per-locale URLs served as static HTML: `/` (Spanish, default) and `/en/` (English). Each URL is fully server-rendered in its language so crawlers see localized content with JavaScript disabled.
- Convert the language selector from an in-place runtime swap into navigation: the toggle becomes a link to the equivalent page in the other locale, preserving the current section anchor.
- **BREAKING** Remove the client-side runtime language swap (`src/scripts/i18n-client.ts`, the `s2b:languagechange` event, and the in-place `[data-i18n]` text replacement as the mechanism for switching language). Language is now selected by URL at build time. `[data-i18n]` markers may remain as authoring hints but are no longer the switching mechanism.
- React islands select their language from a server-provided prop instead of subscribing to a runtime language-change event.
- Add reciprocal SEO metadata per page: `<html lang>`, per-locale `<title>`/`description`, per-locale `canonical`, `hreflang` alternates (`es`, `en`, `x-default`), and per-locale `og:locale`.
- Generate `sitemap.xml` (with locale alternates) and reference it from `robots.txt`.
- `/` remains deterministically Spanish — no server-side or automatic language redirect (avoids crawler ambiguity). Client-side language auto-suggestion is explicitly out of scope for this change.

## Capabilities

### New Capabilities
- `localized-routing`: Per-locale static URLs for the landing page, server-rendered localized HTML, language selection by URL, the language toggle as navigation, and reciprocal SEO metadata (`hreflang`, per-locale canonical, localized meta, sitemap with alternates).

### Modified Capabilities
- `island-i18n`: Interactive islands select the active language from a server-provided prop tied to the page's locale, instead of re-rendering in response to a runtime language-toggle event. The runtime-toggle and stored-preference-on-load requirements are retired.
- `docs-navigation`: The documentation section is localized by the page's server-rendered locale. The "runtime language reactivity" requirement is removed; the four-group structure, per-item title+description, single i18n source of truth, and resolvable repository links are retained.

## Impact

- **Routing/pages**: `src/pages/index.astro` refactored into a shared landing component plus thin per-locale page files (`src/pages/index.astro` ES, `src/pages/en/index.astro` EN).
- **Layout/SEO**: `src/layouts/BaseLayout.astro` gains a `lang` input and emits `<html lang>`, localized meta, per-locale canonical, `hreflang` alternates, and localized JSON-LD `url`.
- **Config/deps**: `astro.config.mjs` gains Astro i18n routing config and the `@astrojs/sitemap` integration; `package.json` adds `@astrojs/sitemap`; `public/robots.txt` references the sitemap.
- **Components**: `Header.astro`, `LanguageToggle.tsx`, and all content sections (`Hero`, `ValueProps`, `Features`, `HowItWorks`, `UseCases`, `Installation`, `Docs`, `StackArch`, `CTA`, `Footer`) render localized copy from the page's locale.
- **Islands**: `DocsTabs.tsx`, `HowItWorksLoop.tsx`, and the `useLanguage` hook take language from a server prop; the `s2b:languagechange` plumbing is removed.
- **Removed**: `src/scripts/i18n-client.ts` (runtime swap) and the body script that invokes it.
- **i18n data**: `src/i18n/{es,en}.json` remain the single source of truth; key-parity enforcement retained.
- **Tests**: Playwright coverage extended to both URLs (content, `<html lang>`, canonical, `hreflang`, toggle navigation, a JS-disabled crawler-view assertion); i18n key-parity check retained.

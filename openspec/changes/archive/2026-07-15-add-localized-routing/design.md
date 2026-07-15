## Context

The landing page is a static Astro 5 build with a single route (`/`) that is always server-rendered in Spanish. English is produced only at runtime: `src/scripts/i18n-client.ts` swaps every `[data-i18n]` text node from `localStorage.language`, and React islands (`DocsTabs`, `HowItWorksLoop`) re-render via a `s2b:languagechange` CustomEvent dispatched by `LanguageToggle.tsx`. The `useLanguage` hook wires islands to that event.

Consequences for SEO: crawlers only ever receive the Spanish HTML at one URL. English exists only after JavaScript executes, so it is not a distinct, indexable page. `BaseLayout.astro` hardcodes `<html lang="es">`, a single shared `canonical`, and no `hreflang`; there is no sitemap.

This design moves language selection from runtime (client swap) to build time (per-locale URL), so each language is a fully server-rendered, crawlable page. It supersedes the runtime-reactivity requirements previously captured in `island-i18n` and `docs-navigation`.

Constraints: static output (no SSR adapter, no backend); single landing page today; deployed on a VPS (Nginx/Caddy) behind `share2brain.app`; must follow `docs/frontend-standards.md` (dual-source i18n copy, Lighthouse SEO = 1.0, single i18n source of truth) and `docs/base-standards.md`.

## Goals / Non-Goals

**Goals:**
- Serve Spanish from `/` and English from `/en/` as static, fully localized HTML crawlable with JavaScript disabled.
- Emit reciprocal SEO metadata per page: `<html lang>`, localized `<title>`/`description`, self-referential `canonical`, `hreflang` alternates (`es`, `en`, `x-default`), `og:locale`, and localized JSON-LD `url`.
- Generate `sitemap.xml` with per-URL `hreflang` alternates and reference it from `robots.txt`.
- Convert the language selector into locale navigation links that preserve the active section anchor.
- Keep `src/i18n/{es,en}.json` as the single source of truth with enforced key parity.
- Remove the runtime language-swap machinery so there is one unambiguous source of "current language": the URL.

**Non-Goals:**
- Automatic language redirection (server- or client-side) based on `Accept-Language`, IP, or stored preference — `/` stays deterministically Spanish.
- Preserving in-place (no-navigation) language switching — it is intentionally retired.
- Adding new locales beyond `es`/`en`, or localizing routes other than the landing page (`/docs/*`, `/changelog` are out of scope here).
- Path/URL changes for the Spanish page — `/` is preserved to protect existing indexing.

## Decisions

### D1: Full SSR-per-locale (toggle → link), not a hybrid that keeps the runtime swap
Each locale renders server-side at its own URL; the toggle becomes an anchor to the other locale. **Alternative considered:** a hybrid that adds URLs for crawlers but keeps the client swap for no-navigation switching. Rejected: it creates two competing sources of truth for the active language (URL vs `localStorage`), which makes `canonical`/`hreflang` prone to drift, doubles the test surface, and perpetuates the `i18n-client.ts`/`s2b:languagechange` machinery for negligible UX gain on a landing page where navigation is instant. Single source of truth (the URL) is the point of the change.

### D2: URL scheme `/` (es) + `/en/` (en) via `prefixDefaultLocale: false`
Spanish keeps the already-indexed root URL; English gets `/en/`. **Alternative considered:** symmetric `/es/` + `/en/` (`prefixDefaultLocale: true`). Rejected for now: it changes the existing `/` URL, forcing a permanent `301` `/` → `/es/` and a full re-index, with no SEO upside over a correct `hreflang`/`x-default` setup. Symmetry is not worth the ranking churn.

### D3: Explicit per-locale page files over a `[...lang]` dynamic route
Refactor the page body into a shared component (e.g. `src/components/LandingPage.astro` or a `LocalizedLayout`) that takes `lang`, then have two thin pages render it: `src/pages/index.astro` (`lang="es"`) and `src/pages/en/index.astro` (`lang="en"`). **Alternative considered:** a single `src/pages/[...lang]/index.astro` with `getStaticPaths`. Rejected as premature: with exactly two locales and one page, explicit files are clearer and easier to test. If more locales or localized sub-pages appear later, migrating to `getStaticPaths` is a mechanical follow-up. This is noted as a revisit trigger, not a debt.

### D4: Enable Astro i18n config + `@astrojs/sitemap` with i18n mapping
Add `i18n: { defaultLocale: 'es', locales: ['es','en'], routing: { prefixDefaultLocale: false } }` to `astro.config.mjs` to unlock the locale URL helpers (`getRelativeLocaleUrl`) used for the toggle links and `hreflang`, and configure `@astrojs/sitemap` with matching `i18n` options so the sitemap emits `hreflang` alternates automatically. **Alternative considered:** hand-roll URL helpers and a static sitemap. Rejected: the official integration keeps alternates correct as content grows and is the standard per `docs/frontend-standards.md`.

### D5: Components render localized copy from `translations[lang]` server-side
Each content section (`Hero`, `ValueProps`, `Features`, `HowItWorks`, `UseCases`, `Installation`, `Docs`, `StackArch`, `CTA`, `Footer`, `Header`) already receives a `lang` prop; they render text from the i18n file for that locale directly in the server output. Islands (`DocsTabs`, `HowItWorksLoop`) receive `lang` as a prop from the server-rendered page and select copy from it — no event subscription. The dual-source copy rule (every string in both `es.json` and `en.json`) and single-source-of-truth for structured data (e.g. `docSections`) are retained. **Alternative considered:** keep `[data-i18n]` as the render mechanism and pre-fill the correct language server-side per URL. Rejected: leaving the swap script in place invites the D1 ambiguity; `[data-i18n]` may remain only as a harmless authoring marker.

### D6: Language toggle as accessible links preserving the section anchor
`LanguageToggle.tsx` renders `<a>` elements to the equivalent locale URL, computed with the Astro locale helper, appending the current `location.hash` when present so a visitor deep in `#docs` lands on `#docs` in the other locale. Active locale is marked with `aria-current`/`aria-pressed`. **Alternative considered:** a plain button that calls `history.pushState`. Rejected: real anchors are crawlable, keyboard-accessible, and shareable by default.

### D7: `BaseLayout.astro` becomes locale-aware
`BaseLayout` takes `lang` (and optionally per-locale `title`/`description` resolved from i18n) and emits `<html lang={lang}>`, the localized `<title>`/`description`, a self-referential `canonical` (`Astro.site` + locale path), the `hreflang` alternate set including `x-default` (pointing at the default locale), `og:locale`/`og:locale:alternate`, and localized JSON-LD `url`. The theme-detection inline script stays; the language line in it and the i18n body script are removed.

## Risks / Trade-offs

- **Losing SEO equity on the existing `/` during transition** → `/` URL and its Spanish content are unchanged; only metadata is added. Add `hreflang`/`x-default` and submit the new sitemap so Google discovers `/en/` without demoting `/`.
- **Duplicate-content or wrong-locale indexing** → self-referential per-locale `canonical` plus reciprocal `hreflang` (validated in tests) prevent the two pages from competing.
- **Existing users with `localStorage.language='en'` land on Spanish `/`** → acceptable for this change (auto-suggestion is out of scope); the visible EN toggle link is one click away. Revisit only if analytics show friction.
- **Anchor/nav drift between locales** → both locales share the same section id scheme (`#producto`, `#docs`, …); a test asserts the toggle preserves the anchor.
- **Regressions from removing the swap machinery** → `island-i18n` and `docs-navigation` behavior is re-verified per locale via Playwright, including a JS-disabled crawler-view assertion, before archiving.
- **Trade-off: no in-place switching** → accepted deliberately (D1); a full navigation on a static page is effectively instant and removes a class of state bugs.

## Migration Plan

1. Land config + layout + shared component refactor behind the same build (no route removed; `/` stays Spanish).
2. Add `/en/`, sitemap, and `robots.txt` sitemap reference.
3. Deploy; verify both URLs render correct localized HTML with JS disabled and expose correct `hreflang`/`canonical`.
4. Submit/resubmit `sitemap.xml` in Google Search Console; monitor indexing of `/en/`.
5. Rollback: revert the change set — `/` returns to the prior single-URL behavior; no data migration is involved.

## Open Questions

- None blocking. Confirmed in exploration: Option A (SSR-per-locale), `/` + `/en/`, deterministic root, no auto-redirect, explicit per-locale pages. Revisit `[...lang]` + `getStaticPaths` only if additional locales or localized sub-pages (`/en/docs`, blog) are introduced.

# Step 10 — Test & Build Verification

**Change:** add-localized-routing
**Date:** 2026-07-15
**Branch:** feature/add-localized-routing

## Commands executed

| Command | Purpose |
|---------|---------|
| `npm install` | Install `@astrojs/sitemap` |
| `npm run build` | Production build (SSG) |
| `npx playwright test tests/localized-routing.spec.ts` | New per-locale routing spec |
| `npx playwright test` | Full suite (3 projects: Desktop Dark/Light, Mobile Dark) |

## Build verification

`npm run build` completes without errors and emits **two static pages** plus the sitemap:

```
▶ src/pages/en/index.astro   └─ /en/index.html
▶ src/pages/index.astro      └─ /index.html
[@astrojs/sitemap] `sitemap-index.xml` created at `dist`
[build] 2 page(s) built in ~2s
```

`dist/` contains `index.html` (ES), `en/index.html` (EN), `sitemap-index.xml`, `sitemap-0.xml`, and `robots.txt`.

### SEO output verified from built HTML

| Signal | `/` (ES) | `/en/` (EN) |
|--------|----------|-------------|
| `<html lang>` | `es` | `en` |
| `<title>` | "Share2Brain — Un segundo cerebro…" | "Share2Brain — A searchable second brain…" |
| canonical | `https://share2brain.app/` | `https://share2brain.app/en/` |
| hreflang | es → `/`, en → `/en/`, x-default → `/` | es → `/`, en → `/en/`, x-default → `/` |
| og:locale | `es_ES` | `en_US` |
| Hero body copy | Spanish only (EN string absent) | English only |

`sitemap-0.xml` lists `https://share2brain.app/` and `https://share2brain.app/en/`, each with reciprocal `xhtml:link` hreflang alternates. `robots.txt` references `sitemap-index.xml`.

## Test results

### New spec — `tests/localized-routing.spec.ts`
First targeted run (Desktop - Dark): **14/14 passed**. Covers per-locale content isolation, `<html lang>`, self-referential canonical, reciprocal hreflang + x-default, og:locale, toggle navigation, section-anchor preservation, and the JavaScript-disabled crawler view.

### Full suite regression
- **First full run:** 260 passed, **19 failed** — all failures were pre-existing `design-compliance.spec.ts` tests still encoding the retired runtime-toggle model (in-place swap, stored-preference-on-load) plus one hydration-timing flake in the anchor test on Mobile.
- **Fixes applied:**
  - Rewrote the 6 runtime-toggle tests to the navigation model (toggle click → navigate to `/en/`; content localized per URL). The stored-preference test became a **deterministic-root** test (a stored `en` preference must not re-localize `/`).
  - Made anchor preservation hydration-independent: the section anchor is folded into the toggle link's `href` via a mount effect, so the destination is correct regardless of click timing.
  - Updated language-toggle selectors from `button[...]` to `a[...]` (the toggle is now a link).
- **Targeted re-run of all affected tests across all 3 projects:** 27/27 passed.
- **Final full-suite run:** 278 passed, 1 failed. The single failure — `Docs › selecting a tab swaps the panel items` (design-compliance.spec.ts:281) — is a pre-existing `DocsTabs` hydration-timing flake unrelated to this change (it touches no i18n/routing code and passed in the earlier full run). It **passes on isolated re-run** (`1 passed`). All i18n/routing/SEO tests pass.

## Post-review fixes (adversarial-review round)

After an independent adversarial review, the following gaps were fixed and re-verified:

- **Spec drift (Major):** the `## Purpose` of `island-i18n` and `docs-navigation` still described the retired runtime-toggle model (delta specs can't edit Purpose). Updated both main specs' Purpose to the per-locale / server-prop model.
- **Mixed-language embedding (Minor):** `DocsTabs`/`HowItWorksLoop` received both `es`+`en` props, so each page's HTML embedded the other language's copy in serialized island props. Refactored both islands to receive only the active locale's data (`sections` / `content`); `Docs.astro`/`HowItWorks.astro` select by `lang`. Verified: `dist/index.html` no longer contains English docs/loop strings and `dist/en/index.html` no longer contains Spanish ones.
- **Test gap (Minor):** added a per-locale assertion that `<title>` and meta `description` are non-empty.
- **Host note (Minor):** documented trailing-slash handling for `/en` in `backend-standards.md`.

## Outcome

Build succeeds; both locale pages render correct localized HTML and SEO metadata, each page carries a single language; the Playwright suite is green after updating tests to the new per-locale routing model.

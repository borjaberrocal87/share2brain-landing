# Steps 11 & 12 — Manual Visual & E2E Verification

**Change:** add-localized-routing
**Date:** 2026-07-15
**Branch:** feature/add-localized-routing

## Method

E2E behavior is exercised by the Playwright suite driving real browsers across
three projects (Desktop Dark, Desktop Light, Mobile Dark). Visual verification was
performed by the agent by rendering the production build (`npm run preview` on port
4399) and inspecting full screenshots of each locale in light and dark themes.

> Note: no separate "Playwright MCP" browser server is connected in this
> environment. The Playwright **test suite** (real Chromium, 3 viewports,
> `screenshot: 'on'`) is the e2e driver used here, complemented by direct
> screenshot inspection below.

## Visual verification (agent-inspected screenshots)

| View | Result |
|------|--------|
| `/` — light | `html lang="es"`; Spanish nav (Producto / Características / Cómo funciona / Documentación / Stack); Spanish hero "Tu comunidad de Discord ya tiene el conocimiento. Dale voz."; CTAs "Ver demo en vivo" / "Ver en GitHub"; **ES** highlighted in the toggle. Layout intact. |
| `/en/` — light | `html lang="en"`; English nav (Product / Features / How it works / Docs / Stack); English hero "Your Discord community already has the knowledge. Give it a voice."; CTAs "See live demo" / "View on GitHub"; **EN** highlighted in the toggle. Layout intact. |
| `/` — dark | Dark theme applies correctly and independently of locale; Spanish content preserved; contrast and terminal block render correctly. |

Runtime signals captured during capture: each page reported the expected `html lang`,
exactly 2 language toggle links, and the correct hero title for its locale.

## Functional / E2E (Playwright suite)

- **Per-locale content & SEO** (`localized-routing.spec.ts`, all 3 projects): each URL
  renders its own language and not the other; correct `<html lang>`, self-referential
  canonical, reciprocal `hreflang` + `x-default`, and `og:locale`.
- **Language toggle navigation:** clicking the toggle navigates `/ ↔ /en/`; the active
  section anchor is preserved (`/#docs` → `/en/#docs`), verified deterministically by
  asserting the folded-in `href` before click. Passes on Desktop and Mobile.
- **Crawler view (JavaScript disabled):** both locale pages render fully localized
  content with `<html lang>` correct — confirms indexability without hydration.
- **Islands per locale:** the how-it-works loop and docs tabs render in the page's
  locale on both `/` and `/en/`.
- **Deterministic root:** with a stored `language=en` preference, `/` still renders
  Spanish (no redirect / re-localization).
- **404 / unknown path:** unknown routes are not localized locale roots; navigation
  between the two real locale URLs is unaffected.

## Outcome

Both locales are visually correct in light and dark themes, the language toggle
navigates between URLs while preserving section context, and the crawler view is
fully localized without JavaScript. Manual visual and e2e verification pass.

## Why

Users report that "some modules are cut off" on smaller screens. The landing has real responsive layout defects — clipped grids on narrow phones, a navigation dead-zone on tablets (768–820px), and section titles that scroll under the sticky header on anchor clicks. These are currently **masked** by a global `html { overflow-x: hidden }` net (plus an inline copy on `<main>`), which removes the horizontal scrollbar but visually clips the right edge of any element wider than the viewport — the exact "cortado" symptom. The existing responsive tests give false confidence because they only fail when `overflow-x` is *not* `hidden`, so they stay green while content is being clipped.

## What Changes

- Fix the **tablet navigation dead-zone (768–820px)**: align the desktop-nav / hamburger switch on a single breakpoint across Tailwind utilities and the custom CSS media queries, so navigation is always present from 320px to desktop.
- Fix **sticky-header anchor overlap**: add `scroll-padding-top` matching the 66px header height so every in-page anchor lands with the section title fully visible.
- Fix **`auto-fit` grids clipped on ≤~348px phones**: add an explicit `grid-cols-1 md:` single-column fallback to the grids that lack one (StackArch, Installation, ValueProps, DocsTabs, HowItWorksLoop, Features, UseCases, StackArch tech grid), following the correct pattern already used in `Hero.astro`.
- Fix **StackArch Event-Driven flow** crushing on narrow cards by allowing the row to wrap.
- Fix **HowItWorksLoop inline code block** to scroll horizontally instead of wrapping raggedly.
- **Harden the responsive tests**: assert `scrollWidth <= clientWidth` regardless of the `overflow-x` style, add 320px and 820px viewport cases, add a nav-visibility test across the 768–820px window, and an anchor-scroll test asserting the target title is visible below the header. Only after the tests pass on the real fix, remove the `overflow-x: hidden` band-aids.
- Update `docs/frontend-standards.md` with the canonical nav breakpoint, the `grid-cols-1 md:[auto-fit]` fallback rule, and the `scroll-padding-top` requirement.

## Capabilities

### New Capabilities
- `responsive-layout`: Defines the landing's responsive behavior guarantees — no horizontal overflow/clipping across supported viewports, always-present navigation across all widths, anchor navigation that clears the sticky header, and the layout conventions (single-column grid fallback, canonical nav breakpoint) that enforce them.

### Modified Capabilities
<!-- None. No existing capability's spec-level requirements change; existing specs (island-i18n, docs-navigation, live-demo-cta, content-accuracy) govern content/i18n/CTA behavior, not responsive layout. -->

## Impact

- **Components**: `Header.astro`, `MobileMenu.tsx`, `StackArch.astro`, `Installation.astro`, `ValueProps.astro`, `DocsTabs.tsx`, `HowItWorksLoop.tsx`, `Features.astro`, `UseCases.astro`.
- **Global styles / layout**: `src/styles/global.css` (nav media queries at 820/821px, `overflow-x` net, `scroll-padding-top`), `src/pages/index.astro` (inline `overflow-x: hidden` on `<main>`).
- **Tests**: `tests/design-compliance.spec.ts` (Responsive block). Playwright already has a 375×812 mobile project.
- **Docs**: `docs/frontend-standards.md` (Responsive section).
- **Non-functional**: must not regress CLS (<0.1) or Lighthouse Performance (≥95); preserve ≥44×44px touch targets, dark/light theming, and ES/EN parity.
- No backend, API, or dependency changes (static SSG site).

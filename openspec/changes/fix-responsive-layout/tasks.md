## 0. Feature Branch (MUST BE FIRST)

- [x] 0.1 Create and switch to feature branch `fix/fix-responsive-layout-clipped-modules` from `main`

## 1. Harden Responsive Tests First (TDD — must fail against current code)

- [x] 1.1 In `tests/design-compliance.spec.ts` Responsive block, rewrite the three overflow tests to assert `document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1` directly, independent of the `overflow-x` style
- [x] 1.2 Add overflow test cases at 320px and 820px (keep 375, 768, 1440)
- [x] 1.3 Add a navigation-visibility test asserting exactly one of desktop nav / hamburger is visible across the 768–820px range (e.g. at 768, 800, 819px)
- [x] 1.4 Add an anchor-scroll test: click each in-page nav anchor (`#producto`, `#features`, `#how`, `#docs`, `#stack`, `#install`) and assert the target section heading's top is at/below the sticky header bottom (~66px) and within the viewport
- [x] 1.5 Run the new tests and confirm they FAIL against current code (documents the defects) — 7 failed as expected: overflow at 320/375/414, nav gap at 768/800/819, #producto top=0.375

## 2. Fix Navigation Breakpoint Dead-Zone (D1)

- [x] 2.1 Measure the header row at 768px in the browser; decide canonical breakpoint: prefer Tailwind `md` (768px); if the header overflows at 768px, register a single custom screen `nav: '820px'` in `tailwind.config.mjs`
- [x] 2.2 Remove the raw `@media (max-width:820px)` / `@media (min-width:821px)` nav overrides in `src/styles/global.css` (lines ~146/157)
- [x] 2.3 Ensure `Header.astro` desktop nav (`hidden md:flex` or `hidden nav:flex`) and `MobileMenu.tsx` wrapper (`md:hidden` or `nav:hidden`) use the single chosen breakpoint consistently
- [x] 2.4 Verify navigation is present and operable across 320–1440px with no dead-zone (run task 1.3 test)

## 3. Fix Sticky-Header Anchor Overlap (D2)

- [x] 3.1 Introduce a `--header-h: 66px` CSS custom property and use it for the header height sizing
- [x] 3.2 Add `scroll-padding-top: var(--header-h)` to `html` in `src/styles/global.css`
- [x] 3.3 Verify every nav anchor lands with the section heading fully visible below the header (run task 1.4 test)

## 4. Fix Clipped `auto-fit` Grids (D3)

- [x] 4.1 `StackArch.astro:88` — add `grid-cols-1 md:` fallback to the architecture grid (and `:71` tech grid if needed)
- [x] 4.2 `Installation.astro:55` — add `grid-cols-1 md:` fallback
- [x] 4.3 `ValueProps.astro:40` — add `grid-cols-1 md:` fallback
- [x] 4.4 `DocsTabs.tsx:51` — add `grid-cols-1 md:` fallback
- [x] 4.5 `Features.astro:50` and `UseCases.astro:42` — add `grid-cols-1 md:` fallback
- [x] 4.6 `HowItWorksLoop.tsx:112` — add `grid-cols-1 md:` fallback to the detail panel grid
- [x] 4.7 Verify no card is clipped at 320/375px in the browser
- [x] 4.8 `HowItWorksLoop.tsx:51` steps grid (`minmax(190px)`, `mx-auto`) — add `grid-cols-1 md:` fallback. The audit rated it "safe", but that held only under the global mask: its `mx-auto` cancels flex `align-items: stretch`, so the grid shrink-to-fits to max-content (3 columns = 602px) and overflowed once the net was removed

## 5. Contain Long Content Locally (D4)

- [x] 5.1 `HowItWorksLoop.tsx:133-149` — add `overflow-x-auto` to the active-step inline code block
- [x] 5.2 `StackArch.astro:139-174` — add `flex-wrap` to the Event-Driven flow row so items wrap on narrow cards
- [x] 5.3 `MobileMenu.tsx` — the closed off-canvas drawer (`fixed right-0 translateX(100%)`, w-280) extends past the viewport and was only hidden by the global `overflow-x: hidden`. Wrap the sliding panel in a viewport-height clip container (`overflow-x-hidden`, `pointer-events-none`) so the drawer is clipped locally instead of page-wide — required before the global net can be removed (D5)
- [x] 5.4 `MobileMenu.tsx` — the header's `backdrop-filter` makes it the containing block for `position: fixed` descendants, so the clip container's `bottom-0` (and the overlay's `inset-0`) resolved against the 66px header → the drawer collapsed to 0 height (found in `/verify`). Size both from the viewport instead: clip container `h-[calc(100vh-var(--header-h))]`, overlay `w-screen h-screen`. Also fixes the overlay dim + click-outside-to-close (pre-existing header-contained bug)
- [x] 5.5 `tests/design-compliance.spec.ts` — add a regression test asserting the opened drawer panel is visible with height > 50px and clickable links (the gap that let 5.4 through); passes across all 3 projects

## 6. Remove the Masking Net (D5 — only after sections 2–5 pass)

- [x] 6.1 Confirm the hardened tests (section 1) pass with the mask still in place — 13/13 passed
- [x] 6.2 Remove `overflow-x: hidden` from `html` in `src/styles/global.css` (line ~74)
- [x] 6.3 Remove inline `overflow-x: hidden; max-width: 100vw` from `<main>` in `src/pages/index.astro:23`
- [x] 6.4 Re-run the full responsive suite; if any overflow reappears, fix the source (do NOT reinstate the net) — re-exposed the steps-grid source (fixed in 4.8); 13/13 pass with the net removed

## 7. Review and Update Existing Tests (MANDATORY)

- [x] 7.1 Review `tests/design-compliance.spec.ts` for tests affected by the nav-breakpoint change (e.g. `desktop nav hidden on mobile`, `mobile menu button visible on mobile` at 375px) and update expectations to the chosen breakpoint
- [x] 7.2 Confirm `tests/i18n-parity.spec.ts` is unaffected (no i18n keys changed)

## 8. Run Tests and Verify Build (MANDATORY) — AGENT MUST EXECUTE

- [x] 8.1 Ensure dependencies installed (`npm ci`)
- [x] 8.2 Run targeted responsive tests (`npm run test:e2e -- design-compliance`) and confirm all pass, no regressions
- [x] 8.3 Run full unit suite (`npm test`); record counts, failures, runtime
- [x] 8.4 Run `npm run type-check` and `npm run build`; confirm no errors and `dist/` contains expected pages
- [x] 8.5 Save report to `specs/fix-responsive-layout/reports/YYYY-MM-DD-step-8-test-and-build-verification.md` with commands, results, and build output

## 9. Manual Visual/Functional Testing (MANDATORY) — AGENT MUST EXECUTE

- [x] 9.1 Start `npm run dev`; verify site loads at `http://localhost:4321`
- [x] 9.2 Resize/emulate 320, 375, 414, 768, 820, 1024, 1440px; verify no clipping, no horizontal scroll, all modules fully visible
- [x] 9.3 Verify navigation present and usable at every width, including 768–820px; open/close hamburger; toggle dark/light and confirm no theme regression
- [x] 9.4 Click each nav anchor and confirm the section title clears the sticky header
- [x] 9.5 Document findings in `specs/fix-responsive-layout/reports/YYYY-MM-DD-step-9-manual-visual-testing.md`

## 10. E2E Testing with Playwright MCP (MANDATORY) — AGENT MUST EXECUTE

- [x] 10.1 With dev server running, drive the page via Playwright MCP at 375px and 800px: assert no horizontal overflow, nav visible, anchor navigation clears the header
- [x] 10.2 Document scenarios and outcomes in the step-9 report (or a step-10 report)

## 11. Update Technical Documentation (MANDATORY)

- [x] 11.1 Update `docs/frontend-standards.md` §Responsive: canonical nav breakpoint, `grid-cols-1 md:[auto-fit]` single-column fallback rule (cite `Hero.astro`), and `scroll-padding-top: var(--header-h)` requirement
- [x] 11.2 Note that page-level `overflow-x: hidden` is no longer used to mask overflow and must not be reintroduced as a fix

## 12. Finalize

- [x] 12.1 Run `openspec validate --change fix-responsive-layout --strict` and confirm it passes — valid
- [x] 12.2 Commit with a conventional message referencing the change (commit 8ee1764 on `fix/fix-responsive-layout-clipped-modules`). PR: pending user confirmation to push (outward-facing)

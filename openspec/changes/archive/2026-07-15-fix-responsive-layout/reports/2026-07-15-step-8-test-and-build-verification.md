# Step 8 — Test & Build Verification

**Change:** fix-responsive-layout
**Date:** 2026-07-15
**Branch:** fix/fix-responsive-layout-clipped-modules

## Environment note

`package.json` defines only `dev`, `build`, `preview`, `astro`. The scripts named
in the mandatory-steps checklist (`npm test`, `npm run type-check`,
`npm run test:e2e`) are **not wired** in this project and there is no Vitest
dependency (no unit suite exists). The real gates are:

- **Build / type-safety:** `npm run build` (Astro build; fails on TS/template errors)
- **E2E:** `npx playwright test` (real Chromium, 3 projects)

## Commands & results

### Production build
```
npm run build
```
- ✅ Completed. 1593 modules transformed, `dist/index.html` generated in ~1.9s, no errors.
- Confirms the new Tailwind `nav` screen, `min-[360px]:` variant, and `h-[var(--header-h)]` / `max-h-[calc(100vh-var(--header-h))]` arbitrary values compile.

### Targeted responsive tests (mask removed)
```
npx playwright test design-compliance --project="Desktop - Dark" \
  --grep "no horizontal overflow|navigation control|clears sticky header|hamburger visible at 320|desktop nav visible at 1440"
```
- ✅ 13/13 passed.

### Full suite — all projects
```
npx playwright test design-compliance i18n-parity
```
- ✅ **228 passed** (Desktop-Dark, Desktop-Light, Mobile-Dark), 0 failed.
- Runtime ~4.9m.

## TDD evidence

Before implementation, the 7 new/rewritten responsive assertions **failed**
against unfixed code (documenting the defects):
- Overflow at 320/375/414px
- Nav dead-zone at 768/800/819px (neither control visible)
- `#producto` top = 0.375px (hidden under the sticky header)

After implementation and **with the `overflow-x: hidden` mask fully removed**,
all pass — proving the page genuinely fits rather than clipping.

## Overflow-source note (D5)

Removing the global mask re-exposed one genuine overflow source not caught by the
initial audit: the HowItWorks steps grid (`minmax(190px)` + `mx-auto`) shrink-to-fit
to max-content (602px). Fixed with the same `grid-cols-1 md:` fallback (task 4.8).
No masking was reinstated.

## Verdict

✅ Build passes. ✅ 228/228 e2e pass across dark/light/mobile. No regressions in
existing Header, Theme, Typography, i18n, a11y, or SEO tests.

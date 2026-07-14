# Post-apply fix — CTA hover states + re-verification

**Change:** add-live-demo-cta
**Date:** 2026-07-14

## Issue reported (after apply, before archive)

User: the CTA hover states did not match the design. Root cause: the demo buttons
had `transition-[filter]` but **no `:hover` rule**, so they gave no hover feedback;
inline `style` cannot express `:hover`. The GitHub secondary buttons likewise had no
working hover (border set inline, no hover rule).

Handled per project rule #7: updated OpenSpec artifacts first (spec scenario
"Primary CTA gives hover feedback", design decision on Tailwind hover utilities,
tasks 3.6/3.7/4.6/4.7/5.3), then implemented.

## Fix

- Primary (demo) buttons: added `hover:brightness-105` (with `transition-[filter]`)
  → `filter: brightness(1.05)` on hover, matching the design.
- Secondary (GitHub) buttons: moved the inline `border` to Tailwind
  `border border-[color:var(--border-strong)] hover:border-[color:var(--accent)] transition-colors`
  (inline border shorthand would otherwise beat the hover class) → border turns accent on hover.

Files: `src/components/Hero.astro`, `src/components/CTA.astro`,
`tests/design-compliance.spec.ts` (new hover test).

## Re-verification

- **Targeted tests:** `Live demo CTA` block now **18 passed** (6 tests × 3 projects), including the new hover test.
- **Build:** `npm run build` — Complete, no errors.
- **Runtime (headless Chromium):**
  - primary demo button computed `filter` on hover = `brightness(1.05)` ✓
  - GitHub secondary button computed `border-color` on hover = `rgb(245, 166, 35)` (= `--accent` `#F5A623`) ✓
  - Screenshots `hover-primary.png` / `hover-secondary.png` confirm the amber border and brighter primary.

## Result

PASS — both CTA hover states now match the design in the Hero and final CTA sections.

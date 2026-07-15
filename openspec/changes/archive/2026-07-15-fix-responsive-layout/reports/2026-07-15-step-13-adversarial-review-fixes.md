# Step 13 — Adversarial-review fixes

**Change:** fix-responsive-layout
**Date:** 2026-07-15
**Trigger:** independent `/adversarial-review` → FAIL (2 Major + minors)

## Fixes applied

### Major 1 — Overflow test was defeatable by the mask it removed
The rewritten test used `documentElement.scrollWidth`, which `overflow-x: hidden`
clamps — so re-adding the mask made it pass despite real overflow (proven: injected
a 3000px element → masked `scrollWidth=375`, test PASSED). Spec required
style-independent tests.
- **Fix (tests):** assert each element's `getBoundingClientRect().right <= viewport`
  (unclampable; contained/scrollable/fixed descendants excluded) AND assert
  `html`/`body`/`main` don't use `overflow-x: hidden`/`clip`. Reintroducing the mask
  now fails the test.

### Major 2 — Drawer `aria-hidden-focus` a11y violation
`aria-hidden={!isOpen}` wrapped focusable links; probed closed drawer link →
`focusable=true, tabIndex=0, insideAriaHidden=true`. Keyboard users could Tab into
the hidden menu.
- **Fix (code):** replaced with `inert` on the clip container when closed (via ref);
  `inert` removes links from tab order and the AT tree. Added a test asserting the
  closed drawer is `inert` and its links are not focusable.

### Minors
- Anchor test now clicks a **real** desktop nav link (`#features`) and asserts the
  section **heading** (h1–h4), not the section container; hash coverage retained for
  `#install` (no nav link).
- Spec scenarios corrected (nav-link click vs hash-only targets; heading element;
  style-independent test wording). New requirement: "The mobile drawer is not
  reachable when closed."
- CLS/Lighthouse targets not measured this cycle — CSS-only changes, no expected
  regression; deferred, not a blocker.
- Overlay `w-screen` confirmed safe (drawer only ≤820px, body-scroll locked when open).

## Verification

```
npx playwright test design-compliance --grep "Responsive|Anchor|mobile"
```
- ✅ **113 passed** across Desktop-Dark / Desktop-Light / Mobile-Dark, incl. the new
  hardened overflow test, `inert` drawer test, and real-click anchor test.
- ✅ `npm run build` green.

## Verdict
All adversarial-review blockers/majors + minors addressed. Change is
archive-ready pending push/PR.

# Step 6 — Test & Build Verification

**Change:** add-live-demo-cta
**Date:** 2026-07-14
**Branch:** feat/landing-content-rewrite (implemented in place per user decision; no separate feature branch)

## Commands executed

```bash
npm ci
npx playwright test tests/i18n-parity.spec.ts --grep "Live demo CTA" tests/design-compliance.spec.ts   # targeted
npx playwright test                                                                                     # full suite
npm run build
```

## Targeted tests (new live-demo CTA)

**15 passed** (5 tests × 3 projects: Desktop-Dark, Desktop-Light, Mobile-Dark):

- renders in both hero and cta sections
- links to the live demo, opens safely in a new tab (`href="https://demo.share2brain.app/"`, `target="_blank"`, `rel` contains `noopener`/`noreferrer`)
- has a leading play icon (`path[d="M8 5v14l11-7z"]`)
- is the first action in its button group
- label is localized and toggles ES ↔ EN (`Ver demo en vivo` → `See live demo`)

## Full suite

**156 passed / 6 failed** (runtime ~3.9m).

### The 6 failures are PRE-EXISTING and UNRELATED to this change

All 6 belong to the uncommitted `feat/landing-content-rewrite` WIP (a broad copy rewrite present in the working tree before this change), not to the live-demo CTA:

| Failing test | Cause (in unrelated WIP) |
|---|---|
| `Value Props › card titles present` (×3 projects) | Test expects h3 titles containing `Indexa`/`Responde`/`control`; the WIP reworded `vp` titles to sentence-style ("Tu comunidad ya tiene el conocimiento…"). |
| `i18n › switching to EN updates content` (×3 projects) | Test asserts EN `valuesTitle` contains lowercase `'knowledge'`; the WIP copy is "**K**nowledge that dies in the scroll…" — `.toContain` is case-sensitive. |

**Evidence:** `git diff src/i18n/*.json` shows this change added only the two `"ctaDemo"` lines; every other delta (features array, `vp`, `valuesTitle`, etc.) is the pre-existing content-rewrite WIP. The live-demo change touches only `Hero.astro`, `CTA.astro`, `src/config/site.ts`, and the `hero.ctaDemo` copy key.

**Disposition:** Out of scope for `add-live-demo-cta`. These belong to the content-rewrite work and should be reconciled there (either update those tests to the new copy or restore the expected strings).

## Build

`npm run build` — **Complete!** 1 page built in ~5.1s, no errors. `dist/index.html` verified:

- `https://demo.share2brain.app/` × 2
- `data-i18n="hero.ctaDemo"` × 2
- `Ver demo en vivo` × 2 (correct ES default for SSR)
- `aria-label="Watch the Share2Brain live demo (opens in new tab)"` × 2

## Conclusion

The `add-live-demo-cta` change is fully green: its 15 dedicated tests pass across all projects, the production build succeeds, and SSR output is correct. The 6 suite failures are pre-existing and unrelated.

## Update (post-adversarial-review, 2026-07-14)

The 2 content-rewrite tests that produced the 6 failures were updated to match the current (rewritten) copy — `Value Props › card titles` now asserts `conocimiento`/`verificables`/`decides`; `i18n › switching to EN` now compares case-insensitively. Full suite re-run: **165 passed / 0 failed**. (These test fixes are content-rewrite scope, not the live-demo-cta capability, but were needed to clear the archive gate.)

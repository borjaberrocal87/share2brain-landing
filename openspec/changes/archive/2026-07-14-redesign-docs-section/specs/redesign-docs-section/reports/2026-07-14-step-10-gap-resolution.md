# Step 10 — Gap resolution (post-adversarial-review)

**Date:** 2026-07-14
**Branch:** `feature/redesign-docs-section`

Resolves the gaps raised in the adversarial review. Artifacts (spec, design, tasks) were updated first per the project's post-apply rule, then code.

## Gaps and how they were resolved

| # | Gap (from review) | Resolution | Evidence |
|---|---|---|---|
| 1 | Language toggle desynced the docs section (English heading over Spanish tabs/items) | New `src/i18n/useLanguage.ts` hook + `languagechange` `CustomEvent` dispatched by `LanguageToggle`. `DocsTabs` **and** `HowItWorksLoop` now receive both languages and re-render on toggle. | Live drive: ES→EN flips tabs `["Empezar",…]`→`["Getting started","Architecture","API & Agent","Development"]` and first description "Clonar, configurar…"→"Clone, configure…". Screenshot `docs-en-fixed.png` shows a fully-English section (vs the earlier mixed-language `docs-en-toggled.png`). |
| 2 | Inactive tabs' `aria-controls` pointed to non-existent panel ids | All four panels now rendered; inactive ones carry the `hidden` attribute, so every `aria-controls` resolves. | Test "every tab aria-controls references a panel present in the DOM" passes across all projects. |
| 3 | No arrow-key navigation on the `role="tablist"` | Full WAI-ARIA tabs pattern: roving `tabindex` (active tab `0`, others `-1`) + `onKeyDown` for ArrowUp/Down/Left/Right (wrapping) and Home/End, moving focus and selection together. | Test "tabs support keyboard navigation (Arrow / Home / End)" passes; live drive: ArrowDown from tab 0 → "Architecture" selected, focus `docs-tab-1`. |
| 4 | "No item missing its description" not enforced by a test | New test iterates all four tabs and asserts non-empty title + description on every item. | Test "every item in every tab has a non-empty title and description" passes. |
| 5 | Several distinct titles resolve to the same doc top (no anchors) | No action — faithful to the approved design; documented as acceptable in the review. | — |
| 6 | EN `docSections` never served at runtime | Resolved as a side effect of #1 — the EN data now renders when the user toggles to English. | Same as #1 evidence. |

## Checks

| Command | Result |
|---|---|
| `npx astro check` | 15 errors — **same as `main` baseline**; none in changed files (`DocsTabs.tsx`, `Docs.astro`, `HowItWorksLoop.tsx`, `HowItWorks.astro`, `useLanguage.ts`, `LanguageToggle.tsx`). |
| `npx knip` | Unused files 11 (no new orphans; back to apply-phase state after inlining the `Language` type to avoid dragging in `utils.ts`); `useLanguage.ts` not flagged. |
| `npm run build` | ✅ Completed; 1 page. |
| `npx playwright test` (full) | **189 passed** (Desktop-Dark, Desktop-Light, Mobile-Dark) — 12 new since apply, including toggle/keyboard/aria/all-descriptions. |
| Real-browser drive | ES↔EN toggle re-renders both islands; keyboard nav works. `docs-en-fixed.png` captured. |

## Files changed (gap resolution)

- `src/i18n/useLanguage.ts` (new) — language hook.
- `src/components/LanguageToggle.tsx` — dispatch `languagechange`.
- `src/components/DocsTabs.tsx` — reactive + full ARIA tabs pattern.
- `src/components/HowItWorksLoop.tsx`, `src/components/HowItWorks.astro` — reactive.
- `src/components/Docs.astro` — pass both languages + `initialLang`.
- `tests/design-compliance.spec.ts` — 4 new/updated Docs tests.

## Conclusion

All six review gaps are resolved (5 & 6 needed no/side-effect action). The mixed-language state — the only user-visible gap — is fixed and verified in a real browser. No regressions.

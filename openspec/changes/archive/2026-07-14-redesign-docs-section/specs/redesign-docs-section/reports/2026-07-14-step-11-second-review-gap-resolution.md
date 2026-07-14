# Step 11 — Second-review gap resolution

**Date:** 2026-07-14
**Branch:** `feature/redesign-docs-section`

Resolves the Minor gaps from the second adversarial review. Artifacts updated first (new `island-i18n` capability, `design.md` event-rename decision, `tasks.md` group 11), then code.

## Gaps and resolutions

| Gap (review 2) | Resolution | Evidence |
|---|---|---|
| `HowItWorksLoop` reactivity had no automated test | Added test "How It Works › switches language on toggle" (step labels ES→EN, and not-ES after). | Test passes on all projects. |
| `HowItWorksLoop` reactivity had no governing spec | Added new capability `island-i18n` (proposal + `specs/island-i18n/spec.md`) covering runtime language reactivity for the docs tabs and the how-it-works loop, plus restored-on-load and native-event robustness. | `openspec validate` passes. |
| Only docs ES→EN was automated (no round-trip / restored-on-load) | Added "Docs › language toggle round-trips (ES → EN → ES)" and "Docs › renders the stored language preference on load" (`localStorage=en` via `addInitScript`). | Both tests pass. |
| `languagechange` reused the native `window` event name | Renamed the custom event to `s2b:languagechange` (dispatch in `LanguageToggle`, listener in `useLanguage`). | Drive: bare `new Event('languagechange')` leaves tab0 = "Empezar"; real toggle (`s2b:languagechange`) → "Getting started". |
| `Language` union duplicated in live code | Exported `Language` from `src/i18n/index.ts`; `useLanguage.ts`, `DocsTabs.tsx`, `HowItWorksLoop.tsx` now import it. (Dead `utils.ts` copy left for the separate i18n dead-file cleanup.) | `astro check` clean; knip unchanged. |
| Transient hydration timing (heading vs island before `client:visible` mount) | No code change — inherent to `client:visible`; hook corrects on mount. Documented. | — |

## Checks

| Command | Result |
|---|---|
| `npx astro check` | 15 errors — same `main` baseline; none in changed files. |
| `npx knip` | No new orphans; `useLanguage.ts` and the new `Language` export not flagged; only the pre-existing `es`/`en` unused exports remain. |
| `npm run build` | ✅ Completed. |
| `npx playwright test` (full) | **198 passed** (Desktop-Dark, Desktop-Light, Mobile-Dark) — +9 since the first gap round (HowItWorks toggle, docs round-trip, restored-on-load ×3 projects). |
| Real-browser drive | Native `languagechange` ignored; `s2b:languagechange` from the real toggle re-renders islands; HowItWorks ES→EN verified; docs EN→ES round-trip and restored-on-load verified. |

## Files changed (this round)

- `src/i18n/index.ts` — `export type Language`.
- `src/i18n/useLanguage.ts` — import shared `Language`; listen for `s2b:languagechange`.
- `src/components/LanguageToggle.tsx` — dispatch `s2b:languagechange`.
- `src/components/DocsTabs.tsx`, `src/components/HowItWorksLoop.tsx` — use shared `Language` type.
- `tests/design-compliance.spec.ts` — +3 tests (HowItWorks toggle, docs round-trip, restored-on-load).
- OpenSpec: `proposal.md` (+`island-i18n`), `specs/island-i18n/spec.md` (new), `design.md`, `tasks.md`.

## Conclusion

All second-review Minor gaps resolved (transient-timing needed no code change). No regressions; full suite green.

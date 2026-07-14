## 0. Create Feature Branch (MUST BE FIRST)

- [x] 0.1 Create and switch to branch `feature/redesign-docs-section` from `main` before any code changes

## 1. Verify documentation links against the application repository

- [x] 1.1 For each design `href` (README `#quick-start`; `docs/self-hosting.md` + `#environment-variables-and-config` anchor; `docs/context/ARCHITECTURE-SPINE.md`, `TECHNICAL-DESIGN.md`, `PRD.md`; `docs/data-model.md`; `docs/api-spec.yml`; `CONTRIBUTING.md`; `docs/base-standards.md`; `ROADMAP.md`; `docs/development_guide.md`), confirm it resolves in `github.com/borjaberrocal87/share2brain` (via `gh`/WebFetch)
- [x] 1.2 Record a link → resolves/needs-fix reconciliation; correct any non-resolving path/anchor to a resolvable target, or drop the item — no broken link may ship
- [x] 1.3 Save the reconciliation under `specs/redesign-docs-section/reports/` (e.g. `YYYY-MM-DD-doc-link-verification.md`)

## 2. Move documentation data into the i18n JSON (single source of truth)

- [x] 2.1 In `src/i18n/es.json`, replace `docsTitle` with "Documentación navegable" and `docsSub` with the design's "…organizado por secciones." sub-copy
- [x] 2.2 In `src/i18n/es.json`, replace `docSections` with the four groups (Empezar / Arquitectura / API y Agente / Desarrollo), each item `{ title, description, href }` using the design's ES copy and the verified links
- [x] 2.3 Mirror 2.1–2.2 in `src/i18n/en.json` with the design's EN copy (Getting started / Architecture / API & Agent / Development)
- [x] 2.4 Run the existing en/es key-parity check and confirm no key drift

## 3. Update types and the Astro consumer

- [x] 3.1 Update the `Translations` type (derived from `typeof esRaw`; the JSON edit already reflects the new item shape — no manual type edit required) in `src/i18n/index.ts` so `docSections` is `{ name; items: { title; description; href }[] }[]`
- [x] 3.2 In `src/components/Docs.astro`, delete the hard-coded `docSectionsEs`/`docSectionsEn` arrays and source `docSections` from the selected language's translations; keep the `docsKicker`/`docsTitle`/`docsSub` `data-i18n` spans and align their fallback text with the design copy

## 4. Update the DocsTabs island to the design layout

- [x] 4.1 Update `DocItem`/`DocSection` interfaces in `src/components/DocsTabs.tsx` to `{ title, description, href }`
- [x] 4.2 Render each item as two lines — title (font-heading/semibold ~15.5px) over description (muted ~13px) — matching the design markup
- [x] 4.3 Make the external-link icon persistent (remove `opacity-0 group-hover:opacity-60`; muted color, always visible)
- [x] 4.4 Keep tab semantics (`role="tablist"`/`tab`/`tabpanel`, `aria-selected`, `aria-controls`/`id`) and set each link's `aria-label` from its title while preserving the "opens in new tab" affordance and `target="_blank" rel="noopener noreferrer"`

## 5. Review and Update Existing Tests (MANDATORY)

- [x] 5.1 Search for existing tests/specs covering the docs section (Playwright specs, snapshots); update them for the new taxonomy/item shape. Note: the project has no Vitest unit suite — if none exist, record that and rely on the Playwright drive in Step 7

## 6. Run Checks and Verify Build (MANDATORY — AGENT MUST EXECUTE)

- [x] 6.1 Run `npx astro check` and resolve any type/diagnostic errors
- [x] 6.2 Run `npx knip` and confirm no new unused exports/files (e.g. the removed arrays leave no orphans)
- [x] 6.3 Run `npm run build` and confirm it completes without errors and `dist/` contains the page
- [x] 6.4 Save a report under `specs/redesign-docs-section/reports/` (`YYYY-MM-DD-step-6-checks-and-build-verification.md`) with commands and summarized results

## 7. Manual Visual/Functional + E2E Testing (MANDATORY — AGENT MUST EXECUTE)

- [x] 7.1 Serve the built site (`npx astro preview --port 4399`, or `npm run dev` at `http://localhost:4321`) and open the `#docs` section
- [x] 7.2 Verify the four tabs render in order, tab switching swaps the panel items, and each item shows title + description with a persistent external-link icon
- [x] 7.3 Verify light and dark themes render correctly and the layout is responsive (no overflow of the two-line items at narrow widths)
- [x] 7.4 Drive with Playwright: click through all tabs, assert item counts/titles, and confirm links carry the correct verified `href`, `target="_blank"`, and `rel="noopener noreferrer"`; check keyboard focus/selection on tabs
- [x] 7.5 Compare against `context/design/design.html` `#docs` and document findings/screenshots in a report under `specs/redesign-docs-section/reports/`

## 8. Update Technical Documentation (MANDATORY)

- [x] 8.1 Update `docs/frontend-standards.md` to reflect the DocsTabs item model (title+description) and that docs data lives in the i18n files (single source)
- [x] 8.2 Update `docs/data-model.md` if it documents the docs-section content structure/navigation

## 10. Gap resolution (post-adversarial-review)

- [x] 10.1 Add `src/i18n/useLanguage.ts` — a hook that initializes from the stored language on mount and re-renders on a `languagechange` `CustomEvent`
- [x] 10.2 In `LanguageToggle.tsx`, dispatch `window.dispatchEvent(new CustomEvent('languagechange', { detail: newLang }))` alongside the existing `__applyTranslations` call
- [x] 10.3 Make `DocsTabs` language-reactive: accept both languages' sections + `initialLang`, select via `useLanguage`; keep single-source data (both come from i18n `docSections`)
- [x] 10.4 Implement the full ARIA tabs pattern in `DocsTabs`: render all panels (inactive `hidden`) so every `aria-controls` resolves; roving `tabindex`; `onKeyDown` for ArrowLeft/Right (wrapping) + Home/End moving focus and selection
- [x] 10.5 Update `Docs.astro` to pass `translations.es.docSections` / `translations.en.docSections` + `initialLang`
- [x] 10.6 Make `HowItWorksLoop` language-reactive with the same hook; update `HowItWorks.astro` to pass both languages' assembled steps/loopback/note + `initialLang`
- [x] 10.7 Extend tests: docs language toggle (ES→EN updates tabs+items), keyboard nav (Arrow/Home/End), all items have non-empty title+description, every tab `aria-controls` resolves to a present panel
- [x] 10.8 Re-run checks (`astro check`, `knip`, `build`) and the full Playwright suite; drive the ES↔EN toggle and keyboard nav in a real browser; save an updated report under `specs/redesign-docs-section/reports/`

## 11. Second-review gap resolution

- [x] 11.1 Rename the custom event to the namespaced `s2b:languagechange` in `LanguageToggle.tsx` (dispatch) and `useLanguage.ts` (listener), avoiding the native `window` `languagechange` collision
- [x] 11.2 Centralize the `Language` type: export `Language` from `src/i18n/index.ts` and consume it in `useLanguage.ts`, `DocsTabs.tsx`, and `HowItWorksLoop.tsx` (removes the duplicated inline unions in live code; dead `utils.ts` copy deferred to the i18n dead-file cleanup follow-up)
- [x] 11.3 Add a test asserting `HowItWorksLoop` switches language on toggle (step labels ES→EN)
- [x] 11.4 Add docs tests for the EN→ES round-trip and the stored-language-applies-on-load path
- [x] 11.5 Re-run checks (`astro check`, `knip`, `build`) and the full Playwright suite; drive the how-it-works toggle + round-trip + restored-on-load in a real browser; update the report under `specs/redesign-docs-section/reports/`

## 9. Finalize

- [x] 9.1 Re-validate the change (`openspec validate redesign-docs-section`) and confirm all specs scenarios are satisfied before archiving
- [x] 9.2 Re-validate after gap resolution and confirm the new scenarios (keyboard, language reactivity, aria-controls) are satisfied
- [x] 9.3 Re-validate after second-review gap resolution and confirm the `island-i18n` scenarios are satisfied

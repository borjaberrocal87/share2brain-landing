## 0. Setup (MUST BE FIRST)

- [x] 0.1 Feature branch — per user decision, implemented in place on `feat/landing-content-rewrite` (no separate branch)
- [x] 0.2 Run `npm ci` to ensure dependencies are installed

## 1. Copy (i18n)

- [x] 1.1 Add `"ctaDemo": "Ver demo en vivo"` under `hero` in `src/i18n/es.json` (after `ctaSecondary`)
- [x] 1.2 Add `"ctaDemo": "See live demo"` under `hero` in `src/i18n/en.json` (matching position, preserving key parity)

## 2. Shared demo URL constant

- [x] 2.1 Define a single `DEMO_URL = 'https://demo.share2brain.app/'` constant; prefer a shared module (e.g. `src/config/site.ts`) if one exists, otherwise an identical local `const` in each component frontmatter

## 3. Hero CTA (`src/components/Hero.astro`)

- [x] 3.1 Add a primary anchor as the FIRST child of the CTA group (`role="group"`), before the "View on GitHub" link
- [x] 3.2 Wire it: `href={DEMO_URL}`, `target="_blank"`, `rel="noopener noreferrer"`, descriptive `aria-label` (e.g. "Watch the Share2Brain live demo (opens in new tab)")
- [x] 3.3 Style as primary per design: gradient `linear-gradient(150deg, #FFCB6B, #F5A623)`, `color: var(--on-accent)`, `font-weight: 700`, radius `12px`, shadow `0 12px 28px -12px rgba(245,166,35,0.7)`, padding `13px 24px`; reuse existing `transition-colors` hover idiom (do NOT use the mockup's `style-hover` pseudo-attribute)
- [x] 3.4 Add leading play icon `<path d="M8 5v14l11-7z"/>` with `aria-hidden="true"`
- [x] 3.5 Wrap label in a `<span data-i18n="hero.ctaDemo">` with the `lang === 'es' ? 'Ver demo en vivo' : 'See live demo'` default (dual-source parity)
- [x] 3.6 Add primary hover feedback: `hover:brightness-105` (with `transition-[filter]`) so the demo button brightens per design
- [x] 3.7 Make the sibling GitHub secondary button's border-hover work: move its inline border to Tailwind `border border-[color:var(--border-strong)] hover:border-[color:var(--accent)] transition-colors` so hover turns the border accent per design

## 4. Final CTA section (`src/components/CTA.astro`)

- [x] 4.1 Add a primary anchor as the FIRST child of the button group, before the "View on GitHub" link
- [x] 4.2 Wire it: `href={DEMO_URL}`, `target="_blank"`, `rel="noopener noreferrer"`, descriptive `aria-label`
- [x] 4.3 Style as primary per design (same gradient/icon/shadow; padding `14px 28px`), reusing the existing button idiom
- [x] 4.4 Add leading play icon with `aria-hidden="true"`
- [x] 4.5 Wrap label in a `<span data-i18n="hero.ctaDemo">` with the correct ES/EN default (dual-source parity)
- [x] 4.6 Add primary hover feedback (`hover:brightness-105` + `transition-[filter]`) to the CTA-section demo button
- [x] 4.7 Make the sibling GitHub secondary button's border-hover work (same Tailwind border-hover approach as 3.7)

## 5. Review and Update Existing Tests (MANDATORY)

- [x] 5.1 Extend `tests/design-compliance.spec.ts`: assert the live-demo CTA renders in BOTH Hero and CTA sections, is the FIRST button, has the play icon, `href="https://demo.share2brain.app/"`, `target="_blank"`, `rel="noopener noreferrer"`, and correct label per language
- [x] 5.2 Confirm `tests/i18n-parity.spec.ts` still passes with the new `hero.ctaDemo` key (extend if it enumerates expected keys)
- [x] 5.3 Add a test asserting the primary demo CTA brightens on hover (computed `filter` changes on hover)

## 6. Run Tests and Verify Build (MANDATORY — AGENT MUST EXECUTE)

- [x] 6.1 Run targeted tests for the changed specs first (`design-compliance`, `i18n-parity`); confirm no regressions
- [x] 6.2 Run the full test suite (`npx playwright test`; no `npm test` script) — 156 passed / 6 failed (6 pre-existing, unrelated to this change; see report)
- [x] 6.3 Run `npm run build`; confirm it completes without errors and `dist/` contains the expected pages
- [x] 6.4 Save a report to `openspec/changes/add-live-demo-cta/reports/YYYY-MM-DD-step-6-test-and-build-verification.md` with commands, summarized results, and build output

## 7. Manual Visual/Functional Testing (MANDATORY — AGENT MUST EXECUTE)

- [x] 7.1 Start `npm run dev` and verify the site loads at `http://localhost:4321`
- [x] 7.2 Verify the demo CTA renders as the primary (gradient) first button in Hero and CTA sections, with correct icon and spacing; check responsive wrap and dark/light mode
- [x] 7.3 Toggle language ES↔EN and confirm the demo label updates via `data-i18n`; confirm the no-JS/SSR default matches the build-time locale
- [x] 7.4 Confirm the link points to `https://demo.share2brain.app/` and opens in a new tab; verify no broken layout or console errors
- [x] 7.5 Document findings in `openspec/changes/add-live-demo-cta/reports/YYYY-MM-DD-step-7-manual-visual-testing.md`

## 8. E2E Testing with Playwright MCP (MANDATORY — AGENT MUST EXECUTE)

- [x] 8.1 No Playwright MCP server connected — drove real Chromium via installed Playwright instead (see report)
- [x] 8.2 Assert both demo CTAs are present, first-in-group, and carry the correct `href`/`target`/`rel`; verify the link resolves (or is reachable) without navigating away destructively
- [x] 8.3 Document scenarios and outcomes in a report under `openspec/changes/add-live-demo-cta/reports/`

## 9. Update Technical Documentation (MANDATORY)

- [x] 9.1 Update `docs/frontend-standards.md` to note the primary live-demo CTA pattern and the shared `DEMO_URL` constant, if not already covered
- [x] 9.2 If the `DEMO_URL`/demo instance warrants it, note the external demo dependency in `docs/development_guide.md`

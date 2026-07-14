## Why

The landing page currently offers only secondary actions ("View on GitHub"), giving visitors no direct way to experience the product before self-hosting it. The updated design (`context/design/design.html`) introduces a primary "Ver demo en vivo" / "See live demo" call-to-action that sends visitors straight to the hosted live demo at `https://demo.share2brain.app/`, lowering the barrier to evaluation and giving both the Hero and the final CTA sections a clear primary action.

## What Changes

- Add a new **primary** CTA button — gradient styling with a leading play icon — labeled "Ver demo en vivo" (ES) / "See live demo" (EN), linking to `https://demo.share2brain.app/` and opening in a new tab.
- Place the button as the **first** action (before the existing "View on GitHub" button) in two sections:
  - Hero (`src/components/Hero.astro`)
  - Final CTA (`src/components/CTA.astro`)
- Add a new bilingual copy key `hero.ctaDemo` to both `src/i18n/es.json` and `src/i18n/en.json`, wired via `data-i18n` so runtime language toggling works.
- Keep both the SSR hardcoded component defaults and the i18n JSON in sync (dual-source copy constraint).
- Extend Playwright coverage so the new CTA is asserted in both sections and i18n key parity is preserved.

Non-goals (explicitly out of scope): the unrelated `share2brain`→`keephive` / `s2b`→`kh` rebrand present in the design mockup diff, and any change to existing GitHub links or the canonical app repo.

## Capabilities

### New Capabilities
- `live-demo-cta`: The landing page presents a primary, bilingual "live demo" call-to-action in the Hero and final CTA sections that links visitors to the hosted live demo, opens safely in a new tab, and stays consistent across SSR and runtime language toggling.

### Modified Capabilities
<!-- None. `content-accuracy` governs copy fidelity to the app source and is unaffected by adding a new CTA. -->

## Impact

- **Components**: `src/components/Hero.astro`, `src/components/CTA.astro` (add primary anchor + `data-i18n` span; shared `DEMO_URL` constant).
- **Copy**: `src/i18n/es.json`, `src/i18n/en.json` (new `hero.ctaDemo` key, parity required).
- **Tests**: `tests/design-compliance.spec.ts` (new CTA assertions), `tests/i18n-parity.spec.ts` (parity holds with new key).
- **External dependency**: the hosted demo at `https://demo.share2brain.app/` must be reachable; the button is a plain external link (no runtime coupling).
- No backend, build-pipeline, or dependency changes.

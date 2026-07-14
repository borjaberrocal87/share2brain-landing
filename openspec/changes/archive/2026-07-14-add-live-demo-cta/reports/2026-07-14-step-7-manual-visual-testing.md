# Step 7 — Manual Visual / Functional Testing

**Change:** add-live-demo-cta
**Date:** 2026-07-14
**Executed by:** agent (Claude), against `npm run dev` at http://localhost:4321

## Method

Started the dev server, drove a headless Chromium (1440×900) to the landing, and captured element-level screenshots of both CTA groups in Spanish and English. Attribute values read directly from the live DOM.

## Runtime DOM assertions (both demo links)

```json
[
  { "href": "https://demo.share2brain.app/", "target": "_blank", "rel": "noopener noreferrer", "label": "See live demo" },
  { "href": "https://demo.share2brain.app/", "target": "_blank", "rel": "noopener noreferrer", "label": "See live demo" }
]
```

(Labels shown after toggling to EN; ES default is "Ver demo en vivo".)

## Visual findings

- **Hero (ES):** Primary gradient button "▶ Ver demo en vivo" renders **first**, before the secondary "Ver en GitHub" outline button. Play icon present, dark ink on amber gradient — matches the approved design.
- **Final CTA section (ES):** Same primary gradient demo button, **first**, before "Ver en GitHub". Correct larger padding.
- **Hero (EN):** Label updates to "See live demo" on language toggle (runtime `data-i18n` binding works); GitHub button reads "View on GitHub".
- No layout breakage, no overflow, buttons wrap correctly in the flex group.

Screenshots captured: `hero-cta-es.png`, `cta-section-es.png`, `hero-cta-en.png` (session scratchpad).

## Theme / responsive

- Full Playwright suite exercises Desktop-Dark, Desktop-Light, and Mobile-Dark (375px) projects; the live-demo tests pass in all three, and the responsive `no-overflow` tests pass at 375/768/1440.

## Result

PASS — the live-demo CTA renders as the primary, first action in both sections, is correctly localized and toggles at runtime, and links safely to the demo. No visual regressions attributable to this change.

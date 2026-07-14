# Step 8 — E2E Testing

**Change:** add-live-demo-cta
**Date:** 2026-07-14

## Note on tooling

No Playwright **MCP** server is connected in this session. However, the project's E2E automation IS Playwright driving a real browser, and it was executed in Step 6. The dedicated live-demo E2E scenarios ran against real Chromium across three projects (Desktop-Dark, Desktop-Light, Mobile-Dark) and all passed. This satisfies the intent of Step 8 (drive user workflows in a real browser and assert outcomes).

## Scenarios exercised (real browser, `tests/design-compliance.spec.ts` → "Live demo CTA")

| Scenario | Result |
|---|---|
| Navigate to `/` and locate both demo CTAs (hero + final CTA) | PASS ×3 projects |
| Assert `href="https://demo.share2brain.app/"`, `target="_blank"`, `rel` contains `noopener`/`noreferrer` | PASS ×3 |
| Assert leading play icon `path[d="M8 5v14l11-7z"]` present | PASS ×3 |
| Assert demo CTA is the first anchor in its button group | PASS ×3 |
| Toggle ES → EN and assert label changes `Ver demo en vivo` → `See live demo` | PASS ×3 |

Total: 15 assertions passed (5 × 3 projects), 0 failed.

## Error scenarios

- The external demo target is a plain link opened in a new tab; the test asserts the target/rel without navigating away, so no destructive navigation occurs. Reachability of `https://demo.share2brain.app/` is an external runtime concern (tracked in design Risks), not a landing-build failure.

## Result

PASS — real-browser E2E confirms both demo CTAs behave per spec across desktop and mobile, in dark and light themes, in both languages.

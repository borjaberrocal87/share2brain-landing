# Step 9 / 10 — Visual & E2E Verification

**Change:** fix-responsive-layout
**Date:** 2026-07-15
**Executed by:** agent (real Chromium via Playwright runner)

## Playwright MCP availability

No Playwright MCP server is connected in this (non-interactive) session. The
equivalent E2E/visual verification was performed with the **Playwright test
runner** driving real Chromium across 3 projects (Desktop-Dark 1440, Desktop-Light
1440, Mobile-Dark 375) and, within tests, explicit viewport sizes of
320/375/414/768/800/819/820/1024/1440 px. Screenshots were captured and inspected.

## Behavioral verification (automated, all passing)

- **No horizontal overflow** at 320/375/414/768/820/1024/1440 px — asserted on
  `scrollWidth <= clientWidth + 1`, independent of `overflow-x`. The global mask
  is removed, so these prove the page genuinely fits.
- **Navigation present at every width**, exactly one control shown; verified the
  former 768–820 px dead-zone (768/800/819) now always shows the hamburger.
- **Anchor navigation** clears the sticky header for all six anchors
  (`#producto`, `#features`, `#how`, `#docs`, `#stack`, `#install`) across all 3
  projects.

## Screenshot inspection (see `reports/screens/`)

| Screenshot | Result |
|---|---|
| `header-320.png` | Hex logo only (wordmark hidden < 360px), ES/EN + theme + hamburger fit; no overflow. |
| `header-768.png` | Wordmark shown, hamburger present (dead-zone fixed). |
| `header-820.png` | Still hamburger (< 821); no overflow. |
| `header-1440.png` / `full-1440.png` | Desktop nav shown; layout intact. |
| `menu-open-375.png` | Drawer opens (button → X); no layout break, no horizontal overflow. |
| `anchor-stack-1440.png` | After clicking "Stack", no section title trapped under the sticky header. |
| `full-320/768/820.png` | Full-page renders — all modules fully visible, nothing clipped at the right edge. |

## Theme

Verified in both dark (Desktop-Dark, Mobile-Dark) and light (Desktop-Light)
projects — 228/228 pass in both; no theme-specific regression. No hardcoded
theme colors were introduced (the pre-existing `text-white` in StackArch was left
unchanged, out of scope).

## Verdict

✅ Navigation usable across 320–1440 px with no dead-zone. ✅ No clipping / no
horizontal scroll at any tested width. ✅ Anchors clear the header. ✅ Dark/light
and ES/EN behavior intact.

## Context

The landing (`src/pages/index.astro`) is a static Astro + Tailwind site with React islands. It suffers from responsive defects that surface as clipped modules. An audit identified the concrete causes:

1. **Nav breakpoint mismatch.** Tailwind toggles the nav on `md` (768px) — `Header.astro:68` (`hidden md:flex`), `MobileMenu.tsx:48` (`md:hidden`) — but custom CSS media queries in `global.css:146/157` toggle the same elements at 820/821px with `!important`. Net effect: in the 768–820px window **neither** the desktop nav nor the hamburger renders.
2. **Sticky-header anchor overlap.** The header is `sticky top-0 h-[66px]` (`Header.astro:22,31`) with `scroll-behavior: smooth` (`global.css:73`), but no `scroll-padding-top`/`scroll-margin-top` exists, so anchor targets scroll under the header.
3. **`auto-fit` grids without a 1-column fallback.** Grids like `grid-cols-[repeat(auto-fit,minmax(300px,1fr))]` (StackArch:88, Installation:55, ValueProps:40, DocsTabs:51, Features:50, UseCases:42, HowItWorksLoop:112, StackArch:71) force a track wider than the viewport on narrow phones, then get clipped by the global net. `Hero.astro:36` already does it correctly with `grid-cols-1 md:grid-cols-[repeat(auto-fit,...)]`.
4. **Masking net.** `html { overflow-x: hidden }` (`global.css:74`) and inline `overflow-x: hidden; max-width:100vw` on `<main>` (`index.astro:23`) hide the scrollbar but clip content — the "cortado" symptom — and neutralize the existing overflow tests, which only fail when `overflow-x` is *not* hidden (`design-compliance.spec.ts:599-628`).

Constraints: static SSG, mobile-first, documented breakpoints `sm 640 / md 768 / lg 1024 / xl 1280` (`docs/frontend-standards.md`); must preserve CLS < 0.1, Lighthouse ≥ 95, ≥44×44px touch targets, dark/light theming, and ES/EN parity.

## Goals / Non-Goals

**Goals:**
- Eliminate horizontal overflow / clipping at 320–1440px **without relying on** `overflow-x: hidden`.
- Guarantee a navigation control at every width, switching desktop/hamburger at one canonical breakpoint.
- Make anchor navigation land section titles below the sticky header.
- Make long code / flow content scroll or wrap within its own bounds.
- Harden the responsive tests so the defects cannot silently regress, then remove the masking net.

**Non-Goals:**
- Visual redesign, new sections, or copy changes.
- Fixing the undefined `.clip-path-hex` utility (hex icons render as squares) — tracked separately; out of scope for "cut-off".
- Changing i18n, CTA, or docs-navigation behavior (governed by other specs).
- Backend / build / deployment changes.

## Decisions

### D1 — Converge the nav switch on a single Tailwind breakpoint
Remove the raw `@media (max-width:820px)`/`(min-width:821px)` overrides in `global.css` and drive the desktop-nav/hamburger switch purely from Tailwind so the utility class and the actual toggle point agree.
- **Preferred:** use the documented `md` (768px) breakpoint (`hidden md:flex` / `md:hidden`), matching `docs/frontend-standards.md`.
- **Verification gate (during apply):** measure the header row at 768px. If logo + wordmark + LanguageToggle + ThemeToggle fit without overflow, keep `md`. If they don't fit (the likely reason the 820px override existed), register a single custom screen `nav: '820px'` in `tailwind.config.mjs` and use `hidden nav:flex` / `nav:hidden` — still one canonical breakpoint, no raw CSS media queries.
- **Why not keep both:** two breakpoints on the same elements is the root cause of the dead-zone; a single source of truth is mandatory.
- **Alternative considered:** keep CSS media queries and drop the Tailwind prefixes — rejected, because it splits responsive logic out of the components where it belongs and contradicts the Tailwind-utility standard.

### D2 — Anchor offset via `scroll-padding-top` on the scroll container
Add `scroll-padding-top: <header-height>` to `html` (which owns `scroll-behavior: smooth`) rather than `scroll-margin-top` on each section, so one rule covers all current and future anchors.
- Tie the value to the 66px header. To avoid drift, express the header height as a CSS custom property (e.g. `--header-h: 66px`) consumed by both the header sizing and `scroll-padding-top`.
- **Alternative considered:** per-section `scroll-margin-top` — rejected as repetitive and easy to forget on new sections.

### D3 — Single-column fallback for every `auto-fit` grid
Prefix each offending `auto-fit` grid with `grid-cols-1 md:` so it is one column below `md` and only switches to the auto-fit track at ≥768px, mirroring `Hero.astro:36`. This removes the sub-`md` overflow source entirely rather than clipping it.
- **Alternative considered:** lowering each `minmax` floor to ~150px — rejected; brittle, must be tuned per card, and still risks overflow on the narrowest devices.

### D4 — Contain long content locally
- HowItWorksLoop inline code block (`HowItWorksLoop.tsx:133-149`): add `overflow-x-auto` so long lines scroll like `CodeBlock`, instead of ragged div wrapping.
- StackArch Event-Driven flow (`StackArch.astro:139-174`): add `flex-wrap` so the Producer→stream→Consumer row wraps on narrow cards instead of crushing.

### D5 — Test-first, then remove the mask
Order matters (TDD, per project §1):
1. Rewrite the three overflow tests to assert `documentElement.scrollWidth <= clientWidth + 1` **regardless of** `overflow-x`; add 320px and 820px cases; add a nav-visibility test spanning 768–820px and an anchor-scroll test. These fail against current code.
2. Apply D1–D4 until the new tests pass.
3. **Only then** remove `overflow-x: hidden` from `html` and the inline style on `<main>`, and re-run the suite to prove overflow is genuinely gone, not hidden.
- **Why keep the net until last:** removing it first would expose clipping as visible horizontal scroll in production during the fix window; removing it last makes the tests the proof.

## Risks / Trade-offs

- **Header may not fit at 768px** → D1 verification gate: fall back to a custom `nav:820` screen; no dead-zone either way.
- **Removing `overflow-x: hidden` re-exposes a missed overflow source** → keep it until D5 step 3; the hardened tests at 320/375/768/820/1440 (plus manual check) catch any remainder before removal. If one is found, fix the source rather than reinstating the net.
- **`scroll-padding-top` drift if header height changes** → mitigated by sourcing both from one `--header-h` custom property (D2).
- **Grid fallback could change desktop appearance** → the `md:` prefix leaves ≥768px rendering identical to today; only sub-`md` changes, which is the intended fix.
- **CLS/perf regression** → changes are CSS-class/media-query only, no new assets or JS; verify Lighthouse unaffected.

## Open Questions

- None blocking. The only branch (md vs. custom `nav:820`) is resolved by the D1 verification gate at implementation time and does not change the spec-level guarantee (a single breakpoint, no dead-zone).

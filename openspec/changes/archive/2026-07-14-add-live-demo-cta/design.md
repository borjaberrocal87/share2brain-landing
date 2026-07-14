## Context

The landing is a static Astro site. Marketing copy has **two synchronized sources** (documented from prior work on `content-accuracy`):

1. **SSR hardcoded defaults** inside each `*.astro` component — the `lang === 'es' ? … : …` ternaries. This is what crawlers, no-JS visitors, and the pre-hydration paint render.
2. **`src/i18n/{es,en}.json`** — applied at runtime by `src/scripts/i18n-client.ts` only to elements carrying a `data-i18n` attribute.

Editing the JSON alone is insufficient: it leaves SSR HTML stale and causes a hydration flash. Any new copy must be added to **both** sources, and the text node must carry `data-i18n` for runtime toggling to work.

The approved design (`context/design/design.html`) adds a primary gradient play-button CTA — `t.hero.ctaDemo` = "Ver demo en vivo" / "See live demo" — placed first in both the Hero and the final CTA button groups. The mockup diff also contains an unrelated `share2brain`→`keephive` rebrand; that is explicitly excluded here.

The demo destination is confirmed: `https://demo.share2brain.app/`.

## Goals / Non-Goals

**Goals:**
- Add a primary "live demo" CTA to the Hero (`src/components/Hero.astro`) and final CTA (`src/components/CTA.astro`) sections, first in each button group.
- Link to `https://demo.share2brain.app/`, opening in a new tab with `rel="noopener noreferrer"`.
- Add bilingual `hero.ctaDemo` copy, wired via `data-i18n` and mirrored in component defaults so SSR and runtime toggling agree.
- Preserve i18n key parity and keep the Playwright suite green.

**Non-Goals:**
- The `share2brain`→`keephive` / `s2b`→`kh` rebrand, localStorage-key changes, or repo-URL changes from the mockup diff.
- Fixing the pre-existing bug where React-island / build-time-`lang` sections do not live-toggle (Hero and CTA are plain Astro with `data-i18n`, so they are unaffected).
- Building an in-page demo, video embed, or modal — the CTA is a plain external link.

## Decisions

- **Demo destination = external link, new tab.** `href="https://demo.share2brain.app/"`, `target="_blank"`, `rel="noopener noreferrer"`. Rationale: confirmed with requester; keeps the static site decoupled from the demo instance. Alternatives considered (on-page anchor, video modal) were rejected per the requester's choice.
- **Centralize the URL in one constant.** Define `DEMO_URL = 'https://demo.share2brain.app/'` once and reference it from both buttons, so a future URL change is a single edit. Rationale: DRY; the URL appears in two components. Given it is used across two files, prefer a shared module (e.g. a small `src/config/site.ts` export) over duplicating it in each component frontmatter; if the repo has no such config location, a local `const` per component is acceptable but must be identical.
- **Single copy key `hero.ctaDemo` for both buttons.** Rationale: the label is identical in both sections and the mockup references `t.hero.ctaDemo` in both; one key avoids drift and keeps parity simpler.
- **Dual-source copy + `data-i18n`.** Add `hero.ctaDemo` to `es.json` and `en.json`, add the matching ternary default in each component, and put `data-i18n="hero.ctaDemo"` on the label span. Rationale: the mandatory two-source constraint above.
- **Reuse existing button idiom, not the mockup's raw markup.** Match the sibling GitHub anchor's Tailwind/inline-style pattern. Do **not** copy the mockup's invalid `style-hover` pseudo-attribute. The primary style is the gradient `linear-gradient(150deg, #FFCB6B, #F5A623)`, `color: var(--on-accent)`, `font-weight: 700`, radius `12px`, shadow `0 12px 28px -12px rgba(245,166,35,0.7)`, with a leading play icon (`<path d="M8 5v14l11-7z"/>`, `aria-hidden="true"`). Rationale: consistency and valid HTML.
- **Hover feedback via Tailwind `hover:` utilities, not inline `:hover`.** The mockup's `style-hover` maps to real hover states: the primary (demo) button brightens (`filter: brightness(1.05)`) and the secondary (GitHub) button's border turns accent-colored. Inline `style` cannot express `:hover`, so use Tailwind: `transition-[filter] hover:brightness-105` on the primary. For the secondary, the border color is set inline, which would beat a `hover:border-*` class (inline specificity); to let the design's border-hover work, move its border to Tailwind classes (`border border-[color:var(--border-strong)] hover:border-[color:var(--accent)] transition-colors`). Rationale: without an actual `:hover` rule the buttons had no hover response at all (the bug reported after apply).
- **Accessibility.** Anchor carries a descriptive `aria-label` (e.g. "Watch the Share2Brain live demo (opens in new tab)"); icon is `aria-hidden`. Rationale: matches existing GitHub-link a11y conventions.

## Risks / Trade-offs

- **Demo instance unavailable / not yet deployed** → The button would lead to a dead page. Mitigation: URL is centralized for a one-line change; confirm `https://demo.share2brain.app/` is live before/at release.
- **SSR and JSON drift** (the classic two-source trap) → Mitigation: add copy to both sources in the same change and assert the rendered label in Playwright for both locales.
- **Duplicated URL across two components** → Mitigation: shared `DEMO_URL` constant.
- **Visual regression in existing button rows** (new first button changes wrap/spacing) → Mitigation: reuse existing flex/gap container; verify via `design-compliance` visual/DOM assertions.

## Migration Plan

Not applicable — additive UI change on a static site. Rollback is reverting the component/i18n/test edits; no data or deploy migration.

## Open Questions

- None blocking. (Demo URL confirmed; shared-constant location to be chosen during implementation based on whether a `src/config` module already exists.)

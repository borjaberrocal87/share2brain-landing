## Context

The `#docs` section is rendered by `src/components/Docs.astro`, which hard-codes two arrays (`docSectionsEs`, `docSectionsEn`) of `{ name, href }` items and passes the language-selected array to the `DocsTabs` React island (`client:visible`). A separate, now-stale `docSections` key also exists in `src/i18n/es.json` / `en.json` and is unused by the render path — a dual-source drift hazard.

Design source of truth: `context/design/design.html` (I18N `docSections`, lines 443–468 ES / 551–575 EN; render markup lines 246–275). The design defines four topic groups, `{ t, d, href }` items (title + description), a two-line entry layout, and a persistent external-link icon.

Constraints:
- Static Astro site; React is used only for islands. Follows `docs/frontend-standards.md`.
- The client-side language toggle (`src/scripts/i18n-client.ts`) only rewrites `data-i18n` text nodes; it does not re-render React islands. `src/pages/index.astro` fixes `lang = 'es'` at build time and passes it to `Docs`. This is the same pattern `HowItWorksLoop` already follows for its per-step descriptions.

## Goals / Non-Goals

**Goals:**
- Match the design's four-group taxonomy, title+description item model, heading/sub-copy, and persistent external-link affordance.
- Establish a single source of truth for doc data in the i18n JSON.
- Ensure every doc link resolves in the application repository.
- Preserve accessible tab semantics and light/dark theming.

**Non-Goals:**
- Any visual restyling beyond the design (spacing, radii, hex motifs unchanged).
- Changes to other sections, routes, or the build pipeline.
- Server-side per-language routing (e.g. `/en`); language remains a client-side toggle over a single ES-built page.

**Added to scope (gap resolution, post-review):**
- Runtime language reactivity for the docs island (and, for consistency, the sibling `HowItWorksLoop` the review flagged as sharing the defect) so a language toggle updates island content, not just `data-i18n` spans.
- Full WAI-ARIA tabs pattern in `DocsTabs`: all panels present (inactive hidden) so every `aria-controls` resolves, roving `tabindex`, and arrow/Home/End keyboard navigation.

## Decisions

- **Single source in i18n JSON (over keeping arrays in `Docs.astro`).** `docSections` moves fully into `src/i18n/es.json` / `en.json` as `{ title, description, href }[]` groups; `Docs.astro` reads the language's translations and passes them to `DocsTabs`; the hard-coded arrays are deleted. *Why:* removes the duplicate/stale definition, aligns with how copy already lives in i18n, and keeps ES/EN parity checkable with the existing parity command. *Alternative rejected:* keeping data in `Docs.astro` and deleting the i18n key — less churn but leaves doc copy outside the translation layer and inconsistent with the rest of the site.
- **Field naming `{ title, description, href }`.** Use descriptive English field names in the codebase (the design's `t`/`d` are mockup shorthand). *Why:* matches project naming conventions (clear, descriptive names) and the existing `DocItem` field `name`. `DocsTabs`'s `DocItem`/`DocSection` interfaces and `Translations` type update to match.
- **Two-line render + persistent icon in `DocsTabs`.** Render title (600, ~15.5px) over description (muted, ~13px); replace the hover-only `opacity-0 group-hover:opacity-60` external-link icon with a persistent muted icon, matching the design markup. *Why:* the user chose "match design (always visible)".
- **Link verification during implementation.** Each design `href` is checked against `github.com/borjaberrocal87/share2brain` (via `gh`/WebFetch) before the copy is finalized; non-resolving targets are corrected or the item dropped. *Why:* the user chose "verify now & fix", and `content-accuracy` already requires links to target the app repo with source backing.
- **Accessibility carried forward.** Keep `role="tablist"`/`tab`/`tabpanel`, `aria-selected`, `aria-controls`/`id` wiring; the link's `aria-label` derives from the item title and keeps the "opens in new tab" affordance; `target="_blank" rel="noopener noreferrer"` retained.

### Gap-resolution decisions (post-adversarial-review)

- **Runtime language reactivity via a `useLanguage` hook + a namespaced `s2b:languagechange` event (over per-language SSR routing).** A new `src/i18n/useLanguage.ts` hook reads the stored language on mount and subscribes to a `s2b:languagechange` `CustomEvent`; `LanguageToggle` dispatches that event (in addition to its existing `__applyTranslations` call). The event name is **namespaced** to avoid colliding with the platform's native `window` `languagechange` event (fired when `navigator.languages` changes); the hook also guards on a valid `'es'|'en'` payload so any stray event is ignored. Islands that hold localized content receive **both** languages' data as props and pick the active one from the hook. *Why:* keeps the single ES-built static page, needs no routing, and reuses the existing toggle choke point (`LanguageToggle` is the only language switcher — `MobileMenu` does not switch language). *Alternative rejected:* building `/en` pages — larger architectural change (routing, duplicated HTML) for a client toggle that already exists.
- **Apply the hook to `DocsTabs` and `HowItWorksLoop`.** The review flagged both as sharing the desync. Resolving only `DocsTabs` would leave a known-inconsistent sibling, so both adopt the same hook. `Docs.astro` / `HowItWorks.astro` pass `es`/`en` data plus `initialLang`.
- **Full ARIA tabs pattern in `DocsTabs`.** Render all four panels, hiding inactive ones with the `hidden` attribute (so every tab's `aria-controls` resolves); active tab `tabIndex=0`, others `-1`; `onKeyDown` on the tablist handles ArrowLeft/Right (wrapping) and Home/End, moving focus and selection together. *Why:* fixes the dangling `aria-controls` and the missing arrow-key roving in one coherent change rather than patching each symptom.

## Risks / Trade-offs

- **Language reactivity adds a client event + dual-language props to islands** → Mitigation: the `useLanguage` hook is tiny and self-contained; islands ship both languages' copy (a few KB) which is acceptable for a landing page. `LanguageToggle` is the sole dispatch point, so there is one place to keep in sync. Full Playwright drive covers the ES↔EN toggle for both islands.
- **Keyboard/roving-tabindex rework could regress pointer interaction** → Mitigation: click handlers retained; Playwright covers both click and keyboard paths, plus the all-panels-rendered change is verified to still show only the active panel.
- **A design link may not resolve in the real repo** → Mitigation: verify-and-fix step is a gated task; the spec forbids shipping a broken link, so a non-resolving target is corrected or removed rather than shipped.
- **i18n type change could break other consumers of `docSections`** → Mitigation: the current render path ignores the stale key, so the only consumer becomes `Docs.astro`/`DocsTabs`; `astro check` + `knip` catch orphans and type breaks.
- **ES/EN drift when adding the description field** → Mitigation: run the existing en/es key-parity check as a DoD gate.

## Migration Plan

Not applicable at runtime (static site, no data migration). Deployment is the standard build + publish. Rollback = revert the change commit; no state is affected.

## Open Questions

None — the three prior decisions (single source → i18n JSON; external-link icon → always visible; links → verify now & fix) are resolved.

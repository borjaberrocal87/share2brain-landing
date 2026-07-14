## Why

The live Documentation section (`#docs`) has drifted from the approved design in `context/design/design.html`: it uses an outdated tab taxonomy, shows link titles without the descriptive sub-line the design specifies, and its doc data is duplicated across `Docs.astro` and a stale `docSections` key in the i18n files. Visitors evaluating Share2Brain can't scan docs by topic or tell what each link leads to, and the duplicated data is a drift/maintenance hazard.

## What Changes

- Replace the tab taxonomy with the design's four groups: **Empezar / Arquitectura / API y Agente / Desarrollo** (EN: **Getting started / Architecture / API & Agent / Development**).
- Extend each doc item from title-only to **title + description**, rendered as a two-line entry (bold title + muted description) per the design.
- Update the section heading and sub-copy to the design's wording ("Documentación navegable" / "Browsable documentation"; "…organizado por secciones").
- Point every doc link at its concrete repository document (README quick-start, `docs/self-hosting.md`, `docs/context/*`, `docs/data-model.md`, `docs/api-spec.yml`, `CONTRIBUTING.md`, `docs/base-standards.md`, `ROADMAP.md`, `docs/development_guide.md`), and verify each link resolves in the application repository before shipping.
- Make the per-item external-link icon **persistent** (always visible), matching the design, instead of the current hover-only reveal.
- Consolidate doc-section data into a **single source of truth in the i18n JSON** (`src/i18n/es.json` / `en.json`), removing the duplicated arrays in `Docs.astro`.
- **BREAKING** (internal only): the doc-item shape changes from `{ name, href }` to `{ title, description, href }`; `DocsTabs` props and the i18n `docSections` type change accordingly. No public/runtime API is affected (static site).

Out of scope: server-side per-language routing (e.g. `/en`); no restyling beyond what the design specifies.

Follow-up (post-adversarial-review): resolved the language-toggle desync that previously left React islands showing the build-time language. Interactive landing islands now re-render on a runtime language toggle; `DocsTabs` also gains the full WAI-ARIA tabs keyboard/`aria-controls` behavior.

## Capabilities

### New Capabilities
- `docs-navigation`: The browsable documentation section — its topic taxonomy, the title+description item model, persistent external-link affordance, single-source i18n data, keyboard-navigable tabs, runtime language reactivity, and the requirement that every doc link targets a resolvable document in the application repository.
- `island-i18n`: The cross-cutting behavior that interactive landing islands (the documentation tabs and the how-it-works loop) reflect the site's active language at runtime — re-rendering when the user toggles language and honoring a stored preference on load.

### Modified Capabilities
<!-- No existing spec requirements change. `content-accuracy` already governs that links target the app repo and are source-verified; this change complies with it and does not alter its requirements. -->

## Impact

- **Components**: `src/components/DocsTabs.tsx` (item model + two-line render + persistent icon + aria labels), `src/components/Docs.astro` (drive tabs from i18n, drop hard-coded arrays, update heading/sub-copy fallbacks).
- **i18n**: `src/i18n/es.json`, `src/i18n/en.json` (new `docsTitle`/`docsSub`, restructured `docSections` with `{ title, description, href }`), keeping ES/EN key parity; `src/i18n/index.ts` `Translations` type update.
- **Cross-spec**: complies with `content-accuracy` (links target `github.com/borjaberrocal87/share2brain` and are verified against source).
- **Verification**: `astro check`, `knip`, build, and a Playwright drive of the section in light and dark themes.
- No dependencies, routes, or build-pipeline changes.

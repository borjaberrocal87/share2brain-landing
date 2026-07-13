## 1. Source verification (gate — before any copy edit)

- [x] 1.1 Re-confirm the reconciliation table in design.md against the current app repo (github.com/borjaberrocal87/share2brain) package manifests; update any version/finding that drifted
- [x] 1.2 Cross-check the two open questions against source: (a) any confirmed structured logger beyond `@sentry/node`; (b) whether the reason/act/observe loop wording matches the LangGraph agent implementation — record the answers in design.md
- [x] 1.3 Extend the reconciliation table with any additional claims found while reading current `en.json` (mark each: confirmed / corrected / removed, with evidence)

## 2. Correct English copy (`src/i18n/en.json`)

- [x] 2.1 Fix `stack[]`: rename the orchestration entry to "LangGraph" (on LangChain.js); reduce the observability entry to "Sentry" (remove Pino/Prometheus); optionally add Drizzle ORM
- [x] 2.2 Fix `howSub`/`loopSteps`/`loopNote`: name LangGraph as the runtime; keep the Zod-schema tool-validation wording (confirmed); adjust loop wording per task 1.2
- [x] 2.3 Fix `hero.sub` and `vp[0]`: describe indexing of links/URLs shared in Discord channels (fetched + chunked by workers), not uploaded docs/files
- [x] 2.4 Align `hero.title` and value messaging with the "searchable, self-hosted second brain with verifiable/cited sources" positioning
- [x] 2.5 Elevate role-based, permission-aware retrieval (Discord roles → channel access enforced in retrieval) into a value prop or feature
- [x] 2.6 Reconcile `installSub`/`installSteps` and any service references with the actual Docker Compose topology (backend, bot, workers, web, Postgres+pgvector, Redis)
- [x] 2.7 Review remaining keys (`cases`, `docSections`, `archLayers`, `eventSub`, `ctaSub`, `footerTag`) for any residual inaccuracy and correct

## 3. Mirror into Spanish copy (`src/i18n/es.json`)

- [x] 3.1 Translate every corrected English value into `es.json`, preserving meaning (no English placeholders left)
- [x] 3.2 Verify `en.json` and `es.json` have identical key sets and identical array lengths for every array

## 4. SEO metadata & structured data

- [x] 4.1 Update `src/layouts/BaseLayout.astro` meta `title`/`description` and Open Graph tags to match the corrected positioning
- [x] 4.2 Update any `SoftwareApplication` JSON-LD so it contains no removed/inaccurate claim

## 5. Tests & verification

- [x] 5.1 Update/adjust `tests/design-compliance.spec.ts` assertions that pin now-changed copy; keep i18n-parity coverage (add a parity check if none exists)
- [x] 5.2 Run `npm run build` — build succeeds
- [x] 5.3 Run the Playwright suite — all pass
- [x] 5.4 Manually verify the rendered landing in EN and ES, light and dark mode: no inaccurate claim remains, no untranslated string

## 6. Finalize

- [x] 6.1 Write PR description listing each changed claim with its source-evidence reference (from the reconciliation table)

## 7. Adversarial-review fixes (blocker + majors)

- [x] 7.1 Point every GitHub link and the install `git clone`/`cd` at the app repo `share2brain` (not `share2brain-landing`): `Hero.astro` (install code + CTA href), `Installation.astro` (clone code), `Footer.astro`, `CTA.astro`, `BaseLayout.astro` JSON-LD `maintainer.url`
- [x] 7.2 Fix the web UI entry point in install snippets: `http://localhost:3000` → `http://localhost`
- [x] 7.3 Restore the YAML config: add `cp Share2Brain.config.yml.example Share2Brain.config.yml` to the install steps and mention `Share2Brain.config.yml` in the Configuration docs section (component + i18n JSON, EN/ES)
- [x] 7.4 Remove the unverified "admin panel" claim: describe the web app as the search/chat/documents/stats SPA in `installSub` (EN/ES) and the StackArch React card role
- [x] 7.5 Re-align JSON-LD `featureList` to the app's real feature list (indexing links, semantic search, RAG w/ citations, per-channel RBAC, read tracking, one-command deploy)
- [x] 7.6 Add a design-compliance assertion that the clone command / primary GitHub CTA host is `share2brain` (guards against regression); broaden the i18n parity English-leftover check
- [x] 7.7 Rebuild, re-run Playwright, and re-verify the install + GitHub-link surface (SSR + rendered)

## Context

The landing is a static Astro site. All user-facing copy is centralized in two i18n dictionaries — `src/i18n/en.json` and `src/i18n/es.json` — and rendered by `.astro` components; SEO metadata and JSON-LD live in `src/layouts/BaseLayout.astro`. There is no backend, DB, or auth to touch.

The product it describes (Share2Brain) lives in a **separate monorepo** (github.com/borjaberrocal87/share2brain) with packages `backend`, `bot`, `shared`, `web`, `workers`. During enrichment the disputed claims were verified against that repo's package manifests. The verified findings are the basis for every decision below. `context/PRD.md` in this repo is stale and explicitly excluded as a source.

### Verified claim → source-evidence reconciliation

| Copy claim | Source evidence | Verdict → action |
|---|---|---|
| Orchestration = "LangChain.js" | `packages/backend`: `@langchain/langgraph@^1.4.7`; `packages/shared`: `@langchain/core@^1.2.1` | **Correct** → "LangGraph" (on LangChain.js) |
| Indexes "docs, files and sources" | `packages/bot`: `discord.js@^14.26.4`; `packages/workers`: `undici@^7.28.0` (HTTP fetch); no upload lib anywhere | **Correct** → indexes URLs/links shared in Discord; workers fetch + chunk their content |
| Zod tool-arg validation | `packages/shared`: `zod@^4.4.0` | **Confirmed** → keep |
| Observability "Sentry · Pino · Prometheus" | `packages/shared`: `@sentry/node@^9.41.0`; no `pino`, no `prom-client` in any package | **Partly false** → "Sentry" only |
| "Anthropic or OpenAI" | `packages/shared`: `@langchain/anthropic`, `@langchain/openai` | **Confirmed** → keep |
| Providers/DB stack (Drizzle, pg, pgvector) | `packages/shared`: `drizzle-orm@^0.45.0`, `pg@^8.13.0`; pgvector is a Postgres extension (SQL-level, no npm dep) | **Confirmed** → may add Drizzle to stack list |
| Auth "Sessions and cookies" | `packages/backend`: `express-session`, `connect-redis`, `helmet` | **Confirmed** → Redis-backed session cookies |
| Repo / clone URL "share2brain-landing" | README quickstart: `git clone https://github.com/borjaberrocal87/share2brain.git` → `cd share2brain` | **WRONG (adversarial review)** → all GitHub links + install clone must target `share2brain`, not the landing repo |
| Web UI at "http://localhost:3000" | README: "Open `http://localhost` — nginx is the single public entry point (port 80)" | **WRONG** → `http://localhost` (port 80) |
| "admin panel" (web app) | `packages/web/src`: no `admin/` dir, no AdminPanel; README: web is a "React + Vite SPA (search, chat, documents, stats)" | **UNVERIFIED / false** → drop "admin panel"; describe as search/chat/docs/stats SPA |
| YAML config | README quickstart: `cp Share2Brain.config.yml.example Share2Brain.config.yml` (two config files); `packages/shared`: `yaml@^2.6.0` | **REAL — earlier removal was a MISTAKE** → restore config-file mention in install steps + docs |
| Per-channel RBAC | README: "Per-channel RBAC — Discord roles map to channel access, applied inside the vector query, never as a post-filter" | **Confirmed** → value-prop wording matches |

## Goals / Non-Goals

**Goals:**
- Every product claim in the copy is traceable to source evidence (the table above is the seed; extend it if editing surfaces new claims).
- Corrections applied identically in `en.json` and `es.json` with strict key/array parity.
- SEO meta + JSON-LD consistent with the corrected on-page copy.
- Design-compliance tests stay green; add/adjust assertions where they pin changed copy.

**Non-Goals:**
- No layout, component, or visual redesign.
- No new landing sections or features not present in the app.
- No changes to the app repository; it is read-only source of truth.
- Not treating README as sufficient — README seeded the questions, source manifests answered them.

## Decisions

- **Edit BOTH the component hardcoded defaults AND the i18n JSON.** CORRECTED during verify: the copy has two sources, not one. Each `.astro` component hardcodes its ES/EN copy for the server render; the client script (`i18n-client.ts`) only overwrites elements carrying `data-i18n`. Sections fed to React islands (`DocsTabs`, `HowItWorksLoop`) and `StackArch`'s arrays have **no** `data-i18n`, so JSON never reaches them — the hardcoded component array is the only source a user ever sees. Editing JSON alone left the served HTML stale (crawlers/no-JS/pre-hydration) and the Stack section wrong even with JS. So the fix edits the component defaults (the real source) and keeps the JSON in sync for the overlay-driven sections.
- **Source manifests are the authority, README is a pointer.** Where README and manifests could differ, manifests win (they resolved LangGraph and the Pino/Prometheus removals). This satisfies the ticket's "faithfully" bar and the user's explicit "verify from source" choice.
- **Say "LangGraph (LangChain.js)" rather than dropping LangChain entirely.** LangGraph is built on `@langchain/core`; naming both is accurate and preserves recognizability. Alternative (only "LangGraph") is acceptable but less discoverable.
- **Describe ingestion as "links shared in Discord," not "files."** Matches the bot→workers(undici) fetch pipeline. Avoids implying an upload feature that does not exist.
- **Reduce the observability line to "Sentry."** Do not substitute a guessed logger; if a structured logger is later confirmed in source, it can be added in a follow-up. Under-claiming is safer than a second inaccuracy.
- **Keep Zod and the reason/act/observe framing.** Zod is confirmed in `shared`; the reason/act/observe description is a fair characterization of a LangGraph agent loop. Flag the loop wording for a light source cross-check during apply, but it is not a blocker.

## Risks / Trade-offs

- **Source could drift after verification** (monorepo evolves). → Reconciliation records exact package + version so a future check is cheap; re-verify if the app repo changes materially before archive.
- **Translation drift between EN and ES.** → Enforce parity mechanically (key/array-length check) and translate ES from the finalized EN, last.
- **Design-compliance tests may hardcode old copy and fail.** → Treat test updates as part of the change, not incidental; only relax assertions that legitimately pinned corrected strings.
- **Over-correcting the observability line loses a true selling point (Sentry is real).** → Keep Sentry; only remove the unverified Pino/Prometheus.

## Known limitation (pre-existing, out of scope)

`StackArch`, the `DocsTabs` island, and the `HowItWorksLoop` island render from the build-time `lang` prop with no `data-i18n`, so they stay Spanish when a visitor switches to English. This predates the change (those sections never localized) and is not introduced here; the corrected copy is accurate in both, but the EN toggle does not translate them. Fixing it is a separate i18n change (wire these sections through `data-i18n`/JSON).

## Migration Plan

Copy-only change; deploy via the existing static pipeline. Rollback = revert the copy/meta commit. No data or config migration.

## Open Questions (resolved during apply)

- **Structured logger beyond Sentry?** RESOLVED — checked all 5 package manifests (backend, bot, shared, web, workers); no `pino`, `winston`, or `prom-client` anywhere. `@sentry/node` (shared) is the only observability dependency. Copy advertises **Sentry only**.
- **Does reason/act/observe match the runtime?** RESOLVED — the runtime is `@langchain/langgraph`, a graph-based agent framework whose canonical loop is exactly reason→act(tool)→observe. The wording is an accurate characterization; kept as-is.
- **Add Drizzle to the stack list?** RESOLVED — the stack card grid is fixed at 8 by `design-compliance.spec.ts`. Rather than drop a card, Drizzle is surfaced in the Postgres card's role text; the list stays curated at 8.

## Apply-time source confirmation (tasks 1.1–1.3)

- Docker Compose topology confirmed = **7 services**: `postgres`, `redis`, `migrator`, `backend`, `bot`, `workers`, `nginx`. There is no standalone `web` service — the web app + admin panel are served behind `nginx`. Install copy reconciled to this.
- No drift from the enrichment-time reconciliation table above (same session, same commit of the app repo).
- Additional claims found reading `en.json`: JSON-LD `featureList` contained **"Telegram alerts"** — unsupported (no Telegram anywhere in source). Marked **removed**. JSON-LD `requirements` said "Node.js 20+" — source requires **Node.js 24**; marked **corrected**.
- **CORRECTION (adversarial review):** "YAML configuration" was ALSO removed from `featureList` in the first pass on the false belief it was unsupported. This was a mistake — the app requires `Share2Brain.config.yml` (README quickstart) and `yaml@^2.6.0` is a shared dep. The YAML config must be represented on the page (install steps + Configuration docs). See the new reconciliation rows and task group 7.
- **Adversarial review also found** the install snippets + every "View on GitHub" link point to `share2brain-landing` (this repo) instead of the app repo `share2brain`, the web UI port is stated as `:3000` (should be `http://localhost`/80), and "admin panel" is asserted but absent from source. All corrected in task group 7.

## Why

The landing copy misrepresents the product in ways that damage credibility with a developer audience. Verified against the app source (github.com/borjaberrocal87/share2brain): the site names the wrong orchestration framework ("LangChain.js" instead of LangGraph), claims it indexes uploaded "docs and files" when it actually indexes URLs shared in Discord channels, and advertises observability tooling (Pino, Prometheus) that the codebase does not use. A landing that can't accurately describe its own product undermines the "verifiable by design" positioning it sells.

## What Changes

- Correct factual inaccuracies in landing copy so every claim is backed by the application's source of truth (its repository), covering:
  - **Orchestration framework**: "LangChain.js" → **LangGraph** (`@langchain/langgraph`, built on `@langchain/core`).
  - **What it indexes**: "docs, files and sources" / "documents and files" → **links/URLs shared in Discord channels**, whose content the workers fetch and chunk (bot uses `discord.js`; workers use `undici`). No arbitrary file-upload path exists.
  - **Observability claim**: "Sentry · Pino · Prometheus" → **Sentry** only (`@sentry/node` is the sole one present).
  - **Positioning / hero**: align headline with the product's own "turn buried Discord knowledge into a searchable, self-hosted second brain with verifiable sources" framing.
  - **RBAC**: elevate role-based, permission-aware retrieval (Discord roles → channel access enforced in vector queries) to a first-class message.
  - **Install/services**: reconcile the described service set with the actual Docker Compose topology (backend, bot, workers, web, Postgres+pgvector, Redis).
- Apply all corrections in **both** `en.json` and `es.json` with strict structural parity (same keys, same array lengths).
- Update SEO meta (`title`, `description`, OG) and any `SoftwareApplication` JSON-LD to match the corrected positioning.
- Establish a **claim → source-evidence** reconciliation as a required verification gate before copy is edited.

Non-goals: layout/visual redesign, new sections, or advertising capabilities the app does not have. No `SoftwareApplication` behavior of the app itself changes — this is landing content only.

## Capabilities

### New Capabilities
- `content-accuracy`: Requirements that landing copy faithfully represent the Share2Brain application as defined by its source repository, including per-claim source verification, English/Spanish i18n parity, and SEO metadata consistency.

### Modified Capabilities
<!-- None. Main specs (openspec/specs/) are empty; landing-page-core/i18n-support/seo-optimization exist only in the unarchived landing-implementation change, so no synced requirement is being altered here. -->

## Impact

- **Content (primary)**: `src/i18n/en.json`, `src/i18n/es.json`.
- **SEO**: `src/layouts/BaseLayout.astro` (meta tags + JSON-LD).
- **Tests**: `tests/design-compliance.spec.ts` — adjust any assertions that pin now-changed copy; keep i18n parity coverage.
- **External dependency**: the app repository (github.com/borjaberrocal87/share2brain) is the source of truth; claims must be re-verified against it, not against the stale `context/PRD.md`.
- No runtime, API, or dependency changes to the landing itself (copy + meta only).

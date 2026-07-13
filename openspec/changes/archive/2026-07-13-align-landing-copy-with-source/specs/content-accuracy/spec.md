## ADDED Requirements

### Requirement: Copy claims match the application source of truth

The landing copy SHALL describe only capabilities, technologies, and behaviors that exist in the Share2Brain application as defined by its source repository (github.com/borjaberrocal87/share2brain). The stale `context/PRD.md` MUST NOT be used as the source of truth. Every product claim in the copy MUST be traceable to concrete source evidence (package manifests, Docker Compose topology, or runtime code).

#### Scenario: Orchestration framework is named correctly
- **WHEN** the copy references the agent orchestration technology
- **THEN** it identifies **LangGraph** (built on LangChain.js / `@langchain/core`)
- **AND** it does not present "LangChain.js" as the orchestration framework on its own

#### Scenario: Indexing description reflects URL ingestion
- **WHEN** the copy describes what Share2Brain indexes
- **THEN** it states that it indexes links/URLs shared in Discord channels whose content is fetched and chunked
- **AND** it does not claim users upload arbitrary documents or files

#### Scenario: Observability claim lists only present tooling
- **WHEN** the copy lists observability tooling
- **THEN** it lists only tooling present in the source (Sentry via `@sentry/node`)
- **AND** it does not list Pino or Prometheus

#### Scenario: A claim without source backing is removed or corrected
- **WHEN** a copy claim cannot be traced to source evidence during verification
- **THEN** the claim is corrected to match the source or removed
- **AND** no unverified claim ships in the copy

#### Scenario: Repository links and install command target the app repository
- **WHEN** the landing links to GitHub or shows a `git clone` / quickstart command
- **THEN** they target the application repository (`github.com/borjaberrocal87/share2brain`), not the landing repository
- **AND** the quickstart reflects the app's real steps (both `.env` and `Share2Brain.config.yml`) and its real entry point (`http://localhost`)

#### Scenario: Configuration surface reflects both config files
- **WHEN** the copy describes how the app is configured
- **THEN** it mentions both the `.env` and the `Share2Brain.config.yml` files that the app requires

### Requirement: Per-claim source verification precedes copy edits

The change SHALL produce a claim → source-evidence reconciliation that maps each product claim in the copy to its verifying source (file and/or dependency). Copy edits MUST NOT be made from README or PRD alone; each disputed claim MUST be confirmed against the application's source.

#### Scenario: Reconciliation exists before editing
- **WHEN** copy edits are proposed
- **THEN** a reconciliation table listing each claim and its source evidence exists
- **AND** each claim is marked confirmed, corrected, or removed with its evidence reference

### Requirement: Positioning reflects the product's verifiable-knowledge value

The hero and primary value messaging SHALL communicate that Share2Brain turns a Discord community's scattered knowledge into a searchable, self-hosted second brain that answers with verifiable, cited sources, and SHALL present role-based, permission-aware retrieval as a first-class capability.

#### Scenario: Hero communicates core value
- **WHEN** a visitor reads the hero section
- **THEN** it conveys self-hosted, verifiable, source-cited answers over the community's own knowledge

#### Scenario: Permission-aware retrieval is surfaced
- **WHEN** a visitor reads the value or feature messaging
- **THEN** it states that Discord roles govern which knowledge the agent may use, enforced within retrieval

### Requirement: English and Spanish copy maintain structural parity

The `en.json` and `es.json` content files SHALL contain identical key sets and identical array cardinality. Spanish copy SHALL be a faithful translation of the corrected English copy, not a duplicate of the English text.

#### Scenario: Key and array parity
- **WHEN** `en.json` and `es.json` are compared after the change
- **THEN** they have the same set of keys and the same length for every corresponding array
- **AND** every Spanish value is translated (no English placeholder values remain)

### Requirement: SEO metadata stays consistent with corrected copy

The page `title`, meta `description`, Open Graph tags, and any `SoftwareApplication` JSON-LD SHALL reflect the corrected product positioning and contain no claim that the on-page copy no longer makes.

#### Scenario: Metadata matches on-page claims
- **WHEN** SEO metadata and JSON-LD are reviewed after the change
- **THEN** their product description aligns with the corrected hero/value copy
- **AND** they contain no inaccurate or removed claim

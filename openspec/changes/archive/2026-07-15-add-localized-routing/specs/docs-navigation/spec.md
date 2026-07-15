## ADDED Requirements

### Requirement: Documentation section renders in the page's locale

The documentation section SHALL display its tab labels and item title/description copy in the locale of the page that hosts it, selected from the server-provided language prop tied to the page's URL locale. The section heading, sub-copy, tab labels, and item copy SHALL all be in the page locale with no mixed-language state, and this SHALL hold from first paint through hydration without depending on a runtime language toggle.

#### Scenario: Spanish page renders the documentation section in Spanish
- **WHEN** the Spanish page (`/`) renders the documentation section
- **THEN** the heading, sub-copy, tab labels, and every item's title and description are in Spanish

#### Scenario: English page renders the documentation section in English
- **WHEN** the English page (`/en/`) renders the documentation section
- **THEN** the heading, sub-copy, tab labels, and every item's title and description are in English

#### Scenario: No mixed-language state after hydration
- **WHEN** the documentation section hydrates on either locale page
- **THEN** all of its copy is in the page's locale
- **AND** the copy does not change language after hydration

## REMOVED Requirements

### Requirement: Documentation section reflects the active language at runtime

**Reason**: The site moves to per-locale static URLs; the documentation section's language is now determined by the page's URL locale at build time, and there is no runtime language toggle or stored-preference restoration for it to react to.

**Migration**: The documentation section receives its language via the server-provided page locale (see the ADDED requirement "Documentation section renders in the page's locale"). To view the documentation in the other language, navigate to that locale's URL (`/` for Spanish, `/en/` for English), which serves a freshly server-rendered section in that language.

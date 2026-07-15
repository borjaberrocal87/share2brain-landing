## ADDED Requirements

### Requirement: Interactive landing islands render in the page's locale

Interactive React islands on the landing page that carry localized copy — the documentation tabs (`DocsTabs`) and the how-it-works loop (`HowItWorksLoop`) — SHALL render their content in the locale of the page that hosts them, selected from a server-provided language prop tied to the page's URL locale. Islands SHALL receive copy for the active locale (or for both locales, selecting the active one via the server prop) and SHALL render that locale consistently from first paint through hydration, without depending on a runtime language-toggle event or a stored preference.

#### Scenario: Islands on the Spanish page render in Spanish
- **WHEN** the Spanish page (`/`) hydrates its documentation tabs and how-it-works loop
- **THEN** each island's labels, titles, descriptions, loopback text, and notes render in Spanish

#### Scenario: Islands on the English page render in English
- **WHEN** the English page (`/en/`) hydrates its documentation tabs and how-it-works loop
- **THEN** each island's labels, titles, descriptions, loopback text, and notes render in English

#### Scenario: Island language matches the server-rendered locale after hydration
- **WHEN** either locale page hydrates its islands
- **THEN** each island's language matches the page's server-rendered locale
- **AND** the island's language does not change after hydration

## REMOVED Requirements

### Requirement: Interactive landing islands reflect the active language at runtime

**Reason**: The site moves to per-locale static URLs; language is selected by URL at build time rather than toggled at runtime. There is no longer a runtime language-change event or stored-preference restoration for islands to react to.

**Migration**: Islands now receive their language via a server-provided prop derived from the page's URL locale (see the ADDED requirement "Interactive landing islands render in the page's locale"). Switching language is a navigation to the other locale's URL, which serves a freshly server-rendered page. The `s2b:languagechange` event and the `useLanguage` runtime-subscription mechanism are removed.

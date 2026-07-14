## ADDED Requirements

### Requirement: Documentation section presents four topic groups

The documentation section (`#docs`) SHALL organize documentation links into exactly four topic groups, presented as selectable tabs, matching the approved design. The groups SHALL be, in order: Empezar, Arquitectura, API y Agente, Desarrollo (Spanish) and Getting started, Architecture, API & Agent, Development (English).

#### Scenario: Four tabs render in the designed order
- **WHEN** a visitor views the documentation section
- **THEN** four topic tabs are shown in the order Empezar / Arquitectura / API y Agente / Desarrollo (ES) or Getting started / Architecture / API & Agent / Development (EN)
- **AND** exactly one tab is active at a time

#### Scenario: Selecting a tab shows that group's items
- **WHEN** a visitor selects a tab
- **THEN** the panel shows the documentation items belonging to that group
- **AND** the previously shown group's items are replaced

### Requirement: Each documentation item shows a title and a description

Each documentation item SHALL display a title and a short description on separate lines, matching the design's two-line entry. Both the title and the description SHALL be defined for every item in both languages.

#### Scenario: Item renders title and description
- **WHEN** a documentation item is displayed
- **THEN** its title is shown as the primary line
- **AND** its description is shown as a secondary, visually muted line beneath the title

#### Scenario: No item is missing its description
- **WHEN** any documentation item is rendered in either language
- **THEN** it has a non-empty title and a non-empty description

### Requirement: Documentation links target resolvable application-repository documents

Every documentation item link SHALL point to a document that resolves in the Share2Brain application repository (`github.com/borjaberrocal87/share2brain`). Links MUST be verified against the repository before shipping; a link whose target does not resolve MUST be corrected or removed, never shipped.

#### Scenario: Links point to the application repository
- **WHEN** a visitor activates a documentation link
- **THEN** it navigates to a document under `github.com/borjaberrocal87/share2brain`
- **AND** the target document (and anchor, if any) resolves

#### Scenario: A non-resolving link is not shipped
- **WHEN** a link target cannot be resolved during verification
- **THEN** the link is corrected to a resolvable target or the item is removed
- **AND** no broken documentation link ships

### Requirement: Each documentation item exposes a persistent external-link affordance

Each documentation item SHALL show a persistent external-link icon indicating it opens in a new tab, visible without hover, matching the design. Links SHALL open in a new tab with safe rel attributes.

#### Scenario: External-link icon is always visible
- **WHEN** a documentation item is displayed
- **THEN** an external-link icon is visible regardless of hover state

#### Scenario: Links open safely in a new tab
- **WHEN** a visitor activates a documentation link
- **THEN** it opens in a new browser tab
- **AND** the link carries `rel="noopener noreferrer"`

### Requirement: Documentation section heading and sub-copy match the design

The documentation section SHALL use the design's heading and sub-copy in both languages: "Documentación navegable" / "Browsable documentation" for the heading, and the "organized by section" sub-copy for the supporting line.

#### Scenario: Heading and sub-copy reflect the design wording
- **WHEN** a visitor reads the documentation section header
- **THEN** the heading reads "Documentación navegable" (ES) or "Browsable documentation" (EN)
- **AND** the sub-copy states that everything needed to deploy and operate the instance is organized by section

### Requirement: Documentation data has a single source of truth

The documentation groups and their items SHALL be defined in a single source — the i18n translation files — and consumed from there by the documentation section. Duplicate definitions of the documentation data MUST NOT exist elsewhere in the codebase, and the Spanish and English i18n files MUST maintain key parity.

#### Scenario: Documentation data is defined once
- **WHEN** the codebase is inspected for documentation-section data
- **THEN** the groups and items are defined only in the i18n translation files
- **AND** no duplicate documentation-data definition exists in the component layer

#### Scenario: Translation files keep key parity
- **WHEN** the Spanish and English translation files are compared
- **THEN** they expose the same documentation keys with the same structure

### Requirement: Documentation section preserves accessible tab semantics

The documentation section SHALL preserve accessible tab semantics: the tab list, tabs, and panels SHALL carry appropriate ARIA roles and relationships, each tab's `aria-controls` SHALL reference a panel that is present in the DOM, and each documentation link SHALL have an accessible name derived from its title.

#### Scenario: Tabs expose ARIA roles and selection state
- **WHEN** assistive technology inspects the documentation section
- **THEN** the tab list, tabs, and panels expose their roles
- **AND** the active tab is marked selected and associated with its panel

#### Scenario: Every tab control references a present panel
- **WHEN** assistive technology or a validator resolves each tab's `aria-controls`
- **THEN** every referenced panel id exists in the DOM (inactive panels are rendered but hidden)
- **AND** no tab points to a missing panel

#### Scenario: Links have accessible names and new-tab affordance
- **WHEN** assistive technology reads a documentation link
- **THEN** its accessible name includes the item title
- **AND** it conveys that the link opens in a new tab

### Requirement: Documentation tabs are keyboard-navigable

The documentation tab list SHALL follow the WAI-ARIA tabs keyboard pattern: a roving tab stop (only the active tab is in the tab order), Left/Right arrow keys move between tabs, and Home/End jump to the first/last tab, activating the focused tab.

#### Scenario: Arrow keys move between tabs
- **WHEN** a tab has focus and the user presses the Right (or Left) arrow key
- **THEN** focus and selection move to the next (or previous) tab, wrapping at the ends
- **AND** the panel updates to the newly selected tab

#### Scenario: Roving tab stop
- **WHEN** the user tabs into the documentation tab list
- **THEN** only the active tab is reachable via the Tab key (roving `tabindex`)
- **AND** the other tabs are reachable via the arrow keys

### Requirement: Documentation section reflects the active language at runtime

The documentation section SHALL display its tab labels and item title/description copy in the currently active site language, and SHALL update them when the user switches language at runtime — not only on the initial server-rendered language.

#### Scenario: Switching language updates the tabs and items
- **WHEN** the user toggles the site language (e.g. ES → EN) while viewing the documentation section
- **THEN** the tab labels and every item's title and description re-render in the new language
- **AND** the section heading, sub-copy, and the tab/item copy are all in the same language (no mixed-language state)

#### Scenario: Restored language applies on load
- **WHEN** the site loads with a previously stored language preference that differs from the server-rendered default
- **THEN** the documentation tabs and items render in the stored language after hydration

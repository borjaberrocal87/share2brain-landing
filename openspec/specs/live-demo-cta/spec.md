# live-demo-cta Specification

## Purpose

Provide a primary "live demo" call-to-action across the landing site so visitors can reach the hosted Share2Brain demo directly, presented consistently, bilingually, and accessibly in both the Hero and final CTA sections.

## Requirements

### Requirement: Primary live-demo call-to-action in Hero

The Hero section SHALL present a primary "live demo" call-to-action as the first action in its call-to-action group, positioned before the "View on GitHub" action. The button SHALL link to the hosted live demo at `https://demo.share2brain.app/`, open in a new browser tab, and use safe cross-origin link attributes.

#### Scenario: Hero demo button is rendered first

- **WHEN** a visitor loads the landing page
- **THEN** the Hero call-to-action group contains a link whose accessible label identifies it as the live demo
- **AND** that link is the first child of the Hero call-to-action group, appearing before the "View on GitHub" link

#### Scenario: Hero demo button targets the live demo safely

- **WHEN** the Hero live-demo link is rendered
- **THEN** its `href` is `https://demo.share2brain.app/`
- **AND** it has `target="_blank"` and `rel="noopener noreferrer"`

### Requirement: Primary live-demo call-to-action in final CTA section

The final CTA section SHALL present a primary "live demo" call-to-action as the first action in its button group, positioned before the "View on GitHub" action, linking to `https://demo.share2brain.app/` and opening in a new browser tab with safe cross-origin link attributes.

#### Scenario: CTA-section demo button is rendered first

- **WHEN** a visitor loads the landing page
- **THEN** the final CTA section button group contains a link whose accessible label identifies it as the live demo
- **AND** that link is the first child of the button group, appearing before the "View on GitHub" link

#### Scenario: CTA-section demo button targets the live demo safely

- **WHEN** the final CTA section live-demo link is rendered
- **THEN** its `href` is `https://demo.share2brain.app/`
- **AND** it has `target="_blank"` and `rel="noopener noreferrer"`

### Requirement: Bilingual live-demo copy

The live-demo call-to-action label SHALL be available in Spanish and English under a single copy key `hero.ctaDemo`, defined in both `src/i18n/es.json` and `src/i18n/en.json`, preserving key parity between the two locale files.

#### Scenario: Spanish label

- **WHEN** the page is served or toggled to Spanish
- **THEN** the live-demo button label reads "Ver demo en vivo"

#### Scenario: English label

- **WHEN** the page is served or toggled to English
- **THEN** the live-demo button label reads "See live demo"

#### Scenario: Locale files keep key parity

- **WHEN** the i18n parity check runs over `src/i18n/es.json` and `src/i18n/en.json`
- **THEN** the `hero.ctaDemo` key is present in both files and the files have identical key sets

### Requirement: Consistent copy across SSR and runtime toggling

The live-demo label SHALL render correctly in server-side output for the build-time locale and SHALL update when the visitor toggles the language at runtime, by carrying a `data-i18n="hero.ctaDemo"` attribute and matching hardcoded component defaults.

#### Scenario: Server-rendered default matches the locale

- **WHEN** the page is server-rendered for a given locale with JavaScript disabled
- **THEN** the live-demo button shows the correct localized label for that locale from the component default

#### Scenario: Runtime language toggle updates the label

- **WHEN** a visitor toggles the site language at runtime
- **THEN** the live-demo button label updates to the selected language via its `data-i18n="hero.ctaDemo"` binding

### Requirement: Accessible and visually primary presentation

The live-demo call-to-action SHALL be styled as the primary action (gradient background with a leading play icon per the approved design) and SHALL be accessible: the button exposes a descriptive accessible name and its decorative icon is hidden from assistive technology.

#### Scenario: Decorative icon is hidden from assistive tech

- **WHEN** the live-demo button is rendered
- **THEN** its leading play icon carries `aria-hidden="true"`
- **AND** the link exposes a descriptive accessible name identifying it as the Share2Brain live demo

#### Scenario: Primary CTA gives hover feedback

- **WHEN** a pointer hovers over the live-demo button
- **THEN** the button visibly brightens (a `brightness(1.05)` filter per the approved design), animated via a filter transition
- **AND** the effect matches the design's primary-button hover treatment in both the Hero and final CTA sections

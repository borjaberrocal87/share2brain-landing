# island-i18n Specification

## Purpose

Ensure interactive React islands on the landing page that carry localized copy render in the site's active language and update reliably when the language is toggled at runtime, including when a stored preference is restored on load and when native browser language-change events occur.

## Requirements

### Requirement: Interactive landing islands reflect the active language at runtime

Interactive React islands on the landing page that carry localized copy — the documentation tabs (`DocsTabs`) and the how-it-works loop (`HowItWorksLoop`) — SHALL display their content in the site's active language and SHALL update when the user toggles the language at runtime, not only for the server-rendered default language. Islands SHALL receive copy for both languages and select the active one via a shared mechanism driven by the language toggle.

#### Scenario: How-it-works loop switches language on toggle
- **WHEN** the user toggles the site language (e.g. ES → EN) while the how-it-works section is visible
- **THEN** the loop's step labels, titles, descriptions, loopback text, and note re-render in the new language

#### Scenario: Documentation tabs switch language on toggle
- **WHEN** the user toggles the site language while the documentation section is visible
- **THEN** the documentation tab labels and item title/description copy re-render in the new language
- **AND** the toggle works in both directions (ES → EN and EN → ES)

#### Scenario: Stored language preference applies on load
- **WHEN** the page loads with a stored language preference that differs from the server-rendered default
- **THEN** each localized island renders in the stored language once it hydrates

#### Scenario: A native language-change event does not corrupt island state
- **WHEN** a `languagechange`-style browser event without a valid language payload reaches an island
- **THEN** the island keeps its current language and does not throw

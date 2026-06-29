## ADDED Requirements

### Requirement: Language toggle SHALL switch between ES and EN
The language toggle button SHALL switch all text content between Spanish and English.

#### Scenario: Language toggle is visible
- **WHEN** user views the header
- **THEN** language toggle button is visible with "ES" and "EN" options

#### Scenario: Clicking ES switches to Spanish
- **WHEN** user clicks "ES" button
- **THEN** all text content switches to Spanish

#### Scenario: Clicking EN switches to English
- **WHEN** user clicks "EN" button
- **THEN** all text content switches to English

### Requirement: Language preference SHALL persist across sessions
The selected language SHALL be saved to localStorage and restored on page load.

#### Scenario: Language is saved to localStorage
- **WHEN** user switches language
- **THEN** selected language is stored in localStorage with key "language"

#### Scenario: Language is restored on page load
- **WHEN** user reloads the page
- **THEN** previously selected language is applied immediately

#### Scenario: Default language is Spanish
- **WHEN** user has no saved language preference
- **THEN** page displays content in Spanish

### Requirement: i18n system SHALL provide type-safe translations
All translations SHALL be defined in TypeScript files with proper typing.

#### Scenario: Translation files exist
- **WHEN** project is built
- **THEN** translation files exist for ES and EN with matching keys

#### Scenario: Translations are type-safe
- **WHEN** developer accesses translations
- **THEN** TypeScript provides autocomplete and type checking for translation keys

### Requirement: All visible text SHALL use i18n translations
All user-facing text content SHALL be sourced from the i18n system, not hardcoded.

#### Scenario: Hero text is translated
- **WHEN** user switches language
- **THEN** hero title, subtitle, and badge text update to selected language

#### Scenario: Navigation is translated
- **WHEN** user switches language
- **THEN** navigation links update to selected language

#### Scenario: Section content is translated
- **WHEN** user switches language
- **THEN** all section titles, descriptions, and card content update to selected language

### Requirement: Language toggle SHALL have correct active state
The language toggle SHALL visually indicate which language is currently active.

#### Scenario: Active language is highlighted
- **WHEN** user views language toggle
- **THEN** current language button has distinct styling (background, border)

#### Scenario: Inactive language is muted
- **WHEN** user views language toggle
- **THEN** non-active language button has muted styling

### Requirement: Language toggle SHALL have aria-label for accessibility
The language toggle button SHALL have an aria-label describing its function.

#### Scenario: Aria-label is present
- **WHEN** screen reader encounters language toggle
- **THEN** it reads "Switch language" or equivalent description

### Requirement: Language toggle SHALL be keyboard accessible
The language toggle SHALL be fully operable via keyboard.

#### Scenario: Keyboard navigation works
- **WHEN** user presses Tab to focus language toggle
- **THEN** toggle receives visible focus indicator

#### Scenario: Enter/Space activates toggle
- **WHEN** user presses Enter or Space on focused toggle
- **THEN** language switches to the other option

### Requirement: Code blocks SHALL preserve formatting across languages
Code blocks in installation and documentation sections SHALL maintain formatting when language switches.

#### Scenario: Code blocks are not affected by language toggle
- **WHEN** user switches language
- **THEN** code blocks retain syntax highlighting and formatting

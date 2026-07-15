## ADDED Requirements

### Requirement: Each language is served from its own static URL

The landing page SHALL be served as static HTML from a distinct URL per supported language: Spanish (the default locale) at `/` and English at `/en/`. Each URL SHALL be pre-rendered at build time so that no client-side language switching is required to reach a given language's content.

#### Scenario: Spanish is served at the root URL
- **WHEN** a visitor or crawler requests `/`
- **THEN** the response is static HTML with all page copy in Spanish

#### Scenario: English is served at its own URL
- **WHEN** a visitor or crawler requests `/en/`
- **THEN** the response is static HTML with all page copy in English

#### Scenario: Both URLs are produced by the static build
- **WHEN** the site is built with `astro build`
- **THEN** the build output includes a page for `/` and a page for `/en/`

### Requirement: Localized content is crawlable without JavaScript

Each locale's page SHALL render its complete localized copy in the server-generated HTML, so that a client with JavaScript disabled sees the page fully in that locale. Language selection MUST NOT depend on client-side text replacement.

#### Scenario: Spanish content is present without JavaScript
- **WHEN** `/` is loaded with JavaScript disabled
- **THEN** the visible page copy (headings, body, navigation, CTAs) is fully rendered in Spanish

#### Scenario: English content is present without JavaScript
- **WHEN** `/en/` is loaded with JavaScript disabled
- **THEN** the visible page copy is fully rendered in English

#### Scenario: No in-place language swap occurs on load
- **WHEN** either locale page finishes loading with JavaScript enabled
- **THEN** the page copy does not change language after hydration

### Requirement: The language selector navigates between locale URLs

The language selector SHALL be presented as navigation links to the equivalent page in each supported locale, not as an in-place runtime toggle. Selecting a language SHALL navigate to that locale's URL and SHALL preserve the current in-page section anchor when one is present.

#### Scenario: Selecting the other language navigates to its URL
- **WHEN** a visitor on `/` selects English
- **THEN** the browser navigates to `/en/`

#### Scenario: The current section anchor is preserved across the switch
- **WHEN** a visitor viewing a section (e.g. `#docs`) selects the other language
- **THEN** the destination URL targets the same section anchor in the other locale

#### Scenario: The active locale is indicated
- **WHEN** a locale page is displayed
- **THEN** the language selector marks the current locale as active and exposes it accessibly (e.g. `aria-current`/`aria-pressed`)

### Requirement: Each locale page emits reciprocal localization metadata

Each locale page SHALL declare its language and localization relationships in the document head: the `<html lang>` attribute set to the page locale; a localized `<title>` and meta `description`; a self-referential per-locale `canonical`; reciprocal `hreflang` alternate links for every supported locale plus an `x-default`; and a matching `og:locale`. The localized JSON-LD `url` SHALL reference the locale's own URL.

#### Scenario: HTML lang matches the page locale
- **WHEN** `/en/` is inspected
- **THEN** the root element declares `lang="en"`
- **AND** `/` declares `lang="es"`

#### Scenario: Canonical is self-referential per locale
- **WHEN** each locale page is inspected
- **THEN** its `canonical` points to that locale's own URL (not to a single shared URL)

#### Scenario: hreflang alternates are reciprocal and complete
- **WHEN** either locale page's head is inspected
- **THEN** it lists `hreflang` alternate links for both `es` and `en` and an `x-default`
- **AND** each alternate points to the correct locale URL

#### Scenario: Title, description, and og:locale are localized
- **WHEN** each locale page is inspected
- **THEN** its `<title>`, meta `description`, and `og:locale` are in and reflect that page's locale

### Requirement: A sitemap enumerates all locale URLs with alternates

The build SHALL generate a `sitemap.xml` that lists every locale URL and declares each URL's `hreflang` alternates, and `robots.txt` SHALL reference the sitemap.

#### Scenario: Sitemap lists both locale URLs
- **WHEN** the generated `sitemap.xml` is inspected
- **THEN** it contains entries for `/` and `/en/`
- **AND** each entry declares its `hreflang` alternates

#### Scenario: robots.txt references the sitemap
- **WHEN** `robots.txt` is inspected
- **THEN** it contains a `Sitemap:` directive pointing to the generated sitemap

### Requirement: The default route is deterministic

The root URL `/` SHALL always serve the Spanish default locale and MUST NOT perform automatic server-side or build-time language redirection based on visitor locale or a stored preference. Automatic client-side language redirection is out of scope for this capability.

#### Scenario: Root always serves the default locale
- **WHEN** any visitor or crawler requests `/`, regardless of browser language or stored preference
- **THEN** the Spanish page is served without redirecting to another locale

### Requirement: Localized copy is sourced per locale from the i18n files

Each locale page SHALL render its copy from the shared i18n translation files (`src/i18n/{es,en}.json`) selected by the page's locale. The Spanish and English translation files SHALL maintain key parity so every string exists in both locales.

#### Scenario: Page copy is selected by locale from i18n
- **WHEN** a locale page renders a section
- **THEN** its copy is taken from the i18n file matching the page locale

#### Scenario: Translation files keep key parity
- **WHEN** the Spanish and English translation files are compared
- **THEN** they expose the same keys with the same structure

## ADDED Requirements

### Requirement: Theme toggle SHALL switch between dark and light modes
The theme toggle button SHALL switch the entire page between dark and light color schemes.

#### Scenario: Theme toggle button is visible
- **WHEN** user views the header
- **THEN** theme toggle button is visible with sun/moon icon

#### Scenario: Clicking toggle switches theme
- **WHEN** user clicks the theme toggle button
- **THEN** page transitions from dark to light mode (or vice versa)

#### Scenario: Theme transition is smooth
- **WHEN** user clicks the theme toggle button
- **THEN** color changes animate smoothly over 250ms

### Requirement: Theme preference SHALL persist across sessions
The selected theme SHALL be saved to localStorage and restored on page load.

#### Scenario: Theme is saved to localStorage
- **WHEN** user switches theme
- **THEN** selected theme is stored in localStorage with key "theme"

#### Scenario: Theme is restored on page load
- **WHEN** user reloads the page
- **THEN** previously selected theme is applied immediately

#### Scenario: Default theme respects system preference
- **WHEN** user has no saved theme preference
- **THEN** page uses dark mode if system prefers dark, light mode if system prefers light

### Requirement: CSS variables SHALL define theme colors
All theme colors SHALL be defined as CSS variables for dynamic switching.

#### Scenario: CSS variables are defined
- **WHEN** page loads
- **THEN** CSS variables for light mode (--bg, --surface, --text, --accent, etc.) are defined in :root

#### Scenario: Dark mode overrides variables
- **WHEN** user switches to dark mode
- **THEN** CSS variables are overridden with dark mode values via [data-theme="dark"] selector

#### Scenario: All components use CSS variables
- **WHEN** any component renders
- **THEN** colors are sourced from CSS variables, not hardcoded values

### Requirement: Theme toggle SHALL have correct icon states
The theme toggle button SHALL display sun icon in dark mode and moon icon in light mode.

#### Scenario: Sun icon in dark mode
- **WHEN** page is in dark mode
- **THEN** theme toggle displays sun icon

#### Scenario: Moon icon in light mode
- **WHEN** page is in light mode
- **THEN** theme toggle displays moon icon

### Requirement: Theme toggle SHALL have aria-label for accessibility
The theme toggle button SHALL have an aria-label describing its function.

#### Scenario: Aria-label is present
- **WHEN** screen reader encounters theme toggle
- **THEN** it reads "Toggle theme" or equivalent description

### Requirement: Theme SHALL not cause flash of unstyled content
The theme SHALL be applied before page render to prevent FOUC.

#### Scenario: Theme is applied in head
- **WHEN** page loads
- **THEN** theme is applied via inline script in <head> before any content renders

#### Scenario: No flash on reload
- **WHEN** user reloads page with saved theme
- **THEN** page renders with correct theme from the start, no flash of wrong theme

### Requirement: Theme toggle SHALL work with reduced motion preference
The theme toggle SHALL respect prefers-reduced-motion system setting.

#### Scenario: Reduced motion is respected
- **WHEN** user has prefers-reduced-motion enabled
- **THEN** theme transition animation is disabled (instant switch)

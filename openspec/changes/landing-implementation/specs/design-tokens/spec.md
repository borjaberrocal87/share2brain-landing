## ADDED Requirements

### Requirement: CSS variables SHALL define all design tokens
All design tokens SHALL be defined as CSS variables for dynamic theming.

#### Scenario: Light mode variables are defined
- **WHEN** page loads in light mode
- **THEN** CSS variables for light mode are defined in :root

#### Scenario: Dark mode variables are defined
- **WHEN** page loads in dark mode
- **THEN** CSS variables for dark mode are defined via [data-theme="dark"] selector

#### Scenario: All tokens are used
- **WHEN** components render
- **THEN** colors, spacing, and typography are sourced from CSS variables

### Requirement: Typography system SHALL use specified fonts
The typography system SHALL use Space Grotesk for headings, IBM Plex Sans for body, and IBM Plex Mono for code.

#### Scenario: Google Fonts are loaded
- **WHEN** page loads
- **THEN** Space Grotesk, IBM Plex Sans, and IBM Plex Mono fonts are loaded from Google Fonts

#### Scenario: Headings use Space Grotesk
- **WHEN** h1, h2, h3 elements render
- **THEN** font-family is 'Space Grotesk', sans-serif

#### Scenario: Body text uses IBM Plex Sans
- **WHEN** body text renders
- **THEN** font-family is 'IBM Plex Sans', sans-serif

#### Scenario: Code uses IBM Plex Mono
- **WHEN** code elements render
- **THEN** font-family is 'IBM Plex Mono', monospace

### Requirement: Color palette SHALL match Claude Design specification
The color palette SHALL match the Claude Design specification exactly.

#### Scenario: Primary accent color is correct
- **WHEN** components render
- **THEN** accent color is #F5A623 (amber/honey)

#### Scenario: Discord color is correct
- **WHEN** Discord-related elements render
- **THEN** color is #5865F2

#### Scenario: Success color is correct
- **WHEN** success elements render
- **THEN** color is #22c55e

#### Scenario: Error color is correct
- **WHEN** error elements render
- **THEN** color is #ef4444

### Requirement: Spacing system SHALL be consistent
The spacing system SHALL use consistent values across all components.

#### Scenario: Section padding is consistent
- **WHEN** sections render
- **THEN** vertical padding uses clamp(40px, 6vw, 96px)

#### Scenario: Component gaps are consistent
- **WHEN** grids render
- **THEN** gaps use 14-24px range

#### Scenario: Max width is consistent
- **WHEN** content containers render
- **THEN** max-width is 1180px

### Requirement: Border radius SHALL be configurable
Border radius SHALL be configurable via CSS variable.

#### Scenario: Default radius is 10px
- **WHEN** components render
- **THEN** border-radius uses var(--radius, 10px)

#### Scenario: Radius can be changed
- **WHEN** --radius CSS variable is updated
- **THEN** all components using var(--radius) update their border-radius

### Requirement: Shadows SHALL be configurable
Box shadows SHALL be configurable via CSS variable.

#### Scenario: Default shadow is defined
- **WHEN** components render
- **THEN** box-shadow uses var(--shadow, none)

#### Scenario: Shadow can be changed
- **WHEN** --shadow CSS variable is updated
- **THEN** all components using var(--shadow) update their box-shadow

### Requirement: Hexagonal icons SHALL use clip-path
Hexagonal icons SHALL be implemented using CSS clip-path.

#### Scenario: Hexagonal shape is applied
- **WHEN** hexagonal icons render
- **THEN** clip-path is polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)

#### Scenario: Hexagonal icons have correct colors
- **WHEN** hexagonal icons render
- **THEN** background uses var(--accent-soft) and color uses var(--accent-ink)

### Requirement: Responsive breakpoints SHALL be defined
The design system SHALL define responsive breakpoints for mobile, tablet, and desktop.

#### Scenario: Mobile breakpoint is 375px
- **WHEN** viewport is 375px
- **THEN** mobile layout is applied

#### Scenario: Tablet breakpoint is 768px
- **WHEN** viewport is 768px
- **THEN** tablet layout is applied

#### Scenario: Desktop breakpoint is 1440px
- **WHEN** viewport is 1440px
- **THEN** desktop layout is applied

### Requirement: Animations SHALL use CSS variables for configuration
Animation properties SHALL be configurable via CSS variables where applicable.

#### Scenario: Float animation is defined
- **WHEN** hexagonal decorative elements render
- **THEN** kh-float animation is applied with 9-13s duration

#### Scenario: Reduced motion is respected
- **WHEN** prefers-reduced-motion is enabled
- **THEN** animations are disabled

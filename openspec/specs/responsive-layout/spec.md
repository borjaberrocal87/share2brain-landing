# responsive-layout Specification

## Purpose
TBD - created by archiving change fix-responsive-layout. Update Purpose after archive.
## Requirements
### Requirement: No horizontal overflow across supported viewports

The landing page SHALL NOT produce horizontal overflow or clip module content at any supported viewport width. Supported widths are 320, 375, 414, 768, 820, 1024, and 1440 px. The absence of overflow MUST hold on its own — it MUST NOT depend on `overflow-x: hidden` (or `overflow-x: clip`) to hide otherwise-overflowing content.

#### Scenario: No page-level horizontal scroll on small phones

- **WHEN** the page is rendered at 320px width and fully hydrated
- **THEN** `document.documentElement.scrollWidth` is less than or equal to `document.documentElement.clientWidth` (allowing a 1px rounding tolerance)
- **AND** the assertion holds even if `overflow-x: hidden` is removed from `html` and `main`

#### Scenario: No overflow at each supported breakpoint

- **WHEN** the page is rendered at each of 375, 414, 768, 820, 1024, and 1440 px width
- **THEN** no element extends beyond the viewport's right edge and `scrollWidth` does not exceed `clientWidth` (1px tolerance) at any of those widths

#### Scenario: Card grids fall back to a single column on narrow phones

- **WHEN** a section using an `auto-fit` card grid (ValueProps, Features, UseCases, Installation, StackArch, Docs) is rendered below the `md` (768px) breakpoint
- **THEN** the grid renders as a single column so no card is wider than the available content width and no card is clipped

### Requirement: Navigation is present at every viewport width

The landing page SHALL expose a usable navigation control (desktop nav or hamburger menu) at every viewport width from 320px upward, with no width range where both are hidden. The desktop-nav / hamburger switch MUST occur at a single canonical breakpoint, applied consistently across Tailwind utility classes and any custom CSS media queries.

#### Scenario: Navigation present in the former 768–820px dead-zone

- **WHEN** the page is rendered at any width in the 768px–820px range
- **THEN** exactly one of the desktop navigation or the hamburger menu button is visible and operable

#### Scenario: Navigation present at mobile and desktop extremes

- **WHEN** the page is rendered at 320px and at 1440px
- **THEN** a navigation control is visible at each width — the hamburger at 320px and the desktop nav at 1440px

### Requirement: Anchor navigation clears the sticky header

When a user activates an in-page navigation anchor, the target section's heading SHALL be fully visible below the sticky header rather than scrolled underneath it. This SHALL be achieved with a scroll offset (`scroll-padding-top` / `scroll-margin-top`) that matches the sticky header height.

#### Scenario: Section heading visible after clicking a nav link

- **WHEN** the user clicks a desktop nav link (`#producto`, `#features`, `#how`, `#docs`, `#stack`)
- **THEN** the target section's heading element is rendered fully below the sticky header (its top is at or below the header's bottom edge, ~66px) and is not clipped

#### Scenario: Section heading visible for every anchor target

- **WHEN** any in-page anchor is activated, including section targets that have no nav link (e.g. `#install`)
- **THEN** the target section's heading element clears the sticky header (top at or below ~66px)

### Requirement: Long content scrolls within its container instead of clipping

Content that can exceed its container width — code blocks and horizontal flow diagrams — SHALL scroll or wrap within its own bounds rather than clip or force page-level overflow.

#### Scenario: Inline code block scrolls horizontally

- **WHEN** the HowItWorksLoop active-step code block contains a line longer than its container at a narrow viewport
- **THEN** the code block scrolls horizontally within its own bounds and does not cause page-level horizontal overflow or ragged wrapping

#### Scenario: Architecture flow diagram adapts to narrow cards

- **WHEN** the StackArch Event-Driven flow (Producer → stream → Consumer) is rendered inside a card narrower than its natural row width
- **THEN** the flow items wrap to remain legible and are not crushed or clipped

### Requirement: The mobile drawer is not reachable when closed

When the mobile menu is closed, its off-canvas panel and links SHALL NOT be reachable by keyboard or exposed to assistive technology. The closed panel MUST NOT create an `aria-hidden` container that still contains focusable descendants.

#### Scenario: Closed drawer is inert

- **WHEN** the mobile menu is closed and a keyboard user tabs through the page
- **THEN** focus never enters the drawer panel, and the panel's links are not in the tab order (the container is `inert`)

### Requirement: Responsive guarantees are enforced by automated tests

The responsive guarantees above SHALL be covered by automated Playwright tests that fail when content overflows or is clipped, and that CANNOT pass merely because `overflow-x: hidden`/`clip` masks the overflow.

#### Scenario: Overflow tests are style-independent

- **WHEN** the responsive test suite runs at each supported width
- **THEN** it asserts that no element's right edge (via `getBoundingClientRect`, which is not clamped by ancestor `overflow-x`) exceeds the viewport, AND asserts that `html`/`body`/`main` do not use `overflow-x: hidden`/`clip` to mask overflow — so re-introducing the mask makes the test fail rather than pass

#### Scenario: Navigation and anchor behavior are tested

- **WHEN** the responsive test suite runs
- **THEN** it includes a test asserting a navigation control is visible across the 768–820px range and a test asserting a section heading is visible below the header after an anchor click


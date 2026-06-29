## ADDED Requirements

### Requirement: HowItWorksLoop SHALL display interactive steps
The HowItWorksLoop component SHALL display 3 clickable steps with code examples.

#### Scenario: Steps are displayed
- **WHEN** user scrolls to how it works section
- **THEN** 3 steps are visible: "Razonar", "Actuar", "Observar"

#### Scenario: Default step is selected
- **WHEN** component loads
- **THEN** first step (Razonar) is selected by default

#### Scenario: Clicking step updates display
- **WHEN** user clicks on a step
- **THEN** step becomes highlighted and corresponding code example is displayed

### Requirement: HowItWorksLoop SHALL display code examples for each step
Each step SHALL have a corresponding code example showing LangChain.js implementation.

#### Scenario: Code example updates on step selection
- **WHEN** user selects a different step
- **THEN** code example updates to show relevant implementation

#### Scenario: Code has syntax highlighting
- **WHEN** code example is displayed
- **THEN** code has proper syntax highlighting with colors

### Requirement: HowItWorksLoop SHALL have aria-labels for accessibility
Each step button SHALL have an aria-label describing its function.

#### Scenario: Aria-labels are present
- **WHEN** screen reader encounters step buttons
- **THEN** each button reads "Step 01: Razonar" or equivalent

### Requirement: HowItWorksLoop SHALL be keyboard navigable
The HowItWorksLoop component SHALL be fully operable via keyboard.

#### Scenario: Tab navigation works
- **WHEN** user presses Tab to focus step buttons
- **THEN** each button receives visible focus indicator

#### Scenario: Enter/Space activates step
- **WHEN** user presses Enter or Space on focused step
- **THEN** step becomes selected and code example updates

### Requirement: DocsTabs SHALL display tabbed documentation
The DocsTabs component SHALL display 4 tabs with articles organized by section.

#### Scenario: Tabs are displayed
- **WHEN** user scrolls to documentation section
- **THEN** 4 tabs are visible: "Empezar", "Configuración", "Acceso", "Operación"

#### Scenario: Default tab is selected
- **WHEN** component loads
- **THEN** first tab (Empezar) is selected by default

#### Scenario: Clicking tab updates article list
- **WHEN** user clicks on a tab
- **THEN** corresponding articles are displayed in the right panel

### Requirement: DocsTabs SHALL display articles for each tab
Each tab SHALL have a list of related articles.

#### Scenario: Articles are displayed
- **WHEN** user selects a tab
- **THEN** list of articles for that section is displayed

#### Scenario: Articles have icons
- **WHEN** articles are displayed
- **THEN** each article has a document icon

### Requirement: DocsTabs SHALL have aria-labels for accessibility
Each tab button SHALL have an aria-label describing its function.

#### Scenario: Aria-labels are present
- **WHEN** screen reader encounters tab buttons
- **THEN** each button reads "Tab: Empezar" or equivalent

### Requirement: DocsTabs SHALL be keyboard navigable
The DocsTabs component SHALL be fully operable via keyboard.

#### Scenario: Tab navigation works
- **WHEN** user presses Tab to focus tab buttons
- **THEN** each button receives visible focus indicator

#### Scenario: Enter/Space activates tab
- **WHEN** user presses Enter or Space on focused tab
- **THEN** tab becomes selected and article list updates

### Requirement: CodeBlock SHALL display syntax-highlighted code
The CodeBlock component SHALL display code with syntax highlighting and copy button.

#### Scenario: Code is displayed
- **WHEN** CodeBlock component renders
- **THEN** code is displayed with proper syntax highlighting

#### Scenario: Copy button is visible
- **WHEN** CodeBlock component renders
- **THEN** copy button is visible in the top-right corner

#### Scenario: Copy button works
- **WHEN** user clicks copy button
- **THEN** code is copied to clipboard and button shows "Copied!" feedback

### Requirement: CodeBlock SHALL have aria-labels for accessibility
The copy button SHALL have an aria-label describing its function.

#### Scenario: Aria-label is present
- **WHEN** screen reader encounters copy button
- **THEN** it reads "Copy code to clipboard" or equivalent

### Requirement: CodeBlock SHALL be keyboard accessible
The copy button SHALL be fully operable via keyboard.

#### Scenario: Tab navigation works
- **WHEN** user presses Tab to focus copy button
- **THEN** button receives visible focus indicator

#### Scenario: Enter/Space activates copy
- **WHEN** user presses Enter or Space on focused copy button
- **THEN** code is copied to clipboard

### Requirement: React islands SHALL load only when needed
React islands SHALL be lazy-loaded to minimize initial bundle size.

#### Scenario: Islands are lazy-loaded
- **WHEN** page loads
- **THEN** React islands are loaded asynchronously after initial render

#### Scenario: Islands show placeholder while loading
- **WHEN** React island is loading
- **THEN** placeholder or skeleton is displayed until component is ready

### Requirement: React islands SHALL handle errors gracefully
React islands SHALL catch and handle rendering errors without breaking the page.

#### Scenario: Error boundary is present
- **WHEN** React island encounters a rendering error
- **THEN** error is caught and fallback UI is displayed

#### Scenario: Page continues to work
- **WHEN** one React island fails
- **THEN** other sections and components continue to work normally

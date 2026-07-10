## ADDED Requirements

### Requirement: Landing page SHALL include all required sections
The landing page SHALL contain the following sections in order: Header, Hero, Value Props, How it Works, Use Cases, Installation, Documentation, Stack + Architecture, CTA, Footer.

#### Scenario: All sections are present
- **WHEN** user loads the landing page
- **THEN** all 10 sections are rendered in the correct order

#### Scenario: Sections are responsive
- **WHEN** user views on mobile (375px), tablet (768px), or desktop (1440px)
- **THEN** all sections adapt to the viewport width without horizontal overflow

### Requirement: Header SHALL be sticky with navigation
The header SHALL be sticky (fixed at top when scrolling) and contain logo, navigation links, language toggle, and theme toggle.

#### Scenario: Header sticks to top on scroll
- **WHEN** user scrolls down the page
- **THEN** header remains fixed at the top of the viewport

#### Scenario: Navigation links work correctly
- **WHEN** user clicks a navigation link (Producto, How it works, Docs, Stack)
- **THEN** page scrolls smoothly to the corresponding section

#### Scenario: Header is responsive
- **WHEN** user views on mobile (375px)
- **THEN** navigation links are hidden and hamburger menu is displayed

### Requirement: Hero section SHALL display product value proposition
The hero section SHALL display badge, title, subtitle, CTA buttons, and terminal code block.

#### Scenario: Hero content is displayed
- **WHEN** user loads the page
- **THEN** hero section shows "Open source · Self-hosted" badge, product title, subtitle, and GitHub CTA

#### Scenario: Terminal code block is visible
- **WHEN** user views hero section
- **THEN** terminal code block shows installation commands with syntax highlighting

### Requirement: Value Props section SHALL display 3 feature cards
The value props section SHALL display 3 cards with hexagonal icons, titles, and descriptions.

#### Scenario: Value props are displayed
- **WHEN** user scrolls to value props section
- **THEN** 3 cards are visible: "Indexa tu conocimiento", "Responde con fuentes", "Tú tienes el control"

#### Scenario: Cards are responsive
- **WHEN** user views on mobile (375px)
- **THEN** cards stack vertically in a single column

### Requirement: How it Works section SHALL display interactive loop
The how it works section SHALL display 3 interactive steps with code examples.

#### Scenario: Steps are displayed
- **WHEN** user scrolls to how it works section
- **THEN** 3 steps are visible: "Razonar", "Actuar", "Observar"

#### Scenario: Step selection works
- **WHEN** user clicks on a step
- **THEN** the step is highlighted and corresponding code example is displayed

### Requirement: Use Cases section SHALL display 4 use case cards
The use cases section SHALL display 4 cards with icons, titles, and descriptions.

#### Scenario: Use cases are displayed
- **WHEN** user scrolls to use cases section
- **THEN** 4 cards are visible: "Preguntas recurrentes", "Onboarding de miembros", "Soporte técnico", "Buscar en el histórico"

### Requirement: Installation section SHALL display 3 installation steps
The installation section SHALL display 3 step cards with code blocks.

#### Scenario: Installation steps are displayed
- **WHEN** user scrolls to installation section
- **THEN** 3 steps are visible: "Clona el repositorio", "Configura el entorno", "Levanta la instancia"

#### Scenario: Code blocks are formatted correctly
- **WHEN** user views installation section
- **THEN** code blocks show commands with syntax highlighting and copy button

### Requirement: Documentation section SHALL display tabbed navigation
The documentation section SHALL display tabbed navigation with articles organized by section.

#### Scenario: Documentation tabs are displayed
- **WHEN** user scrolls to documentation section
- **THEN** 4 tabs are visible: "Empezar", "Configuración", "Acceso", "Operación"

#### Scenario: Tab switching works
- **WHEN** user clicks on a tab
- **THEN** corresponding articles are displayed in the right panel

### Requirement: Stack + Architecture section SHALL display technology grid and diagrams
The stack + architecture section SHALL display technology cards, Clean Architecture diagram, and Event-Driven diagram.

#### Scenario: Technology grid is displayed
- **WHEN** user scrolls to stack + architecture section
- **THEN** 8 technology cards are visible in a grid

#### Scenario: Architecture diagrams are displayed
- **WHEN** user views stack + architecture section
- **THEN** Clean Architecture and Event-Driven diagrams are visible

### Requirement: CTA section SHALL display final call-to-action
The CTA section SHALL display logo, title, subtitle, and GitHub button.

#### Scenario: CTA is displayed
- **WHEN** user scrolls to CTA section
- **THEN** logo, "Despliega tu propio agente hoy" title, and GitHub button are visible

### Requirement: Footer SHALL display logo and links
The footer SHALL display logo, product name, tagline, and links (Docs, GitHub, License).

#### Scenario: Footer is displayed
- **WHEN** user scrolls to footer
- **THEN** logo, "Share2Brain" name, tagline, and links are visible

### Requirement: Smooth scroll SHALL work for internal links
All internal anchor links SHALL scroll smoothly to the target section.

#### Scenario: Smooth scroll works
- **WHEN** user clicks a navigation link or anchor link
- **THEN** page scrolls smoothly to the target section without abrupt jumps

### Requirement: Responsive design SHALL work across breakpoints
The landing page SHALL be fully responsive across mobile (375px), tablet (768px), and desktop (1440px).

#### Scenario: Mobile layout works
- **WHEN** user views on 375px width
- **THEN** layout adapts to single column, navigation shows hamburger menu, and all content is accessible

#### Scenario: Tablet layout works
- **WHEN** user views on 768px width
- **THEN** layout adapts to appropriate grid columns and all content is accessible

#### Scenario: Desktop layout works
- **WHEN** user views on 1440px width
- **THEN** layout shows full multi-column grid and all content is accessible

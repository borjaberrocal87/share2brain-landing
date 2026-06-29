---
description: Standards and best practices for technical documentation and AI specs in the KeepHive Landing project.
globs:
alwaysApply: true
---

# KeepHive Landing — Documentation Standards

## Introduction

Technical documentation covers all project documentation: README, architecture docs, configuration reference, and any markdown files describing how the project is structured, runs, and operates.

AI specs cover documents that instruct AI agents on how to behave, document, plan, and code. This includes team agreements, standards, and conventions.

## General Rules

- **Always write in English** — including comments and explanations within files. This applies to new documentation, updates, and in-code documentation.

## Technical Documentation

Before any commit or push, review which technical documentation should be updated.

### Update Checklist

1. **Review all recent changes** in the codebase
2. **Identify affected documentation** based on the changes:
   - New/modified Astro component → Update relevant section in component docs
   - New page or route → Update `docs/data-model.md` (content model) and navigation
   - Styling/design token changes → Update `docs/frontend-standards.md`
   - Build/deploy config changes → Update `docs/backend-standards.md`
   - New environment variables → Update `docs/development_guide.md`
   - Content changes (docs pages) → Update the relevant Markdown file in `src/content/docs/`
3. **Update each affected file** in English, maintaining consistency
4. **Verify formatting** follows the established structure
5. **Cross-reference** related docs to ensure internal consistency
6. **Report** which files were updated and what changed

### Documentation File Ownership

| File | Owner | When to Update |
|------|-------|---------------|
| `docs/base-standards.md` | All | Core principles, domain language, tech stack changes |
| `docs/frontend-standards.md` | Frontend team | Component patterns, styling, SEO, performance |
| `docs/backend-standards.md` | Platform team | Build pipeline, deployment, CI/CD, hosting |
| `docs/api-spec.yml` | All | API contract changes (if any external APIs are consumed) |
| `docs/data-model.md` | Content team | Content model, page structure, navigation changes |
| `docs/development_guide.md` | Platform team | Setup steps, env vars, deployment changes |
| `docs/documentation-standards.md` | All | Process changes, new conventions |
| `docs/openspec-tasks-mandatory-steps.md` | All | Task workflow changes |

### Naming and Formatting

- **File names**: kebab-case (`frontend-standards.md`)
- **Headings**: Use ATX-style (`#`, `##`, `###`)
- **Code blocks**: Always specify language (` ```astro `, ` ```typescript `, ` ```bash `)
- **Links**: Use relative paths (`./frontend-standards.md`)
- **Tables**: Use markdown tables for structured data
- **Diagrams**: Use Mermaid syntax for flowcharts

### Content Architecture

The KeepHive Landing site uses Astro's **content collections** for documentation pages:

```
src/content/docs/
├── getting-started.md
├── configuration.md
├── architecture.md
└── security.md
```

Each Markdown file should include:
- **Frontmatter**: `title`, `description`, `order` (for sorting)
- **Headings**: Proper hierarchy (h1 → h2 → h3)
- **Code blocks**: With language specified
- **Links**: Relative links to other docs pages

## AI Specs

This section establishes a mandatory process for the AI to:

1. **Learn from user feedback** — guidance, suggestions, and corrections during interactions.
2. **Identify improvement opportunities** — proactively find ways to refine existing Development Rules.
3. **Stay aligned with evolving needs** — adapt AI assistance as the project evolves.
4. **Incorporate feedback into operational framework** — maximize the AI's value to the team.

This applies after any interaction where the user provides explicit or implicit feedback, suggestions, corrections, or preferences. **The AI must actively analyze all interactions for learning opportunities, not passively wait for direct feedback.**

### Common Pitfalls to Avoid

- **Skipping Approval Process**: Applying rule modifications without user review and approval.
- **Unlinked Proposals**: Proposing changes without connecting to specific user feedback.
- **Imprecise Modifications**: Suggesting changes without identifying which rule or section to modify.
- **Unaddressed Feedback**: Not initiating the learning process when feedback is received.
- **Scope Creep**: Updating multiple unrelated rules simultaneously.
- **Unprompted Rule Changes**: Modifying rules without a connection to user feedback.
- **Missing Update Confirmation**: Failing to notify the user after a rule change is implemented.

### File References

When referencing other documentation files, use relative paths:

```markdown
See [Frontend Standards](./frontend-standards.md) for component patterns.
The content model is defined in [data-model.md](./data-model.md).
```

### Code Documentation

- **JSDoc/TSDoc**: Document public functions and interfaces
- **Inline Comments**: Explain *why*, not *what* — avoid obvious comments
- **Component Props**: Document Astro component props with `interface Props`

```typescript
/**
 * Renders a code block with syntax highlighting and copy button.
 * Uses Shiki for highlighting and Framer Motion for copy animation.
 */
export function CodeBlock({ code, language }: { code: string; language: string }) {
  // ...
}
```

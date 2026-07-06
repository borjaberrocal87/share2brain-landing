---
description: Enforce mandatory steps from openspec/config.yaml when creating tasks.md artifacts for Chat2Brain Landing. Agent must execute all manual tests.
alwaysApply: true
---

# OpenSpec Tasks: Mandatory Steps Enforcement (Chat2Brain Landing)

When creating or updating `tasks.md` artifacts in OpenSpec changes, you MUST:

## 1. Read openspec/config.yaml First

**BEFORE** creating or updating any `tasks.md` file, you MUST read `openspec/config.yaml` to understand:
- Frontend-specific mandatory steps
- Branch naming conventions
- Task structure requirements
- Testing and documentation requirements

## 2. Mandatory Steps

All implementation tasks MUST include these steps in the correct order:

### Step 0: Create Feature Branch (MUST BE FIRST)
- **Location**: Must be the very first step (Step 0)
- **Branch naming**: `feature/<ticket-id>-description` or `fix/<ticket-id>-description`
- **Action**: Create and switch to feature branch before any code changes

### Mandatory Steps (Must Be Included):
- **Step N**: Review and Update Existing Tests (MANDATORY)
- **Step N+1**: Run Tests and Verify Build (MANDATORY)
- **Step N+2**: Manual Visual/Functional Testing (MANDATORY) — **AGENT MUST EXECUTE**
- **Step N+3**: E2E Testing with Playwright MCP (MANDATORY if applicable) — **AGENT MUST EXECUTE**
- **Step N+4**: Update Technical Documentation (MANDATORY)

## 3. Manual Testing Requirements — CRITICAL: Agent Must Execute

**IMPORTANT**: The coding agent (AI) MUST perform all manual testing steps itself. **NEVER delegate testing to the user**. These tests must be executed by the agent to mark tasks as completed in `tasks.md`.

### Step N+1: Run Tests and Verify Build (MANDATORY)

**Agent Responsibility**: The coding agent MUST execute all tests and verify the production build succeeds.

**Implementation Steps** (Agent must perform):
1. **Prepare Test Environment**:
   - Ensure all dependencies are installed (`npm ci`)
   - Document the exact test command(s) that will be executed

2. **Run Targeted Tests First**:
   - Execute focused tests for the modified module(s)
   - Confirm failures are resolved and no new regressions appear
   - Capture command output summary (passed/failed/skipped)

3. **Run Full Test Suite**:
   - Execute `npm test` (Vitest unit tests)
   - Record total test counts, failures, runtime

4. **Verify Production Build**:
   - Run `npm run build`
   - Confirm build completes without errors
   - Check `dist/` output contains expected pages

5. **Create Test Report in Spec Folder**:
   - Save report under `specs/<change-name>/reports/`
   - Filename pattern: `YYYY-MM-DD-step-N+1-test-and-build-verification.md`
   - Include executed commands, summarized results, build output verification

6. **Mark Task as Completed**: Only after tests pass and build succeeds.

### Step N+2: Manual Visual/Functional Testing (MANDATORY)

**Agent Responsibility**: The coding agent MUST visually verify the changes work correctly.

**Implementation Steps** (Agent must perform):
1. **Start Development Server**:
   - Run `npm run dev` if not already running
   - Verify site loads at `http://localhost:4321`

2. **Test Visual Changes**:
   - Navigate to the affected page(s)
   - Verify layout renders correctly
   - Check responsive behavior (resize browser)
   - Verify dark/light mode toggle works
   - Check for visual regressions

3. **Test Interactive Components** (if React island changed):
   - Verify React islands hydrate correctly
   - Test click interactions
   - Verify animations work
   - Check keyboard navigation

4. **Test SEO Elements** (if page structure changed):
   - Verify meta tags are present
   - Check heading hierarchy
   - Verify links are not broken

5. **Document findings** in a report under `specs/<change-name>/reports/`

6. **Mark Task as Completed**: Only after visual verification passes.

### Step N+3: E2E Testing with Playwright MCP (MANDATORY if applicable)

**When This Applies**:
- Changes affecting user navigation or page routing
- New interactive components
- SEO-related changes (meta tags, structured data)
- Performance-critical changes

**Implementation Steps** (Agent must perform):
1. **Ensure dev server is running**
2. **Navigate to application** using Playwright MCP `browser_navigate`
3. **Execute user workflows** using Playwright MCP tools
4. **Test error scenarios** (404 pages, broken links)
5. **Document test scenarios and outcomes**

### Step N+4: Update Technical Documentation (MANDATORY)

After implementation, review and update the relevant docs:

| Change Type | Documentation to Update |
|------------|------------------------|
| New/modified component | `docs/frontend-standards.md` |
| Build/deploy config change | `docs/backend-standards.md` |
| New documentation page | `docs/data-model.md` (content model) |
| New env variable | `docs/development_guide.md` |
| Process change | `docs/documentation-standards.md` |

## 4. Verification Checklist

Before finalizing any `tasks.md` file, verify:
- [ ] Step 0 (Create Feature Branch) is the FIRST step
- [ ] All mandatory steps are included
- [ ] Steps are numbered sequentially
- [ ] Mandatory steps are clearly marked with "(MANDATORY)" label
- [ ] Branch naming follows: `feature/<ticket-id>-description`
- [ ] Step N+1 includes report path in `specs/<change-name>/reports/`
- [ ] Manual testing steps explicitly state "AGENT MUST EXECUTE"
- [ ] Documentation update step is included

## 5. When This Applies

This rule applies when:
- Creating `tasks.md` via `/opsx:ff` (fast-forward) or `openspec-ff-change` skill
- Creating `tasks.md` via `/opsx:continue` (continue change) or `openspec-continue-change` skill
- Updating existing `tasks.md` files
- Any task creation that involves frontend changes
- Implementing tasks from `tasks.md` via `/opsx:apply` or `openspec-apply-change` skill — the agent must execute manual tests

## 6. Agent Execution Requirements

**CRITICAL**: When implementing tasks from `tasks.md`, the coding agent MUST:

1. **Execute All Manual Tests**: Never ask the user to run tests or verify visuals
2. **Start Dev Server If Needed**: Run `npm run dev` before testing
3. **Verify Build**: Always run `npm run build` to confirm no build errors
4. **Mark Tasks Only After Completion**: Tasks can ONLY be marked `[x]` after:
   - All tests executed and passed
   - Production build succeeds
   - Visual/functional verification completed
   - Test report created in `specs/<change-name>/reports/`
5. **Document Everything**: All test commands, results, visual findings, and issues

## 7. Failure to Follow

If you create tasks without following these mandatory steps, the user will need to manually fix the `tasks.md` file. Always read `openspec/config.yaml` first and ensure all mandatory steps are included.

**If you implement tasks without executing manual tests yourself, you are violating this rule.**

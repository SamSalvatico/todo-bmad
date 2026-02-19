# Story 3.6: Create Comprehensive E2E Test Suite for All States

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a developer,
I want comprehensive E2E tests covering all user flows and edge cases,
so that I can confidently deploy and maintain the application.

## Acceptance Criteria

1. `packages/frontend/e2e/todo-crud.spec.ts` (already exists) is enhanced with full happy-path workflow: page loads → EmptyState shows → create todo → EmptyState disappears → todo appears → create second → toggle first → delete second → refresh → first persists with completed state.
2. `packages/frontend/e2e/error-handling.spec.ts` exists and tests: (a) stops backend, attempts creation, verifies error, restarts backend, dismisses error, retries successfully; (b) input preservation on failure — types text, simulates failure, verifies text still in input; (c) empty text validation error.
3. `packages/frontend/e2e/ui-states.spec.ts` exists and tests: (a) LoadingSpinner appears briefly on initial load; (b) EmptyState shows when no todos; (c) ErrorMessage can be dismissed; (d) app recovers from error state.
4. `packages/frontend/e2e/responsive.spec.ts` (enhance existing `mobile.spec.ts` or create new) tests at mobile (375×667), tablet (768×1024), and desktop (1920×1080) — verifies layout doesn't break and touch targets are accessible.
5. `packages/frontend/e2e/keyboard-navigation.spec.ts` (already exists) is verified complete: focus on input, Tab order, Enter creates, Space toggles, focus after delete.
6. `packages/frontend/e2e/accessibility.spec.ts` exists and uses `@axe-core/playwright` to audit: (a) no violations on initial load; (b) no violations with todos present; (c) no violations in error state; (d) ARIA labels present on interactive elements.
7. Data persistence test: creates multiple todos with different states, reloads page, verifies all states and order persist (created_at DESC).
8. Concurrent operations test: opens two browser contexts, creates todo in context 1, refreshes context 2 to see it, updates in context 2, refreshes context 1 to verify (last-write-wins per NFR13).
9. `pnpm test:e2e` runs all tests and all pass.
10. Total E2E execution time < 2 minutes.
11. Tests are stable — no flaky failures on re-run.
12. All FRs from Epic 3 are covered: FR11 (empty), FR12 (loading), FR13-FR15 (errors, input preservation), FR16-FR19 (responsive, touch, keyboard).
13. All NFRs from Epic 3 are validated: performance (NFR1-6 covered by audit), accessibility (NFR14-17), error recovery (NFR11).
14. README testing section documents: how to run unit tests, E2E tests, coverage areas, and requirement that both frontend and backend must be running.

## Tasks / Subtasks

- [ ] Task 1: Enhance happy-path CRUD test in todo-crud.spec.ts (AC: 1, 7)
  - [ ] Add comprehensive workflow test: load → EmptyState → create → disappears → second todo → toggle first → delete second → refresh → persistence with completed state
  - [ ] Add multi-state persistence test: create 3 todos, complete 1, delete 1, refresh, verify surviving todos retain correct states
  - [ ] Verify order is created_at DESC after refresh
  - [ ] Ensure all existing tests in todo-crud.spec.ts still pass — do NOT break or duplicate them

- [ ] Task 2: Create error-handling.spec.ts (AC: 2)
  - [ ] Test 1: Network failure — use `page.route('**/api/todos', route => route.abort())` to simulate backend unreachable, verify ErrorMessage with `role="alert"` appears, unblock route, dismiss error, retry create successfully
  - [ ] Test 2: Input preservation — fill input, abort next POST, attempt create, verify input text preserved after error, unblock, retry successfully
  - [ ] Test 3: Empty text validation — verify Add button is disabled when input is empty, verify no API call made
  - [ ] Run tests and verify all pass

- [ ] Task 3: Create ui-states.spec.ts (AC: 3)
  - [ ] Test 1: LoadingSpinner — use `page.route` to delay API response, verify `role="status"` spinner appears, then resolve and verify spinner disappears
  - [ ] Test 2: EmptyState — ensure no todos exist, verify EmptyState with `role="status"` is visible
  - [ ] Test 3: ErrorMessage dismiss — trigger error via route abort, verify error shows, click dismiss button, verify error disappears
  - [ ] Test 4: Recovery from error — trigger error, dismiss, verify app allows normal create/toggle/delete operations
  - [ ] Run tests and verify all pass

- [ ] Task 4: Verify and enhance responsive tests (AC: 4)
  - [ ] Review existing `mobile.spec.ts` — it already covers 375×667 and 320×568 viewports
  - [ ] Add tablet viewport test (768×1024) if not covered — verify layout, touch targets, full CRUD workflow
  - [ ] Add desktop viewport test (1920×1080) — verify layout doesn't stretch excessively, elements remain centered/usable
  - [ ] Verify touch targets ≥ 44×44px at each viewport
  - [ ] If creating `responsive.spec.ts`, keep `mobile.spec.ts` intact — do NOT break existing tests
  - [ ] Run tests and verify all pass

- [ ] Task 5: Verify keyboard-navigation.spec.ts completeness (AC: 5)
  - [ ] Review existing 8 keyboard tests — confirm coverage: input focus, Tab order, Enter create, Space toggle, Enter delete, focus after deletion, all-keyboard workflow
  - [ ] If any gap in AC 5 requirements, add missing tests
  - [ ] Run tests and verify all 8 (or more) pass

- [ ] Task 6: Create accessibility.spec.ts with @axe-core/playwright (AC: 6)
  - [ ] Install `@axe-core/playwright` as a dev dependency: `pnpm --filter frontend add -D @axe-core/playwright`
  - [ ] Test 1: Initial load — run axe audit on page with no todos, verify zero violations
  - [ ] Test 2: With todos — create 2 todos, complete 1, run axe audit, verify zero violations
  - [ ] Test 3: Error state — trigger error via route abort, run axe audit, verify zero violations
  - [ ] Test 4: ARIA labels — verify `aria-label` on input, checkboxes, delete buttons, and `role` on EmptyState, LoadingSpinner, ErrorMessage
  - [ ] Run tests and verify all pass

- [ ] Task 7: Create concurrent operations test (AC: 8)
  - [ ] Use `browser.newContext()` to create two independent browser contexts
  - [ ] Context 1: create a todo, verify it appears
  - [ ] Context 2: refresh, verify the todo from context 1 appears
  - [ ] Context 2: toggle the todo's completion state
  - [ ] Context 1: refresh, verify the update is reflected
  - [ ] Clean up both contexts
  - [ ] Run test and verify it passes

- [ ] Task 8: Verify full suite and update README (AC: 9, 10, 11, 14)
  - [ ] Run `pnpm test:e2e` — all tests must pass
  - [ ] Run suite 3 times to verify stability (no flaky tests)
  - [ ] Verify total execution time < 2 minutes
  - [ ] Update README Testing section with: how to run unit tests (`pnpm test`), how to run E2E tests (`pnpm test:e2e`), coverage areas, prerequisite that backend and frontend must be running
  - [ ] Document total test counts (unit + E2E)

## Dev Notes

**CRITICAL: This is an E2E TEST story. Do NOT modify any application source code (components, hooks, API, backend). Only add/modify test files and dev dependencies.**

### Existing E2E Test Inventory (24 tests currently)

| File | Tests | Coverage |
|------|-------|----------|
| `smoke.spec.ts` | 1 | Page loads, heading visible |
| `todo-crud.spec.ts` | 7 | Create, toggle, delete, persist, validate, full workflow |
| `mobile.spec.ts` | 8 | Mobile viewport, touch targets, toggle, delete, 320px layout, typography scaling, completed styles |
| `keyboard-navigation.spec.ts` | 8 | Focus on load, Tab order, Enter create, Space toggle, Enter delete, focus after delete, focus after last delete, all-keyboard workflow |

### What's Missing (Gaps to Fill)

1. **Error handling E2E** — No tests for network failures, error messages, input preservation, error dismiss
2. **UI states E2E** — No tests for LoadingSpinner, EmptyState presence, error recovery
3. **Accessibility audit** — No `@axe-core/playwright` tests
4. **Concurrent contexts** — No multi-tab/multi-context tests
5. **Desktop viewport** — No tests at 1920×1080
6. **Tablet viewport** — No tests at 768×1024
7. **Enhanced happy-path** — Existing CRUD test doesn't cover full EmptyState → multi-todo → toggle → delete → persist workflow in one flow

### Project Structure Notes

**New Files to Create:**
- `packages/frontend/e2e/error-handling.spec.ts`
- `packages/frontend/e2e/ui-states.spec.ts`
- `packages/frontend/e2e/accessibility.spec.ts`
- `packages/frontend/e2e/responsive.spec.ts` (or enhance `mobile.spec.ts`)

**Files to Modify:**
- `packages/frontend/e2e/todo-crud.spec.ts` — Add enhanced happy-path and persistence tests
- `packages/frontend/package.json` — Add `@axe-core/playwright` dev dependency
- `README.md` — Update Testing section
- `pnpm-lock.yaml` — Updated by dependency install

**Files to Preserve (NO MODIFICATIONS):**
- ALL source files under `packages/frontend/src/` — components, hooks, api, types
- ALL source files under `packages/backend/src/` — routes, repositories, db
- `packages/frontend/e2e/smoke.spec.ts` — keep as-is
- `packages/frontend/e2e/keyboard-navigation.spec.ts` — keep as-is unless gaps found
- `packages/frontend/e2e/mobile.spec.ts` — keep as-is

### References

- [Source: _bmad-output/planning-artifacts/epics.md — Story 3.6 Acceptance Criteria]
- [Source: _bmad-output/planning-artifacts/architecture.md — Testing: Playwright E2E]
- [Source: _bmad-output/planning-artifacts/prd.md — FR11-FR19, NFR1-6, NFR11, NFR13-17]

### Technical Requirements

**Playwright Configuration (already set up):**
```typescript
// packages/frontend/playwright.config.ts
// testDir: './e2e'
// baseURL: 'http://localhost:5173'
// webServer: backend (port 3000) + frontend (port 5173)
// projects: chromium only
```

**Key Patterns for E2E Tests (from existing tests):**
```typescript
// Standard test setup
test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  await expect(page.locator('h1')).toContainText('My Todos');
});

// Locator patterns used across existing tests
const input = page.locator('input[placeholder="What needs to be done?"]');
const addBtn = page.locator('button:has-text("Add")');
const todoItem = page.locator('li').filter({ hasText: todoText });
const checkbox = todoItem.locator('input[type="checkbox"]');
const deleteBtn = todoItem.locator('button:has-text("Delete")');

// ARIA-based locators (preferred for accessibility tests)
const input = page.locator('input[aria-label="New todo"]');
const todoList = page.locator('ul[aria-label="Todo list"]');

// Delete requires dialog accept
page.once('dialog', (dialog) => void dialog.accept());

// Network interception for error simulation
await page.route('**/api/todos', (route) => route.abort());
await page.unroute('**/api/todos');  // To restore

// Multiple browser contexts for concurrent tests
const context1 = await browser.newContext();
const context2 = await browser.newContext();
const page1 = await context1.newPage();
const page2 = await context2.newPage();
```

**@axe-core/playwright Usage:**
```typescript
import AxeBuilder from '@axe-core/playwright';

test('should have no accessibility violations', async ({ page }) => {
  await page.goto('/');
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});
```

**ARIA Elements to Verify (from Stories 3.1-3.4):**
- `input[aria-label="New todo"]` — TodoInput
- `input[type="checkbox"][aria-label="Toggle todo: {text}"]` — each TodoItem
- `button[aria-label="Delete todo: {text}"]` — each TodoItem delete
- `[role="status"]` — EmptyState, LoadingSpinner
- `[role="alert"][aria-live="assertive"]` — ErrorMessage
- `ul[aria-label="Todo list"]` — TodoList

### Architecture Compliance

**Testing Architecture:**
- E2E tests go in `packages/frontend/e2e/` directory
- Use Playwright with Chromium project only
- Tests must be parallelizable where possible (use unique todo text with `Date.now()`)
- Serial mode only when tests share DB state (use `test.describe.configure({ mode: 'serial' })`)
- `waitForLoadState('networkidle')` pattern in beforeEach
- Clean up created todos at end of each test to avoid pollution

**No Application Code Changes:**
- Do NOT modify components, hooks, API, or backend code
- Do NOT add new production dependencies
- Only `@axe-core/playwright` as new dev dependency

**Anti-Patterns to AVOID:**
- Do NOT use `page.waitForTimeout()` as the sole wait mechanism — prefer `waitForResponse`, `waitForLoadState`, or `expect().toBeVisible()`
- Do NOT hardcode todo IDs — always use text-based locators with `Date.now()` timestamps
- Do NOT share state between test files — each file should be independently runnable
- Do NOT modify `playwright.config.ts` structure — webServer setup is correct
- Do NOT add Firefox/WebKit projects — Chromium only per architecture

### Library & Framework Requirements

**New Dev Dependency:**
```bash
pnpm --filter frontend add -D @axe-core/playwright
```

**Existing Stack (no changes):**
- Playwright 1.58+ (already installed)
- TypeScript (tests use `.spec.ts` extension)
- Chromium browser (auto-installed by Playwright)

### File Structure Requirements

```
packages/frontend/
├── e2e/
│   ├── smoke.spec.ts                    # EXISTING - keep as-is
│   ├── todo-crud.spec.ts                # MODIFY - add enhanced happy-path + persistence
│   ├── mobile.spec.ts                   # EXISTING - keep as-is
│   ├── keyboard-navigation.spec.ts      # EXISTING - keep or enhance
│   ├── error-handling.spec.ts           # NEW - network failures, input preservation, validation
│   ├── ui-states.spec.ts               # NEW - loading, empty, error dismiss, recovery
│   ├── accessibility.spec.ts            # NEW - @axe-core/playwright audits
│   └── responsive.spec.ts              # NEW - tablet + desktop viewports (or enhance mobile.spec.ts)
├── playwright.config.ts                 # NO CHANGE
└── package.json                         # ADD @axe-core/playwright dev dependency
```

### Testing Requirements

**All tests must pass:**
- Existing: 95 unit tests (`pnpm test`)
- Existing: 24 E2E tests (`pnpm test:e2e`)
- New: ~20-30 additional E2E tests
- Target total: ~50+ E2E tests

**Stability requirement:** Run `pnpm test:e2e` at least 2-3 times to verify no flaky tests.

### Previous Story Intelligence (3.5)

**Learnings from Story 3.5 (Performance Optimization):**
- Story was primarily audit/verification — minimal code changes
- Added `rollup-plugin-visualizer` (dev dep), gated by `ANALYZE=true`
- Added `<meta name="description">`, favicon to `index.html`
- Bundle sizes: JS 63.24 KB gzipped, CSS 3.63 KB gzipped
- Dockerfile had multiple issues (missing .dockerignore, broken pnpm symlinks, missing init.sql) — all fixed
- Backend `tsconfig.json` now excludes test files from build compilation
- 140 total tests (45 backend + 95 frontend unit) all passing

**Code Patterns to Follow:**
- Tailwind utility classes only (no custom CSS)
- Biome lint: sorted imports, proper formatting
- `forwardRef` pattern for TodoInput
- `{ data, error }` return pattern in api.ts
- `handle*` naming convention for event handlers

### Git Intelligence Summary

**Recent commits (last 5):**
1. `feat: finished 3.5` — Performance optimization, Dockerfile fixes
2. `feat: finished 3.4` — Keyboard navigation & accessibility
3. `feat: complete story 3.3 responsive design with accessibility fixes`
4. `fix: finalize story 3.2 error handling review`
5. `feat: finished 3.1` — UI state components

**Patterns observed:**
- Commit messages use `feat:` prefix for story work, `fix:` for review corrections
- Each story gets 1-2 commits
- Biome lint compliance enforced — sorted imports, proper formatting

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List


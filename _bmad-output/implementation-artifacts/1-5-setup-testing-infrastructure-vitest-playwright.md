# Story 1.5: Setup Testing Infrastructure (Vitest, Playwright)

Status: ready-for-dev

## Story

As a developer,
I want unit/integration testing with Vitest and E2E testing with Playwright,
So that I can ensure code quality and catch regressions early.

## Acceptance Criteria

**Given** the monorepo with frontend and backend packages
**When** I configure Vitest for unit and integration tests
**Then** both `packages/frontend/` and `packages/backend/` have `vitest` and `@vitest/ui` as dev dependencies
**And** backend includes `@types/better-sqlite3` for testing database operations
**And** frontend includes `@testing-library/react`, `@testing-library/jest-dom`, `jsdom`
**And** each package has a `vitest.config.ts` that extends their Vite config (frontend) or defines test environment (backend)

**Given** Vitest is configured
**When** I create sample test files
**Then** `packages/backend/src/config.test.ts` exists and tests environment variable validation
**And** `packages/frontend/src/App.test.tsx` exists and renders the App component
**And** tests are co-located with source files (same directory)

**Given** sample tests exist
**When** I run `pnpm test` from the root
**Then** Vitest runs all tests in both packages
**And** test results display in the console
**And** all sample tests pass

**Given** Playwright is configured for E2E testing
**When** I setup Playwright in the frontend package
**Then** `packages/frontend/` has `@playwright/test` as a dev dependency
**And** `packages/frontend/playwright.config.ts` configures `webServer` to start both frontend and backend before tests
**And** `packages/frontend/e2e/` directory exists for E2E test files
**And** a sample test `packages/frontend/e2e/smoke.spec.ts` verifies the app loads

**Given** Playwright is configured
**When** I run `pnpm --filter frontend test:e2e`
**Then** Playwright starts the full stack (backend + frontend)
**And** runs E2E tests in headless mode
**And** the smoke test passes

## Tasks / Subtasks

- [ ] Configure Vitest for backend package (AC: 1)
  - [ ] Install Vitest dependencies in backend: `vitest`, `@vitest/ui`
  - [ ] Create `packages/backend/vitest.config.ts` with test environment configuration
  - [ ] Ensure `@types/better-sqlite3` is already installed (from Story 1.2)
  - [ ] Add test script to backend package.json: `"test": "vitest"`

- [ ] Create sample backend test (AC: 2)
  - [ ] Create `packages/backend/src/config.test.ts` co-located with `config.ts`
  - [ ] Write test that validates environment variable schema behavior
  - [ ] Verify test runs successfully with `pnpm --filter backend test`

- [ ] Configure Vitest for frontend package (AC: 1)
  - [ ] Install Vitest dependencies in frontend: `vitest`, `@vitest/ui`, `jsdom`
  - [ ] Install testing library: `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`
  - [ ] Create `packages/frontend/vitest.config.ts` that extends `vite.config.ts`
  - [ ] Add test script to frontend package.json: `"test": "vitest"`
  - [ ] Configure jsdom as test environment for React components

- [ ] Create sample frontend test (AC: 2)
  - [ ] Create `packages/frontend/src/App.test.tsx` co-located with `App.tsx`
  - [ ] Write test that renders the App component
  - [ ] Verify test runs successfully with `pnpm --filter frontend test`

- [ ] Update root package.json test script (AC: 3)
  - [ ] Change root test script from placeholder to: `"test": "pnpm --recursive test"`
  - [ ] Run `pnpm test` from root and verify both packages run tests
  - [ ] Confirm all sample tests pass

- [ ] Install and configure Playwright (AC: 4)
  - [ ] Install Playwright in frontend package: `@playwright/test`
  - [ ] Run Playwright initialization if needed (browsers, config)
  - [ ] Create `packages/frontend/playwright.config.ts`
  - [ ] Configure `webServer` to start backend and frontend before E2E tests
  - [ ] Create `packages/frontend/e2e/` directory for E2E tests

- [ ] Create sample E2E test (AC: 4)
  - [ ] Create `packages/frontend/e2e/smoke.spec.ts`
  - [ ] Write smoke test that navigates to app and verifies page loads
  - [ ] Verify basic DOM elements are present
  - [ ] Add test:e2e script to frontend package.json: `"test:e2e": "playwright test"`

- [ ] Run and verify E2E tests (AC: 5)
  - [ ] Run `pnpm --filter frontend test:e2e`
  - [ ] Verify Playwright starts both backend and frontend servers
  - [ ] Verify smoke test passes in headless mode
  - [ ] Check that servers shut down cleanly after tests

- [ ] Final verification
  - [ ] Run `pnpm test` from root - all unit tests pass
  - [ ] Run `pnpm --filter frontend test:e2e` - E2E tests pass
  - [ ] Run `pnpm lint` - no linting errors
  - [ ] Verify all configuration files follow project conventions

## Dev Notes

### Architecture Requirements

**From [architecture.md#Testing Strategy]:**
- Vitest for unit and integration tests (co-located with source files)
- @testing-library/react for component tests  
- Playwright for E2E tests running against full stack
- Test commands: `pnpm test` (unit/integration), `pnpm test:e2e` (E2E)

**Testing Standards from Architecture:**
- Tests are co-located with source files (same directory)
- Frontend: jsdom environment for React component tests
- Backend: Node environment for API and repository tests
- E2E tests in dedicated `e2e/` directory within frontend package

**File Structure:**
```
todo-bmad/
├── package.json                    # Root test script: "pnpm --recursive test"
└── packages/
    ├── backend/
    │   ├── package.json           # "test": "vitest"
    │   ├── vitest.config.ts       # Backend test config
    │   └── src/
    │       ├── config.ts
    │       ├── config.test.ts     # Co-located test
    │       └── ...
    └── frontend/
        ├── package.json           # "test": "vitest", "test:e2e": "playwright test"
        ├── vitest.config.ts       # Extends vite.config.ts
        ├── playwright.config.ts   # E2E config with webServer
        ├── e2e/
        │   └── smoke.spec.ts      # Sample E2E test
        └── src/
            ├── App.tsx
            ├── App.test.tsx       # Co-located test
            └── ...
```

### Vitest Configuration Guidance

**Backend vitest.config.ts:**
```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
  },
});
```

**Frontend vitest.config.ts:**
```typescript
import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config';

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/test/setup.ts',
    },
  })
);
```

**Frontend test setup file (src/test/setup.ts):**
```typescript
import '@testing-library/jest-dom';
```

### Playwright Configuration Guidance

**playwright.config.ts:**
```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: [
    {
      command: 'pnpm --filter backend dev',
      url: 'http://localhost:3000/health',
      reuseExistingServer: !process.env.CI,
      timeout: 30000,
    },
    {
      command: 'pnpm --filter frontend dev',
      url: 'http://localhost:5173',
      reuseExistingServer: !process.env.CI,
      timeout: 30000,
    },
  ],
});
```

**Note:** The webServer configuration assumes a `/health` endpoint exists on the backend. If not yet implemented, you can use `http://localhost:3000/docs` (Swagger UI) as an alternative for now.

### Sample Test Templates

**Backend config.test.ts:**
```typescript
import { describe, it, expect } from 'vitest';
import type { FastifyInstance } from 'fastify';
import buildApp from './app.js';

describe('Config validation', () => {
  it('should load environment configuration', async () => {
    const app: FastifyInstance = await buildApp({
      logger: false,
    });

    expect(app.config).toBeDefined();
    expect(app.config.PORT).toBeDefined();
    expect(app.config.HOST).toBeDefined();
    
    await app.close();
  });
});
```

**Frontend App.test.tsx:**
```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />);
    expect(document.body).toBeDefined();
  });
});
```

**E2E smoke.spec.ts:**
```typescript
import { test, expect } from '@playwright/test';

test('app loads successfully', async ({ page }) => {
  await page.goto('/');
  
  // Verify the page loaded
  await expect(page).toHaveTitle(/Todo/i);
  
  // Verify React app rendered
  const body = page.locator('body');
  await expect(body).toBeVisible();
});
```

### Dependencies to Install

**Backend:**
- `vitest` - Test runner
- `@vitest/ui` - Web UI for tests (optional but helpful)

**Frontend:**
- `vitest` - Test runner
- `@vitest/ui` - Web UI for tests
- `jsdom` - DOM environment for testing
- `@testing-library/react` - React component testing utilities
- `@testing-library/jest-dom` - Custom matchers for DOM assertions
- `@testing-library/user-event` - User interaction simulation
- `@playwright/test` - E2E testing framework

### Testing Best Practices for This Project

1. **Co-location:** Place tests next to the files they test
2. **Naming:** `*.test.ts` or `*.test.tsx` for unit tests, `*.spec.ts` for E2E tests
3. **Coverage:** Focus on critical paths first (config, core logic)
4. **Speed:** Unit tests should be fast (<10ms each), E2E tests slower but thorough
5. **Isolation:** Each test should be independent
6. **Descriptive names:** Use clear describe/it blocks that read like documentation

### Previous Story Intelligence

**From Story 1.4 (Code Quality Tools):**
- Biome is configured for linting with strict rules
- All new test files should follow Biome formatting (single quotes, semicolons, 2-space indent)
- TypeScript strict mode is enabled - all tests must be properly typed
- Import organization is automatic via Biome

**From Story 1.2 (Backend Setup):**
- Backend uses `@fastify/env` for environment validation
- App factory pattern (`app.ts`) exports buildApp function
- Server entry point is `server.ts`
- These are good candidates for initial unit tests

**From Story 1.3 (Frontend Setup):**
- Frontend uses Vite + React
- App component is the root component  
- Vite config already exists and should be extended for Vitest
- No complex state management yet - simple component render tests sufficient

**From Story 1.1 (Monorepo Setup):**
- pnpm workspaces enable `--recursive` and `--filter` commands
- Root package.json scripts should orchestrate workspace commands
- Pattern: `"test": "pnpm --recursive test"` runs all package tests

### Project Structure Notes

Following established patterns from stories 1.1-1.4:
- Package-level configuration files (`vitest.config.ts`) in each package root
- Package-level scripts in each `package.json`
- Root-level orchestration scripts that delegate to packages
- All test files follow TypeScript strict mode and Biome formatting

### Integration Points

**Vitest + Vite Integration:**
- Frontend vitest config should extend existing vite.config.ts using `mergeConfig`
- This ensures Vite plugins (React, Tailwind) work in tests
- Aliases and path resolution carry over automatically

**Playwright + Dev Servers:**
- Playwright webServer config should start both backend and frontend
- Backend server runs on port 3000
- Frontend dev server runs on port 5173 with proxy to backend
- Tests can make API calls through frontend proxy or directly to backend

**TypeScript Integration:**
- All test files use TypeScript with strict mode
- Vitest provides built-in TypeScript support
- Playwright has @playwright/test with TypeScript support
- No additional type configuration needed beyond existing tsconfig files

### Expected Test Output

**Unit/Integration Tests (`pnpm test`):**
```
 RUN  v2.x.x /path/to/packages/backend
 ✓ src/config.test.ts (1)
   ✓ Config validation (1)
     ✓ should load environment configuration

 RUN  v2.x.x /path/to/packages/frontend  
 ✓ src/App.test.tsx (1)
   ✓ App (1)
     ✓ renders without crashing

 Test Files  2 passed (2)
      Tests  2 passed (2)
```

**E2E Tests (`pnpm --filter frontend test:e2e`):**
```
Running 1 test using 1 worker

  ✓  1 smoke.spec.ts:3:1 › app loads successfully (250ms)

  1 passed (2s)
```

### Common Pitfalls to Avoid

1. **Don't** install testing libraries at root - they belong in package-level devDependencies
2. **Don't** create separate test directories - co-locate tests with source files
3. **Don't** skip the Vitest UI - it's helpful for debugging
4. **Don't** forget to configure jsdom for frontend tests - React needs a DOM
5. **Don't** run E2E tests without ensuring both servers start cleanly
6. **Don't** use different test runners - Vitest for unit/integration, Playwright for E2E only
7. **Don't** skip TypeScript types in test files - strict mode applies to tests too

### Validation Checklist

**Before marking story complete, verify:**
- [ ] `pnpm test` runs successfully from root directory
- [ ] Both backend and frontend tests execute
- [ ] All sample tests pass
- [ ] `pnpm --filter frontend test:e2e` runs E2E tests
- [ ] Playwright starts both servers automatically
- [ ] E2E smoke test passes
- [ ] All test files pass Biome linting
- [ ] All test files pass TypeScript strict checks
- [ ] Test output is clear and readable
- [ ] No console errors or warnings during test runs

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 1.5]
- [Source: _bmad-output/planning-artifacts/architecture.md#Testing Strategy]
- [Source: _bmad-output/planning-artifacts/architecture.md#Project Structure]
- [Source: _bmad-output/implementation-artifacts/1-1-initialize-monorepo-with-pnpm-workspaces.md] - Workspace patterns
- [Source: _bmad-output/implementation-artifacts/1-2-setup-backend-with-fastify-and-typescript.md] - Backend structure
- [Source: _bmad-output/implementation-artifacts/1-3-setup-frontend-with-vite-and-react.md] - Frontend structure  
- [Source: _bmad-output/implementation-artifacts/1-4-configure-code-quality-tools-biome-typescript-strict.md] - Code quality standards
- [Vitest Documentation: https://vitest.dev/]
- [Testing Library Documentation: https://testing-library.com/]
- [Playwright Documentation: https://playwright.dev/]

## Dev Agent Record

### Agent Model Used

_To be filled by dev agent_

### Debug Log References

_To be filled by dev agent if needed_

### Completion Notes List

_To be filled by dev agent_

### File List

_To be filled by dev agent_

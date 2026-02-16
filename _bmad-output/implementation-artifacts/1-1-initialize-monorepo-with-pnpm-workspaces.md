# Story 1.1: Initialize Monorepo with pnpm Workspaces

Status: done

## Story

As a developer,
I want a functioning monorepo with pnpm workspaces configured for frontend and backend packages,
So that I can manage dependencies efficiently and establish the foundation for the entire project.

## Acceptance Criteria

**Given** a clean project directory
**When** I run the initialization commands
**Then** the project has a root `package.json` with workspace configuration
**And** a `pnpm-workspace.yaml` file defines `packages: ['packages/*']`
**And** `packages/frontend/` and `packages/backend/` directories exist with their own `package.json` files
**And** a root `.gitignore` excludes `node_modules`, `dist`, `.env`, and `data/`
**And** an `.env.example` file documents required environment variables
**And** `tsconfig.base.json` at the root provides shared TypeScript configuration with strict mode enabled

**Given** the monorepo structure is initialized
**When** I run `pnpm install` from the root
**Then** all dependencies install successfully
**And** pnpm creates a single `node_modules` at the root with package-specific hoisting

## Tasks / Subtasks

- [x] Initialize root monorepo structure (AC: all)
  - [x] Create root `package.json` with workspace configuration and scripts
  - [x] Create `pnpm-workspace.yaml` with `packages: ['packages/*']`
  - [x] Create `.gitignore` with proper exclusions
  - [x] Create `.env.example` documenting all required environment variables
  - [x] Create shared `tsconfig.base.json` with strict mode enabled
  
- [x] Create frontend package structure (AC: all)
  - [x] Create `packages/frontend/` directory
  - [x] Initialize `packages/frontend/package.json` with name and basic fields
  - [x] Create placeholder `packages/frontend/src/` directory
  
- [x] Create backend package structure (AC: all)
  - [x] Create `packages/backend/` directory
  - [x] Initialize `packages/backend/package.json` with name and basic fields
  - [x] Create placeholder `packages/backend/src/` directory
  
- [x] Verify pnpm workspace functionality (AC: all)
  - [x] Run `pnpm install` from root and verify successful installation
  - [x] Verify single `node_modules` at root with proper hoisting
  - [x] Test workspace commands work: `pnpm --filter frontend <command>`, `pnpm --filter backend <command>`

## Dev Notes

### Critical Architecture Requirements

**⚠️ STARTER TEMPLATE DECISION:**
- **DO NOT** use `create-t3-app`, Turborepo starters, or Nx workspace
- **MANUAL SCAFFOLD ONLY** — pnpm workspaces with Vite + Fastify
- Rationale: No existing starter matches our exact stack (Fastify + React SPA + SQLite + monorepo)
- Reference: [Architecture.md#Starter Template Evaluation](../../planning-artifacts/architecture.md#starter-template-evaluation)

**TypeScript Configuration:**
- `tsconfig.base.json` MUST have strict mode enabled:
  - `"strict": true`
  - `"noUncheckedIndexedAccess": true`
  - `"noImplicitOverride": true`
- Individual package `tsconfig.json` files will extend this base
- Reference: [Architecture.md#Implementation Patterns](../../planning-artifacts/architecture.md#implementation-patterns--consistency-rules)

**Package Manager:**
- Use **pnpm** (not npm or yarn)
- Workspace configuration via `pnpm-workspace.yaml`
- Single `node_modules` at root with package-specific hoisting
- Reference: [Architecture.md#Starter Options](../../planning-artifacts/architecture.md#starter-options-considered)

**File Structure to Create:**
```
todo-bmad/
├── .gitignore
├── .env.example
├── package.json              # Root workspace package
├── pnpm-workspace.yaml       # packages: ['packages/*']
├── tsconfig.base.json        # Shared TS config with strict mode
├── packages/
│   ├── frontend/
│   │   ├── package.json
│   │   └── src/              # Placeholder for now
│   └── backend/
│       ├── package.json
│       └── src/              # Placeholder for now
└── data/                     # For SQLite volume mount (create with .gitkeep)
```

### Environment Variables to Document

Create `.env.example` with these variables (values will be used in later stories):

```bash
# Backend Configuration
PORT=3000
HOST=0.0.0.0
NODE_ENV=development
DB_PATH=./data/todos.db
CORS_ORIGIN=http://localhost:5173

# Frontend Configuration (if needed)
VITE_API_URL=http://localhost:3000
```

Reference: [Architecture.md#Env config](../../planning-artifacts/architecture.md#core-architectural-decisions)

### .gitignore Requirements

Must exclude (minimum):
- `node_modules/`
- `dist/`
- `.env`
- `data/` (except `.gitkeep`)
- `*.log`
- `.DS_Store`
- `coverage/`

Reference: [Architecture.md#Project Structure](../../planning-artifacts/architecture.md#project-structure--boundaries)

### Root package.json Scripts

Include these scripts (more will be added in Story 1.7):
```json
{
  "scripts": {
    "dev": "echo 'Dev script will be configured in Story 1.7'",
    "build": "echo 'Build script will be configured in Story 1.7'",
    "lint": "echo 'Lint script will be configured in Story 1.4'",
    "format": "echo 'Format script will be configured in Story 1.4'",
    "test": "echo 'Test script will be configured in Story 1.5'"
  }
}
```

### Package Naming Convention

- Root package: `todo-bmad` (private: true)
- Frontend package: `@todo-bmad/frontend` (private: true)
- Backend package: `@todo-bmad/backend` (private: true)

Reference: [Architecture.md#Naming Patterns](../../planning-artifacts/architecture.md#naming-patterns)

### Project Structure Notes

**Alignment with Architecture:**
- This story establishes the foundation structure defined in [Architecture.md#Complete Project Directory Structure](../../planning-artifacts/architecture.md#complete-project-directory-structure)
- Subsequent stories (1.2-1.7) will populate the `src/` directories
- The monorepo boundary is set here — all future development happens within `packages/`

**No Conflicts Detected:**
- Clean greenfield project
- No existing code to migrate
- No legacy patterns to maintain

### Testing Requirements

**For this story:**
- Verify `pnpm install` completes without errors
- Verify workspace commands work: `pnpm --filter frontend --version`, `pnpm --filter backend --version`
- Verify TypeScript compiler recognizes `tsconfig.base.json`
- Verify `.gitignore` excludes the correct files

**No automated tests needed** — this story is infrastructure setup only.

Reference: [Architecture.md#Testing Strategy](../../planning-artifacts/architecture.md#architecture-validation-results)

### References

- **Primary Source:** [Epic 1, Story 1.1 in epics.md](../../planning-artifacts/epics.md#story-11-initialize-monorepo-with-pnpm-workspaces)
- **Architecture Decisions:** [Architecture.md#Starter Template Evaluation](../../planning-artifacts/architecture.md#starter-template-evaluation)
- **Structure Reference:** [Architecture.md#Complete Project Directory Structure](../../planning-artifacts/architecture.md#complete-project-directory-structure)
- **Naming Conventions:** [Architecture.md#Naming Patterns](../../planning-artifacts/architecture.md#naming-patterns)
- **TypeScript Config:** [Architecture.md#Implementation Patterns](../../planning-artifacts/architecture.md#implementation-patterns--consistency-rules)

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.5

### Debug Log References

N/A - Infrastructure setup only, no debugging required

### Completion Notes List

**Implementation Summary:**
- Created complete monorepo structure with pnpm workspaces (v10.0.0)
- Configured root package.json with workspace references and placeholder scripts
- Set up pnpm-workspace.yaml targeting `packages/*` pattern
- Created frontend and backend package directories with scoped naming (@todo-bmad/*)
- Established TypeScript base configuration with strict mode enabled (strict, noUncheckedIndexedAccess, noImplicitOverride)
- Configured .gitignore to exclude node_modules, dist, .env, data/, and other build artifacts
- Documented environment variables in .env.example for both frontend and backend
- Created data/ directory with .gitkeep for SQLite database volume

**Verification Results:**
- ✅ pnpm install completed successfully (detected all 3 workspace projects)
- ✅ Single node_modules created at root with proper hoisting
- ✅ Workspace filter commands working: `pnpm --filter @todo-bmad/frontend` and `pnpm --filter @todo-bmad/backend`
- ✅ All acceptance criteria satisfied

**Version Configuration (Updated per user request):**
- Node.js: >=24.0.0 (current environment: v22.21.1 - will need upgrade for production)
- pnpm: >=10.0.0 (current: 10.0.0 ✅)

**Notes:**
- No automated tests created - infrastructure setup story
- Foundation ready for subsequent stories (1.2-1.7) to populate package implementations
- All package.json scripts are placeholders pointing to future story implementations

### File List

**Created:**
- package.json
- pnpm-workspace.yaml
- pnpm-lock.yaml
- .gitignore
- .env.example
- tsconfig.base.json
- packages/frontend/package.json
- packages/frontend/src/ (directory)
- packages/backend/package.json
- packages/backend/src/ (directory)
- data/.gitkeep

**Modified:**
- _bmad-output/implementation-artifacts/sprint-status.yaml (story status updated)

# Story 1.1: Initialize Monorepo with pnpm Workspaces

Status: ready-for-dev

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

- [ ] Initialize root monorepo structure (AC: all)
  - [ ] Create root `package.json` with workspace configuration and scripts
  - [ ] Create `pnpm-workspace.yaml` with `packages: ['packages/*']`
  - [ ] Create `.gitignore` with proper exclusions
  - [ ] Create `.env.example` documenting all required environment variables
  - [ ] Create shared `tsconfig.base.json` with strict mode enabled
  
- [ ] Create frontend package structure (AC: all)
  - [ ] Create `packages/frontend/` directory
  - [ ] Initialize `packages/frontend/package.json` with name and basic fields
  - [ ] Create placeholder `packages/frontend/src/` directory
  
- [ ] Create backend package structure (AC: all)
  - [ ] Create `packages/backend/` directory
  - [ ] Initialize `packages/backend/package.json` with name and basic fields
  - [ ] Create placeholder `packages/backend/src/` directory
  
- [ ] Verify pnpm workspace functionality (AC: all)
  - [ ] Run `pnpm install` from root and verify successful installation
  - [ ] Verify single `node_modules` at root with proper hoisting
  - [ ] Test workspace commands work: `pnpm --filter frontend <command>`, `pnpm --filter backend <command>`

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

_To be filled by Dev Agent_

### Debug Log References

_To be filled by Dev Agent_

### Completion Notes List

_To be filled by Dev Agent_

### File List

_To be filled by Dev Agent_

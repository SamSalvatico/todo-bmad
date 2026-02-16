---
stepsCompleted: ['step-01-validate-prerequisites', 'step-02-design-epics', 'step-03-create-stories', 'step-04-final-validation']
inputDocuments: 
  - '/Users/samuelesalvatico/Nearform/TestRepositories/todo-bmad/_bmad-output/planning-artifacts/prd.md'
  - '/Users/samuelesalvatico/Nearform/TestRepositories/todo-bmad/_bmad-output/planning-artifacts/architecture.md'
  - '/Users/samuelesalvatico/Nearform/TestRepositories/todo-bmad/_bmad-output/planning-artifacts/prd-validation-report.md'
---

# todo-bmad - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for todo-bmad, decomposing the requirements from the PRD, UX Design if it exists, and Architecture requirements into implementable stories.

## Requirements Inventory

### Functional Requirements

**Task Management:**
- **FR1:** User can create a new todo by entering a text description
- **FR2:** User can view a list of all existing todos
- **FR3:** User can mark an active todo as complete
- **FR4:** User can mark a completed todo as active (uncomplete)
- **FR5:** User can delete a todo permanently
- **FR6:** User can distinguish between active and completed todos visually

**Data Persistence:**
- **FR7:** System persists all todos across browser sessions
- **FR8:** System persists all todos across page refreshes
- **FR9:** System maintains todo state (active/completed) accurately after any interruption
- **FR10:** Each todo stores a text description, completion status, and creation timestamp

**User Interface States:**
- **FR11:** User can see a clear empty state when no todos exist
- **FR12:** User can see a loading indicator while data is being fetched
- **FR13:** User can see a meaningful error message when an operation fails
- **FR14:** User can see a meaningful error state when the server is unreachable
- **FR15:** User's input text is preserved if a create operation fails

**Responsive Experience:**
- **FR16:** User can perform all task operations on a desktop browser
- **FR17:** User can perform all task operations on a mobile browser
- **FR18:** User can interact with all controls via touch on mobile devices
- **FR19:** User can navigate and operate all features using only a keyboard

**API:**
- **FR20:** System exposes an endpoint to create a todo
- **FR21:** System exposes an endpoint to retrieve all todos
- **FR22:** System exposes an endpoint to update a todo's completion status
- **FR23:** System exposes an endpoint to delete a todo
- **FR24:** All API endpoints accept and return JSON

### NonFunctional Requirements

**Performance:**
- **NFR1:** API endpoints respond within 150ms for all CRUD operations under normal conditions
- **NFR2:** UI updates render within 100ms of user interaction
- **NFR3:** First Contentful Paint under 1.5 seconds on modern broadband
- **NFR4:** Time to Interactive under 2 seconds on modern broadband
- **NFR5:** Lighthouse Performance score above 90
- **NFR6:** Frontend bundle size small enough to not impact load times

**Security:**
- **NFR7:** API validates and sanitizes all input to prevent injection attacks
- **NFR8:** API returns appropriate HTTP status codes without leaking implementation details
- **NFR9:** CORS configured to restrict API access to the frontend origin only

**Reliability:**
- **NFR10:** Zero data loss — all successfully created todos persist until explicitly deleted
- **NFR11:** Graceful recovery from temporary network interruptions without data corruption
- **NFR12:** Backend restarts do not affect persisted data
- **NFR13:** Concurrent browser tabs do not cause data inconsistency (last-write-wins acceptable)

**Accessibility:**
- **NFR14:** All interactive elements reachable and operable via keyboard (Tab, Enter, Space, Escape)
- **NFR15:** Visible focus indicators on all interactive elements
- **NFR16:** Semantic HTML for all structural and interactive elements
- **NFR17:** Color contrast ratios minimum 4.5:1 for text and status indicators
- **NFR18:** ARIA labels on controls that lack visible text labels

**Maintainability:**
- **NFR19:** Consistent, conventional code patterns understandable by a new developer within 1 hour
- **NFR20:** Local development environment setup and running within 5 minutes
- **NFR21:** Adding a new data field (e.g., priority) requires no architectural restructuring
- **NFR22:** README documents setup, architecture overview, and project structure

### Additional Requirements

**Starter Template and Project Initialization:**
- Project uses **pnpm workspaces + Vite + Fastify** (manual scaffold) as the starter template
- Monorepo structure with `packages/frontend` and `packages/backend`
- TypeScript throughout with strict mode enabled
- Initialize with pnpm workspace configuration

**Infrastructure and Development:**
- Docker multi-stage build with docker-compose for local deployment
- SQLite database with volume mount for data persistence (`./data:/app/data`)
- Development commands: `pnpm dev` runs frontend (Vite) + backend (tsx watch) concurrently
- Vite dev server proxies `/api` requests to Fastify backend in development

**Database and Data Access:**
- SQLite via `better-sqlite3` with single `todos` table
- Repository pattern for all database access - NO raw SQL in route handlers
- Database initialization: `CREATE TABLE IF NOT EXISTS` executed on app startup
- Field mapping: `snake_case` (DB) → `camelCase` (API/JSON) in repository layer only

**API Documentation and Validation:**
- `@fastify/swagger` + `@fastify/swagger-ui` for auto-generated API docs at `/docs`
- Fastify JSON Schema validation on all routes (automatic 400 responses)
- HTML sanitization on text fields to prevent XSS attacks

**Testing Strategy:**
- Vitest for unit and integration tests (co-located with source files)
- @testing-library/react for component tests
- Playwright for E2E tests running against full stack
- Test commands: `pnpm test` (unit/integration), `pnpm test:e2e` (E2E)

**Code Quality and Tooling:**
- Biome for linting and formatting (single tool, Rust-based)
- TypeScript strict mode across all packages
- ESM modules throughout

**Production Deployment:**
- Fastify serves built frontend static files via `@fastify/static`
- Single container, single port in production
- Pino logging (Fastify built-in) configured via environment variables
- Environment variable validation via `@fastify/env` with JSON Schema on startup

**Responsive Design Requirements:**
- Modern browsers only (latest 2 versions: Chrome, Firefox, Safari, Edge)
- No IE11 support, ES2020+ without polyfills
- Touch-friendly tap targets minimum 44x44px
- Tailwind CSS for styling with responsive utilities

**Error Handling Standards:**
- Fastify default error format: `{ statusCode, error, message }`
- Frontend `api.ts` wrapper returns `{ data, error }` pattern
- Never leak SQL errors or stack traces to client
- All async operations wrapped in try/catch

### FR Coverage Map

**Epic 1: Project Foundation & Development Infrastructure**
- Starter template (pnpm workspaces + Vite + Fastify manual scaffold)
- Monorepo setup, TypeScript configuration
- Testing infrastructure (Vitest, Playwright, @testing-library/react)
- Docker multi-stage build and docker-compose
- Code quality tooling (Biome)
- Development workflow (pnpm dev, build, test commands)
- Repository pattern and project structure
- NFR20: Local development environment setup < 5 minutes
- NFR22: README with setup, architecture, structure

**Epic 2: Core Todo Management System**
- FR1: User can create a new todo by entering text description
- FR2: User can view a list of all existing todos
- FR3: User can mark an active todo as complete
- FR4: User can mark a completed todo as active (uncomplete)
- FR5: User can delete a todo permanently
- FR6: User can distinguish between active and completed todos visually
- FR7: System persists all todos across browser sessions
- FR8: System persists all todos across page refreshes
- FR9: System maintains todo state accurately after any interruption
- FR10: Each todo stores text description, completion status, creation timestamp
- FR20: System exposes endpoint to create a todo
- FR21: System exposes endpoint to retrieve all todos
- FR22: System exposes endpoint to update todo's completion status
- FR23: System exposes endpoint to delete a todo
- FR24: All API endpoints accept and return JSON
- NFR1: API endpoints respond within 150ms
- NFR7: API validates and sanitizes all input
- NFR8: API returns appropriate HTTP status codes without leaking details
- NFR9: CORS configured to restrict API access to frontend origin only
- NFR10: Zero data loss — all created todos persist until explicitly deleted
- NFR12: Backend restarts do not affect persisted data

**Epic 3: UI Polish, States & Accessibility**
- FR11: User can see clear empty state when no todos exist
- FR12: User can see loading indicator while data is being fetched
- FR13: User can see meaningful error message when operation fails
- FR14: User can see meaningful error state when server is unreachable
- FR15: User's input text preserved if create operation fails
- FR16: User can perform all task operations on desktop browser
- FR17: User can perform all task operations on mobile browser
- FR18: User can interact with all controls via touch on mobile devices
- FR19: User can navigate and operate all features using only keyboard
- NFR2: UI updates render within 100ms of user interaction
- NFR3: First Contentful Paint under 1.5 seconds
- NFR4: Time to Interactive under 2 seconds
- NFR5: Lighthouse Performance score above 90
- NFR6: Frontend bundle size small enough to not impact load times
- NFR11: Graceful recovery from temporary network interruptions
- NFR13: Concurrent browser tabs do not cause data inconsistency
- NFR14: All interactive elements reachable and operable via keyboard
- NFR15: Visible focus indicators on all interactive elements
- NFR16: Semantic HTML for all structural and interactive elements
- NFR17: Color contrast ratios minimum 4.5:1
- NFR18: ARIA labels on controls that lack visible text labels
- NFR19: Consistent, conventional code patterns understandable within 1 hour
- NFR21: Adding new data field requires no architectural restructuring

## Epic List

### Epic 1: Project Foundation & Development Infrastructure
Establish a complete, production-ready development environment with monorepo structure, testing infrastructure, Docker deployment, and code quality tooling — enabling developers to run the full stack locally within 5 minutes and begin feature development with confidence.

**FRs covered:** Starter template requirements, NFR20, NFR22

**Technical scope:** pnpm workspaces monorepo, TypeScript strict mode, Vite + React frontend, Fastify backend, SQLite with better-sqlite3, Vitest + Playwright testing, Biome linting/formatting, Docker multi-stage build, docker-compose orchestration, repository pattern implementation, comprehensive README.

---

### Epic 2: Core Todo Management System
Users can create todos, view all todos, mark them complete/uncomplete, delete them, and trust their data persists across sessions — delivering the complete core workflow from first task creation to deletion with reliable backend storage and RESTful API.

**FRs covered:** FR1-FR10, FR20-FR24, NFR1, NFR7-NFR10, NFR12

**Technical scope:** Backend (Fastify routes, JSON Schema validation, todo-repository with SQLite, CRUD endpoints, CORS config, Swagger docs), Frontend (React components: TodoList, TodoItem, TodoInput, useTodos hook, api.ts wrapper, Tailwind styling), Data persistence (SQLite database initialization, CREATE TABLE IF NOT EXISTS, volume mount).

---

### Epic 3: UI Polish, States & Accessibility
Users experience a polished, responsive interface with clear feedback for every state (empty, loading, errors), full keyboard navigation, mobile support, and graceful error handling — transforming a functional app into a delightful, production-ready experience accessible to all users.

**FRs covered:** FR11-FR19, NFR2-NFR6, NFR11, NFR13-NFR19, NFR21

**Technical scope:** UI states (EmptyState, LoadingSpinner, ErrorMessage components), responsive design (Tailwind breakpoints, touch targets 44x44px), accessibility (semantic HTML, ARIA labels, focus indicators, keyboard navigation, 4.5:1 contrast), error handling (network failures, server down states, input preservation), performance optimization (bundle size, FCP/TTI targets, Lighthouse score), E2E testing (Playwright scenarios for all states).

---

## Epic 1: Project Foundation & Development Infrastructure

Establish a complete, production-ready development environment with monorepo structure, testing infrastructure, Docker deployment, and code quality tooling — enabling developers to run the full stack locally within 5 minutes and begin feature development with confidence.

### Story 1.1: Initialize Monorepo with pnpm Workspaces

As a developer,
I want a functioning monorepo with pnpm workspaces configured for frontend and backend packages,
So that I can manage dependencies efficiently and establish the foundation for the entire project.

**Acceptance Criteria:**

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

### Story 1.2: Setup Backend with Fastify and TypeScript

As a developer,
I want a Fastify backend configured with TypeScript, environment validation, and database initialization,
So that I have a solid API foundation ready for implementing routes.

**Acceptance Criteria:**

**Given** the monorepo from Story 1.1
**When** I setup the backend package
**Then** `packages/backend/package.json` includes dependencies: `fastify`, `@fastify/cors`, `@fastify/env`, `@fastify/static`, `@fastify/swagger`, `@fastify/swagger-ui`, `better-sqlite3`, `pino`
**And** dev dependencies include: `tsx`, `typescript`, `@types/node`, `@types/better-sqlite3`
**And** `packages/backend/tsconfig.json` extends `../../tsconfig.base.json`

**Given** the backend dependencies are installed
**When** I create the backend source structure
**Then** `packages/backend/src/config.ts` uses `@fastify/env` with JSON Schema for `PORT`, `HOST`, `NODE_ENV`, `DB_PATH`, `CORS_ORIGIN`
**And** `packages/backend/src/db/database.ts` initializes better-sqlite3 connection
**And** `packages/backend/src/db/init.sql` contains `CREATE TABLE IF NOT EXISTS todos` with columns: `id INTEGER PRIMARY KEY AUTOINCREMENT`, `text TEXT NOT NULL`, `completed INTEGER DEFAULT 0`, `created_at TEXT DEFAULT CURRENT_TIMESTAMP`
**And** `packages/backend/src/app.ts` exports a Fastify app factory that registers plugins (cors, env, swagger)
**And** `packages/backend/src/server.ts` is the entry point that calls `app.listen()`

**Given** the backend structure is complete
**When** I run `pnpm --filter backend dev` (using `tsx watch src/server.ts`)
**Then** the server starts on the configured port
**And** the SQLite database is initialized from `init.sql`
**And** Swagger UI is accessible at `http://localhost:3000/docs`
**And** Pino logs startup messages to the console

### Story 1.3: Setup Frontend with Vite and React

As a developer,
I want a Vite-powered React frontend with Tailwind CSS and TypeScript,
So that I can build a fast, modern UI with hot module replacement.

**Acceptance Criteria:**

**Given** the monorepo from Story 1.1
**When** I setup the frontend package
**Then** `packages/frontend/` is initialized with `pnpm create vite . -- --template react-ts`
**And** `packages/frontend/package.json` includes dependencies: `react`, `react-dom`
**And** dev dependencies include: `vite`, `@vitejs/plugin-react`, `typescript`, `tailwindcss`, `@tailwindcss/vite`
**And** `packages/frontend/tsconfig.json` extends `../../tsconfig.base.json`

**Given** Tailwind CSS is configured
**When** I create the Tailwind setup
**Then** `packages/frontend/src/index.css` contains Tailwind directives: `@import "tailwindcss"`
**And** `packages/frontend/vite.config.ts` includes `@tailwindcss/vite` plugin
**And** `vite.config.ts` configures proxy: `'/api': { target: 'http://localhost:3000', changeOrigin: true }`

**Given** the frontend structure is complete
**When** I run `pnpm --filter frontend dev`
**Then** Vite dev server starts on port 5173
**And** Hot Module Replacement (HMR) works for React components
**And** Tailwind utilities are applied correctly
**And** API requests to `/api/*` are proxied to the backend at `http://localhost:3000`

**Given** a basic React app renders
**When** I visit `http://localhost:5173`
**Then** the default Vite + React page loads successfully
**And** the browser console shows no errors

### Story 1.4: Configure Code Quality Tools (Biome, TypeScript strict)

As a developer,
I want automated linting and formatting with Biome across the monorepo,
So that code quality is consistent and enforced automatically.

**Acceptance Criteria:**

**Given** the monorepo with frontend and backend packages
**When** I install and configure Biome
**Then** `biome.json` at the root configures linting and formatting rules for TypeScript and JavaScript
**And** Biome configuration includes: `"organizeImports": { "enabled": true }`, semicolons required, single quotes, 2-space indentation
**And** root `package.json` includes scripts: `"lint": "biome check ."`, `"format": "biome format --write ."`

**Given** Biome is configured
**When** I run `pnpm lint` from the root
**Then** Biome checks all TypeScript files in both packages
**And** it reports any linting errors or warnings
**And** it verifies imports are organized

**Given** code with formatting issues exists
**When** I run `pnpm format`
**Then** Biome formats all files according to the configuration
**And** files are updated with consistent style

**Given** TypeScript strict mode is enabled
**When** I compile both packages
**Then** `tsconfig.base.json` has `"strict": true`, `"noUncheckedIndexedAccess": true`, `"noImplicitOverride": true`
**And** TypeScript compilation catches type errors
**And** no `any` types are allowed without explicit annotation

### Story 1.5: Setup Testing Infrastructure (Vitest, Playwright)

As a developer,
I want unit/integration testing with Vitest and E2E testing with Playwright,
So that I can ensure code quality and catch regressions early.

**Acceptance Criteria:**

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

### Story 1.6: Configure Docker for Local Deployment

As a developer,
I want Docker configuration for local deployment with data persistence,
So that I can run the production build locally and test the full deployment.

**Acceptance Criteria:**

**Given** the monorepo with built frontend and backend
**When** I create the Dockerfile
**Then** a multi-stage `Dockerfile` exists at the root
**And** Stage 1 (build): uses Node image, runs `pnpm install`, builds both packages with `pnpm build`
**And** Stage 2 (production): uses minimal Node image, copies built artifacts, sets `NODE_ENV=production`
**And** production stage copies `packages/backend/dist/` and `packages/frontend/dist/` to the image
**And** the CMD runs `node packages/backend/dist/server.js`

**Given** the Dockerfile is created
**When** I create `docker-compose.yaml`
**Then** it defines a single service `app` that builds from the Dockerfile
**And** exposes port 3000
**And** mounts a volume `./data:/app/data` for SQLite persistence
**And** sets environment variables from `.env` file

**Given** Docker configuration is complete
**When** I add build scripts to root `package.json`
**Then** `"build": "pnpm --filter backend build && pnpm --filter frontend build"` exists
**And** backend build script: `"build": "tsc"`
**And** frontend build script: `"build": "vite build"`

**Given** build scripts are configured and source is built
**When** I run `docker compose build`
**Then** Docker builds the multi-stage image successfully
**And** the final image size is optimized (minimal Node base)

**Given** the Docker image is built
**When** I run `docker compose up`
**Then** the container starts and the backend server listens on port 3000
**And** Fastify serves the frontend static files from `packages/frontend/dist/`
**And** the SQLite database file is created in `./data/` directory
**And** I can access the app at `http://localhost:3000`

**Given** the app is running in Docker
**When** I stop and restart the container
**Then** data persists across restarts (SQLite file in volume mount)

### Story 1.7: Create Comprehensive README and Development Scripts

As a developer,
I want clear documentation and convenient development scripts,
So that I can get started in under 5 minutes and understand the project structure.

**Acceptance Criteria:**

**Given** the complete project structure
**When** I create the root `README.md`
**Then** it includes sections: Project Overview, Tech Stack, Prerequisites, Quick Start, Development, Architecture, Project Structure, Scripts Reference, Docker Deployment
**And** Quick Start shows: clone repo, `cp .env.example .env`, `pnpm install`, `pnpm dev`, visit `http://localhost:5173`
**And** Architecture section explains: monorepo structure, frontend (Vite + React), backend (Fastify + SQLite), testing strategy, Docker deployment
**And** Project Structure shows the directory tree with file descriptions
**And** Scripts Reference documents all pnpm commands with explanations

**Given** the README exists
**When** I add development scripts to root `package.json`
**Then** `"dev": "concurrently \"pnpm --filter backend dev\" \"pnpm --filter frontend dev\""` exists
**And** root package.json includes `concurrently` as a dev dependency
**And** `"test": "pnpm --recursive test"` runs all tests
**And** `"test:e2e": "pnpm --filter frontend test:e2e"` runs Playwright tests
**And** `"lint": "biome check ."` runs linting
**And** `"format": "biome format --write ."` formats code
**And** `"build": "pnpm --filter backend build && pnpm --filter frontend build"` builds both packages

**Given** all scripts are configured
**When** a new developer follows the Quick Start
**Then** they can run `pnpm install` and `pnpm dev` successfully
**And** both frontend (port 5173) and backend (port 3000) start
**And** the total setup time is under 5 minutes

**Given** the README documents architecture
**When** a new developer reads it
**Then** they understand: why pnpm workspaces, how frontend and backend communicate, repository pattern for data access, naming conventions (snake_case DB, camelCase API), test strategy (Vitest + Playwright)
**And** they can locate key files: `app.ts`, `server.ts`, `database.ts`, `App.tsx`, `vite.config.ts`

---

## Epic 2: Core Todo Management System

Users can create todos, view all todos, mark them complete/uncomplete, delete them, and trust their data persists across sessions — delivering the complete core workflow from first task creation to deletion with reliable backend storage and RESTful API.

### Story 2.1: Implement Todo Repository and Database Schema

As a developer,
I want a repository layer that handles all database operations for todos with proper error handling,
So that I have a clean data access boundary and the todos table is created when needed.

**Acceptance Criteria:**

**Given** the backend structure from Epic 1
**When** I create the todo repository
**Then** `packages/backend/src/repositories/todo-repository.ts` exports a `TodoRepository` class
**And** the repository initializes the database from `db/init.sql` on instantiation
**And** the `todos` table is created if it doesn't exist: `id`, `text`, `completed`, `created_at`

**Given** the repository is initialized
**When** I implement CRUD methods
**Then** `create(text: string): Todo` inserts a new todo and returns it with `camelCase` fields
**And** `getAll(): Todo[]` retrieves all todos ordered by `created_at DESC`
**And** `update(id: number, completed: boolean): Todo | null` updates completion status and returns the updated todo
**And** `delete(id: number): boolean` deletes a todo and returns true if successful
**And** all methods map `snake_case` DB columns to `camelCase` TypeScript objects

**Given** the repository methods exist
**When** I create `packages/backend/src/repositories/todo-repository.test.ts`
**Then** tests verify: create inserts and returns todo, getAll retrieves all todos, update changes completion status, delete removes todo
**And** tests use an in-memory SQLite database (`:memory:`)
**And** each test is isolated (fresh database per test)

**Given** the Todo type is needed
**When** I create type definitions
**Then** `packages/backend/src/types/todo.ts` exports `Todo` interface with: `id: number`, `text: string`, `completed: boolean`, `createdAt: string`
**And** exports `CreateTodoRequest` interface with: `text: string`
**And** exports `UpdateTodoRequest` interface with: `completed: boolean`

**Given** repository tests are written
**When** I run `pnpm --filter backend test`
**Then** all repository tests pass
**And** SQL queries execute correctly
**And** field mapping works (snake_case to camelCase)

### Story 2.2: Create Todo CRUD API Endpoints with Validation

As a developer,
I want RESTful API endpoints with JSON Schema validation and Swagger documentation,
So that the frontend can perform all todo operations with proper error handling.

**Acceptance Criteria:**

**Given** the todo repository from Story 2.1
**When** I create JSON Schema definitions
**Then** `packages/backend/src/schemas/todo-schemas.ts` exports schemas for: `createTodoSchema`, `updateTodoSchema`, `todoParamsSchema`
**And** `createTodoSchema` validates: `{ body: { type: 'object', properties: { text: { type: 'string', minLength: 1, maxLength: 500 } }, required: ['text'] } }`
**And** `updateTodoSchema` validates: `{ body: { type: 'object', properties: { completed: { type: 'boolean' } }, required: ['completed'] } }`
**And** `todoParamsSchema` validates: `{ params: { type: 'object', properties: { id: { type: 'number' } }, required: ['id'] } }`

**Given** schemas are defined
**When** I create the todo routes file
**Then** `packages/backend/src/routes/todo-routes.ts` exports a Fastify plugin that registers routes
**And** `GET /api/todos` calls `todoRepository.getAll()` and returns JSON array (200)
**And** `POST /api/todos` validates with `createTodoSchema`, calls `todoRepository.create()`, returns created todo (201)
**And** `PATCH /api/todos/:id` validates with `updateTodoSchema` and `todoParamsSchema`, calls `todoRepository.update()`, returns updated todo (200) or 404
**And** `DELETE /api/todos/:id` validates with `todoParamsSchema`, calls `todoRepository.delete()`, returns 204 on success or 404

**Given** routes are implemented
**When** I register the routes in `app.ts`
**Then** `packages/backend/src/app.ts` imports and registers `todo-routes` plugin
**And** the TodoRepository instance is passed to the routes
**And** Swagger documentation includes all todo endpoints with request/response schemas

**Given** the API is running
**When** I create `packages/backend/src/routes/todo-routes.test.ts`
**Then** integration tests verify: GET returns empty array initially, POST creates todo, GET returns created todo, PATCH updates completion, DELETE removes todo
**And** tests verify validation: POST without text returns 400, PATCH with invalid id returns 404, POST with text > 500 chars returns 400
**And** tests verify sanitization: HTML in text field is stripped/escaped

**Given** route tests are written
**When** I run `pnpm --filter backend test`
**Then** all route tests pass
**And** Fastify validation automatically returns 400 for invalid requests
**And** error responses follow format: `{ statusCode, error, message }`

**Given** the backend is running with `pnpm dev`
**When** I visit `http://localhost:3000/docs`
**Then** Swagger UI displays all todo endpoints
**And** I can test endpoints directly from Swagger UI
**And** request/response schemas are documented

### Story 2.3: Build Frontend API Wrapper and Type Definitions

As a developer,
I want a typed API wrapper that handles all HTTP requests with consistent error handling,
So that components never call fetch directly and errors are handled uniformly.

**Acceptance Criteria:**

**Given** the backend API from Story 2.2
**When** I create frontend type definitions
**Then** `packages/frontend/src/types/todo.ts` exports `Todo` interface matching backend: `id: number`, `text: string`, `completed: boolean`, `createdAt: string`
**And** exports `CreateTodoRequest` interface: `text: string`
**And** exports `ApiResult<T>` type: `{ data: T | null, error: string | null }`

**Given** types are defined
**When** I create the API wrapper
**Then** `packages/frontend/src/api.ts` exports functions: `getTodos()`, `createTodo(text)`, `updateTodo(id, completed)`, `deleteTodo(id)`
**And** all functions return `Promise<ApiResult<T>>`
**And** all functions use native `fetch` with proper error handling
**And** successful responses return `{ data: <result>, error: null }`
**And** failed responses return `{ data: null, error: <message> }`

**Given** the API wrapper is implemented
**When** I handle different error scenarios
**Then** network errors (fetch throws) return `{ data: null, error: 'Network error. Please try again.' }`
**And** HTTP 4xx/5xx errors return `{ data: null, error: response.statusText }` or parsed error message
**And** JSON parse errors are caught and return appropriate error messages

**Given** the API wrapper exists
**When** I create `packages/frontend/src/api.test.ts`
**Then** tests mock fetch responses and verify: successful getTodos returns todos array, failed request returns error object, network error is handled gracefully
**And** tests verify all endpoints: GET, POST, PATCH, DELETE
**And** tests verify error extraction from response bodies

**Given** tests are written
**When** I run `pnpm --filter frontend test`
**Then** all API wrapper tests pass
**And** the ApiResult pattern is validated

### Story 2.4: Create Core Todo UI Components

As a developer,
I want reusable React components for displaying and interacting with todos,
So that the UI can render todo items with proper styling and event handlers.

**Acceptance Criteria:**

**Given** the frontend structure from Epic 1
**When** I create the TodoInput component
**Then** `packages/frontend/src/components/TodoInput.tsx` exports a controlled input component
**And** accepts props: `value: string`, `onChange: (value: string) => void`, `onSubmit: () => void`, `disabled: boolean`
**And** renders an input with placeholder "What needs to be done?"
**And** calls `onSubmit` on Enter key press
**And** calls `onSubmit` when submit button is clicked
**And** is styled with Tailwind (border, padding, focus ring, disabled state)

**Given** the TodoInput component exists
**When** I create `packages/frontend/src/components/TodoInput.test.tsx`
**Then** tests verify: input renders, onChange is called on typing, onSubmit is called on Enter, submit button works, disabled state prevents submission

**Given** the TodoItem component is needed
**When** I create `packages/frontend/src/components/TodoItem.tsx`
**Then** exports a component that accepts: `todo: Todo`, `onToggle: (id: number) => void`, `onDelete: (id: number) => void`
**And** renders todo text with checkbox for completion toggle
**And** applies line-through style when `todo.completed` is true
**And** renders a delete button with appropriate ARIA label
**And** uses Tailwind for styling (distinct active vs completed states)

**Given** the TodoItem component exists
**When** I create `packages/frontend/src/components/TodoItem.test.tsx`
**Then** tests verify: todo renders with text, checkbox toggles completion, delete button calls onDelete, completed todos have line-through style

**Given** the TodoList component is needed
**When** I create `packages/frontend/src/components/TodoList.tsx`
**Then** exports a component that accepts: `todos: Todo[]`, `onToggle`, `onDelete`
**And** maps over todos array and renders TodoItem for each
**And** applies semantic HTML (unordered list or appropriate container)
**And** uses Tailwind for layout (spacing, borders)

**Given** the TodoList component exists
**When** I create `packages/frontend/src/components/TodoList.test.tsx`
**Then** tests verify: empty array renders nothing, todos array renders multiple TodoItems, props are passed correctly to TodoItem

**Given** all component tests are written
**When** I run `pnpm --filter frontend test`
**Then** all component tests pass
**And** components render correctly with proper props

### Story 2.5: Implement Todo State Management with useTodos Hook

As a developer,
I want a custom React hook that manages todo state and API interactions,
So that components get todos, loading state, error state, and CRUD operations in one place.

**Acceptance Criteria:**

**Given** the API wrapper from Story 2.3
**When** I create the useTodos hook
**Then** `packages/frontend/src/hooks/use-todos.ts` exports `useTodos()` hook
**And** returns object: `{ todos: Todo[], loading: boolean, error: string | null, createTodo, updateTodo, deleteTodo, refetch }`
**And** uses `useState` for todos, loading, and error
**And** uses `useEffect` to fetch todos on mount

**Given** the hook structure is defined
**When** I implement the fetch logic
**Then** `useEffect` calls `api.getTodos()` on component mount
**And** sets `loading: true` before fetch
**And** sets `todos` and `loading: false` on success
**And** sets `error` and `loading: false` on failure
**And** dependency array is empty (run once on mount)

**Given** fetch works
**When** I implement `createTodo` function
**Then** `createTodo(text: string)` calls `api.createTodo(text)`
**And** on success, appends new todo to `todos` array (optimistic update not required - wait for response)
**And** on failure, sets error state
**And** returns the ApiResult

**Given** create works
**When** I implement `updateTodo` and `deleteTodo`
**Then** `updateTodo(id, completed)` calls `api.updateTodo(id, completed)` and updates the todo in state
**And** `deleteTodo(id)` calls `api.deleteTodo(id)` and removes todo from state
**And** both handle errors by setting error state

**Given** the hook is implemented
**When** I create `packages/frontend/src/hooks/use-todos.test.ts`
**Then** tests mock the API module and verify: initial fetch loads todos, createTodo adds to list, updateTodo modifies completion, deleteTodo removes from list
**And** tests verify loading states: true during fetch, false after completion
**And** tests verify error handling: error is set on API failure

**Given** tests are written
**When** I run `pnpm --filter frontend test`
**Then** all useTodos hook tests pass
**And** state management logic is validated

### Story 2.6: Integrate Complete Todo Workflow (Create, View, Complete, Delete)

As a user,
I want to create todos, see them in a list, mark them complete/uncomplete, and delete them,
So that I can manage my tasks with full CRUD functionality and data persistence.

**Acceptance Criteria:**

**Given** all components and hooks from previous stories
**When** I update `packages/frontend/src/App.tsx`
**Then** App component uses `useTodos()` hook
**And** renders `<TodoInput>` with value from local state, onChange, onSubmit handlers
**And** renders `<TodoList>` with todos from useTodos, onToggle, onDelete handlers
**And** displays loading state while fetching (can be simple "Loading..." text for now)
**And** displays error state if error exists (can be simple error text for now)

**Given** the App is integrated
**When** the page loads
**Then** `useTodos` fetches all todos from `/api/todos`
**And** todos are rendered in the TodoList
**And** loading state shows briefly during initial fetch

**Given** the app is loaded with no todos
**When** I type "Buy milk" in the TodoInput and press Enter
**Then** `createTodo` is called with "Buy milk"
**And** POST request is sent to `/api/todos`
**And** new todo appears in the list with completed: false

**Given** a todo exists in the list
**When** I click the checkbox next to it
**Then** `updateTodo` is called with the todo id and opposite completed state
**And** PATCH request is sent to `/api/todos/:id`
**And** the todo updates visually (line-through if completed)

**Given** a todo exists in the list
**When** I click the delete button
**Then** `deleteTodo` is called with the todo id
**And** DELETE request is sent to `/api/todos/:id`
**And** the todo is removed from the list

**Given** todos are created
**When** I refresh the page
**Then** all todos persist (loaded from SQLite database)
**And** completed state is maintained
**And** todos appear in the same order (created_at DESC)

**Given** the complete workflow works
**When** I open the browser console
**Then** no errors appear during normal operations
**And** API responses are properly handled

**Given** the integration is complete
**When** I create `packages/frontend/e2e/todo-crud.spec.ts`
**Then** E2E test verifies: page loads, create todo, todo appears, toggle completion, delete todo, page refresh persists data
**And** test runs against the full stack (backend + frontend)

**Given** E2E test is written
**When** I run `pnpm test:e2e`
**Then** Playwright starts both servers
**And** the complete todo workflow test passes
**And** all CRUD operations work end-to-end

---

## Epic 3: UI Polish, States & Accessibility

Users experience a polished, responsive interface with clear feedback for every state (empty, loading, errors), full keyboard navigation, mobile support, and graceful error handling — transforming a functional app into a delightful, production-ready experience accessible to all users.

### Story 3.1: Implement UI State Components (Empty, Loading, Error)

As a user,
I want clear visual feedback for empty states, loading states, and errors,
So that I always understand what's happening and what to do next.

**Acceptance Criteria:**

**Given** the app needs to show different UI states
**When** I create the EmptyState component
**Then** `packages/frontend/src/components/EmptyState.tsx` exports a component
**And** displays a friendly message: "No todos yet. Add one to get started!"
**And** includes a subtle icon or visual element (optional: can be text-only)
**And** is styled with Tailwind (centered, muted text color, generous padding)
**And** uses semantic HTML (e.g., `<div role="status">`)

**Given** EmptyState exists
**When** I create `packages/frontend/src/components/EmptyState.test.tsx`
**Then** test verifies component renders with expected message
**And** test verifies proper ARIA attributes

**Given** the app needs loading feedback
**When** I create the LoadingSpinner component
**Then** `packages/frontend/src/components/LoadingSpinner.tsx` exports a component
**And** accepts optional prop: `message?: string` (default: "Loading...")
**And** displays the message with appropriate styling
**And** includes a visual loading indicator (can be CSS spinner or simple animated text)
**And** uses ARIA attributes: `role="status"`, `aria-live="polite"`

**Given** LoadingSpinner exists
**When** I create `packages/frontend/src/components/LoadingSpinner.test.tsx`
**Then** test verifies default message renders
**And** test verifies custom message prop works
**And** test verifies ARIA attributes are present

**Given** the app needs error feedback
**When** I create the ErrorMessage component
**Then** `packages/frontend/src/components/ErrorMessage.tsx` exports a component
**And** accepts props: `message: string`, `onDismiss?: () => void`
**And** displays error message in a visually distinct container (red/warning colors)
**And** includes dismiss button if `onDismiss` is provided
**And** uses semantic HTML and ARIA: `role="alert"`, `aria-live="assertive"`
**And** is styled with Tailwind (border, background, padding, accessible color contrast 4.5:1)

**Given** ErrorMessage exists
**When** I create `packages/frontend/src/components/ErrorMessage.test.tsx`
**Then** test verifies error message displays
**And** test verifies dismiss button appears when onDismiss provided
**And** test verifies onDismiss is called when button clicked
**And** test verifies ARIA attributes

**Given** all state components exist
**When** I update `App.tsx` to use them
**Then** when `loading` is true, `<LoadingSpinner>` is shown instead of TodoList
**And** when `error` is not null, `<ErrorMessage message={error} onDismiss={clearError}>` is shown
**And** when `todos.length === 0` and not loading, `<EmptyState>` is shown
**And** when todos exist, `<TodoList>` is shown

**Given** state components are integrated
**When** I test the app with no backend running
**Then** error message displays: "Network error. Please try again."
**And** error can be dismissed
**And** app doesn't crash

**Given** state components are integrated
**When** I test the app with empty database
**Then** EmptyState displays after loading completes
**And** message is clear and helpful

### Story 3.2: Add Comprehensive Error Handling and Input Preservation

As a user,
I want the app to handle errors gracefully and preserve my input when operations fail,
So that I don't lose work and always know what went wrong.

**Acceptance Criteria:**

**Given** the TodoInput component
**When** I enhance it with input preservation
**Then** input value is controlled by parent component
**And** when `createTodo` fails in `useTodos`, the error is set but input is NOT cleared
**And** user can see the error message and try again without re-typing

**Given** input preservation is implemented
**When** I create a todo and the network request fails
**Then** TodoInput still contains my typed text
**And** ErrorMessage shows the failure reason
**And** I can click submit again to retry with the same text

**Given** error handling needs improvement in useTodos
**When** I update the `useTodos` hook
**Then** errors from API calls are stored in error state
**And** a `clearError()` function is exported
**And** successful operations clear previous errors
**And** error state is displayed to users via ErrorMessage component

**Given** the API wrapper handles errors
**When** network is unreachable
**Then** error message is user-friendly: "Network error. Please try again."
**And** NOT technical jargon like "Failed to fetch"

**Given** the backend returns validation errors
**When** I try to create a todo with empty text
**Then** backend returns 400 with message: "text must not be empty"
**And** frontend displays this message in ErrorMessage
**And** input focus returns to TodoInput

**Given** error handling is comprehensive
**When** I test various error scenarios
**Then** backend down: "Server is unavailable. Please try again later."
**And** validation error: displays specific validation message from backend
**And** 404 on update/delete: "Todo not found. It may have been deleted."
**And** unexpected errors: "Something went wrong. Please try again."

**Given** errors are handled throughout the app
**When** concurrent operations fail
**Then** one error doesn't block future operations
**And** clearing error allows trying again
**And** no operations leave the app in broken state

**Given** error handling is complete
**When** I create integration tests for error scenarios
**Then** tests verify: network failure shows error, validation error shows error, server error shows error, input is preserved on failure
**And** tests verify error can be dismissed and operation retried

### Story 3.3: Implement Responsive Design with Touch Support

As a user,
I want the app to work seamlessly on desktop, tablet, and mobile with touch-friendly controls,
So that I can manage todos on any device.

**Acceptance Criteria:**

**Given** the app needs responsive layout
**When** I update the overall layout in `App.tsx`
**Then** root container uses Tailwind responsive utilities
**And** max-width is constrained on large screens (e.g., `max-w-2xl mx-auto`)
**And** padding adjusts by breakpoint: `px-4 sm:px-6 lg:px-8`
**And** the layout is centered and readable on all screen sizes

**Given** responsive layout exists
**When** I test on mobile (320px width)
**Then** TodoInput and TodoList fit within viewport
**And** no horizontal scrolling
**And** text is readable (minimum 16px base font size to prevent zoom on iOS)

**Given** touch targets need to be accessible
**When** I update interactive elements
**Then** all buttons and checkboxes are minimum 44x44px (Tailwind: `min-h-11 min-w-11` or `p-3`)
**And** TodoItem checkbox has adequate tap target size
**And** TodoItem delete button has adequate tap target size and spacing
**And** TodoInput submit button has adequate tap target size

**Given** touch-friendly targets exist
**When** I test on mobile device or touch emulation
**Then** I can easily tap checkboxes without mis-taps
**And** I can tap delete buttons without accidentally hitting adjacent items
**And** spacing between interactive elements prevents accidental taps

**Given** the app needs mobile-optimized interactions
**When** I update TodoInput for mobile
**Then** input has appropriate `type="text"` and `autocomplete="off"`
**And** input has `enterkeyhint="done"` for better mobile keyboard
**And** pressing Enter on mobile keyboard submits the form

**Given** responsive design is implemented
**When** I test across breakpoints: mobile (320-767px), tablet (768-1023px), desktop (1024px+)
**Then** layout adapts smoothly at each breakpoint
**And** all features remain functional
**And** typography scales appropriately (Tailwind responsive text sizes)

**Given** visual distinction needs to work on mobile
**When** a todo is completed
**Then** line-through style is clearly visible on small screens
**And** color contrast meets 4.5:1 ratio for active vs completed todos
**And** completed todos have additional visual indicator (opacity or color shift)

**Given** responsive design is complete
**When** I create E2E tests for mobile viewport
**Then** `packages/frontend/e2e/mobile.spec.ts` tests todo creation on 375px width
**And** tests verify touch interactions work
**And** tests verify layout doesn't break

### Story 3.4: Add Full Keyboard Navigation and Accessibility

As a user,
I want to navigate and operate the entire app using only a keyboard,
So that I can be productive regardless of input method and the app is accessible to all users.

**Acceptance Criteria:**

**Given** keyboard navigation is required
**When** I load the app
**Then** focus automatically goes to TodoInput field
**And** I can immediately start typing without clicking

**Given** the app is loaded with todos
**When** I press Tab
**Then** focus moves through interactive elements in logical order: TodoInput → Submit button → Todo 1 checkbox → Todo 1 delete → Todo 2 checkbox → etc.
**And** focus indicators are clearly visible (Tailwind: `focus:ring-2 focus:ring-blue-500 focus:outline-none`)

**Given** focus indicators are needed
**When** I update all interactive elements
**Then** TodoInput has visible focus ring
**And** Submit button has visible focus ring
**And** TodoItem checkboxes have visible focus ring
**And** TodoItem delete buttons have visible focus ring
**And** all focus rings meet 3:1 contrast ratio against background

**Given** keyboard shortcuts are expected
**When** I'm focused on TodoInput and press Enter
**Then** todo is created
**And** input is cleared (on success)
**And** focus remains on input field

**Given** keyboard operation of todos
**When** I Tab to a todo checkbox and press Space
**Then** todo completion toggles
**And** visual state updates immediately

**Given** keyboard deletion
**When** I Tab to a delete button and press Enter or Space
**Then** todo is deleted
**And** focus moves to next logical element (next todo or TodoInput)

**Given** semantic HTML is required
**When** I audit the HTML structure
**Then** TodoInput uses `<form>` element with `onSubmit` handler
**And** TodoList uses semantic list (`<ul>` with `<li>`) or appropriate container
**And** All buttons use `<button type="button">` (delete) or `<button type="submit">` (form submit)
**And** Checkboxes use `<input type="checkbox">`

**Given** ARIA labels are needed
**When** I add ARIA attributes
**Then** TodoInput has `aria-label="New todo"` or proper `<label>`
**And** TodoItem checkbox has `aria-label="Toggle todo: {todo.text}"`
**And** TodoItem delete button has `aria-label="Delete todo: {todo.text}"`
**And** EmptyState has `role="status"`
**And** LoadingSpinner has `role="status" aria-live="polite"`
**And** ErrorMessage has `role="alert" aria-live="assertive"`

**Given** screen reader support is needed
**When** I test with screen reader (or automated accessibility audit)
**Then** all interactive elements are announced correctly
**And** todo text is announced when checking/unchecking
**And** state changes are announced (loading, error, empty)

**Given** color contrast is required
**When** I audit color contrast
**Then** all text meets 4.5:1 contrast ratio minimum
**And** active todo text: 4.5:1 against background
**And** completed todo text: 4.5:1 against background (even with opacity/line-through)
**And** error messages: 4.5:1 contrast
**And** focus indicators: 3:1 contrast

**Given** accessibility is complete
**When** I run Lighthouse accessibility audit
**Then** score is 100
**And** no accessibility violations reported

**Given** keyboard navigation is implemented
**When** I create manual keyboard test scenarios
**Then** document keyboard shortcuts in README
**And** verify all operations possible without mouse
**And** focus management is logical throughout user flows

### Story 3.5: Optimize Performance (Bundle Size, FCP, TTI, Lighthouse)

As a user,
I want the app to load quickly and respond instantly to interactions,
So that my experience is smooth and efficient.

**Acceptance Criteria:**

**Given** performance targets exist (FCP < 1.5s, TTI < 2s, Lighthouse > 90)
**When** I optimize the frontend bundle
**Then** Vite production build uses tree-shaking to eliminate unused code
**And** no unnecessary dependencies are included
**And** Tailwind CSS is purged of unused styles in production build
**And** React is built in production mode (minified, optimized)

**Given** bundle optimization is done
**When** I run `pnpm --filter frontend build`
**Then** main JavaScript bundle is < 150KB gzipped
**And** CSS bundle is < 10KB gzipped
**And** no console warnings about large chunks

**Given** the production build is optimized
**When** I analyze bundle composition
**Then** React + React-DOM are the largest dependencies (expected)
**And** no duplicate dependencies
**And** no development-only code in production bundle

**Given** API performance targets exist (< 150ms)
**When** I verify backend performance
**Then** SQL queries use proper indexes (id is PRIMARY KEY, auto-indexed)
**And** `getAll()` query is simple: `SELECT * FROM todos ORDER BY created_at DESC`
**And** repository operations are synchronous (better-sqlite3), no unnecessary async overhead

**Given** UI update targets exist (< 100ms)
**When** I test UI responsiveness
**Then** toggling todo completion updates immediately (React state update is synchronous)
**And** adding todo updates list immediately after API response
**And** deleting todo removes from list immediately after API response
**And** no unnecessary re-renders (React.memo if needed, but likely not necessary for this scope)

**Given** First Contentful Paint target is < 1.5s
**When** I test initial page load on simulated 4G connection
**Then** HTML loads quickly (< 500ms)
**And** CSS and JS load in parallel
**And** first paint shows app skeleton within 1.5s

**Given** Time to Interactive target is < 2s
**When** I test on simulated 4G connection
**Then** JavaScript executes and hydrates quickly
**And** TodoInput is interactive and focused within 2s
**And** no render-blocking resources delay interactivity

**Given** Lighthouse target is > 90
**When** I run Lighthouse audit in production mode
**Then** Performance score is ≥ 90
**And** Accessibility score is 100
**And** Best Practices score is ≥ 90
**And** SEO score is ≥ 90 (though not critical for this app)

**Given** performance optimizations are complete
**When** I test on low-end device or throttled connection
**Then** app remains usable
**And** loading states provide feedback during slow operations
**And** no jank or freezing during interactions

**Given** performance is optimized
**When** I document performance in README
**Then** list actual bundle sizes
**And** document Lighthouse scores
**And** explain optimization techniques used

### Story 3.6: Create Comprehensive E2E Test Suite for All States

As a developer,
I want comprehensive E2E tests covering all user flows and edge cases,
So that I can confidently deploy and maintain the application.

**Acceptance Criteria:**

**Given** the complete app from previous stories
**When** I create the happy path E2E test
**Then** `packages/frontend/e2e/todo-crud.spec.ts` (already exists from Story 2.6) is enhanced
**And** test verifies: page loads → EmptyState shows → create todo → EmptyState disappears → todo appears → create second todo → toggle first todo → delete second todo → refresh page → first todo persists with completed state

**Given** error scenarios need testing
**When** I create `packages/frontend/e2e/error-handling.spec.ts`
**Then** test 1: stops backend server, attempts todo creation, verifies error message shows, restarts backend, dismisses error, retries successfully
**And** test 2: verifies input preservation - types text, simulates failure, verifies text still in input, retries
**And** test 3: attempts to create invalid todo (empty text), verifies validation error

**Given** UI states need testing
**When** I create `packages/frontend/e2e/ui-states.spec.ts`
**Then** test 1: verifies LoadingSpinner appears briefly on initial load
**And** test 2: verifies EmptyState shows when no todos
**And** test 3: verifies ErrorMessage can be dismissed
**And** test 4: verifies app recovers from error state and allows normal operations

**Given** responsive design needs testing
**When** I create `packages/frontend/e2e/responsive.spec.ts`
**Then** test runs at mobile viewport (375x667)
**And** test runs at tablet viewport (768x1024)
**And** test runs at desktop viewport (1920x1080)
**And** verifies layout doesn't break at each size
**And** verifies touch targets are accessible on mobile

**Given** keyboard navigation needs testing
**When** I create `packages/frontend/e2e/keyboard-navigation.spec.ts`
**Then** test verifies: focus starts on input, Tab moves through elements in order, Enter creates todo, Space toggles checkbox, Space/Enter deletes todo
**And** verifies focus indicators are visible (screenshot comparison or visual regression)
**And** verifies all operations possible without mouse

**Given** accessibility needs testing
**When** I create `packages/frontend/e2e/accessibility.spec.ts`
**Then** test uses `@axe-core/playwright` to run accessibility audit
**And** verifies no violations on initial load
**And** verifies no violations with todos present
**And** verifies no violations in error state
**And** verifies ARIA labels are present on interactive elements

**Given** data persistence needs testing
**When** I enhance the persistence test
**Then** test creates multiple todos with different states (some completed, some active)
**And** closes and reopens browser (tests SQLite persistence)
**And** verifies all todos and their states persist correctly
**And** verifies order is maintained (created_at DESC)

**Given** concurrent operations need testing
**When** I create concurrent scenario test
**Then** test opens two browser contexts (simulating two tabs)
**And** creates todo in context 1
**And** refreshes context 2 and verifies todo appears
**And** updates todo in context 2
**And** refreshes context 1 and verifies update (last-write-wins is acceptable per NFR13)

**Given** all E2E tests are written
**When** I run `pnpm test:e2e`
**Then** all tests pass
**And** total test execution time is reasonable (< 2 minutes)
**And** tests are stable (no flaky failures)

**Given** the test suite is complete
**When** I update the README
**Then** testing section documents: how to run unit tests, how to run E2E tests, what is tested, coverage areas
**And** documents that E2E tests require both frontend and backend to be built/started

**Given** tests validate the complete system
**When** I review test coverage
**Then** all FRs from Epic 3 are tested: FR11 (empty state), FR12 (loading), FR13-FR15 (errors, input preservation), FR16-FR19 (responsive, touch, keyboard)
**And** all NFRs from Epic 3 are validated: performance, accessibility, error recovery
**And** confidence in production readiness is high

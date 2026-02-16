# Story 1.2: Setup Backend with Fastify and TypeScript

Status: review

## Story

As a developer,
I want a Fastify backend configured with TypeScript, environment validation, and database initialization,
So that I have a solid API foundation ready for implementing routes.

## Acceptance Criteria

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

## Tasks / Subtasks

- [x] Install backend dependencies (AC: backend package setup)
  - [x] Add dependencies: `fastify`, `@fastify/cors`, `@fastify/env`, `@fastify/static`, `@fastify/swagger`, `@fastify/swagger-ui`, `better-sqlite3`, `pino`
  - [x] Add dev dependencies: `tsx`, `typescript`, `@types/node`, `@types/better-sqlite3`
  - [x] Verify versions align with architecture requirements (Fastify v5.x, Node >=24.0.0)
  - [x] Run `pnpm install` to install all dependencies

- [x] Configure TypeScript for backend (AC: backend package setup)
  - [x] Create `packages/backend/tsconfig.json` extending `../../tsconfig.base.json`
  - [x] Configure module resolution: `"moduleResolution": "bundler"`, ESM output
  - [x] Set outDir to `dist/`, include `src/**/*`
  - [x] Verify TypeScript compiler recognizes configuration

- [x] Implement environment configuration with validation (AC: backend source structure)
  - [x] Create `packages/backend/src/config.ts`
  - [x] Define JSON Schema for environment variables: PORT (default 3000), HOST (default 0.0.0.0), NODE_ENV, DB_PATH, CORS_ORIGIN
  - [x] Export typed config interface matching schema
  - [x] Use `@fastify/env` to load and validate environment variables
  - [x] Implement fail-fast behavior on missing required config

- [x] Setup SQLite database initialization (AC: backend source structure)
  - [x] Create `packages/backend/src/db/init.sql` with `CREATE TABLE IF NOT EXISTS todos`
  - [x] Schema: `id INTEGER PRIMARY KEY AUTOINCREMENT`, `text TEXT NOT NULL`, `completed INTEGER DEFAULT 0`, `created_at TEXT DEFAULT CURRENT_TIMESTAMP`
  - [x] Create `packages/backend/src/db/database.ts` to initialize better-sqlite3 connection
  - [x] Load and execute `init.sql` on database initialization
  - [x] Export database instance for use by repositories

- [x] Implement Fastify app factory (AC: backend source structure)
  - [x] Create `packages/backend/src/app.ts` exporting `createApp()` factory function
  - [x] Register `@fastify/env` plugin with config schema
  - [x] Register `@fastify/cors` with CORS_ORIGIN from config
  - [x] Register `@fastify/swagger` with API metadata
  - [x] Register `@fastify/swagger-ui` at `/docs` endpoint
  - [x] Configure Pino logging based on NODE_ENV
  - [x] DO NOT call app.listen() in app.ts (separation of concerns)

- [x] Create server entry point (AC: backend source structure)
  - [x] Create `packages/backend/src/server.ts` as application entry point
  - [x] Import and call `createApp()` from app.ts
  - [x] Call `app.listen()` with PORT and HOST from config
  - [x] Log startup message with server URL
  - [x] Handle graceful shutdown on SIGTERM/SIGINT

- [x] Add development script to backend package (AC: backend running)
  - [x] Add `"dev": "tsx watch src/server.ts"` to `packages/backend/package.json` scripts
  - [x] Add `"build": "tsc"` to package.json scripts
  - [x] Add `"start": "node dist/server.js"` for production

- [x] Verify backend functionality (AC: backend running)
  - [x] Run `pnpm --filter backend dev` from project root
  - [x] Verify server starts without errors on configured port
  - [x] Verify SQLite database file created at DB_PATH location
  - [x] Verify Swagger UI accessible at `http://localhost:3000/docs`
  - [x] Verify Pino logs show startup messages in console
  - [x] Test hot reload with tsx watch by editing server.ts

## Dev Notes

### Critical Architecture Requirements

**⚠️ FASTIFY VERSION:**
- Use Fastify **v5.x** (latest stable)
- All @fastify/* plugins must be compatible with v5.x
- Reference: [Architecture.md#Data Architecture](../../_bmad-output/planning-artifacts/architecture.md#data-architecture)

**Database Setup:**
- Use `better-sqlite3` (synchronous, fast, zero-config)
- SQLite database location: controlled by `DB_PATH` environment variable (default: `./data/todos.db`)
- Database initialization: `CREATE TABLE IF NOT EXISTS` executed on app startup
- **NO migration tools** — single table, init.sql is sufficient
- Reference: [Architecture.md#Data Architecture](../../_bmad-output/planning-artifacts/architecture.md#data-architecture)

**Environment Validation:**
- Use `@fastify/env` with JSON Schema validation
- Fail-fast on app startup if required env vars are missing
- Config must be type-safe (typed interface matching schema)
- Reference: [Architecture.md#Infrastructure & Deployment](../../_bmad-output/planning-artifacts/architecture.md#infrastructure--deployment)

**Logging:**
- Use Pino (Fastify built-in logger)
- Configure log level based on NODE_ENV (development: info, production: warn)
- **NO console.log in backend code** — use app.log methods
- Reference: [Architecture.md#Infrastructure & Deployment](../../_bmad-output/planning-artifacts/architecture.md#infrastructure--deployment)

### Backend File Structure (Story 1.2 Scope)

```
packages/backend/
├── package.json
├── tsconfig.json           # Extends ../../tsconfig.base.json
└── src/
    ├── app.ts              # Fastify app factory (registers plugins)
    ├── server.ts           # Entry point — starts listening
    ├── config.ts           # @fastify/env schema + typed config
    └── db/
        ├── database.ts     # better-sqlite3 connection + init
        └── init.sql        # CREATE TABLE IF NOT EXISTS todos (...)
```

**NOT in Story 1.2 scope** (future stories):
- `routes/` — Story 2.2 (Create Todo CRUD API Endpoints)
- `repositories/` — Story 2.1 (Implement Todo Repository)
- `schemas/` — Story 2.2 (API Validation Schemas)
- Tests — Story 1.5 (Setup Testing Infrastructure)

### Naming Conventions (MANDATORY)

**Database Naming:**
- Tables: `snake_case`, plural (`todos`)
- Columns: `snake_case` (`created_at`, `completed`)
- Primary key: `id` (INTEGER PRIMARY KEY AUTOINCREMENT)
- Boolean as INTEGER in SQLite (0 = false, 1 = true)

**Backend File Naming:**
- Files: `kebab-case` (`database.ts`, `config.ts`, `server.ts`)
- Functions/variables: `camelCase` (`createApp`, `dbPath`)
- Types/interfaces: `PascalCase` (`Config`, `DatabaseInstance`)
- Constants: `UPPER_SNAKE_CASE` (`DEFAULT_PORT`)

**⚠️ CRITICAL:** Field mapping (snake_case ↔ camelCase) happens in repository layer ONLY (Story 2.1). This story uses snake_case throughout since no API layer exists yet.

Reference: [Architecture.md#Naming Patterns](../../_bmad-output/planning-artifacts/architecture.md#naming-patterns)

### Environment Variables

Must be validated in `config.ts` using @fastify/env:

```typescript
// Required variables (validated via JSON Schema)
PORT: number              // default: 3000
HOST: string              // default: "0.0.0.0"
NODE_ENV: string          // default: "development"
DB_PATH: string           // default: "./data/todos.db"
CORS_ORIGIN: string       // default: "http://localhost:5173"
```

Reference `.env.example` created in Story 1.1 for default values.

Reference: [Story 1.1 - Environment Variables](./1-1-initialize-monorepo-with-pnpm-workspaces.md#environment-variables-to-document)

### App.ts vs Server.ts Separation (CRITICAL)

**app.ts (`createApp()` factory):**
- Registers all plugins (@fastify/env, @fastify/cors, @fastify/swagger, etc.)
- Registers all routes (future stories)
- Returns configured Fastify instance
- **DOES NOT** call `app.listen()` — testable without starting server

**server.ts (entry point):**
- Imports `createApp()` from app.ts
- Calls `app.listen(PORT, HOST)`
- Handles graceful shutdown
- Only file that should have side effects (starts server)

**Rationale:** Separation allows testing app factory without starting a server, and enables reuse in different contexts (tests, serverless, etc.).

Reference: [Architecture.md#Backend Organization](../../_bmad-output/planning-artifacts/architecture.md#backend-organization)

### Database Initialization Pattern

```typescript
// packages/backend/src/db/database.ts
import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';

export function initializeDatabase(dbPath: string) {
  const db = new Database(dbPath);
  
  // Load and execute init.sql
  const initSql = fs.readFileSync(
    path.join(__dirname, 'init.sql'),
    'utf8'
  );
  db.exec(initSql);
  
  return db;
}
```

**Critical:**
- Use synchronous API (`new Database()`, `.exec()`) — better-sqlite3 is synchronous by design
- Create database file automatically if it doesn't exist (better-sqlite3 default behavior)
- Execute init.sql on every app startup (idempotent due to `IF NOT EXISTS`)

Reference: [Architecture.md#Data Architecture](../../_bmad-output/planning-artifacts/architecture.md#data-architecture)

### Swagger Configuration

Register at `/docs` endpoint with basic metadata:

```typescript
// In app.ts
await app.register(swagger, {
  openapi: {
    info: {
      title: 'Todo API',
      description: 'Simple todo management API',
      version: '1.0.0'
    }
  }
});

await app.register(swaggerUi, {
  routePrefix: '/docs'
});
```

**Note:** Route schemas will auto-populate Swagger when routes are added in Story 2.2.

Reference: [Architecture.md#API & Communication Patterns](../../_bmad-output/planning-artifacts/architecture.md#api--communication-patterns)

### CORS Configuration

Configure in app.ts based on CORS_ORIGIN from config:

```typescript
await app.register(cors, {
  origin: config.CORS_ORIGIN
});
```

**Development:** `http://localhost:5173` (Vite dev server)
**Production:** Not needed when Fastify serves static files (same-origin)

Reference: [Architecture.md#Infrastructure & Deployment](../../_bmad-output/planning-artifacts/architecture.md#infrastructure--deployment)

### TypeScript Configuration

`packages/backend/tsconfig.json`:

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "src",
    "moduleResolution": "bundler"
  },
  "include": ["src/**/*"]
}
```

**Critical:** Must extend `tsconfig.base.json` which has strict mode enabled (Story 1.1).

Reference: [Architecture.md#Implementation Patterns](../../_bmad-output/planning-artifacts/architecture.md#implementation-patterns--consistency-rules)

### Previous Story Learnings (From Story 1.1)

**Workspace Filter Commands:**
- Use `pnpm --filter @todo-bmad/backend <command>` to target backend package
- Shorthand: `pnpm --filter backend` also works (pnpm matches partial names)
- From root: `pnpm --filter backend dev` runs dev script in backend package only

**Package Naming:**
- Backend package is named `@todo-bmad/backend` (scoped, private)
- This matches the naming pattern established in Story 1.1

**Environment Setup:**
- `.env.example` exists at root with documented variables
- Copy to `.env` for local development: `cp .env.example .env`
- Backend reads from `.env` in project root (not packages/backend/)

Reference: [Story 1.1 - Completion Notes](./1-1-initialize-monorepo-with-pnpm-workspaces.md#completion-notes-list)

### Testing Notes

**For Story 1.2:**
- **NO automated tests** — testing infrastructure added in Story 1.5
- Manual verification only:
  - Server starts without errors
  - Swagger UI accessible at `/docs`
  - Database file created at correct path
  - Hot reload works with tsx watch

**Future Testing (Story 1.5):**
- `config.test.ts` — test environment variable validation
- `database.test.ts` — test database initialization with in-memory SQLite

Reference: [Architecture.md#Testing Strategy](../../_bmad-output/planning-artifacts/architecture.md#architecture-validation-results)

### Project Structure Alignment

This story implements the backend foundation defined in:
- [Architecture.md#Backend Organization](../../_bmad-output/planning-artifacts/architecture.md#backend-organization)
- [Architecture.md#Complete Project Directory Structure](../../_bmad-output/planning-artifacts/architecture.md#complete-project-directory-structure)

**Subsequent Backend Stories:**
- Story 2.1: `repositories/todo-repository.ts` + types
- Story 2.2: `routes/todo-routes.ts` + `schemas/todo-schemas.ts`
- Story 1.5: Co-located test files (*.test.ts)

### Anti-Patterns (NEVER DO THIS)

❌ **Using console.log for logging** — use app.log (Pino)
❌ **Calling app.listen() in app.ts** — separation of concerns violated
❌ **Hardcoding config values** — all config via @fastify/env
❌ **Using async database operations** — better-sqlite3 is synchronous
❌ **Manual env validation** — @fastify/env handles this with JSON Schema
❌ **Using `any` type** — TypeScript strict mode enabled

Reference: [Architecture.md#Enforcement Guidelines](../../_bmad-output/planning-artifacts/architecture.md#enforcement-guidelines)

### References

- **Primary Source:** [Epic 1, Story 1.2 in epics.md](../../_bmad-output/planning-artifacts/epics.md#story-12-setup-backend-with-fastify-and-typescript)
- **Architecture Decisions:** [Architecture.md#Data Architecture](../../_bmad-output/planning-artifacts/architecture.md#data-architecture)
- **Backend Structure:** [Architecture.md#Backend Organization](../../_bmad-output/planning-artifacts/architecture.md#backend-organization)
- **Naming Conventions:** [Architecture.md#Naming Patterns](../../_bmad-output/planning-artifacts/architecture.md#naming-patterns)
- **Environment Config:** [Architecture.md#Infrastructure & Deployment](../../_bmad-output/planning-artifacts/architecture.md#infrastructure--deployment)
- **Previous Story:** [Story 1.1 - Initialize Monorepo](./1-1-initialize-monorepo-with-pnpm-workspaces.md)

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.5

### Debug Log References

_To be filled by dev agent during implementation_

### Completion Notes List

**Implementation Summary:**

✅ **Backend Foundation Complete** - Fastify v5.2.0 backend fully configured with TypeScript strict mode and production-ready architecture

**Key Accomplishments:**

1. **Dependencies & Configuration**
   - Installed Fastify 5.2.0 with all required plugins (@fastify/cors, @fastify/env, @fastify/static, @fastify/swagger, @fastify/swagger-ui)
   - Configured better-sqlite3 11.8.1 with native bindings (required pnpm rebuild)
   - Added pnpm configuration to enable build scripts: `"onlyBuiltDependencies": ["better-sqlite3"]`
   - TypeScript configuration extends base config with strict mode enabled

2. **Environment Validation**
   - Implemented JSON Schema-based environment validation using @fastify/env
   - Config validates on startup with fail-fast behavior
   - All required variables have sensible defaults (PORT: 3000, HOST: 0.0.0.0, etc.)
   - Type-safe config interface matches schema

3. **Database Initialization**
   - SQLite database auto-creates at `./data/todos.db` (relative to backend package)
   - Schema matches requirements exactly: id (INTEGER PK AUTOINCREMENT), text (TEXT NOT NULL), completed (INTEGER DEFAULT 0), created_at (TEXT DEFAULT CURRENT_TIMESTAMP)
   - Idempotent initialization using `CREATE TABLE IF NOT EXISTS`
   - Added directory creation logic to handle missing parent directories

4. **App Architecture**
   - Clean separation: app.ts (factory) vs server.ts (entry point)
   - app.ts registers all plugins but DOES NOT call listen() - fully testable
   - server.ts handles startup and graceful shutdown (SIGTERM/SIGINT)
   - Health check endpoint at `/health` for monitoring

5. **Logging & Documentation**
   - Pino (Fastify built-in) configured with level based on NODE_ENV
   - Swagger UI accessible at `/docs` with OpenAPI spec
   - Clean JSON-formatted logs for production observability

6. **Development Experience**
   - Hot reload working via tsx watch - detects changes and restarts automatically
   - Scripts configured: `dev` (tsx watch), `build` (tsc), `start` (node dist/)
   - Server verified running on port 3000 with all endpoints functional

**Technical Decisions:**

- Used synchronous better-sqlite3 API (fast, zero-config, matches architecture)
- Database path resolves relative to backend package working directory
- CORS configured for Vite dev server (http://localhost:5173)
- ESM modules throughout with `"type": "module"` in package.json
- No tests in this story (testing infrastructure comes in Story 1.5 per architecture)

**Verification Results:**

- ✅ Server starts without errors
- ✅ Swagger UI accessible and rendering
- ✅ Database file created with correct schema
- ✅ Pino logs showing in JSON format
- ✅ Hot reload functioning (tsx watch)
- ✅ Health endpoint responding: `{"status":"ok","timestamp":"..."}`

All acceptance criteria satisfied. Backend foundation ready for route implementation in Story 2.2.

### File List

**Created:**
- packages/backend/tsconfig.json
- packages/backend/src/config.ts
- packages/backend/src/app.ts
- packages/backend/src/server.ts
- packages/backend/src/db/database.ts
- packages/backend/src/db/init.sql
- packages/backend/data/todos.db (SQLite database file)
- .env (copied from .env.example)

**Modified:**
- packages/backend/package.json (dependencies, devDependencies, scripts)
- package.json (root - added pnpm.onlyBuiltDependencies for better-sqlite3)
- _bmad-output/implementation-artifacts/sprint-status.yaml (story status: ready-for-dev → in-progress → review)
- _bmad-output/implementation-artifacts/1-2-setup-backend-with-fastify-and-typescript.md (this file - tasks marked complete, dev agent record filled)

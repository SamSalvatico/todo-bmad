---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]
inputDocuments: ['prd.md', 'prd-validation-report.md', 'PRD-todo.md']
workflowType: 'architecture'
project_name: 'todo-bmad'
user_name: 'Sam'
date: '2026-02-16'
lastStep: 8
status: 'complete'
completedAt: '2026-02-16'
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## Project Context Analysis

### Requirements Overview

**Functional Requirements:**
24 functional requirements organized into 5 categories:
- **Task Management (FR1–FR6):** CRUD operations on a single Todo entity — create, read, complete/uncomplete, delete, with visual distinction between active and completed states.
- **Data Persistence (FR7–FR10):** Todos persist across browser sessions and page refreshes. Each todo stores text description, completion status, and creation timestamp.
- **UI States (FR11–FR15):** Empty state, loading indicator, error messages, server-unreachable state, and input preservation on failure.
- **Responsive Experience (FR16–FR19):** Full functionality on desktop and mobile, touch-friendly controls, keyboard navigable.
- **API (FR20–FR24):** RESTful CRUD endpoints accepting and returning JSON.

Architecturally, all FRs map to standard CRUD patterns on a single entity. No complex business logic, workflows, event-driven patterns, or inter-entity relationships.

**Non-Functional Requirements:**
22 NFRs across 5 categories that shape architectural decisions:
- **Performance (NFR1–6):** API < 150ms, UI updates < 100ms, FCP < 1.5s, TTI < 2s, Lighthouse > 90. Achievable with any lightweight modern stack.
- **Security (NFR7–9):** Input validation/sanitization, no implementation detail leakage, CORS restricted to frontend origin.
- **Reliability (NFR10–13):** Zero data loss, graceful network recovery, persistence survives restarts, last-write-wins concurrency.
- **Accessibility (NFR14–18):** Keyboard navigation, focus indicators, semantic HTML, 4.5:1 contrast, ARIA labels.
- **Maintainability (NFR19–22):** Conventional patterns, < 5 min setup, extensible without restructuring, documented README.

**Scale & Complexity:**
- Primary domain: Full-stack Web (SPA + REST API)
- Complexity level: Low
- Single data entity, single user, no auth, no real-time
- Estimated architectural components: ~4 (Frontend SPA, REST API, Data persistence layer, Shared types/contracts)

### Technical Constraints & Dependencies

- JSON API communication — all endpoints accept and return JSON
- No complex state library needed — PRD explicitly states simple state management
- Standard HTTP request/response only — no WebSockets, SSE, or polling
- No authentication — but architecture must allow adding auth middleware later without restructuring
- Solo developer — simplicity and convention over configuration
- New developer productivity: < 5 min local setup, < 1 day to add a new feature
- Modern browsers only (latest 2 versions of Chrome, Firefox, Safari, Edge) — ES2020+, no polyfills

### Cross-Cutting Concerns Identified

| Concern | Impact |
|---------|--------|
| Error handling | Spans UI states (FR13, FR14, FR15) + API responses (NFR8) + network failures (NFR11) |
| Input validation | Frontend UX validation + API sanitization (NFR7) — dual-layer |
| Accessibility | Every interactive UI component (NFR14–18) |
| Responsive design | Layout + touch targets across all breakpoints (FR16–18) |
| Performance budgets | Client-side (NFR2–6) and server-side (NFR1) |
| CORS | API restricted to frontend origin only (NFR9) |

## Starter Template Evaluation

### User Technical Profile

- **Role:** Senior Software Engineer, strong backend, less experienced on frontend
- **Purpose:** Learning project to understand the BMAD method
- **Deployment:** Local only, with Docker
- **Repository:** Monorepo

### Primary Technology Domain

Full-stack Web — SPA frontend (React) + REST API backend (Fastify), monorepo structure.

### Starter Options Considered

| Option | Pros | Cons | Verdict |
|--------|------|------|---------|
| T3 App (`create-t3-app`) | TypeScript-first, great DX | Next.js-based (not SPA + Fastify), Prisma-heavy, wrong architecture | Rejected |
| Turborepo starter | Monorepo tooling, caching, task orchestration | Overkill for a 2-package monorepo | Rejected |
| Nx workspace | Enterprise monorepo, generators | Way too heavy for this scope | Rejected |
| **pnpm workspaces + Vite + Fastify** | Minimal, transparent, matches stack exactly | No scaffolding CLI — trivial manual setup | **Selected** |

### Selected Starter: pnpm workspaces (manual scaffold)

**Rationale:**
- No existing starter matches Fastify + React SPA + SQLite + monorepo precisely
- Every full-stack starter (T3, RedwoodJS, Blitz) makes opinionated framework choices that conflict with the chosen stack
- pnpm workspaces is the simplest monorepo tool — zero config beyond `pnpm-workspace.yaml`
- Full transparency — no magic, every dependency is intentional
- Turborepo/Nx add build caching and task graph orchestration that a 2-package project doesn't need

**Initialization Approach:**

```bash
# Initialize monorepo
mkdir todo-bmad && cd todo-bmad
pnpm init

# Create workspace config
# pnpm-workspace.yaml: packages: ['packages/*']

# Scaffold frontend
pnpm create vite packages/frontend -- --template react-ts

# Scaffold backend
mkdir -p packages/backend/src && cd packages/backend && pnpm init
# Add fastify, @fastify/cors, better-sqlite3, typescript, etc.
```

### Architectural Decisions Provided by This Setup

**Language & Runtime:**
- TypeScript throughout (strict mode)
- Node.js runtime for backend
- ESM modules

**Frontend (packages/frontend):**
- Vite as build tool and dev server (fast HMR, native ESM)
- React 19 with TypeScript
- No extra state library — `useState`/`useEffect` sufficient for this scope
- CSS approach: TBD (next step)

**Backend (packages/backend):**
- Fastify with TypeScript
- `better-sqlite3` for SQLite (synchronous, fast, zero-config)
- `@fastify/cors` for CORS configuration
- Schema validation via Fastify's built-in JSON Schema support

**Build Tooling:**
- Vite for frontend build + dev
- `tsx` for backend dev, `tsc` for production build
- pnpm for package management and workspace orchestration

**Testing:**
- Vitest (shares Vite config, fast, Jest-compatible API) for both frontend and backend
- @testing-library/react for component tests
- Playwright for E2E tests — runs against full stack (Fastify + React)

**Code Quality:**
- Biome for linting + formatting (single tool, Rust-based, near-instant)
- TypeScript strict mode

**Docker:**
- `docker-compose.yaml` at monorepo root
- Multi-stage Dockerfile (build → production image)
- SQLite volume mount for data persistence

**Project Structure:**
```
todo-bmad/
├── packages/
│   ├── frontend/          # Vite + React SPA
│   │   ├── src/
│   │   ├── public/
│   │   ├── package.json
│   │   └── vite.config.ts
│   └── backend/           # Fastify REST API
│       ├── src/
│       ├── package.json
│       └── tsconfig.json
├── docker-compose.yaml
├── Dockerfile
├── pnpm-workspace.yaml
├── package.json
└── README.md
```

**Development Experience:**
- `pnpm dev` — runs both frontend (Vite dev server) and backend (tsx watch) concurrently
- Vite proxies API requests to Fastify in development
- Hot reload on both sides
- SQLite file stored locally (no database server to manage)

**Note:** Project initialization using this approach should be the first implementation story.

## Core Architectural Decisions

### Decision Summary

| Category | Decision | Rationale |
|----------|----------|----------|
| Data modeling | Raw SQL via `better-sqlite3`, repository pattern | Single table, 4 columns — ORM adds nothing |
| Migrations | `CREATE TABLE IF NOT EXISTS` on startup | No migration tool needed for one table |
| Input validation | Fastify JSON Schema (built-in) | Zero dependencies, automatic 400 responses |
| API docs | `@fastify/swagger` + `@fastify/swagger-ui` | Auto-generated from route schemas at `/docs` |
| Error format | Fastify default `{ statusCode, error, message }` | Zero custom work |
| Styling | Tailwind CSS | Utility-first, fast UI development |
| Components | Flat structure (`src/components/`) | ~5 components, no deeper organization needed |
| HTTP client | Native `fetch` with thin wrapper | 4 endpoints, no library needed |
| Logging | Pino (Fastify built-in) | Already bundled, just configure log level |
| Env config | `@fastify/env` | JSON Schema validation on startup, fail-fast |
| Docker | Multi-stage build, docker-compose, SQLite volume | Local deployment with data persistence |

### Data Architecture

**Database:** SQLite via `better-sqlite3`
- Synchronous API, fast, zero-config, no database server
- Single `todos` table: `id` (INTEGER PRIMARY KEY AUTOINCREMENT), `text` (TEXT NOT NULL), `completed` (INTEGER DEFAULT 0), `created_at` (TEXT DEFAULT CURRENT_TIMESTAMP)
- Repository pattern: thin data access layer wrapping raw SQL
- Initialization: `CREATE TABLE IF NOT EXISTS` executed on app startup — no migration tool

### Authentication & Security

**No authentication in V1.** Architecture allows adding auth middleware later without restructuring.
- Input validation: Fastify JSON Schema on all routes — automatic 400 on invalid payloads
- Input sanitization: Strip/escape HTML in text fields to prevent XSS
- CORS: `@fastify/cors` configured to allow frontend origin only
- Error responses: Fastify default format `{ statusCode, error, message }` — no stack traces or implementation details leaked

### API & Communication Patterns

**RESTful API** — 4 endpoints, JSON request/response:

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/todos` | List all todos |
| POST | `/api/todos` | Create a todo |
| PATCH | `/api/todos/:id` | Update completion status |
| DELETE | `/api/todos/:id` | Delete a todo |

- All routes prefixed with `/api/`
- JSON Schema validation on request body and params
- `@fastify/swagger` + `@fastify/swagger-ui` auto-generates OpenAPI docs at `/docs`
- Standard HTTP status codes: 200, 201, 204, 400, 404, 500

### Frontend Architecture

- **Styling:** Tailwind CSS (via `@tailwindcss/vite` plugin)
- **State management:** React `useState` / `useEffect` — no external state library
- **Component structure:** Flat — all components in `src/components/` (~5 components: TodoList, TodoItem, TodoInput, ErrorMessage, LoadingSpinner)
- **HTTP client:** Native `fetch` with a thin `api.ts` wrapper module
- **Routing:** None — single page, no client-side routing needed

### Infrastructure & Deployment

- **Logging:** Pino (Fastify built-in) — configure log level via environment variable
- **Env config:** `@fastify/env` — validates env vars against JSON Schema on startup, fail-fast on missing config
- **Docker:** Multi-stage Dockerfile (build stage → production stage with minimal Node image)
- **docker-compose.yaml:** Single service, SQLite volume mount for data persistence
- **Production serving:** Fastify serves built frontend static files via `@fastify/static`
- **Dev proxy:** Vite proxies `/api` requests to Fastify backend in development

### Deferred Decisions (Not Needed for V1)

- Authentication strategy (no auth in V1, but middleware-ready architecture)
- Rate limiting (local-only deployment)
- Monitoring/APM (learning project)
- CI/CD pipeline (local deployment only)

### Decision Impact Analysis

**Implementation Sequence:**
1. Monorepo scaffold (pnpm workspaces, Biome, TypeScript config)
2. Backend: Fastify + SQLite + env config + route schemas + Swagger
3. Frontend: Vite + React + Tailwind + API wrapper
4. Docker: Compose + multi-stage Dockerfile
5. Integration: Vite proxy → Fastify in dev, static serving in production

**Cross-Component Dependencies:**
- JSON Schema definitions in backend serve triple duty: validation, Swagger docs, and TypeScript type inference
- Tailwind requires `@tailwindcss/vite` plugin in Vite config
- `@fastify/static` serves the built frontend in production Docker image
- `@fastify/cors` only needed in development (same-origin in production when Fastify serves static files)

## Implementation Patterns & Consistency Rules

### Naming Patterns

**Database Naming Conventions:**
- Tables: `snake_case`, plural (`todos`)
- Columns: `snake_case` (`created_at`, `completed`)
- Primary key: `id` (INTEGER PRIMARY KEY AUTOINCREMENT)
- Example: `SELECT id, text, completed, created_at FROM todos`

**API Naming Conventions:**
- Endpoints: plural nouns, kebab-case (`/api/todos`)
- JSON fields: `camelCase` (`createdAt`, `completed`)
- Route params: `:id` (Fastify convention)
- Query params: `camelCase` (if ever needed)
- Repository layer maps `snake_case` DB columns → `camelCase` JSON fields

**Code Naming Conventions:**
- Backend files: `kebab-case` (`todo-repository.ts`, `todo-routes.ts`)
- Frontend components: `PascalCase` (`TodoItem.tsx`, `TodoList.tsx`)
- Frontend utilities: `kebab-case` (`api.ts`, `use-todos.ts`)
- Functions/variables: `camelCase` (`getTodos`, `isCompleted`)
- Types/interfaces: `PascalCase` (`Todo`, `CreateTodoRequest`)
- Constants: `UPPER_SNAKE_CASE` (`DEFAULT_PORT`, `API_BASE_URL`)

### Structure Patterns

**Test Location:** Co-located with source files
- `todo-repository.ts` → `todo-repository.test.ts` (same directory)
- `TodoItem.tsx` → `TodoItem.test.tsx` (same directory)

**Backend Organization:**
```
packages/backend/src/
├── app.ts              # Fastify app factory
├── server.ts           # Entry point (starts server)
├── config.ts           # @fastify/env schema + config
├── db/
│   ├── init.sql        # CREATE TABLE IF NOT EXISTS
│   └── database.ts     # better-sqlite3 connection
├── routes/
│   └── todo-routes.ts  # All /api/todos route handlers
├── repositories/
│   └── todo-repository.ts  # Data access layer (raw SQL)
└── schemas/
    └── todo-schemas.ts  # JSON Schema definitions (validation + Swagger)
```

**Frontend Organization:**
```
packages/frontend/src/
├── App.tsx
├── main.tsx
├── api.ts              # fetch wrapper
├── hooks/
│   └── use-todos.ts    # Custom hook for todo state + API calls
├── components/
│   ├── TodoList.tsx
│   ├── TodoItem.tsx
│   ├── TodoInput.tsx
│   ├── ErrorMessage.tsx
│   └── LoadingSpinner.tsx
└── types/
    └── todo.ts         # Shared Todo type
```

### Format Patterns

**API Response Format:** Direct responses (no wrapper)
- `GET /api/todos` → `[{ id, text, completed, createdAt }]`
- `POST /api/todos` → `{ id, text, completed, createdAt }` (201)
- `PATCH /api/todos/:id` → `{ id, text, completed, createdAt }` (200)
- `DELETE /api/todos/:id` → no body (204)

**Date Format:** ISO 8601 strings in all API responses (`2026-02-16T12:00:00.000Z`)

**Error Response Format:** Fastify default
```json
{ "statusCode": 400, "error": "Bad Request", "message": "body must have required property 'text'" }
```

### Process Patterns

**Error Handling:**
- Backend: Fastify handles validation errors (400) automatically. Repository errors caught and returned as 500 with generic message. SQL errors never leaked to client.
- Frontend: `api.ts` wrapper catches fetch errors, returns typed `{ data, error }` result objects. Components check `error` field and render `ErrorMessage`.
- Never throw unhandled promises — all async operations wrapped in try/catch.

**Loading States:**
- Custom `useTodos` hook returns `{ todos, error, loading }` pattern
- No global loading state — each operation manages its own
- Optimistic UI: not used — wait for server confirmation (simplicity over speed for this scope)

### Enforcement Guidelines

**All AI Agents MUST:**
- Follow naming conventions exactly as specified (no variations)
- Place tests co-located with source files
- Use the repository pattern for all database access (never raw SQL in route handlers)
- Return direct API responses (no wrappers)
- Use Fastify JSON Schema for all route validation (no manual validation in handlers)
- Map `snake_case` DB fields to `camelCase` in the repository layer only

**Anti-Patterns (NEVER do these):**
- `snake_case` in API JSON responses
- SQL queries outside the repository layer
- Global mutable state in frontend
- `any` type in TypeScript (use proper types)
- Console.log for logging in backend (use Fastify's built-in Pino logger)

## Project Structure & Boundaries

### Complete Project Directory Structure

```
todo-bmad/
├── .gitignore
├── .env.example                    # Environment variable template
├── biome.json                      # Biome config (lint + format, shared)
├── docker-compose.yaml             # Local orchestration
├── Dockerfile                      # Multi-stage build
├── package.json                    # Root workspace scripts (dev, build, lint)
├── pnpm-lock.yaml
├── pnpm-workspace.yaml             # packages: ['packages/*']
├── README.md                       # Setup, architecture overview, structure
├── tsconfig.base.json              # Shared TypeScript config (extended by packages)
│
├── packages/
│   ├── backend/
│   │   ├── package.json
│   │   ├── tsconfig.json           # Extends ../../tsconfig.base.json
│   │   └── src/
│   │       ├── app.ts              # Fastify app factory (registers plugins, routes)
│   │       ├── app.test.ts         # App-level integration tests
│   │       ├── server.ts           # Entry point — starts listening
│   │       ├── config.ts           # @fastify/env schema + typed config
│   │       ├── config.test.ts
│   │       ├── db/
│   │       │   ├── database.ts     # better-sqlite3 connection + init
│   │       │   ├── database.test.ts
│   │       │   └── init.sql        # CREATE TABLE IF NOT EXISTS todos (...)
│   │       ├── repositories/
│   │       │   ├── todo-repository.ts      # Raw SQL data access, snake→camel mapping
│   │       │   └── todo-repository.test.ts
│   │       ├── routes/
│   │       │   ├── todo-routes.ts          # GET/POST/PATCH/DELETE /api/todos
│   │       │   └── todo-routes.test.ts
│   │       └── schemas/
│   │           └── todo-schemas.ts         # JSON Schema defs (validation + Swagger)
│   │
│   └── frontend/
│       ├── package.json
│       ├── tsconfig.json           # Extends ../../tsconfig.base.json
│       ├── playwright.config.ts    # Playwright config (webServer: full stack)
│       ├── vite.config.ts          # Vite + Tailwind plugin + API proxy
│       ├── index.html              # SPA entry point
│       ├── e2e/
│       │   ├── todo-crud.spec.ts       # Happy path: create, complete, delete
│       │   └── todo-errors.spec.ts     # Error states, network failures
│       ├── public/
│       │   └── favicon.svg
│       └── src/
│           ├── main.tsx            # React root render
│           ├── App.tsx             # Root component — renders TodoList
│           ├── App.test.tsx
│           ├── index.css           # Tailwind @import directives
│           ├── api.ts              # fetch wrapper ({ data, error } return type)
│           ├── api.test.ts
│           ├── types/
│           │   └── todo.ts         # Todo interface, CreateTodoRequest, etc.
│           ├── hooks/
│           │   ├── use-todos.ts    # { todos, error, loading } + CRUD methods
│           │   └── use-todos.test.ts
│           └── components/
│               ├── TodoList.tsx
│               ├── TodoList.test.tsx
│               ├── TodoItem.tsx
│               ├── TodoItem.test.tsx
│               ├── TodoInput.tsx
│               ├── TodoInput.test.tsx
│               ├── ErrorMessage.tsx
│               ├── ErrorMessage.test.tsx
│               ├── LoadingSpinner.tsx
│               └── LoadingSpinner.test.tsx
│
└── data/                           # Docker volume mount target for SQLite
    └── .gitkeep
```

### Architectural Boundaries

**API Boundary:**
- All API endpoints live behind `/api/` prefix
- Route handlers (`todo-routes.ts`) are the only entry point — they validate input via JSON Schema and delegate to the repository
- Route handlers NEVER contain SQL or direct DB access

**Data Access Boundary:**
- `todo-repository.ts` is the ONLY file that touches `better-sqlite3`
- Repository handles `snake_case` → `camelCase` field mapping
- Repository returns typed TypeScript objects, never raw SQL rows

**Frontend-Backend Boundary:**
- `api.ts` is the ONLY file that makes HTTP requests
- All API calls return `{ data: T | null, error: string | null }` — components never call `fetch` directly
- `useTodos` hook is the ONLY consumer of `api.ts` — components get data from the hook

**Component Boundary:**
- Components receive data via props from `App.tsx` (which uses `useTodos`)
- Components NEVER call API functions directly
- Components are purely presentational except `App.tsx` which owns state

### Requirements to Structure Mapping

| FR Category | Files |
|-------------|-------|
| Task Management (FR1–FR6) | `todo-routes.ts`, `todo-repository.ts`, `TodoList.tsx`, `TodoItem.tsx`, `TodoInput.tsx` |
| Data Persistence (FR7–FR10) | `database.ts`, `init.sql`, `todo-repository.ts` |
| UI States (FR11–FR15) | `ErrorMessage.tsx`, `LoadingSpinner.tsx`, `use-todos.ts`, `api.ts` |
| Responsive Experience (FR16–FR19) | All components + `index.css` (Tailwind) |
| API (FR20–FR24) | `todo-routes.ts`, `todo-schemas.ts` |

### Data Flow

```
User Action → Component → useTodos hook → api.ts → fetch(/api/todos)
    → Fastify route → JSON Schema validation → todo-repository → SQLite
    ← SQL result → repository (snake→camel) → JSON response
    ← api.ts ({ data, error }) → useTodos (setState) → Component re-render
```

### Development Workflow

| Command | Action |
|---------|--------|
| `pnpm dev` | Runs frontend (Vite :5173) + backend (tsx watch :3000) concurrently |
| `pnpm build` | Builds frontend (Vite) + backend (tsc) |
| `pnpm lint` | Runs Biome check across all packages |
| `pnpm format` | Runs Biome format across all packages |
| `pnpm test` | Runs Vitest (unit + integration) across all packages |
| `pnpm test:e2e` | Runs Playwright E2E tests against full stack |
| `docker compose up` | Builds and runs production image locally |

### Docker Build Strategy

**Multi-stage Dockerfile:**
1. **Stage 1 (build):** Node image, `pnpm install`, build both packages
2. **Stage 2 (production):** Minimal Node image, copy built backend + built frontend static files, run `node packages/backend/dist/server.js`

**Production serving:** Fastify serves frontend static files from `packages/frontend/dist/` via `@fastify/static`. Single container, single port.

**Volume:** `./data:/app/data` — SQLite DB file persists across container restarts.

## Architecture Validation Results

### Coherence Validation ✅

**Decision Compatibility:**
- Fastify + better-sqlite3 + JSON Schema — all native Fastify patterns, no library conflicts
- Vite + React + Tailwind — standard combination, `@tailwindcss/vite` is the official integration
- Biome handles both lint + format across both packages — no ESLint/Prettier conflict
- pnpm workspaces with two packages — zero orchestration overhead
- TypeScript strict + ESM throughout — consistent module system
- Vitest + Playwright — complementary (unit/integration vs E2E), no overlap or conflict

No contradictions found.

**Pattern Consistency:**
- Naming: `snake_case` (DB) → `camelCase` (API/code) — mapping happens in exactly one place (repository)
- Files: `kebab-case` backend, `PascalCase` React — follows ecosystem conventions
- Testing: co-located unit tests (Vitest) + dedicated E2E directory (Playwright) — clear separation
- All JSON Schema definitions serve validation + Swagger + types — no duplication

**Structure Alignment:**
- Repository pattern enforces the data access boundary
- `api.ts` → `useTodos` → Components chain enforces the frontend boundary
- Route prefix `/api/` cleanly separates API from static file serving in production

### Requirements Coverage Validation ✅

**Functional Requirements:**

| FR | Covered By | Status |
|----|-----------|--------|
| FR1–FR6 (Task CRUD) | `todo-routes.ts` + `todo-repository.ts` + `TodoList/Item/Input` | ✅ |
| FR7–FR9 (Persistence) | `better-sqlite3` + Docker volume + `init.sql` | ✅ |
| FR10 (Data fields) | `init.sql` schema: text, completed, created_at | ✅ |
| FR11 (Empty state) | Handled in `TodoList.tsx` when `todos.length === 0` | ✅ |
| FR12 (Loading) | `LoadingSpinner.tsx` + `useTodos` loading flag | ✅ |
| FR13–FR14 (Errors) | `ErrorMessage.tsx` + `api.ts` error handling | ✅ |
| FR15 (Input preservation) | `TodoInput.tsx` doesn't clear on API failure | ✅ |
| FR16–FR18 (Responsive + touch) | Tailwind responsive utilities + 44px touch targets | ✅ |
| FR19 (Keyboard nav) | Semantic HTML + focus indicators + Tailwind | ✅ |
| FR20–FR24 (API) | 4 REST endpoints + JSON Schema validation | ✅ |

**Non-Functional Requirements:**

| NFR | Architectural Support | Status |
|-----|----------------------|--------|
| NFR1 (API < 150ms) | SQLite sub-ms queries + Fastify (fastest Node.js framework) | ✅ |
| NFR2 (UI < 100ms) | React synchronous state updates | ✅ |
| NFR3–4 (FCP/TTI) | Vite tree-shaking, small bundle, no heavy dependencies | ✅ |
| NFR5 (Lighthouse > 90) | Semantic HTML, Tailwind purge, no render-blocking resources | ✅ |
| NFR7 (Input sanitization) | JSON Schema validation on all routes | ✅ |
| NFR8 (No detail leakage) | Fastify default error format, SQL errors caught in repository | ✅ |
| NFR9 (CORS) | `@fastify/cors` restricted to frontend origin | ✅ |
| NFR10–13 (Reliability) | SQLite durability, repository error handling, last-write-wins | ✅ |
| NFR14–18 (Accessibility) | Semantic HTML, Tailwind focus utilities, ARIA patterns | ✅ |
| NFR19–22 (Maintainability) | Clear patterns, < 5 min setup via Docker, documented README | ✅ |

**Coverage: 24/24 FRs, 22/22 NFRs** — no gaps.

### Implementation Readiness ✅

**Decision Completeness:** All critical technology choices documented. No ambiguous decisions remain.

**Structure Completeness:** Every file in the project tree is specified with its purpose. Boundaries are explicit.

**Pattern Completeness:** Naming, structure, format, process, and error handling patterns are all defined with concrete examples and anti-patterns.

### Gap Analysis

**Critical Gaps:** None identified.

**Minor observations (non-blocking):**
- Frontend `types/todo.ts` duplicates the type information from backend `todo-schemas.ts`. For this project size, manual sync is fine — no shared package needed.
- HTML sanitization for XSS prevention on the text field: sanitize in the repository layer before insert (strip HTML tags from todo text).

### Architecture Completeness Checklist

**✅ Requirements Analysis**
- [x] Project context thoroughly analyzed
- [x] Scale and complexity assessed (low)
- [x] Technical constraints identified
- [x] Cross-cutting concerns mapped

**✅ Architectural Decisions**
- [x] Critical decisions documented
- [x] Technology stack fully specified
- [x] Integration patterns defined
- [x] Performance considerations addressed

**✅ Implementation Patterns**
- [x] Naming conventions established
- [x] Structure patterns defined
- [x] Format patterns specified
- [x] Process patterns documented (error handling, loading)

**✅ Project Structure**
- [x] Complete directory structure defined
- [x] Component boundaries established
- [x] Integration points mapped
- [x] Requirements → structure mapping complete

**✅ Testing Strategy**
- [x] Unit + integration testing (Vitest)
- [x] Component testing (@testing-library/react)
- [x] E2E testing (Playwright)

### Architecture Readiness Assessment

**Overall Status:** READY FOR IMPLEMENTATION

**Confidence Level:** High

**Key Strengths:**
- Radically simple — every decision is the boring, obvious choice for this scope
- Zero ambiguity — AI agents have explicit patterns for every file and convention
- Clear boundaries — repository pattern, API wrapper, and component prop drilling prevent crossed wires
- Full FR/NFR coverage with no architectural gaps
- Comprehensive test coverage strategy (unit, integration, E2E)

**Areas for Future Enhancement (not needed for V1):**
- Shared type package between frontend/backend if project grows beyond one entity
- Health check endpoint for Docker monitoring


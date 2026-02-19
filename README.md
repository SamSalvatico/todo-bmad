# todo-bmad

## Project Overview
A full-stack Todo application built as a pnpm workspace monorepo with a React SPA frontend and Fastify REST API backend. The goal is a fast, predictable developer experience that gets you running locally in under five minutes.

## Tech Stack
- Node.js 24+ (ESM)
- pnpm workspaces
- Frontend: Vite + React 19 + TypeScript
- Backend: Fastify 5 + SQLite (better-sqlite3)
- Styling: Tailwind CSS
- Quality: Biome (lint + format)
- Testing: Vitest (unit/integration), Playwright (E2E)
- Docker: multi-stage build + docker-compose

## Prerequisites
- Node.js >= 24
- pnpm >= 10 (enable via `corepack enable` if needed)
- Docker (optional, for containerized run)

## Quick Start
```bash
# 1) Clone the repo
git clone <repo-url>
cd todo-bmad
# 2) Set environment variables
cp .env.example .env

# 3) Install dependencies
pnpm install

# 4) Start backend + frontend
pnpm dev
```

Open `http://localhost:5173` in your browser.

## Development
- `pnpm dev` runs both packages concurrently.
- Backend runs on `http://localhost:3000` and exposes `/api/*` plus `/health`.
- Frontend runs on `http://localhost:5173` and proxies `/api` to the backend via Vite.

Environment variables live in `.env`. The default `DB_PATH` is `./data/todos.db`, and `CORS_ORIGIN` is set to the frontend dev server.

## Architecture
### Why pnpm workspaces
Workspaces keep frontend and backend dependencies isolated while allowing a single root install and shared tooling. This is the simplest monorepo setup for a two-package project.

### Frontend-backend communication
- Development: Vite proxies `/api/*` to the Fastify server (`packages/frontend/vite.config.ts`).
- Production: Fastify serves the built frontend and keeps `/api` on the same origin.

### Backend stack
Fastify provides the REST API, and SQLite (`better-sqlite3`) stores data locally for a zero-config developer experience.

### Repository pattern
Database access is isolated in the backend repository layer, with `snake_case` SQLite fields mapped to `camelCase` API responses.

### Naming conventions
- Database: `snake_case` tables/columns
- API JSON: `camelCase`
- Backend files: `kebab-case`
- Frontend components: `PascalCase`

### Testing strategy
- Vitest for backend and frontend unit/integration tests (co-located with source files)
- Playwright for end-to-end testing against the running app

### Docker deployment
Docker uses a multi-stage build with docker-compose for local production parity.

### Key files
- Backend app factory: `packages/backend/src/app.ts`
- Backend entry point: `packages/backend/src/server.ts`
- Database connection: `packages/backend/src/db/database.ts`
- Frontend root: `packages/frontend/src/App.tsx`
- Vite config: `packages/frontend/vite.config.ts`

## Project Structure
```
.
├── .env.example               # Environment variable template
├── Dockerfile                 # Multi-stage build
├── docker-compose.yaml        # Local Docker deployment
├── package.json               # Root scripts and workspace config
├── pnpm-workspace.yaml        # Workspace package globs
├── tsconfig.base.json         # Shared TypeScript config
├── packages/
│   ├── backend/
│   │   ├── src/
│   │   │   ├── app.ts          # Fastify app factory
│   │   │   ├── server.ts       # Server entry point
│   │   │   └── db/
│   │   │       ├── database.ts # SQLite connection + init
│   │   │       └── init.sql    # Schema initialization
│   │   └── package.json
│   └── frontend/
│       ├── src/
│       │   ├── App.tsx         # Root component
│       │   ├── main.tsx        # App bootstrap
│       │   └── index.css
│       ├── public/
│       ├── vite.config.ts      # Dev server + proxy
│       └── package.json
└── README.md
```

## Scripts Reference
- `pnpm dev`: Run backend and frontend in watch mode
- `pnpm build`: Build both packages
- `pnpm test`: Run all unit/integration tests across workspaces
- `pnpm test:e2e`: Run Playwright tests (frontend package)
- `pnpm lint`: Run Biome checks
- `pnpm check`: Run Biome checks with auto-fixes
- `pnpm format`: Format code with Biome

## Docker Deployment
```bash
# Build and run the production container
cp .env.example .env
docker compose up --build
```

The container exposes `http://localhost:3000` and uses `./data` for the SQLite volume (`DB_PATH=/app/data/todos.db`).

## Performance

### Bundle Sizes (Production Build)

| Asset | Raw | Gzipped |
| ----- | --- | ------- |
| JavaScript | 200.70 KB | **63.24 KB** |
| CSS | 13.79 KB | **3.63 KB** |
| **Total** | **214.49 KB** | **66.87 KB** |

All well within targets: JS < 150 KB gzipped ✅, CSS < 10 KB gzipped ✅

### Lighthouse Scores

| Category | Target | Notes |
| -------- | ------ | ----- |
| Performance | ≥ 90 | Verify via Chrome DevTools Lighthouse |
| Accessibility | 100 | Maintained from Story 3.4 |
| Best Practices | ≥ 90 | All meta tags and favicon in place |

These are target scores based on the architecture's performance requirements. Run Lighthouse yourself in Chrome DevTools (Incognito mode) against the production build to verify — see [How to Run Lighthouse Locally](#how-to-run-lighthouse-locally) below.

### Optimization Techniques

- **Vite tree-shaking** — Rollup eliminates unused code automatically in production builds
- **Tailwind CSS v4 automatic purging** — `@tailwindcss/vite` plugin includes only styles actually used in source
- **React production build** — Vite compiles React in production mode with minification via esbuild
- **No render-blocking resources** — `<script type="module">` defers JS loading by default
- **Synchronous SQLite** — `better-sqlite3` avoids async overhead for sub-millisecond DB operations
- **Minimal dependency footprint** — Only React + React-DOM in production (no routing, state, or UI libraries)

### How to Analyze the Bundle

```bash
# Standard production build (shows sizes in output)
pnpm --filter frontend build

# Bundle visualization (opens interactive treemap)
ANALYZE=true pnpm --filter frontend build
# Opens bundle-analysis.html in your browser
```

### How to Run Lighthouse Locally

```bash
# Option 1: Docker
docker compose up --build
# Open Chrome DevTools → Lighthouse on http://localhost:3000

# Option 2: Manual
pnpm build
NODE_ENV=production node packages/backend/dist/server.js
# Open Chrome DevTools → Lighthouse on http://localhost:3000
```

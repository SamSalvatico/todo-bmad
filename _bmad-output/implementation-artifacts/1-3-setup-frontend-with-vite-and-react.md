# Story 1.3: Setup Frontend with Vite and React

Status: ready-for-dev

## Story

As a developer,
I want a Vite-powered React frontend with Tailwind CSS and TypeScript,
So that I can build a fast, modern UI with hot module replacement.

## Acceptance Criteria

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

## Tasks / Subtasks

- [ ] Initialize Vite React TypeScript template (AC: frontend package setup)
  - [ ] Navigate to `packages/frontend/` directory
  - [ ] Run `pnpm create vite . -- --template react-ts` to scaffold React + TypeScript + Vite
  - [ ] Verify files created: `index.html`, `src/main.tsx`, `src/App.tsx`, `vite.config.ts`, `tsconfig.json`
  - [ ] Review generated package.json - note Vite+React versions

- [ ] Update frontend package.json metadata (AC: frontend package setup)
  - [ ] Set `"name": "@todo-bmad/frontend"` to match monorepo naming pattern from Story 1.1
  - [ ] Set `"version": "0.1.0"`
  - [ ] Set `"private": true`
  - [ ] Add `"description": "React frontend for Todo application"`
  - [ ] Verify `"type": "module"` exists (Vite default, required for ESM)

- [ ] Install additional frontend dependencies (AC: frontend package setup)
  - [ ] Add `tailwindcss` and `@tailwindcss/vite` as dev dependencies
  - [ ] Run `pnpm install` from packages/frontend/
  - [ ] Verify all dependencies install successfully without conflicts
  - [ ] Check that React 19.x is installed (architecture requirement)

- [ ] Configure TypeScript for frontend (AC: frontend package setup)
  - [ ] Edit `packages/frontend/tsconfig.json` to extend `../../tsconfig.base.json`
  - [ ] Add frontend-specific compiler options: `"jsx": "react-jsx"`, `"jsxImportSource": "react"`
  - [ ] Configure `"include": ["src"]` and `"exclude": ["dist", "node_modules"]`
  - [ ] Create `tsconfig.node.json` for Vite config file (if not generated)
  - [ ] Verify TypeScript recognizes configuration: `pnpm tsc --noEmit`

- [ ] Configure Tailwind CSS (AC: Tailwind setup)
  - [ ] Replace `packages/frontend/src/index.css` content with: `@import "tailwindcss";`
  - [ ] Ensure index.css is imported in `src/main.tsx`
  - [ ] Create `packages/frontend/vite.config.ts` if not exists
  - [ ] Add `@tailwindcss/vite` plugin to Vite config
  - [ ] Test Tailwind utilities render correctly by adding a test class to App.tsx

- [ ] Configure Vite proxy for API requests (AC: Tailwind setup + API proxy)
  - [ ] Edit `packages/frontend/vite.config.ts`
  - [ ] Add server.proxy configuration: `'/api': { target: 'http://localhost:3000', changeOrigin: true }`
  - [ ] Ensure changeOrigin is true (required for CORS handling in development)
  - [ ] Add comment explaining proxy routes `/api/*` to backend during development

- [ ] Setup development scripts (AC: frontend running)
  - [ ] Verify Vite default scripts in package.json: `dev`, `build`, `preview`
  - [ ] Ensure `"dev": "vite"` starts dev server on port 5173
  - [ ] Ensure `"build": "vite build"` outputs to `dist/`
  - [ ] Add `"preview": "vite preview"` for testing production builds locally

- [ ] Verify frontend functionality independently (AC: frontend running)
  - [ ] Run `pnpm --filter frontend dev` from project root
  - [ ] Verify Vite dev server starts on http://localhost:5173
  - [ ] Verify default Vite + React page renders with no console errors
  - [ ] Test Hot Module Replacement: edit App.tsx, save, verify hot reload
  - [ ] Test Tailwind: add utility class like `text-blue-500`, verify styling applies

- [ ] Verify API proxy configuration with backend (AC: API proxy)
  - [ ] Start backend server: `pnpm --filter backend dev` (in separate terminal)
  - [ ] Start frontend server: `pnpm --filter frontend dev` (in separate terminal)
  - [ ] Open browser DevTools Network tab
  - [ ] Test proxy by visiting `http://localhost:5173/api/` in browser
  - [ ] Verify request is proxied to backend (should show Swagger/404, not Vite 404)
  - [ ] Check backend logs to confirm request was received

- [ ] Clean up default Vite template (AC: basic app renders)
  - [ ] Simplify `packages/frontend/src/App.tsx` to minimal "Todo App" heading
  - [ ] Remove unnecessary assets from `src/assets/` (keep only if needed)
  - [ ] Update `index.html` title to "Todo App"
  - [ ] Verify clean app renders at http://localhost:5173 with no errors

## Dev Notes

### Critical Architecture Requirements

**⚠️ VITE VERSION:**
- Use Vite **6.x** (latest stable)
- Vite is the build tool and dev server (fast HMR, native ESM)
- Reference: [Architecture.md#Starter Template](../../_bmad-output/planning-artifacts/architecture.md#selected-starter-pnpm-workspaces-manual-scaffold)

**⚠️ REACT VERSION:**
- Use React **19.x** (latest stable)
- React DOM must match React version exactly
- No extra state library needed - `useState`/`useEffect` sufficient for this scope
- Reference: [Architecture.md#Frontend Architecture](../../_bmad-output/planning-artifacts/architecture.md#frontend-architecture)

**⚠️ TAILWIND CSS:**
- Use `@tailwindcss/vite` plugin (Tailwind v4 integration)
- Single import in index.css: `@import "tailwindcss";`
- **NO** tailwind.config.js or postcss.config.js needed with v4 Vite plugin
- Automatic purging in production builds (tree-shaking)
- Reference: [Architecture.md#Frontend Architecture](../../_bmad-output/planning-artifacts/architecture.md#frontend-architecture)

**TypeScript Configuration:**
- Must extend `tsconfig.base.json` from root (strict mode enabled)
- Use `"jsx": "react-jsx"` (React 17+ JSX transform - no import React needed)
- Vite requires separate `tsconfig.node.json` for config files
- Reference: [Architecture.md#Starter Template](../../_bmad-output/planning-artifacts/architecture.md#selected-starter-pnpm-workspaces-manual-scaffold)

**Development Proxy:**
- Vite dev server proxies `/api/*` to Fastify backend (`http://localhost:3000`)
- Required for CORS-free development (both served from localhost:5173)
- In production, Fastify will serve static frontend files (Story 1.6)
- Reference: [Architecture.md#Infrastructure & Deployment](../../_bmad-output/planning-artifacts/architecture.md#infrastructure--deployment)

### Frontend File Structure (Story 1.3 Scope)

```
packages/frontend/
├── package.json               # @todo-bmad/frontend
├── tsconfig.json              # Extends ../../tsconfig.base.json
├── tsconfig.node.json         # For vite.config.ts
├── vite.config.ts             # Tailwind plugin + API proxy
├── index.html                 # SPA entry point
├── public/
│   └── favicon.svg            # (Vite default)
└── src/
    ├── main.tsx               # React root render
    ├── App.tsx                # Root component (simplified for now)
    └── index.css              # Tailwind import
```

**NOT in Story 1.3 scope** (future stories):
- `components/` — Story 2.4 (Create Core Todo UI Components)
- `hooks/` — Story 2.5 (useTodos hook)
- `types/` — Story 2.3 (API wrapper and type definitions)
- `api.ts` — Story 2.3 (Frontend API wrapper)
- Tests — Story 1.5 (Setup Testing Infrastructure)

### Naming Conventions (MANDATORY)

**Frontend File Naming:**
- Components: `PascalCase` (`TodoItem.tsx`, `TodoList.tsx`)
- Utility files: `kebab-case` (`api.ts`, `use-todos.ts`)
- Hooks: `use-*` prefix (`use-todos.ts`)
- Types: `PascalCase` (`Todo`, `ApiResult`)
- Constants: `UPPER_SNAKE_CASE` (`API_BASE_URL`)

**Package Naming:**
- Frontend package: `@todo-bmad/frontend` (matches backend: `@todo-bmad/backend`)
- Scoped, private packages (monorepo pattern from Story 1.1)

Reference: [Architecture.md#Naming Patterns](../../_bmad-output/planning-artifacts/architecture.md#naming-patterns)

### Vite Configuration Pattern

```typescript
// packages/frontend/vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
});
```

**Critical:**
- `@vitejs/plugin-react` for React Fast Refresh (HMR)
- `@tailwindcss/vite` for Tailwind v4 integration
- Proxy configuration routes ALL `/api/*` requests to backend during development
- `changeOrigin: true` required for proper CORS handling

Reference: [Architecture.md#Frontend Architecture](../../_bmad-output/planning-artifacts/architecture.md#frontend-architecture)

### TypeScript Configuration

**packages/frontend/tsconfig.json:**

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "react",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "target": "ES2020",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "allowImportingTsExtensions": true,
    "noEmit": true
  },
  "include": ["src"],
  "exclude": ["dist", "node_modules"]
}
```

**packages/frontend/tsconfig.node.json** (for Vite config):

```json
{
  "compilerOptions": {
    "composite": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "types": ["node"]
  },
  "include": ["vite.config.ts"]
}
```

**Critical:**
- Must extend root `tsconfig.base.json` (has `strict: true` from Story 1.1)
- `"jsx": "react-jsx"` enables new JSX transform (no `import React` needed)
- `"noEmit": true` because Vite handles bundling, TypeScript only for type checking
- Separate config for Vite config file to avoid conflicts

Reference: [Architecture.md#Implementation Patterns](../../_bmad-output/planning-artifacts/architecture.md#implementation-patterns--consistency-rules)

### Tailwind CSS Setup (v4 with Vite Plugin)

**packages/frontend/src/index.css:**

```css
@import "tailwindcss";
```

That's it! No other Tailwind config needed with v4 Vite plugin.

**Key differences from Tailwind v3:**
- **NO** `tailwind.config.js` required
- **NO** PostCSS config required
- **NO** `@tailwind base/components/utilities` directives
- Single import in CSS: `@import "tailwindcss";`
- Automatic purging in production (Vite tree-shaking)

**Customization (if needed in future stories):**
- Use CSS variables in index.css for theme customization
- Use `@layer` directives for custom utilities
- Reference: Tailwind v4 docs

Reference: [Architecture.md#Frontend Architecture](../../_bmad-output/planning-artifacts/architecture.md#frontend-architecture)

### Package Scripts

**packages/frontend/package.json:**

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

**From root:**
- `pnpm --filter frontend dev` → starts Vite dev server on port 5173
- `pnpm --filter frontend build` → builds production bundle to `dist/`
- `pnpm --filter frontend preview` → preview production build locally

**Root-level concurrent dev command** (Story 1.7, but mentioned for context):
- `pnpm dev` will later run both frontend and backend concurrently

Reference: [Architecture.md#Development Workflow](../../_bmad-output/planning-artifacts/architecture.md#development-workflow)

### Previous Story Learnings (From Stories 1.1 & 1.2)

**Workspace Filter Commands:**
- Use `pnpm --filter frontend <command>` to target frontend package
- Shorthand works: `pnpm --filter frontend` (pnpm matches partial names)
- From root: `pnpm --filter frontend dev` runs dev script in frontend package only

**Package Naming Pattern:**
- Frontend: `@todo-bmad/frontend` (scoped, matches backend naming from Story 1.2)
- Private packages (`"private": true` in package.json)

**TypeScript Strict Mode:**
- Root `tsconfig.base.json` has `"strict": true` enabled (Story 1.1)
- All packages must extend this base config
- No `any` types without explicit annotation

**Environment Setup:**
- `.env.example` exists at root (Story 1.1)
- Environment variables read from root `.env` file
- Frontend doesn't need env vars yet (future stories will add API_BASE_URL)

**Git Commit Patterns from Story 1.2:**
- `feat: start story 1-2` → Start new story
- `feat: finished 1-2` → Complete implementation
- `fix: reviewed 1.2` → Post-review fixes
- Follow same pattern for Story 1.3

Reference: 
- [Story 1.1](./1-1-initialize-monorepo-with-pnpm-workspaces.md)
- [Story 1.2](./1-2-setup-backend-with-fastify-and-typescript.md)

### API Proxy Behavior (Development vs Production)

**Development (Story 1.3 - current):**
- Frontend: `http://localhost:5173` (Vite dev server)
- Backend: `http://localhost:3000` (Fastify)
- Vite proxies `/api/*` → backend automatically
- Frontend code uses relative URLs: `fetch('/api/todos')`
- No CORS issues (requests appear same-origin)

**Production (Story 1.6 - future):**
- Single server: Fastify serves frontend static files + API
- Single port: `http://localhost:3000`
- Fastify `@fastify/static` plugin serves `packages/frontend/dist/`
- Same relative URLs work: `fetch('/api/todos')` (truly same-origin)
- No proxy needed

**Critical for developers:**
- Always use relative URLs starting with `/api/` in frontend code
- Never hardcode `http://localhost:3000` in fetch calls
- Proxy config is dev-only convenience

Reference: [Architecture.md#Infrastructure & Deployment](../../_bmad-output/planning-artifacts/architecture.md#infrastructure--deployment)

### Testing the Setup

**Verify Vite works:**
```bash
pnpm --filter frontend dev
# Should start on http://localhost:5173
# Visit in browser, see Vite + React default page
```

**Verify HMR works:**
```tsx
// Edit src/App.tsx - add some text
<h1 className="text-blue-600">Todo App</h1>
// Save file - browser should hot reload without full refresh
```

**Verify Tailwind works:**
```tsx
// In App.tsx, add Tailwind utilities
<div className="bg-blue-500 text-white p-4">
  Tailwind is working!
</div>
// Should show blue background with white text
```

**Verify proxy works:**
```bash
# Terminal 1: Start backend
pnpm --filter backend dev

# Terminal 2: Start frontend
pnpm --filter frontend dev

# Browser: Visit http://localhost:5173/api/
# Should show Swagger UI or Fastify 404 (proves proxy works)
# Check backend logs - should show request received
```

**Verify TypeScript works:**
```bash
# From packages/frontend/
pnpm exec tsc --noEmit
# Should show no errors (or only Vite-related ones, which are expected)
```

### Common Pitfalls to Avoid

**❌ DON'T:**
- Don't create `tailwind.config.js` (not needed with v4 Vite plugin)
- Don't create `postcss.config.js` (not needed with v4 Vite plugin)
- Don't use old Tailwind v3 directives (`@tailwind base`, etc.)
- Don't forget to extend `tsconfig.base.json`
- Don't hardcode backend URL in fetch calls (use relative `/api/`)
- Don't use `npm` or `yarn` (use `pnpm` for consistency)
- Don't forget `changeOrigin: true` in proxy config

**✅ DO:**
- Use `@import "tailwindcss";` in index.css (Tailwind v4 way)
- Extend `../../tsconfig.base.json` in frontend tsconfig
- Use relative URLs (`/api/*`) for all API calls
- Use `pnpm --filter frontend <command>` for frontend tasks
- Test HMR, Tailwind, and proxy before marking story complete
- Keep App.tsx simple for now (detailed components come later)

### Performance Considerations (Future Context)

**Bundle Size Targets (Story 3.5 - for reference):**
- Main JS bundle: < 150KB gzipped
- CSS bundle: < 10KB gzipped
- Vite automatically tree-shakes unused code in production
- Tailwind automatically purges unused styles

**Current Story Scope:**
- Just get Vite, React, and Tailwind working
- Performance optimization is Epic 3 concern
- But using Vite+Tailwind sets up for easy optimization later

Reference: [Epics.md - Story 3.5](../../_bmad-output/planning-artifacts/epics.md#story-35-optimize-performance-bundle-size-fcp-tti-lighthouse)

### Architecture References

All architectural decisions for this story are documented in:
- [Architecture.md - Frontend Architecture](../../_bmad-output/planning-artifacts/architecture.md#frontend-architecture)
- [Architecture.md - Starter Template](../../_bmad-output/planning-artifacts/architecture.md#selected-starter-pnpm-workspaces-manual-scaffold)
- [Architecture.md - Project Structure](../../_bmad-output/planning-artifacts/architecture.md#project-structure--boundaries)

### Next Steps After Story 1.3

**Story 1.4:** Configure Code Quality Tools (Biome, TypeScript strict)
- Will add linting and formatting for frontend
- Biome will check both frontend and backend
- TypeScript strict mode already configured via tsconfig.base.json

**Story 1.5:** Setup Testing Infrastructure (Vitest, Playwright)
- Will add Vitest for frontend unit/component tests
- Will add Playwright for E2E tests
- Frontend will get `@testing-library/react` for component testing

**Story 1.6:** Configure Docker for Local Deployment
- Fastify will serve built frontend static files
- Single container, single port in production
- Frontend dist/ will be copied to Docker image

**Story 1.7:** Create Comprehensive README and Development Scripts
- Will add `pnpm dev` at root to run both frontend + backend
- Will document the complete development workflow
- Will explain the Vite proxy setup

Reference: [Epics.md - Epic 1](../../_bmad-output/planning-artifacts/epics.md#epic-1-project-foundation--development-infrastructure)

## Dev Agent Record

### Agent Model Used

_To be filled by dev agent_

### Debug Log References

_To be filled by dev agent_

### Completion Notes List

_To be filled by dev agent_

### File List

_To be filled by dev agent after implementation_

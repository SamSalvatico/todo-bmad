# Story 1.6: Configure Docker for Local Deployment

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a developer,
I want Docker configuration for local deployment with data persistence,
so that I can run the production build locally and test the full deployment.

## Acceptance Criteria

1. Multi-stage `Dockerfile` at repo root.
2. Build stage uses Node image, runs `pnpm install`, builds both packages with `pnpm build`.
3. Production stage uses minimal Node image, copies `packages/backend/dist/` and `packages/frontend/dist/`, sets `NODE_ENV=production`.
4. CMD runs `node packages/backend/dist/server.js`.
5. `docker-compose.yaml` defines single service `app`, exposes port 3000, mounts `./data:/app/data`, uses `.env`.
6. Root build scripts exist: `pnpm --filter backend build && pnpm --filter frontend build` plus per-package `build` scripts.
7. `docker compose build` succeeds; `docker compose up` serves app at `http://localhost:3000` and creates SQLite DB in `./data/`.
8. Data persists across container restarts.

## Tasks / Subtasks

- [ ] Dockerfile (AC: 1-4)
  - [ ] Add multi-stage build with Node LTS image for build
  - [ ] Enable Corepack and use repo `pnpm-lock.yaml`
  - [ ] Build both packages and copy `dist/` outputs into production image
  - [ ] Use minimal Node runtime image and `NODE_ENV=production`
  - [ ] Set CMD to `node packages/backend/dist/server.js`
- [ ] docker-compose.yaml (AC: 5)
  - [ ] Define `app` service with build context at repo root
  - [ ] Expose `3000:3000`
  - [ ] Mount volume `./data:/app/data`
  - [ ] Load environment variables from `.env`
- [ ] Build scripts (AC: 6)
  - [ ] Update root `package.json` build script to `pnpm --filter backend build && pnpm --filter frontend build`
  - [ ] Confirm backend `build` uses `tsc`
  - [ ] Confirm frontend `build` uses `vite build`
- [ ] Production static serving (AC: 7)
  - [ ] Register `@fastify/static` to serve `packages/frontend/dist` in production
  - [ ] Ensure path and index handling work in container
- [ ] Verification (AC: 7-8)
  - [ ] `docker compose build`
  - [ ] `docker compose up` and verify `http://localhost:3000`
  - [ ] Restart container and verify SQLite data persists

## Dev Notes

- Root `package.json` currently uses placeholder `build` script and engines require Node >= 24.0.0. Docker base image must align with Node 24 LTS.
- `.env.example` includes `DB_PATH=./data/todos.db`; container workdir should be `/app` so this resolves to `/app/data/todos.db` with the volume mount.
- Backend already has `@fastify/static` dependency but does not register it in `createApp()`.

### Project Structure Notes

- Add `Dockerfile` and `docker-compose.yaml` at repo root.
- Use existing `data/` folder for volume mount target.

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 1.6]
- [Source: _bmad-output/planning-artifacts/architecture.md#Docker]
- [Source: _bmad-output/planning-artifacts/architecture.md#Infrastructure & Deployment]
- [Source: .env.example]

## Developer Context

### Technical Requirements

- Use multi-stage Docker build.
- Build stage must run `pnpm install` and `pnpm build` from repo root.
- Production stage must only include built `dist` outputs and runtime dependencies.
- Runtime must start via `node packages/backend/dist/server.js`.

### Architecture Compliance

- Fastify serves built frontend static files via `@fastify/static` in production.
- Single container, single port (3000) for production.
- SQLite data persisted via host volume `./data:/app/data`.

### Library / Framework Requirements

- Use Node official images (LTS line) for build and runtime stages.
- Use Corepack to ensure `pnpm@10` (per root `packageManager`) inside the image.

### File Structure Requirements

- `Dockerfile` at repo root.
- `docker-compose.yaml` at repo root.
- Do not create additional Docker files in packages.

### Testing Requirements

- `docker compose build` succeeds without warnings.
- `docker compose up` serves the SPA at `http://localhost:3000`.
- Verify database file under `./data/` persists after container restart.

### Previous Story Intelligence

- Tests and tooling are already set up; keep Biome formatting conventions.
- Playwright webServer config expects backend `GET /health` endpoint (already present).

### Git Intelligence Summary

- Recent commits include implementation and review work for story 1.6; verify existing changes before adding new Docker assets.

### Latest Tech Information

- Node.js LTS reported as v24.13.1; latest current release v25.6.1. Prefer Node 24 LTS for production images.
- Docker Hub Node image tags include `24-bookworm`, `24-bookworm-slim`, and `lts` / `lts-slim` aliases.

### Project Context Reference

- No project-context.md found.

## Dev Agent Record

### Agent Model Used

GPT-5.2-Codex

### Debug Log References

### Completion Notes List

### File List

## Story Completion Status

Status set to ready-for-dev.
Ultimate context engine analysis completed - comprehensive developer guide created.

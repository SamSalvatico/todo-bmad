# Story 1.7: Create Comprehensive README and Development Scripts

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a developer,
I want clear documentation and convenient development scripts,
so that I can get started in under 5 minutes and understand the project structure.

## Acceptance Criteria

1. Root README includes sections: Project Overview, Tech Stack, Prerequisites, Quick Start, Development, Architecture, Project Structure, Scripts Reference, Docker Deployment.
2. Quick Start shows: clone repo, `cp .env.example .env`, `pnpm install`, `pnpm dev`, visit `http://localhost:5173`.
3. Architecture section explains: monorepo structure, frontend (Vite + React), backend (Fastify + SQLite), testing strategy, Docker deployment.
4. Project Structure shows the directory tree with file descriptions.
5. Scripts Reference documents all pnpm commands with explanations.
6. Root `package.json` scripts include:
   - `dev`: `concurrently "pnpm --filter backend dev" "pnpm --filter frontend dev"`
   - `test`: `pnpm --recursive test`
   - `test:e2e`: `pnpm --filter frontend test:e2e`
   - `lint`: `biome check .`
   - `format`: `biome format --write .`
   - `build`: `pnpm --filter backend build && pnpm --filter frontend build`
7. Root `package.json` includes `concurrently` as a dev dependency.
8. New developer can run `pnpm install` and `pnpm dev` successfully; backend on 3000, frontend on 5173, total setup under 5 minutes.
9. README explains why pnpm workspaces are used, frontend-backend communication, repository pattern, naming conventions (snake_case DB, camelCase API), and test strategy (Vitest + Playwright).
10. README points to key files: `app.ts`, `server.ts`, `database.ts`, `App.tsx`, `vite.config.ts`.

## Tasks / Subtasks

- [x] Author comprehensive root README (AC: 1-5, 8-10)
  - [x] Add Project Overview, Tech Stack, Prerequisites, Quick Start
  - [x] Document Development, Architecture, Project Structure, Scripts Reference, Docker Deployment
  - [x] Include directory tree with descriptions and key file callouts
- [x] Add development scripts and dependency updates in root `package.json` (AC: 6-7)
  - [x] Add `concurrently` to devDependencies
  - [x] Add `dev`, `test`, `test:e2e`, `lint`, `format`, `build` scripts
- [x] Verify documented commands (AC: 8)
  - [x] Run `pnpm install` and `pnpm dev` locally
  - [x] Confirm ports and startup messages align with README

## Dev Notes

### Technical Requirements

- Root README must reflect the current monorepo structure and stack (pnpm workspaces, Vite + React, Fastify + SQLite).
- README must describe API and data flow boundaries (repository pattern, API wrapper) and naming conventions (snake_case DB, camelCase API).
- Scripts should align with existing tooling (Biome, Vitest, Playwright) and existing build process.
- `concurrently` should be added as a dev dependency and used for `pnpm dev` per current recommended usage.

### Architecture Compliance

- Maintain single repo README at root that documents architecture, setup, and scripts.
- Align structure descriptions with documented project structure and boundaries.

### Library / Framework Requirements

- `concurrently` version on npm is 9.2.1 (latest) and supports `pnpm` usage; use quoted commands in scripts.
- Keep dependency additions minimal and limited to dev tooling.

### File Structure Requirements

- README is at repo root: `README.md`.
- Root `package.json` scripts are the canonical entry points for local dev/test/build.

### Testing Requirements

- No new automated tests required; validate that documented commands work and do not regress existing scripts.
- Preserve existing Vitest and Playwright test commands.

### Previous Story Intelligence

- Docker story 1.6 noted Node 24 LTS alignment and Corepack usage in container builds.
- Keep README aligned with `.env.example` (DB_PATH and `/app` working directory when using Docker).
- Playwright webServer config expects backend `GET /health` endpoint to exist.

### Git Intelligence Summary

- Recent commits are all story 1.6 Docker-focused; README updates should align with current Docker and build behavior.

### Latest Tech Information

- `concurrently` 9.2.1 recommends local devDependency installation and quoted command strings in package scripts.

### Project Context Reference

- No project-context.md found.

## Project Structure Notes

- Ensure README tree matches the architecture document structure and actual `packages/frontend` and `packages/backend` layout.
- Call out the primary entry points (`packages/backend/src/server.ts`, `packages/frontend/src/main.tsx`).
- Document the `/api` proxy in Vite dev configuration and the production static serving via Fastify.

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 1.7]
- [Source: _bmad-output/planning-artifacts/architecture.md#Project Structure]
- [Source: _bmad-output/planning-artifacts/architecture.md#Development Workflow]
- [Source: _bmad-output/planning-artifacts/prd.md#Journey 3: Jamie — The Developer Extending the Codebase]
- [Source: _bmad-output/implementation-artifacts/1-6-configure-docker-for-local-deployment.md#Dev Notes]
- [Source: https://www.npmjs.com/package/concurrently]

## Dev Agent Record

### Agent Model Used

GPT-5.2-Codex

### Debug Log References

- None.

### Completion Notes List

- Authored root README with setup, architecture, structure, and scripts reference.
- Updated root scripts and added `concurrently` dev dependency.
- Verified `pnpm install`, `pnpm dev`, and `pnpm test` (ports 3000/5173).
- Excluded backend `dist` output from Vitest to avoid duplicate compiled test runs.

### File List

- README.md
- package.json
- pnpm-lock.yaml
- packages/backend/vitest.config.ts
- _bmad-output/implementation-artifacts/1-7-create-comprehensive-readme-and-development-scripts.md

## Change Log

- 2026-02-17: Added root README, updated root scripts and dependencies, validated dev workflow, and fixed backend test runner exclusions.

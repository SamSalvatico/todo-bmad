# Story 2.2: Create Todo CRUD API Endpoints with Validation

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a developer,
I want RESTful API endpoints with JSON Schema validation and Swagger documentation,
so that the frontend can perform all todo operations with proper error handling.

## Acceptance Criteria

1. **Schemas**: `packages/backend/src/schemas/todo-schemas.ts` exports `createTodoSchema`, `updateTodoSchema`, and `todoParamsSchema`.
2. **Create schema**: `createTodoSchema` validates `{ body: { type: 'object', properties: { text: { type: 'string', minLength: 1, maxLength: 500 } }, required: ['text'] } }`.
3. **Update schema**: `updateTodoSchema` validates `{ body: { type: 'object', properties: { completed: { type: 'boolean' } }, required: ['completed'] } }`.
4. **Params schema**: `todoParamsSchema` validates `{ params: { type: 'object', properties: { id: { type: 'number' } }, required: ['id'] } }`.
5. **Routes file**: `packages/backend/src/routes/todo-routes.ts` exports a Fastify plugin that registers CRUD routes.
6. **GET /api/todos**: Calls `todoRepository.getAll()` and returns JSON array with status 200.
7. **POST /api/todos**: Validates with `createTodoSchema`, sanitizes text, calls `todoRepository.create()`, returns created todo with status 201.
8. **PATCH /api/todos/:id**: Validates with `updateTodoSchema` and `todoParamsSchema`, calls `todoRepository.update()`, returns updated todo (200) or 404 if missing.
9. **DELETE /api/todos/:id**: Validates with `todoParamsSchema`, calls `todoRepository.delete()`, returns 204 on success or 404 if missing.
10. **App registration**: `packages/backend/src/app.ts` registers the `todo-routes` plugin and passes the `TodoRepository` instance to routes.
11. **Swagger docs**: Swagger UI at `/docs` includes all todo endpoints with request/response schemas.
12. **Route tests**: `packages/backend/src/routes/todo-routes.test.ts` verifies CRUD behavior and validation errors, including: missing text (400), text > 500 (400), invalid id (404), and HTML sanitization.
13. **Validation errors**: Fastify returns `{ statusCode, error, message }` format on invalid requests.

## Tasks / Subtasks

- [ ] Define JSON Schemas (AC: 1-4)
  - [ ] Add request schemas for create/update
  - [ ] Add params schema for `:id`
  - [ ] Add response schemas for Swagger (single todo, list, error, 404)
- [ ] Implement todo routes plugin (AC: 5-9)
  - [ ] Wire repository to route handlers via plugin options
  - [ ] Implement GET/POST/PATCH/DELETE with correct status codes
  - [ ] Add sanitization step for todo text before create
  - [ ] Return 404 for missing update/delete targets
- [ ] Register routes in app (AC: 10-11)
  - [ ] Instantiate `TodoRepository` with `app.db`
  - [ ] Register routes with plugin options
- [ ] Add integration tests (AC: 12-13)
  - [ ] Use `app.inject()` with in-memory DB
  - [ ] Cover CRUD happy paths and validation failures
  - [ ] Verify sanitization behavior
- [ ] Verify `pnpm --filter backend test` passes

## Dev Notes

### Developer Context

- Repository pattern is mandatory; no SQL in route handlers. Use `TodoRepository` from Story 2.1.
- Fastify JSON Schema validation is the primary validation layer. Avoid manual validation in handlers.
- Error responses must use Fastify default format (no custom error wrapper).
- API responses must be direct JSON (no `data` wrapper).
- API JSON uses `camelCase` fields only.

### Technical Requirements

- Use `@fastify/swagger` request/response schemas for all routes to populate `/docs`.
- Add text sanitization for create requests to prevent XSS. Sanitize before calling `todoRepository.create()`.
- Status codes: 200 (GET, PATCH), 201 (POST), 204 (DELETE), 404 for missing id on update/delete.
- `PATCH` only updates `completed` state; no text updates in this endpoint.

### Architecture Compliance

- Follow naming conventions: `todo-routes.ts`, `todo-schemas.ts`, `todo-routes.test.ts`.
- Keep tests co-located with routes.
- Do not introduce new global state or custom error formats.

### Library / Framework Requirements

- Backend stack: Fastify v5, `@fastify/swagger`, `@fastify/swagger-ui`, `@fastify/env`, `@fastify/cors`, `better-sqlite3`.
- If adding sanitization dependency, keep it minimal and server-side only. Prefer a small, well-known HTML sanitizer.

### File Structure Requirements

**Create:**
- `packages/backend/src/schemas/todo-schemas.ts`
- `packages/backend/src/routes/todo-routes.ts`
- `packages/backend/src/routes/todo-routes.test.ts`

**Modify:**
- `packages/backend/src/app.ts` (register routes + instantiate repository)

### Testing Requirements

- Use `createApp()` and `app.inject()` for integration tests.
- Use `:memory:` DB path or temp DB to keep tests isolated.
- Test cases:
  - GET returns empty array initially
  - POST creates todo, returns 201, persisted
  - PATCH toggles `completed`, returns updated todo
  - DELETE returns 204 and removes todo
  - POST without text returns 400
  - POST with text length > 500 returns 400
  - PATCH/DELETE for missing id returns 404
  - Sanitization: HTML input is stripped/escaped

### Previous Story Intelligence

- Story 2.1 added `TodoRepository` with synchronous methods and camelCase mapping.
- Repository throws on empty text; schema validation should prevent this path.
- Types are in `packages/backend/src/types/todo.ts` and should be reused.

### Git Intelligence Summary

- Recent commits finalize Story 2.1 and code review fixes; repository layer is stable.
- No recent route or schema work exists; this story introduces new route + schema layers.

### Latest Tech Information

- No external research required beyond current stack.
- Keep to Fastify v5 and existing dependencies already pinned in `packages/backend/package.json`.

### Project Context Reference

- Epic 2 story definition and constraints: `_bmad-output/planning-artifacts/epics.md`.
- Architecture guardrails: `_bmad-output/planning-artifacts/architecture.md`.

## Dev Agent Record

### Agent Model Used

GPT-5.2-Codex

### Debug Log References

None

### Completion Notes List

- Ultimate context engine analysis completed - comprehensive developer guide created

### File List

**To be created:**
- `packages/backend/src/schemas/todo-schemas.ts`
- `packages/backend/src/routes/todo-routes.ts`
- `packages/backend/src/routes/todo-routes.test.ts`

**To be modified:**
- `packages/backend/src/app.ts`

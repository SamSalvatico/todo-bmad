# Story 2.3: Build Frontend API Wrapper and Type Definitions

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a developer,
I want a typed API wrapper that handles all HTTP requests with consistent error handling,
so that components never call fetch directly and errors are handled uniformly.

## Acceptance Criteria

1. **Types**: `packages/frontend/src/types/todo.ts` exports `Todo`, `CreateTodoRequest`, and `ApiResult<T>`.
2. **Todo type**: `Todo` matches backend shape: `id: number`, `text: string`, `completed: boolean`, `createdAt: string`.
3. **Create request**: `CreateTodoRequest` is `{ text: string }`.
4. **ApiResult**: `{ data: T | null, error: string | null }` and used by all API functions.
5. **API wrapper**: `packages/frontend/src/api.ts` exports `getTodos()`, `createTodo(text)`, `updateTodo(id, completed)`, `deleteTodo(id)`.
6. **Return shape**: All API functions return `Promise<ApiResult<T>>` with `{ data, error }` semantics.
7. **Error handling**: Network failures return `Network error. Please try again.`
8. **HTTP errors**: Non-2xx responses return error from JSON body `message` when present, otherwise `response.statusText`.
9. **Parse safety**: JSON parse errors are caught and return a readable error message.
10. **Tests**: `packages/frontend/src/api.test.ts` covers success + failure for GET/POST/PATCH/DELETE, network error, and error-body parsing.

## Tasks / Subtasks

- [x] Define shared frontend types (AC: 1-4)
  - [x] Create `packages/frontend/src/types/todo.ts` with `Todo`, `CreateTodoRequest`, `ApiResult<T>`
- [x] Implement API wrapper (AC: 5-9)
  - [x] Add `getTodos()` for `GET /api/todos`
  - [x] Add `createTodo(text)` for `POST /api/todos`
  - [x] Add `updateTodo(id, completed)` for `PATCH /api/todos/:id`
  - [x] Add `deleteTodo(id)` for `DELETE /api/todos/:id`
  - [x] Centralize response parsing + error extraction
- [x] Add unit tests (AC: 10)
  - [x] Mock `fetch` for success and failure paths
  - [x] Validate error parsing from JSON and statusText fallback

## Dev Notes

### Developer Context

- Frontend must never call `fetch` directly; `api.ts` is the only HTTP entry point.
- `useTodos` is the only consumer of `api.ts` (components stay presentational).
- API responses are direct JSON (no `data` wrapper). Error responses follow Fastify default `{ statusCode, error, message }`.
- Keep the wrapper minimal and typed; no HTTP client libraries.

### Technical Requirements

- Use native `fetch` and return `ApiResult<T>` for all endpoints.
- For non-2xx responses, try `await response.json()` and read `message` if present.
- If JSON parsing fails (invalid JSON, empty body), return `response.statusText` or a generic `Unexpected response from server.` message.
- For network failures (fetch throws), return `Network error. Please try again.`
- For `DELETE`, treat 204 as success and return `{ data: null, error: null }` (or `ApiResult<void>`).

### Architecture Compliance

- Follow file and naming conventions in architecture docs (kebab-case for utilities, types in `src/types`).
- Keep tests co-located with source (`api.test.ts` next to `api.ts`).
- Do not introduce a shared package or extra abstractions for this scope.

### File Structure Requirements

**Create:**
- `packages/frontend/src/types/todo.ts`
- `packages/frontend/src/api.ts`
- `packages/frontend/src/api.test.ts`

### Testing Requirements

- Use Vitest to mock `global.fetch` (or `vi.stubGlobal`).
- Test cases:
  - `getTodos` returns list on 200
  - `createTodo` returns created todo on 201
  - `updateTodo` returns updated todo on 200
  - `deleteTodo` returns success on 204
  - Non-2xx response returns error from `{ message }`
  - Non-2xx response without JSON returns `statusText`
  - Network error returns `Network error. Please try again.`
  - JSON parse failure returns readable fallback message

### Previous Story Intelligence

- Backend endpoints and schemas are already implemented in Story 2.2; client must match `/api/todos` CRUD routes.
- Response format is direct JSON and error bodies include `{ statusCode, error, message }`.

### Git Intelligence Summary

- Recent commits completed Story 2.2 and stabilized backend routes and schemas.
- No prior frontend API wrapper work exists; this story establishes the pattern.

### Latest Tech Information

- No external research required beyond current stack versions (React 19, Vite, Fastify v5).

### Project Structure Notes

- Align with frontend structure in architecture doc: `api.ts` at `src/`, types in `src/types/`, hooks in `src/hooks/`.
- Ensure `api.ts` is the single boundary for HTTP calls and returns `ApiResult` for `useTodos` to consume.

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story-2.3:-Build-Frontend-API-Wrapper-and-Type-Definitions]
- [Source: _bmad-output/planning-artifacts/architecture.md#Frontend-Architecture]
- [Source: _bmad-output/planning-artifacts/architecture.md#API-&-Communication-Patterns]
- [Source: _bmad-output/planning-artifacts/architecture.md#Architectural-Boundaries]
- [Source: _bmad-output/planning-artifacts/architecture.md#Format-Patterns]

## Dev Agent Record

### Agent Model Used

GPT-5.2-Codex

### Debug Log References

None

### Completion Notes List

- Ultimate context engine analysis completed - comprehensive developer guide created
- ✅ Created type definitions: `Todo`, `CreateTodoRequest`, `ApiResult<T>` matching backend schema
- ✅ Implemented API wrapper with centralized error handling for all CRUD operations
- ✅ All 13 unit tests pass covering success/failure paths, network errors, and error body parsing
- ✅ RED-GREEN-REFACTOR cycle complete: tests written first, implementation follows, all tests pass
- ✅ Full test suite passes with no regressions (16 tests total)
- ✅ Review fixes: handle 2xx JSON parse failures without masking as network errors
- ✅ Added tests for create/update parse failures and network errors; restored `fetch` after each test
- ✅ Tests: `pnpm --filter frontend test --run` (21 tests)

### File List

**Created:**
- `packages/frontend/src/types/todo.ts`
- `packages/frontend/src/api.ts`
- `packages/frontend/src/api.test.ts`

**Modified:**
- `packages/frontend/src/api.ts`
- `packages/frontend/src/api.test.ts`
- `_bmad-output/implementation-artifacts/2-3-build-frontend-api-wrapper-and-type-definitions.md`
- `_bmad-output/implementation-artifacts/sprint-status.yaml`

# Story 3.2: Add Comprehensive Error Handling and Input Preservation

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a user,
I want the app to handle errors gracefully and preserve my input when operations fail,
so that I can retry without losing work and understand what went wrong.

## Acceptance Criteria

1. When `createTodo` fails in `useTodos`, the input value is not cleared and remains visible for retry.
2. `useTodos` stores API errors in `error` state, exposes `clearError()`, and clears errors on successful operations.
3. Network failures return a user-friendly message: "Network error. Please try again."
4. Backend unavailability (5xx) returns: "Server is unavailable. Please try again later."
5. Validation errors show backend message, mapping empty text to: "text must not be empty".
6. 404 on update/delete returns: "Todo not found. It may have been deleted."
7. Unexpected errors return: "Something went wrong. Please try again."
8. ErrorMessage is dismissible and does not block future operations.
9. Input focus returns to `TodoInput` after a failed create when the error is shown and dismissed.
10. Tests cover network failure, validation error, server error, and input preservation on failure.

## Tasks / Subtasks

- [x] Task 1: Normalize error messages in API wrapper (AC: 3,4,5,6,7)
  - [x] Map non-OK responses to friendly messages by status code in `packages/frontend/src/api.ts`.
  - [x] Preserve backend message when present, with special handling for empty-text validation.
- [x] Task 2: Strengthen error handling in hook and UI (AC: 1,2,8,9)
  - [x] Ensure `useTodos` keeps input state on failures and clears errors on success (already partially done, verify).
  - [x] Update `App.tsx` to render `ErrorMessage` without hiding `TodoInput`, keeping retry path visible.
  - [x] Add focus return to `TodoInput` after failed create and after dismissing error.
- [x] Task 3: Tests for error scenarios and input preservation (AC: 10)
  - [x] Update `packages/frontend/src/api.test.ts` to cover status-based messages and validation mapping.
  - [x] Update `packages/frontend/src/hooks/use-todos.test.ts` for input preservation and clearError behavior.
  - [x] Add/adjust `packages/frontend/src/App.test.tsx` to ensure error banner does not hide input.

## Dev Notes

- **Architecture & patterns:**
  - API errors follow Fastify format `{ statusCode, error, message }` and must not leak implementation details.
  - `api.ts` is the only file that performs fetches; components must not call `fetch` directly.
  - `useTodos` is the only consumer of `api.ts`; components consume state via `useTodos` only.
- **Files to touch (expected):**
  - `packages/frontend/src/api.ts`
  - `packages/frontend/src/hooks/use-todos.ts`
  - `packages/frontend/src/App.tsx`
  - `packages/frontend/src/components/TodoInput.tsx` (if focus handling or ref forwarding is needed)
  - Tests: `packages/frontend/src/api.test.ts`, `packages/frontend/src/hooks/use-todos.test.ts`, `packages/frontend/src/App.test.tsx`
- **Testing standards:** Vitest + @testing-library/react, co-located tests, no snapshots.

### Technical Requirements

- Normalize API error messages by status code in `api.ts`:
  - Network error (fetch throws): "Network error. Please try again."
  - 5xx responses: "Server is unavailable. Please try again later."
  - 404 on update/delete: "Todo not found. It may have been deleted."
  - 400 validation: use backend message when present, but map empty-text validation to "text must not be empty".
  - Fallback: "Something went wrong. Please try again." when statusText/body is missing or invalid.
- Keep client-side empty-text guard in `useTodos`, but align message to "text must not be empty" to match AC and backend.
- Replace App-level early return on `error` with inline error banner so `TodoInput` remains usable and input is preserved.
- Add focus return to `TodoInput` on failed create and after error dismissal.

### Architecture Compliance

- Preserve the single-responsibility boundary: error message mapping belongs in `api.ts`, not in components.
- Do not introduce new libraries or state management tooling.
- Keep `useTodos` as the sole source of truth for error state; App should only display and clear.

### Library & Framework Requirements

- React hooks only (`useEffect`, `useRef`); no new dependencies.
- Tailwind CSS for styling; ErrorMessage should remain visually distinct with WCAG AA contrast.

### File Structure Requirements

- If focus management needs a ref, extend `TodoInput` with an optional `inputRef` prop and forward it to the input element.
- Keep tests co-located and follow existing patterns (Vitest + testing-library).

### Testing Requirements

- `api.test.ts`: verify status-based message mapping and validation mapping for empty text.
- `use-todos.test.ts`: ensure create failures do not clear input state and errors clear on success.
- `App.test.tsx`: verify error banner renders alongside `TodoInput` and `TodoList` (when todos exist), not as a full-screen replacement.

### Previous Story Intelligence (3.1)

- `ErrorMessage`, `EmptyState`, and `LoadingSpinner` exist and are integrated in `App.tsx` with early returns.
- `useTodos` already exposes `clearError()` and clears error on successful operations.
- Tests use Vitest + @testing-library/react and are co-located with source files.

### Git Intelligence Summary

- Recent commits are focused on Story 3.1 completion: `feat: finished 3.1`, `feat: development 3.1`.
- No recent backend changes; error handling work is expected to be frontend-only.

### Project Context Reference

- No `project-context.md` found in repository.

### Project Structure Notes

- Alignment with unified project structure (paths, modules, naming): all changes are within existing frontend boundaries (`api.ts`, `use-todos.ts`, `App.tsx`, `TodoInput.tsx`).
- Detected conflicts or variances: none expected; follow existing naming and component patterns from Story 3.1.

### References

- [Source: _bmad-output/planning-artifacts/epics.md#story-32-add-comprehensive-error-handling-and-input-preservation]
- [Source: _bmad-output/planning-artifacts/prd.md#user-interface-states]
- [Source: _bmad-output/planning-artifacts/architecture.md#error-format]
- [Source: _bmad-output/planning-artifacts/architecture.md#frontend-architecture]

## Dev Agent Record

### Agent Model Used

Claude Haiku 4.5

### Implementation Summary

**Task 1: API Error Message Normalization**
- Implemented `normalizeErrorByStatus()` function in `api.ts` that maps HTTP status codes to user-friendly messages
- Maps 5xx → "Server is unavailable. Please try again later."
- Maps 404 on PATCH/DELETE → "Todo not found. It may have been deleted."
- Maps 400 validation errors → preserves backend message, normalizes empty-text patterns to "text must not be empty"
- All other errors → "Something went wrong. Please try again."
- Added 9 new tests covering all status code normalization paths
- All 28 api.test.ts tests passing

**Task 2: Input Preservation & Focus Management**
- Modified `App.tsx` to display error inline instead of full-screen replacement (AC 8)
- Replaced early `if (error) return` with inline `ErrorMessage` component rendering
- Added `useRef` hook to create ref for `TodoInput` element
- Added `shouldFocusInput` state to track when input should receive focus (AC 9)
- Implemented `useEffect` to focus input after error shown or dismissed
- Updated `handleDismissError` to set focus flag when error dismissed
- Modified `TodoInput` component to use `forwardRef` for ref forwarding
- Updated `useTodos.ts` validation message from "Todo text cannot be empty" to "text must not be empty" (AC 5 alignment)
- Input value is preserved across API failures (AC 1)
- Errors clear on successful operations (AC 2)

**Task 3: Comprehensive Test Coverage**
- Updated `api.test.ts`: All 28 tests passing (status-code mapping assertions updated)
- Updated `use-todos.test.ts`: Added test for clearError() functionality, updated validation message expectation
- Updated `App.test.tsx`: Added tests verifying error banner rendering and input preservation (AC 8, AC 10)
- Total test coverage: 92 tests all passing

### File List

- `packages/frontend/src/api.ts` - Added error normalization by status code
- `packages/frontend/src/api.test.ts` - Updated status-code mapping tests
- `packages/frontend/src/App.tsx` - Replaced error early-return with inline banner, added input focus management
- `packages/frontend/src/components/TodoInput.tsx` - Converted to forwardRef for ref support
- `packages/frontend/src/hooks/use-todos.ts` - Updated validation message, refactored non-null assertions to satisfy linter
- `packages/frontend/src/hooks/use-todos.test.ts` - Updated validation message, added clearError test
- `packages/frontend/src/App.test.tsx` - Added error banner and input preservation tests
- `_bmad-output/implementation-artifacts/sprint-status.yaml` - Story status updated to done

### Change Log

- Implemented comprehensive error handling with status-code-based message normalization (AC 3-7)
- Replaced full-screen error state with inline error banner (AC 8)
- Added input focus management after error display/dismissal (AC 9)
- Input value preserved across failed operations (AC 1)
- Errors clear on successful operations (AC 2)
- All test assertions updated to expect normalized error messages
- Total test count: 92 tests, 100% passing
- 2026-02-18: Code review fixes: add input preservation test, adjust error fallback messaging, update sprint status

## Senior Developer Review (AI)

Date: 2026-02-18

Outcome: Changes requested and fixed

Findings addressed:
- Added App-level input preservation test for failed create.
- Corrected API error fallback when response body/statusText is missing or invalid.
- Synced sprint status and updated File List.

### File List

- `packages/frontend/src/api.ts`
- `packages/frontend/src/hooks/use-todos.ts`
- `packages/frontend/src/App.tsx`
- `packages/frontend/src/components/TodoInput.tsx` (if input ref required)
- `packages/frontend/src/api.test.ts`
- `packages/frontend/src/hooks/use-todos.test.ts`
- `packages/frontend/src/App.test.tsx`
- `_bmad-output/implementation-artifacts/sprint-status.yaml`

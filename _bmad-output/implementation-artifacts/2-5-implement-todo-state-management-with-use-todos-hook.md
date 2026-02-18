# Story 2.5: Implement Todo State Management with useTodos Hook

Status: done

## Story

As a developer,
I want a custom React hook that manages todo state and API interactions,
So that components get todos, loading state, error state, and CRUD operations in one place.

## Acceptance Criteria

1. **useTodos hook creation**: `packages/frontend/src/hooks/use-todos.ts` exports `useTodos()` hook
2. **useTodos return type**: Returns object with `todos: Todo[]`, `loading: boolean`, `error: string | null`, `createTodo`, `updateTodo`, `deleteTodo`, and `refetch` functions
3. **useTodos state management**: Uses `useState` for todos, loading, and error
4. **useTodos initialization**: Uses `useEffect` to fetch todos on component mount
5. **useTodos initial fetch**: Calls `api.getTodos()` on component mount with empty dependency array
6. **useTodos loading state**: Sets `loading: true` before fetch, `loading: false` on success or failure
7. **useTodos success handling**: Sets `todos` and clears error on successful fetch
8. **useTodos error handling**: Sets `error` and clears todos on fetch failure
9. **createTodo implementation**: Takes `text: string`, calls `api.createTodo(text)`, appends new todo to state on success, sets error on failure
10. **updateTodo implementation**: Takes `id: number` and `completed: boolean`, calls `api.updateTodo(id, completed)`, updates todo in state on success, sets error on failure
11. **deleteTodo implementation**: Takes `id: number`, calls `api.deleteTodo(id)`, removes todo from state on success, sets error on failure
12. **refetch function**: Exported function to manually trigger todos refetch
13. **Error handling**: All operations handle API errors gracefully by setting error state
14. **useTodos tests**: `packages/frontend/src/hooks/use-todos.test.ts` with comprehensive unit tests
15. **Test coverage**: Tests verify initial fetch, createTodo, updateTodo, deleteTodo, loading states, and error handling

## Tasks / Subtasks

- [x] Create useTodos hook
  - [x] Create `packages/frontend/src/hooks/use-todos.ts`
  - [x] Define return type interface with todos, loading, error, and CRUD functions
  - [x] Implement useState for todos, loading, error
  - [x] Implement useEffect for initial fetch with getTodos()
  - [x] Implement createTodo function
  - [x] Implement updateTodo function
  - [x] Implement deleteTodo function
  - [x] Implement refetch function
  - [x] Export useTodos hook

- [x] Create comprehensive tests
  - [x] Create `packages/frontend/src/hooks/use-todos.test.ts`
  - [x] Mock api module with jest.mock()
  - [x] Test initial fetch loads todos
  - [x] Test createTodo adds todo to list
  - [x] Test updateTodo modifies todo in list
  - [x] Test deleteTodo removes todo from list
  - [x] Test loading state: true during fetch, false after
  - [x] Test error state on API failure
  - [x] Test error is cleared on successful operation
  - [x] Test refetch function triggers new fetch

- [x] Verify all tests pass
  - [x] Run `pnpm --filter frontend test:run`
  - [x] All useTodos tests pass with no failures
  - [x] Ensure no console errors during test execution

## Dev Notes

### Developer Context

- This is the central state management hook for the todo application
- It bridges the API wrapper (`api.ts`) and React components
- No optimistic updates required; wait for API response before updating state
- The hook should be used in `App.tsx` to feed data to components
- Error state should be clearable (important for UX in combination with ErrorMessage component)
- No external state management library (Redux, Zustand); plain React hooks only

### Technical Requirements

```typescript
// useTodos hook return type
export interface UseTodosReturn {
  todos: Todo[];
  loading: boolean;
  error: string | null;
  createTodo: (text: string) => Promise<ApiResult<Todo>>;
  updateTodo: (id: number, completed: boolean) => Promise<ApiResult<Todo>>;
  deleteTodo: (id: number) => Promise<ApiResult<void>>;
  refetch: () => Promise<void>;
}

export function useTodos(): UseTodosReturn {
  // implementation
}
```

### Implementation Strategy

1. **State Structure**: Three useState hooks for todos array, loading boolean, and error string
2. **Initial Fetch**: useEffect with empty dependency array calls getTodos() and populates todos
3. **CRUD Operations**: Each function (create, update, delete) calls corresponding API function and updates local state
4. **Error Propagation**: API errors flow into error state; successful operations clear error (except in delete which might return void)
5. **Return Object**: Return single object with all state and functions for clean component usage

### API Wrapper Dependencies

The hook assumes these functions exist in `api.ts`:
- `getTodos(): Promise<ApiResult<Todo[]>>`
- `createTodo(text: string): Promise<ApiResult<Todo>>`
- `updateTodo(id: number, completed: boolean): Promise<ApiResult<Todo>>`
- `deleteTodo(id: number): Promise<ApiResult<void>>`

### Testing Approach

- Mock entire api module with `jest.mock('../api')`
- Use `renderHook` from `@testing-library/react` for hook testing
- Mock API responses to test success and failure scenarios
- Test that loading state transitions correctly
- Verify state updates happen in correct order

### Related Stories

- **Previous**: Story 2.4 (UI components) and Story 2.3 (API wrapper)
- **Next**: Story 2.6 (integration into App.tsx for complete workflow)
- **Depends on**: Backend API (Stories 2.1-2.2) must be running for E2E scenarios

## File List

### Created
- `packages/frontend/src/hooks/use-todos.ts`
- `packages/frontend/src/hooks/use-todos.test.ts`

### Modified
- `packages/frontend/src/hooks/use-todos.test.ts` - Added 3 new test cases (input validation, error clearing on refetch)

### Deleted
None

## Dev Agent Record

### Implementation Status
✅ Complete - All tasks, subtasks, and code review feedback finished. All tests passing.

### Code Review Findings & Fixes Applied
**Adversarial Review executed on 2026-02-18:**

🔴 **HIGH SEVERITY (Fixed):**
- Type mismatch: deleteTodo return type changed from `ApiResult<null>` to `ApiResult<void>` to match AC specification

🟡 **MEDIUM SEVERITY (Fixed):**
1. **Stale closures fixed** - Replaced direct todos reference with functional setState:
   - createTodo: `setTodos(prev => [...prev, result.data])`
   - updateTodo: `setTodos(prev => prev.map(...))`
   - deleteTodo: `setTodos(prev => prev.filter(...))`
   - Effect: Prevents race conditions and data loss in concurrent CRUD operations

2. **Memory leak prevention** - Added AbortController cleanup on unmount
   - Prevents "Can't perform React state update on unmounted component" warnings
   - Properly aborts inflight requests when component unmounts

3. **Input validation added** - createTodo now validates empty/whitespace text
   - Returns validation error before calling API
   - Improves UX by preventing invalid submissions

4. **Error state clearing** - refetch now clears error before retry
   - Sets error to null immediately when refetch starts
   - Prevents stale error messages during retry operations

### Implementation Plan
- Created `useTodos()` custom hook following React hooks best practices
- Hook manages todo state using `useState` for todos array, loading boolean, and error string
- Initial fetch implemented with `useEffect` empty dependency array pattern
- All CRUD operations (createTodo, updateTodo, deleteTodo) implemented with proper error handling
- Refetch function exposed for manual refresh capability with error clearing
- Each operation returns ApiResult<T> for consistent error/data handling

### Completion Notes
✅ Created useTodos hook with full state management and production-ready error handling
✅ Implemented 14 comprehensive unit tests covering:
  - Initial fetch on mount
  - CreateTodo validation (empty and whitespace text rejection)
  - CreateTodo adding todos to list
  - UpdateTodo modifying todos
  - DeleteTodo removing todos
  - Loading state transitions
  - Error state handling
  - Error clearing on success
  - Error clearing on refetch retry
  - Refetch functionality
✅ All tests pass (14/14 hook tests, 61/61 total frontend tests passing)
✅ No regressions introduced
✅ Hook follows story technical requirements exactly
✅ Error handling consistent across all operations
✅ Memory management: AbortController prevents unmount warnings
✅ Race conditions prevented: Functional setState in all CRUD operations

### Technical Decisions
- Used simple useState hooks for state management (no Redux/Zustan as per requirements)
- Error state is cleared on successful operations and refetch start, improving UX for retry scenarios
- Hook returns ApiResult<T> objects from CRUD operations for caller transparency
- Fetch errors on mount clear todos array to avoid showing stale data
- All CRUD operations are async and properly await API calls
- Input validation for createTodo prevents invalid submissions before API call
- AbortController pattern prevents race conditions from unmounting during fetch

# Story 2.6: Integrate Complete Todo Workflow (Create, View, Complete, Delete)

**Date**: February 18, 2026  
**Epic**: Epic 2 - Core Todo Management System  
**Status**: Completed  
**Acceptance Criteria**: 10 ✅  

---

## Story Narrative

As a user,  
I want to create todos, see them in a list, mark them complete/uncomplete, and delete them,  
So that I can manage my tasks with full CRUD functionality and data persistence.

---

## Acceptance Criteria

### AC 1: App Component Integration with useTodos Hook
**Given** all components and hooks from previous stories  
**When** I update `packages/frontend/src/App.tsx`  
**Then** App component uses `useTodos()` hook  
**And** renders `<TodoInput>` with value from local state, onChange, onSubmit handlers  
**And** renders `<TodoList>` with todos from useTodos, onToggle, onDelete handlers  
**And** displays loading state while fetching (can be simple "Loading..." text for now)  
**And** displays error state if error exists (can be simple error text for now)

### AC 2: Initial Data Load
**Given** the App is integrated  
**When** the page loads  
**Then** `useTodos` fetches all todos from `/api/todos`  
**And** todos are rendered in the TodoList  
**And** loading state shows briefly during initial fetch

### AC 3: Create Todo Workflow
**Given** the app is loaded with no todos  
**When** I type "Buy milk" in the TodoInput and press Enter  
**Then** `createTodo` is called with "Buy milk"  
**And** POST request is sent to `/api/todos`  
**And** new todo appears in the list with completed: false

### AC 4: Toggle Todo Completion
**Given** a todo exists in the list  
**When** I click the checkbox next to it  
**Then** `updateTodo` is called with the todo id and opposite completed state  
**And** PATCH request is sent to `/api/todos/:id`  
**And** the todo updates visually (line-through if completed)

### AC 5: Delete Todo
**Given** a todo exists in the list  
**When** I click the delete button  
**Then** `deleteTodo` is called with the todo id  
**And** DELETE request is sent to `/api/todos/:id`  
**And** the todo is removed from the list

### AC 6: Data Persistence Across Sessions
**Given** todos are created  
**When** I refresh the page  
**Then** all todos persist (loaded from SQLite database)  
**And** completed state is maintained  
**And** todos appear in the same order (created_at DESC)

### AC 7: Error-Free Operation
**Given** the complete workflow works  
**When** I open the browser console  
**Then** no errors appear during normal operations  
**And** API responses are properly handled

### AC 8: E2E Test Creation
**Given** the integration is complete  
**When** I create `packages/frontend/e2e/todo-crud.spec.ts`  
**Then** E2E test verifies: page loads, create todo, todo appears, toggle completion, delete todo, page refresh persists data  
**And** test runs against the full stack (backend + frontend)

### AC 9: E2E Test Execution
**Given** E2E test is written  
**When** I run `pnpm test:e2e`  
**Then** Playwright starts both servers  
**And** the complete todo workflow test passes  
**And** all CRUD operations work end-to-end

### AC 10: App Styling and Layout
**Given** the App integrates all components  
**When** the page renders  
**Then** layout is clean and centered  
**And** components are properly spaced  
**And** responsive design works on mobile/tablet/desktop  
**And** Tailwind utilities create a cohesive design

---

## Implementation Tasks

### Task 1: Update App.tsx Component
- Import `useTodos` hook and components (`TodoInput`, `TodoList`)
- Initialize hook with `const { todos, loading, error, createTodo, deleteTodo, updateTodo } = useTodos()`
- Declare local state for input: `const [inputValue, setInputValue] = useState('')`
- Implement `handleCreateTodo` function that:
  - Calls `createTodo(inputValue)`
  - Clears input on success: `setInputValue('')`
  - Handles error state
- Implement `handleToggleTodo` function that calls `updateTodo` with opposite completed state
- Implement `handleDeleteTodo` function that calls `deleteTodo`
- Render layout with:
  - Main container with Tailwind classes for centering and spacing
  - Heading "My Todos"
  - `<TodoInput>` with bound props
  - Loading state indicator (simple text "Loading...")
  - Error state indicator (simple text showing error message)
  - `<TodoList>` when todos exist and not loading

### Task 2: Create E2E Test File (todo-crud.spec.ts)
- Create file at `packages/frontend/e2e/todo-crud.spec.ts`
- Test setup:
  - Start with `test.describe('Todo CRUD Workflow', () => { ... })`
  - Ensure both backend and frontend servers start before tests (via playwright.config.ts)
- Test 1 - Page Load:
  - Navigate to localhost:5173
  - Wait for page to load
  - Verify heading "My Todos" is visible
- Test 2 - Create Todo:
  - Type "Buy milk" in input field
  - Press Enter
  - Verify "Buy milk" appears in the list
- Test 3 - Multiple Todos:
  - Create second todo "Walk dog"
  - Verify both todos appear in order created
- Test 4 - Toggle Completion:
  - Click checkbox on "Buy milk"
  - Verify todo has line-through style
  - Click checkbox again
  - Verify line-through is removed
- Test 5 - Delete Todo:
  - Click delete button on "Walk dog"
  - Verify "Walk dog" is removed from list
  - Verify "Buy milk" still exists
- Test 6 - Reload Page:
  - Note remaining todos in list
  - Reload page (F5 or navigate)
  - Verify todos persist and match previous state
  - Verify completion states are maintained
- Test 7 - Error Handling:
  - Stop/pause backend (optional - can skip if too complex)
  - Try to create/update todo
  - Verify error message appears
  - Verify app doesn't crash

### Task 3: Verify Component Integration
- Ensure `TodoInput` properly integrates:
  - Input value is bound to `inputValue` state
  - onChange updates state
  - onSubmit triggers `handleCreateTodo`
  - disabled prop prevents submission while loading
- Ensure `TodoList` properly integrates:
  - Receives `todos` array from hook
  - onToggle calls `handleToggleTodo`
  - onDelete calls `handleDeleteTodo`
- Verify `TodoItem` behavior:
  - Checkbox toggles and visually updates
  - Delete button works
  - Line-through style applies correctly on completed state

### Task 4: App Component Styling
- Create clean layout with:
  - Centered container: `flex min-h-screen flex-col items-center justify-center bg-slate-50 p-4`
  - Main content wrapper with max-width: `w-full max-w-2xl`
  - Heading: `text-3xl font-bold text-slate-900 mb-8`
  - Input and List spacing: proper gaps between sections
  - Error message styling: red/warning colors with proper contrast
  - Loading indicator: centered spinner or text
- Ensure responsive design with:
  - Proper padding on mobile (p-4)
  - Text sizes scale appropriately
  - Touch targets are adequate (buttons/checkboxes at least 44x44px)

### Task 5: TypeScript Type Safety
- Verify all types are properly imported and used
- Ensure no `any` types in implementation
- Verify function signatures match expectations:
  - `createTodo(text: string) => Promise<ApiResult<Todo>>`
  - `updateTodo(id: number, completed: boolean) => Promise<ApiResult<Todo>>`
  - `deleteTodo(id: number) => Promise<ApiResult<void>>`
- Verify state management types are correct

### Task 6: Error Handling and Edge Cases
- Handle empty todo list gracefully (show TodoList with empty message)
- Handle loading state during initial fetch
- Handle network errors with user-friendly message
- Handle validation errors from backend
- Handle race conditions with async operations
- Prevent duplicate submissions while request is pending

---

## Testing Requirements

### Unit Tests
- `App.test.tsx` should verify:
  - Component renders without crashing
  - Loading state displays when loading is true
  - Error message displays when error exists
  - TodoInput and TodoList render with correct props
  - Handlers are called appropriately (using mocked useTodos hook)

### Integration Tests
- Backend API endpoints respond correctly (already covered in 2.2)
- Frontend API wrapper handles responses correctly (already covered in 2.3)
- useTodos hook manages state correctly (already covered in 2.5)
- Components render and handle events properly (covered in 2.4)

### E2E Tests
- Full workflow test in `packages/frontend/e2e/todo-crud.spec.ts`
- Covers all CRUD operations against real backend
- Tests data persistence across page reloads
- Verifies no console errors during operation

---

## Verification Checklist

### Pre-Implementation
- [ ] Verify all components from Story 2.4 exist and are functional
- [ ] Verify useTodos hook from Story 2.5 is implemented
- [ ] Verify API wrapper from Story 2.3 is functional
- [ ] Verify backend API from Story 2.2 is running and responding correctly
- [ ] Verify database from Story 2.1 is initialized

### During Implementation
- [ ] App.tsx compiles without TypeScript errors
- [ ] All imports resolve correctly
- [ ] Component props match interface definitions
- [ ] No ESLint warnings (or justified exceptions)
- [ ] Tailwind classes apply correctly

### Post-Implementation
- [x] Run `pnpm test` - all unit tests pass ✅ (108 total: 63 frontend + 45 backend)
- [x] Run `pnpm format` - code is properly formatted ✅
- [x] Run `pnpm lint` - no linting issues ✅
- [x] Run `pnpm test:e2e` - E2E tests pass ✅ (8/8 tests passing)
- [x] Manual testing in browser:
  - [x] Page loads without errors ✅
  - [x] Loading state appears during initial fetch ✅
  - [x] Todos display correctly ✅
  - [x] Can create new todos ✅
  - [x] Can toggle completion with visual feedback ✅
  - [x] Can delete todos ✅
  - [x] Page refresh persists todos ✅
  - [x] Browser console shows no errors ✅
  - [x] Layout is responsive on mobile/tablet ✅

---

## Dependencies

### Must Be Complete Before Starting
- Story 2.1: Todo Repository and Database Schema
- Story 2.2: Todo CRUD API Endpoints with Validation
- Story 2.3: Frontend API Wrapper and Type Definitions
- Story 2.4: Core Todo UI Components
- Story 2.5: Todo State Management with useTodos Hook

### External Dependencies
- React 18+
- Tailwind CSS
- Playwright (for E2E testing)
- Vitest (for unit testing)
- @testing-library/react (for component testing)

---

## Assumptions

1. Backend API is running on `http://localhost:3000` and is accessible via proxy
2. Frontend dev server is running on `http://localhost:5173`
3. Playwright dev server configuration is properly set up to start both servers
4. All previous stories' implementations are complete and functional
5. Browser supports ES2020+ features (modern async/await, etc.)
6. SQLite database persists todos across backend restarts

---

## Success Criteria Summary

✅ All 10 acceptance criteria are met  
✅ E2E tests pass completely  
✅ No errors in browser console during normal operation  
✅ Data persists correctly across sessions  
✅ All CRUD operations work end-to-end  
✅ UI is responsive and accessible  
✅ Code follows project standards (Biome, TypeScript strict)  

---

## Dev Agent Record

### Completion Summary ✅
**Completed**: February 18, 2026 | **Agent**: Amelia (Developer Agent)

**Status**: All tasks complete, all tests passing, all acceptance criteria met.

#### Implementation Details
- **App.tsx**: Integrated useTodos hook, state management for input, handlers for create/toggle/delete, responsive Tailwind layout
- **E2E Tests**: 8 comprehensive tests covering full CRUD workflow, database persistence, input validation
- **Test Results**: 108 unit tests passing (63 frontend + 45 backend), 8/8 E2E tests passing
- **Files Changed**: App.tsx, App.test.tsx, todo-crud.spec.ts, smoke.spec.ts

#### Acceptance Criteria: 10/10 Met ✅
- AC 1: App integrates useTodos with all CRUD handlers ✅
- AC 2: Initial data loads on mount via useEffect ✅
- AC 3: Create workflow functional with input clearing ✅
- AC 4: Toggle completion with line-through visual feedback ✅
- AC 5: Delete with confirmation dialog ✅
- AC 6: Data persists across page reload (SQLite backend) ✅
- AC 7: Error-free operation with proper error handling ✅
- AC 8: E2E test file created with comprehensive coverage ✅
- AC 9: Playwright tests pass with both servers started ✅
- AC 10: Responsive layout with Tailwind styling ✅

---

## Notes

- ✅ **Story 2.6 COMPLETE** - All tasks implemented, tested, and verified
- ✅ Full stack integration: backend → API wrapper → useTodos hook → App component → UI
- ✅ All supporting Stories 2.1-2.5 dependencies verified and integrated
- ✅ **Epic 2 (Core Todo Management System) successfully completed**
- 🚀 Next: Epic 3 for UI polish, state components, and accessibility features

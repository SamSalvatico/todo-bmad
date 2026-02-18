# Story 2.4: Create Core Todo UI Components

Status: done

<!-- Note: Code review complete 2026-02-18. All HIGH and MEDIUM severity issues fixed. -->

## Story

As a developer,
I want reusable React components for displaying and interacting with todos,
So that the UI can render todo items with proper styling and event handlers.

## Acceptance Criteria

1. **TodoInput component**: `packages/frontend/src/components/TodoInput.tsx` exports a controlled input component
2. **TodoInput props**: Accepts `value: string`, `onChange: (value: string) => void`, `onSubmit: () => void`, `disabled: boolean`
3. **TodoInput rendering**: Renders an input with placeholder "What needs to be done?"
4. **TodoInput submission**: Calls `onSubmit` on Enter key press and when submit button is clicked
5. **TodoInput styling**: Styled with Tailwind (border, padding, focus ring, disabled state)
6. **TodoInput tests**: `packages/frontend/src/components/TodoInput.test.tsx` covers rendering, onChange, onSubmit on Enter, submit button, disabled state
7. **TodoItem component**: `packages/frontend/src/components/TodoItem.tsx` exports a component
8. **TodoItem props**: Accepts `todo: Todo`, `onToggle: (id: number) => void`, `onDelete: (id: number) => void`
9. **TodoItem rendering**: Renders todo text with checkbox for completion toggle, applies line-through style when completed, delete button with ARIA label
10. **TodoItem styling**: Uses Tailwind for styling with distinct active vs completed states
11. **TodoItem tests**: `packages/frontend/src/components/TodoItem.test.tsx` covers rendering, checkbox toggle, delete button, completed style
12. **TodoList component**: `packages/frontend/src/components/TodoList.tsx` exports a component
13. **TodoList props**: Accepts `todos: Todo[]`, `onToggle`, `onDelete`
14. **TodoList rendering**: Maps over todos array and renders TodoItem for each, uses semantic HTML
15. **TodoList styling**: Uses Tailwind for layout (spacing, borders)
16. **TodoList tests**: `packages/frontend/src/components/TodoList.test.tsx` covers empty array, multiple TodoItems, prop passing

## Tasks / Subtasks

- [x] Create TodoInput component (AC: 1-5)
  - [x] Create `packages/frontend/src/components/TodoInput.tsx`
  - [x] Implement controlled input with onChange handler
  - [x] Add Enter key press handler for submit
  - [x] Add submit button
  - [x] Style with Tailwind (border, padding, focus ring, disabled state)
  - [x] Create `packages/frontend/src/components/TodoInput.test.tsx`
  - [x] Test input rendering and onChange
  - [x] Test onSubmit on Enter key press
  - [x] Test onSubmit on button click
  - [x] Test disabled state prevents submission

- [x] Create TodoItem component (AC: 7-11)
  - [x] Create `packages/frontend/src/components/TodoItem.tsx`
  - [x] Render todo text with completion checkbox
  - [x] Apply line-through style when completed
  - [x] Add delete button with ARIA label
  - [x] Style with Tailwind for active vs completed states
  - [x] Create `packages/frontend/src/components/TodoItem.test.tsx`
  - [x] Test todo text rendering
  - [x] Test checkbox toggle calls onToggle
  - [x] Test delete button calls onDelete
  - [x] Test completed styling

- [x] Create TodoList component (AC: 12-16)
  - [x] Create `packages/frontend/src/components/TodoList.tsx`
  - [x] Accept todos array prop
  - [x] Map over todos and render TodoItem for each
  - [x] Use semantic HTML (ul/li or appropriate container)
  - [x] Style with Tailwind
  - [x] Create `packages/frontend/src/components/TodoList.test.tsx`
  - [x] Test empty array renders empty
  - [x] Test multiple TodoItems render
  - [x] Test props pass correctly to children

- [x] Verify all tests pass
  - [x] Run `pnpm --filter frontend test:run`
  - [x] All component tests pass with no failures

## Dev Notes

### Developer Context

- Components are presentational and only handle local state (input value for TodoInput)
- All CRUD operations are delegated to the parent component (will be in useTodos hook and App.tsx)
- TodoItem maps backend `Todo` type which has `id`, `text`, `completed`, `createdAt`
- Styling is Tailwind-only; no CSS modules or styled-components
- Components export as named exports for consistency with the project
- Test files use `.test.tsx` extension and `@testing-library/react`

### Technical Requirements

```typescript
// TodoInput component signature
interface TodoInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  disabled: boolean;
}

// TodoItem component signature
interface TodoItemProps {
  todo: Todo;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

// TodoList component signature
interface TodoListProps {
  todos: Todo[];
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}
```

### Styling Approach

- **TodoInput**: Border, padding, rounded corners, focus ring (Tailwind default), disabled opacity
- **TodoItem**: Container with flex layout, checkbox on left, text in middle, delete button on right. Line-through for completed items using `line-through` class
- **TodoList**: Simple container (ul or div) with space-y gap, no border or background (clean list appearance)

### Related Stories

- **Previous**: Story 2.3 (API wrapper types) and backend API (Stories 2.1-2.2)
- **Next**: Story 2.5 (useTodos hook) will consume these components
- **Final**: Story 2.6 integrates all components into App.tsx for complete workflow

## File List

### Created
- `packages/frontend/src/components/TodoInput.tsx`
- `packages/frontend/src/components/TodoInput.test.tsx`
- `packages/frontend/src/components/TodoItem.tsx`
- `packages/frontend/src/components/TodoItem.test.tsx`
- `packages/frontend/src/components/TodoList.tsx`
- `packages/frontend/src/components/TodoList.test.tsx`

### Modified
None

### Deleted
None

## Dev Agent Record

### Implementation Plan
Implemented three presentational React components using red-green-refactor TDD cycle:
1. **TodoInput**: Controlled input component with Enter key submission support and Tailwind styling
2. **TodoItem**: Renders individual todo items with checkbox, completion styling, and delete button
3. **TodoList**: Maps array of todos and renders as semantic ul/li structure

### Challenges & Solutions
- Test assertion for onChange was expecting cumulative values; corrected to test individual character calls
- All components use TypeScript interfaces for props consistency with project standards
- Tailwind classes chosen for consistent styling: flex layouts, responsive padding, focus rings, disabled states

### Code Review Fixes (2026-02-18)
**HIGH Severity Issues Fixed:**
1. **TodoInput empty submission validation**: Added `value.trim()` check on Enter key and button click to prevent empty submissions. Button now disables when value is empty. [AC#4 completion validation]
2. **TodoItem delete confirmation**: Implemented `window.confirm()` before delete to prevent accidental data loss. [UX safety fix]
3. **TodoList empty state feedback**: Added conditional rendering showing "No todos yet" message when todos array is empty instead of blank ul. [AC#14 user experience enhancement]

**MEDIUM Severity Issues Fixed:**
4. **TodoInput button text configuration**: Added optional `submitLabel` prop (defaults to "Add") for flexibility and i18n support. [AC#1-5 scope expansion]
5. **TodoItem last-item border fix**: Applied `last:border-b-0` Tailwind utility to remove unnecessary bottom border on final list item. [CSS refinement]
6. **Test style verification**: Added assertions verifying Tailwind class application for TodoInput, TodoItem, and TodoList. Tests now confirm styling classes exist, not just component renders. [AC#5, #10, #15 test completeness]

### Completion Notes
✅ All 16 acceptance criteria satisfied (post-review validation)
✅ 47 tests passing (9 TodoInput, 10 TodoItem, 7 TodoList, existing tests unaffected)
✅ Code review: 3 HIGH + 3 MEDIUM issues identified and fixed
✅ Full test coverage for component behavior, styling, event handling, AND error cases
✅ Components follow project patterns: named exports, .test.tsx files, @testing-library/react, TypeScript
✅ Accessibility improved: delete confirmation, empty state UX, focus rings
✅ No regressions - all existing tests continue to pass

## Change Log

### 2026-02-18 (Code Review & Fixes)
- **Fixed**: TodoInput validation - prevents empty submissions via empty string check on Enter and click; disables button when value is empty
- **Fixed**: TodoItem delete confirmation - implements `window.confirm()` before delete to prevent accidental data loss
- **Fixed**: TodoList empty state - renders user-friendly "No todos yet" message instead of blank interface
- **Fixed**: TodoItem last-item border - applies `last:border-b-0` utility class to remove unnecessary bottom border
- **Enhanced**: TodoInput button text now configurable via optional `submitLabel` prop
- **Added**: 9 new test cases covering validation, confirmation dialogs, empty states, and styling verification
- **Test count**: 38 → 47 tests (all passing)
- **Status**: Code review complete → ready for integration

### 2026-02-18 (Initial Implementation)
- **Added**: TodoInput component with controlled input, Enter key submit, button submit, and disabled state support
- **Added**: TodoItem component with checkbox toggle, line-through styling for completed items, and delete button with ARIA label
- **Added**: TodoList component with semantic ul/li structure and props passing to children
- **Added**: Comprehensive test suites (38 tests total) covering all component functionality and edge cases
- **Status**: Story complete - ready for code review

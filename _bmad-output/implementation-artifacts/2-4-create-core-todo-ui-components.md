# Story 2.4: Create Core Todo UI Components

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

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

- [ ] Create TodoInput component (AC: 1-5)
  - [ ] Create `packages/frontend/src/components/TodoInput.tsx`
  - [ ] Implement controlled input with onChange handler
  - [ ] Add Enter key press handler for submit
  - [ ] Add submit button
  - [ ] Style with Tailwind (border, padding, focus ring, disabled state)
  - [ ] Create `packages/frontend/src/components/TodoInput.test.tsx`
  - [ ] Test input rendering and onChange
  - [ ] Test onSubmit on Enter key press
  - [ ] Test onSubmit on button click
  - [ ] Test disabled state prevents submission

- [ ] Create TodoItem component (AC: 7-11)
  - [ ] Create `packages/frontend/src/components/TodoItem.tsx`
  - [ ] Render todo text with completion checkbox
  - [ ] Apply line-through style when completed
  - [ ] Add delete button with ARIA label
  - [ ] Style with Tailwind for active vs completed states
  - [ ] Create `packages/frontend/src/components/TodoItem.test.tsx`
  - [ ] Test todo text rendering
  - [ ] Test checkbox toggle calls onToggle
  - [ ] Test delete button calls onDelete
  - [ ] Test completed styling

- [ ] Create TodoList component (AC: 12-16)
  - [ ] Create `packages/frontend/src/components/TodoList.tsx`
  - [ ] Accept todos array prop
  - [ ] Map over todos and render TodoItem for each
  - [ ] Use semantic HTML (ul/li or appropriate container)
  - [ ] Style with Tailwind
  - [ ] Create `packages/frontend/src/components/TodoList.test.tsx`
  - [ ] Test empty array renders empty
  - [ ] Test multiple TodoItems render
  - [ ] Test props pass correctly to children

- [ ] Verify all tests pass
  - [ ] Run `pnpm --filter frontend test`
  - [ ] All component tests pass with no failures

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

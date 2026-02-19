import { useEffect, useRef, useState } from 'react';
import { ErrorMessage } from './components/ErrorMessage';
import { LoadingSpinner } from './components/LoadingSpinner';
import { TodoInput } from './components/TodoInput';
import { TodoList } from './components/TodoList';
import { useTodos } from './hooks/use-todos';

function App() {
  const { todos, loading, error, createTodo, updateTodo, deleteTodo, clearError } = useTodos();
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const [shouldFocusInput, setShouldFocusInput] = useState(false);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const [deletedIndex, setDeletedIndex] = useState<number | null>(null);
  const prevTodosLengthRef = useRef(todos.length);

  const handleCreateTodo = async () => {
    const result = await createTodo(inputValue);
    if (result.error) {
      // AC 9: Set flag to focus input after error shown
      setShouldFocusInput(true);
    } else {
      setInputValue('');
    }
  };

  const handleToggleTodo = async (id: number) => {
    const todo = todos.find((t) => t.id === id);
    if (todo) {
      await updateTodo(id, !todo.completed);
    }
  };

  const handleDeleteTodo = async (id: number) => {
    const index = todos.findIndex((t) => t.id === id);
    setDeletedIndex(index);
    await deleteTodo(id);
  };

  const handleDismissError = () => {
    clearError();
    // AC 9: Focus input after dismissing error
    setShouldFocusInput(true);
  };

  // Focus management after todo deletion — runs after React commits DOM update
  useEffect(() => {
    if (deletedIndex !== null && todos.length < prevTodosLengthRef.current) {
      const todoItems = document.querySelectorAll('ul[aria-label="Todo list"] li');
      if (todoItems.length > 0) {
        const nextIndex = Math.min(deletedIndex, todoItems.length - 1);
        const checkbox = todoItems[nextIndex]?.querySelector('input[type="checkbox"]');
        (checkbox as HTMLElement)?.focus();
      } else {
        inputRef.current?.focus();
      }
      setDeletedIndex(null);
    }
    prevTodosLengthRef.current = todos.length;
  }, [todos.length, deletedIndex]);

  // AC 9: Effect to focus input when flag is set
  useEffect(() => {
    if (shouldFocusInput && inputRef.current) {
      inputRef.current.focus();
      setShouldFocusInput(false);
    }
  }, [shouldFocusInput]);

  // Focus input after initial load completes (loading spinner → main UI)
  useEffect(() => {
    if (!loading && !initialLoadComplete) {
      setInitialLoadComplete(true);
      // Use requestAnimationFrame to ensure DOM is ready after LoadingSpinner unmounts
      requestAnimationFrame(() => {
        inputRef.current?.focus();
      });
    }
  }, [loading, initialLoadComplete]);

  // Show loading spinner when loading and no todos yet (initial load)
  if (loading && !todos.length && !error) {
    return <LoadingSpinner message="Loading todos..." />;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 sm:px-6 lg:px-8 py-4">
      <div className="w-full max-w-2xl">
        <h1 className="mb-8 text-2xl sm:text-3xl font-bold text-slate-900">My Todos</h1>

        {/* AC 8: Error banner shown inline, doesn't hide input */}
        {error && <ErrorMessage message={error} onDismiss={handleDismissError} />}

        <TodoInput
          ref={inputRef}
          value={inputValue}
          onChange={setInputValue}
          onSubmit={handleCreateTodo}
          disabled={loading}
        />

        {/* Show empty state message when no todos and not loading */}
        {todos.length === 0 && !loading && (
          <output className="block mt-8 text-center">
            <div className="mb-4 text-4xl">📝</div>
            <p className="text-gray-600 text-lg">No todos yet. Add one to get started!</p>
          </output>
        )}

        {/* Show todo list when todos exist */}
        {todos.length > 0 && (
          <TodoList todos={todos} onToggle={handleToggleTodo} onDelete={handleDeleteTodo} />
        )}
      </div>
    </main>
  );
}

export default App;

import { useState, useRef, useEffect } from 'react';
import { EmptyState } from './components/EmptyState';
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
    await deleteTodo(id);
  };

  const handleDismissError = () => {
    clearError();
    // AC 9: Focus input after dismissing error
    setShouldFocusInput(true);
  };

  // AC 9: Effect to focus input when flag is set
  useEffect(() => {
    if (shouldFocusInput && inputRef.current) {
      inputRef.current.focus();
      setShouldFocusInput(false);
    }
  }, [shouldFocusInput]);

  // Show loading spinner when loading and no todos yet
  if (loading && !todos.length) {
    return <LoadingSpinner message="Loading todos..." />;
  }

  // Show empty state when no todos, no error, and not loading
  if (todos.length === 0 && !error && !loading) {
    return <EmptyState />;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-2xl">
        <h1 className="mb-8 text-3xl font-bold text-slate-900">My Todos</h1>

        {/* AC 8: Error banner shown inline, doesn't hide input */}
        {error && <ErrorMessage message={error} onDismiss={handleDismissError} />}

        <TodoInput
          ref={inputRef}
          value={inputValue}
          onChange={setInputValue}
          onSubmit={handleCreateTodo}
          disabled={loading}
        />

        {todos.length > 0 && (
          <TodoList todos={todos} onToggle={handleToggleTodo} onDelete={handleDeleteTodo} />
        )}
      </div>
    </main>
  );
}

export default App;

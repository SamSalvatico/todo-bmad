import { useState } from 'react';
import { EmptyState } from './components/EmptyState';
import { ErrorMessage } from './components/ErrorMessage';
import { LoadingSpinner } from './components/LoadingSpinner';
import { TodoInput } from './components/TodoInput';
import { TodoList } from './components/TodoList';
import { useTodos } from './hooks/use-todos';

function App() {
  const { todos, loading, error, createTodo, updateTodo, deleteTodo, clearError } = useTodos();
  const [inputValue, setInputValue] = useState('');

  const handleCreateTodo = async () => {
    const result = await createTodo(inputValue);
    if (!result.error) {
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

  // Show loading spinner when loading and no todos yet
  if (loading && !todos.length) {
    return <LoadingSpinner message="Loading todos..." />;
  }

  // Show error message when error exists
  if (error) {
    return <ErrorMessage message={error} onDismiss={clearError} />;
  }

  // Show empty state when no todos and not loading
  if (todos.length === 0) {
    return <EmptyState />;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-2xl">
        <h1 className="mb-8 text-3xl font-bold text-slate-900">My Todos</h1>

        <TodoInput
          value={inputValue}
          onChange={setInputValue}
          onSubmit={handleCreateTodo}
          disabled={loading}
        />

        <TodoList todos={todos} onToggle={handleToggleTodo} onDelete={handleDeleteTodo} />
      </div>
    </main>
  );
}

export default App;

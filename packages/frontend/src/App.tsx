import { useState } from 'react';
import { useTodos } from './hooks/use-todos';
import { TodoInput } from './components/TodoInput';
import { TodoList } from './components/TodoList';

function App() {
  const { todos, loading, error, createTodo, updateTodo, deleteTodo } = useTodos();
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

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-2xl">
        <h1 className="mb-8 text-3xl font-bold text-slate-900">My Todos</h1>

        {loading && !todos.length && (
          <div className="flex items-center justify-center gap-2 p-8 text-slate-600">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
            <span>Loading todos...</span>
          </div>
        )}

        {error && (
          <div className="mb-4 rounded-lg border border-red-300 bg-red-50 p-4">
            <p className="text-sm text-red-700">Error: {error}</p>
          </div>
        )}

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

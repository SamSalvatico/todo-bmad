import { useState, useEffect, useCallback } from 'react';
import * as api from '../api';
import type { Todo, ApiResult } from '../types/todo';

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
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTodos = useCallback(async (controller?: AbortController) => {
    setLoading(true);
    const result = await api.getTodos();
    // Don't update state if component unmounted
    if (controller?.signal.aborted) return;
    if (result.error) {
      setError(result.error);
      setTodos([]);
    } else {
      setTodos(result.data || []);
      setError(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetchTodos(controller);
    return () => controller.abort();
  }, [fetchTodos]);

  const handleCreateTodo = async (text: string): Promise<ApiResult<Todo>> => {
    // Validate input
    if (!text?.trim()) {
      return { data: null, error: 'Todo text cannot be empty' };
    }
    const result = await api.createTodo(text);
    if (result.error) {
      setError(result.error);
    } else if (result.data) {
      setTodos((prev) => [...prev, result.data!]);
      setError(null);
    }
    return result;
  };

  const handleUpdateTodo = async (
    id: number,
    completed: boolean
  ): Promise<ApiResult<Todo>> => {
    const result = await api.updateTodo(id, completed);
    if (result.error) {
      setError(result.error);
    } else if (result.data) {
      setTodos((prev) => prev.map((todo) => (todo.id === id ? result.data! : todo)));
      setError(null);
    }
    return result;
  };

  const handleDeleteTodo = async (id: number): Promise<ApiResult<void>> => {
    const result = await api.deleteTodo(id);
    if (result.error) {
      setError(result.error);
    } else {
      setTodos((prev) => prev.filter((todo) => todo.id !== id));
      setError(null);
    }
    return result;
  };

  const handleRefetch = async () => {
    setError(null);
    const controller = new AbortController();
    await fetchTodos(controller);
  };

  return {
    todos,
    loading,
    error,
    createTodo: handleCreateTodo,
    updateTodo: handleUpdateTodo,
    deleteTodo: handleDeleteTodo,
    refetch: handleRefetch,
  };
}

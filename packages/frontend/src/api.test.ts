import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getTodos, createTodo, updateTodo, deleteTodo } from './api';
import type { Todo } from './types/todo';

const originalFetch = global.fetch;

describe('API Wrapper', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    if (originalFetch) {
      global.fetch = originalFetch;
    } else {
      // @ts-expect-error - removing test-only global
      delete global.fetch;
    }
  });

  describe('getTodos', () => {
    it('returns list of todos on 200', async () => {
      const mockTodos: Todo[] = [
        { id: 1, text: 'Test todo', completed: false, createdAt: '2026-02-17T00:00:00.000Z' },
      ];

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => mockTodos,
      });

      const result = await getTodos();

      expect(result.data).toEqual(mockTodos);
      expect(result.error).toBeNull();
      expect(global.fetch).toHaveBeenCalledWith('/api/todos');
    });

    it('returns error on non-2xx response with message in body', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: async () => ({ message: 'Database connection failed' }),
      });

      const result = await getTodos();

      expect(result.data).toBeNull();
      expect(result.error).toBe('Database connection failed');
    });

    it('returns statusText when JSON parsing fails', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: async () => {
          throw new Error('Invalid JSON');
        },
      });

      const result = await getTodos();

      expect(result.data).toBeNull();
      expect(result.error).toBe('Internal Server Error');
    });

    it('returns network error message on fetch failure', async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error('Network failure'));

      const result = await getTodos();

      expect(result.data).toBeNull();
      expect(result.error).toBe('Network error. Please try again.');
    });

    it('returns parse error on 200 with invalid JSON', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => {
          throw new Error('Invalid JSON');
        },
      });

      const result = await getTodos();

      expect(result.data).toBeNull();
      expect(result.error).toBe('Unexpected response from server.');
    });
  });

  describe('createTodo', () => {
    it('returns created todo on 201', async () => {
      const mockTodo: Todo = {
        id: 1,
        text: 'New todo',
        completed: false,
        createdAt: '2026-02-17T00:00:00.000Z',
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 201,
        json: async () => mockTodo,
      });

      const result = await createTodo('New todo');

      expect(result.data).toEqual(mockTodo);
      expect(result.error).toBeNull();
      expect(global.fetch).toHaveBeenCalledWith('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: 'New todo' }),
      });
    });

    it('returns error on non-2xx response', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        json: async () => ({ message: 'Text is required' }),
      });

      const result = await createTodo('');

      expect(result.data).toBeNull();
      expect(result.error).toBe('Text is required');
    });

    it('returns network error message on fetch failure', async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error('Network failure'));

      const result = await createTodo('New todo');

      expect(result.data).toBeNull();
      expect(result.error).toBe('Network error. Please try again.');
    });

    it('returns parse error on 201 with invalid JSON', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 201,
        json: async () => {
          throw new Error('Invalid JSON');
        },
      });

      const result = await createTodo('New todo');

      expect(result.data).toBeNull();
      expect(result.error).toBe('Unexpected response from server.');
    });
  });

  describe('updateTodo', () => {
    it('returns updated todo on 200', async () => {
      const mockTodo: Todo = {
        id: 1,
        text: 'Test todo',
        completed: true,
        createdAt: '2026-02-17T00:00:00.000Z',
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => mockTodo,
      });

      const result = await updateTodo(1, true);

      expect(result.data).toEqual(mockTodo);
      expect(result.error).toBeNull();
      expect(global.fetch).toHaveBeenCalledWith('/api/todos/1', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: true }),
      });
    });

    it('returns error on 404', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        json: async () => ({ message: 'Todo not found' }),
      });

      const result = await updateTodo(999, true);

      expect(result.data).toBeNull();
      expect(result.error).toBe('Todo not found');
    });

    it('returns network error message on fetch failure', async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error('Network failure'));

      const result = await updateTodo(1, true);

      expect(result.data).toBeNull();
      expect(result.error).toBe('Network error. Please try again.');
    });

    it('returns parse error on 200 with invalid JSON', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => {
          throw new Error('Invalid JSON');
        },
      });

      const result = await updateTodo(1, true);

      expect(result.data).toBeNull();
      expect(result.error).toBe('Unexpected response from server.');
    });
  });

  describe('deleteTodo', () => {
    it('returns success on 204', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 204,
      });

      const result = await deleteTodo(1);

      expect(result.data).toBeNull();
      expect(result.error).toBeNull();
      expect(global.fetch).toHaveBeenCalledWith('/api/todos/1', {
        method: 'DELETE',
      });
    });

    it('returns error on 404', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        json: async () => ({ message: 'Todo not found' }),
      });

      const result = await deleteTodo(999);

      expect(result.data).toBeNull();
      expect(result.error).toBe('Todo not found');
    });

    it('returns network error on fetch failure', async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error('Network failure'));

      const result = await deleteTodo(1);

      expect(result.data).toBeNull();
      expect(result.error).toBe('Network error. Please try again.');
    });
  });

  describe('Error handling edge cases', () => {
    it('returns generic message when JSON has no message field', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: async () => ({ error: 'SomeError' }),
      });

      const result = await getTodos();

      expect(result.data).toBeNull();
      expect(result.error).toBe('Internal Server Error');
    });

    it('returns generic message when statusText is empty', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        statusText: '',
        json: async () => {
          throw new Error('Invalid JSON');
        },
      });

      const result = await getTodos();

      expect(result.data).toBeNull();
      expect(result.error).toBe('Unexpected response from server.');
    });
  });
});

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useTodos } from './use-todos';
import * as api from '../api';

vi.mock('../api');

const mockTodo1: any = {
  id: 1,
  text: 'Buy groceries',
  completed: false,
  createdAt: '2026-02-18T10:00:00Z',
};

const mockTodo2: any = {
  id: 2,
  text: 'Walk dog',
  completed: true,
  createdAt: '2026-02-18T11:00:00Z',
};

const mockTodo3: any = {
  id: 3,
  text: 'Write code',
  completed: false,
  createdAt: '2026-02-18T12:00:00Z',
};

describe('useTodos hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should load todos on component mount', async () => {
    vi.mocked(api.getTodos).mockResolvedValue({
      data: [mockTodo1, mockTodo2],
      error: null,
    });

    const { result } = renderHook(() => useTodos());

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.todos).toEqual([mockTodo1, mockTodo2]);
    expect(result.current.error).toBeNull();
    expect(api.getTodos).toHaveBeenCalledTimes(1);
  });

  it('should set error state when initial fetch fails', async () => {
    vi.mocked(api.getTodos).mockResolvedValue({
      data: null,
      error: 'Failed to fetch todos',
    });

    const { result } = renderHook(() => useTodos());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.todos).toEqual([]);
    expect(result.current.error).toBe('Failed to fetch todos');
  });

  it('should reject createTodo with empty text', async () => {
    vi.mocked(api.getTodos).mockResolvedValue({
      data: [mockTodo1],
      error: null,
    });

    const { result } = renderHook(() => useTodos());

    await waitFor(() => {
      expect(result.current.todos.length).toBeGreaterThan(0);
    });

    let createResult;
    await act(async () => {
      createResult = await result.current.createTodo('');
    });

    expect(createResult?.error).toBe('Todo text cannot be empty');
    expect(result.current.todos).toEqual([mockTodo1]);
    expect(api.createTodo).not.toHaveBeenCalled();
  });

  it('should reject createTodo with whitespace-only text', async () => {
    vi.mocked(api.getTodos).mockResolvedValue({
      data: [mockTodo1],
      error: null,
    });

    const { result } = renderHook(() => useTodos());

    await waitFor(() => {
      expect(result.current.todos.length).toBeGreaterThan(0);
    });

    let createResult;
    await act(async () => {
      createResult = await result.current.createTodo('   ');
    });

    expect(createResult?.error).toBe('Todo text cannot be empty');
    expect(api.createTodo).not.toHaveBeenCalled();
  });

  it('should add todo when createTodo succeeds', async () => {
    vi.mocked(api.getTodos).mockResolvedValue({
      data: [mockTodo1],
      error: null,
    });
    vi.mocked(api.createTodo).mockResolvedValue({
      data: mockTodo2,
      error: null,
    });

    const { result } = renderHook(() => useTodos());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    let createResult;
    await act(async () => {
      createResult = await result.current.createTodo('Walk dog');
    });

    expect(createResult).toEqual({ data: mockTodo2, error: null });
    expect(result.current.todos).toEqual([mockTodo1, mockTodo2]);
    expect(result.current.error).toBeNull();
    expect(api.createTodo).toHaveBeenCalledWith('Walk dog');
  });

  it('should set error state when createTodo fails', async () => {
    vi.mocked(api.getTodos).mockResolvedValue({
      data: [mockTodo1],
      error: null,
    });
    vi.mocked(api.createTodo).mockResolvedValue({
      data: null,
      error: 'Failed to create todo',
    });

    const { result } = renderHook(() => useTodos());

    await waitFor(() => {
      expect(result.current.todos.length).toBeGreaterThan(0);
    });

    let createResult;
    await act(async () => {
      createResult = await result.current.createTodo('Invalid');
    });

    expect(createResult.error).toBe('Failed to create todo');
    expect(result.current.error).toBe('Failed to create todo');
    expect(result.current.todos).toEqual([mockTodo1]);
  });

  it('should update todo when updateTodo succeeds', async () => {
    vi.mocked(api.getTodos).mockResolvedValue({
      data: [mockTodo1, mockTodo2],
      error: null,
    });
    vi.mocked(api.updateTodo).mockResolvedValue({
      data: { ...mockTodo1, completed: true },
      error: null,
    });

    const { result } = renderHook(() => useTodos());

    await waitFor(() => {
      expect(result.current.todos.length).toBe(2);
    });

    let updateResult;
    await act(async () => {
      updateResult = await result.current.updateTodo(1, true);
    });

    expect(updateResult.error).toBeNull();
    expect(result.current.todos[0]).toEqual({ ...mockTodo1, completed: true });
    expect(result.current.error).toBeNull();
    expect(api.updateTodo).toHaveBeenCalledWith(1, true);
  });

  it('should set error state when updateTodo fails', async () => {
    vi.mocked(api.getTodos).mockResolvedValue({
      data: [mockTodo1],
      error: null,
    });
    vi.mocked(api.updateTodo).mockResolvedValue({
      data: null,
      error: 'Failed to update todo',
    });

    const { result } = renderHook(() => useTodos());

    await waitFor(() => {
      expect(result.current.todos.length).toBeGreaterThan(0);
    });

    let updateResult;
    await act(async () => {
      updateResult = await result.current.updateTodo(1, true);
    });

    expect(updateResult.error).toBe('Failed to update todo');
    expect(result.current.error).toBe('Failed to update todo');
  });

  it('should remove todo when deleteTodo succeeds', async () => {
    vi.mocked(api.getTodos).mockResolvedValue({
      data: [mockTodo1, mockTodo2, mockTodo3],
      error: null,
    });
    vi.mocked(api.deleteTodo).mockResolvedValue({
      data: null,
      error: null,
    });

    const { result } = renderHook(() => useTodos());

    await waitFor(() => {
      expect(result.current.todos.length).toBe(3);
    });

    let deleteResult;
    await act(async () => {
      deleteResult = await result.current.deleteTodo(2);
    });

    expect(deleteResult.error).toBeNull();
    expect(result.current.todos).toEqual([mockTodo1, mockTodo3]);
    expect(result.current.error).toBeNull();
    expect(api.deleteTodo).toHaveBeenCalledWith(2);
  });

  it('should set error state when deleteTodo fails', async () => {
    vi.mocked(api.getTodos).mockResolvedValue({
      data: [mockTodo1],
      error: null,
    });
    vi.mocked(api.deleteTodo).mockResolvedValue({
      data: null,
      error: 'Failed to delete todo',
    });

    const { result } = renderHook(() => useTodos());

    await waitFor(() => {
      expect(result.current.todos.length).toBeGreaterThan(0);
    });

    let deleteResult;
    await act(async () => {
      deleteResult = await result.current.deleteTodo(1);
    });

    expect(deleteResult.error).toBe('Failed to delete todo');
    expect(result.current.error).toBe('Failed to delete todo');
  });

  it('should clear error on successful operation after failure', async () => {
    vi.mocked(api.getTodos).mockResolvedValue({
      data: [mockTodo1],
      error: null,
    });
    vi.mocked(api.createTodo).mockResolvedValueOnce({
      data: null,
      error: 'Failed to create',
    });
    vi.mocked(api.createTodo).mockResolvedValueOnce({
      data: mockTodo2,
      error: null,
    });

    const { result } = renderHook(() => useTodos());

    await waitFor(() => {
      expect(result.current.todos.length).toBeGreaterThan(0);
    });

    // First create fails
    await act(async () => {
      await result.current.createTodo('Text');
    });
    expect(result.current.error).toBe('Failed to create');

    // Second create succeeds and clears error
    await act(async () => {
      await result.current.createTodo('Text');
    });
    expect(result.current.error).toBeNull();
  });

  it('should clear error on successful refetch after failure', async () => {
    vi.mocked(api.getTodos).mockResolvedValueOnce({
      data: null,
      error: 'Failed to fetch todos',
    });
    vi.mocked(api.getTodos).mockResolvedValueOnce({
      data: [mockTodo1, mockTodo2],
      error: null,
    });

    const { result } = renderHook(() => useTodos());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('Failed to fetch todos');

    await act(async () => {
      await result.current.refetch();
    });

    expect(result.current.error).toBeNull();
    expect(result.current.todos).toEqual([mockTodo1, mockTodo2]);
  });

  it('should refetch todos when refetch is called', async () => {
    vi.mocked(api.getTodos).mockResolvedValueOnce({
      data: [mockTodo1],
      error: null,
    });
    vi.mocked(api.getTodos).mockResolvedValueOnce({
      data: [mockTodo1, mockTodo2, mockTodo3],
      error: null,
    });

    const { result } = renderHook(() => useTodos());

    await waitFor(() => {
      expect(result.current.todos.length).toBe(1);
    });

    await act(async () => {
      await result.current.refetch();
    });

    expect(result.current.todos).toEqual([mockTodo1, mockTodo2, mockTodo3]);
    expect(api.getTodos).toHaveBeenCalledTimes(2);
  });

  it('should set loading state during fetch operations', async () => {
    vi.mocked(api.getTodos).mockImplementation(
      () =>
        new Promise((resolve) => {
          setTimeout(() => {
            resolve({ data: [mockTodo1], error: null });
          }, 10);
        }),
    );

    const { result } = renderHook(() => useTodos());

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.todos).toEqual([mockTodo1]);
  });
});

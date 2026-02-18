import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';
import { useTodos } from './hooks/use-todos';

// Mock the hook before importing App
vi.mock('./hooks/use-todos', () => ({
  useTodos: vi.fn(() => ({
    todos: [{ id: 1, text: 'Test todo', completed: false }],
    loading: false,
    error: null,
    createTodo: vi.fn(),
    updateTodo: vi.fn(),
    deleteTodo: vi.fn(),
    clearError: vi.fn(),
    refetch: vi.fn(),
  })),
}));

describe('App', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<App />);
    expect(document.body).toBeDefined();
  });

  it('renders the app title', () => {
    render(<App />);
    const heading = screen.getByText(/my todos/i);
    expect(heading).toBeInTheDocument();
  });

  it('applies correct styling to the heading', () => {
    render(<App />);
    const heading = screen.getByText(/my todos/i);
    expect(heading).toHaveClass('text-2xl', 'sm:text-3xl', 'font-bold', 'text-slate-900');
  });

  it('renders the TodoInput component', () => {
    render(<App />);
    const input = screen.getByPlaceholderText(/what needs to be done/i);
    expect(input).toBeInTheDocument();
  });

  it('renders the TodoList component with todos', () => {
    render(<App />);
    const todoText = screen.getByText(/Test todo/i);
    expect(todoText).toBeInTheDocument();
  });

  // AC 8: Error banner shown inline without hiding input
  it('renders error banner alongside TodoInput when error exists', () => {
    vi.mocked(useTodos).mockReturnValue({
      todos: [{ id: 1, text: 'Test todo', completed: false, createdAt: '2026-02-18T00:00:00Z' }],
      loading: false,
      error: 'Network error. Please try again.',
      createTodo: vi.fn(),
      updateTodo: vi.fn(),
      deleteTodo: vi.fn(),
      clearError: vi.fn(),
      refetch: vi.fn(),
    });

    render(<App />);

    // Error message should be visible
    const errorMessage = screen.getByText(/network error/i);
    expect(errorMessage).toBeInTheDocument();

    // TodoInput should still be visible (AC 8)
    const input = screen.getByPlaceholderText(/what needs to be done/i);
    expect(input).toBeInTheDocument();

    // TodoList should still be visible
    const todoText = screen.getByText(/Test todo/i);
    expect(todoText).toBeInTheDocument();
  });

  // AC 8: Error banner shown even with no todos
  it('renders error banner and TodoInput when error exists with no todos', () => {
    vi.mocked(useTodos).mockReturnValue({
      todos: [{ id: 1, text: 'Existing todo', completed: false, createdAt: '2026-02-18T00:00:00Z' }],
      loading: false,
      error: 'Server is unavailable. Please try again later.',
      createTodo: vi.fn(),
      updateTodo: vi.fn(),
      deleteTodo: vi.fn(),
      clearError: vi.fn(),
      refetch: vi.fn(),
    });

    render(<App />);

    // Error message should be visible
    const errorMessage = screen.getByText(/server is unavailable/i);
    expect(errorMessage).toBeInTheDocument();

    // TodoInput should be visible (AC 8 - retry path available)
    const input = screen.getByPlaceholderText(/what needs to be done/i);
    expect(input).toBeInTheDocument();
  });

  // AC 10: Input value preserved when createTodo fails
  it('preserves input value after failed create', async () => {
    const createTodo = vi.fn().mockResolvedValue({
      data: null,
      error: 'Network error. Please try again.',
    });

    vi.mocked(useTodos).mockReturnValue({
      todos: [{ id: 1, text: 'Existing todo', completed: false, createdAt: '2026-02-18T00:00:00Z' }],
      loading: false,
      error: null,
      createTodo,
      updateTodo: vi.fn(),
      deleteTodo: vi.fn(),
      clearError: vi.fn(),
      refetch: vi.fn(),
    });

    render(<App />);

    const input = screen.getByPlaceholderText(/what needs to be done/i);
    const button = screen.getByRole('button', { name: /add/i });

    fireEvent.change(input, { target: { value: 'Keep me' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(input).toHaveValue('Keep me');
    });
  });
});
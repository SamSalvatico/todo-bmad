import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import App from './App';

// Mock the hook before importing App
vi.mock('./hooks/use-todos', () => ({
  useTodos: vi.fn(() => ({
    todos: [],
    loading: false,
    error: null,
    createTodo: vi.fn(),
    updateTodo: vi.fn(),
    deleteTodo: vi.fn(),
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
    expect(heading).toHaveClass('text-3xl', 'font-bold', 'text-slate-900');
  });

  it('renders the TodoInput component', () => {
    render(<App />);
    const input = screen.getByPlaceholderText(/what needs to be done/i);
    expect(input).toBeInTheDocument();
  });

  it('renders the TodoList component when empty', () => {
    render(<App />);
    const emptyMessage = screen.getByText(/no todos yet/i);
    expect(emptyMessage).toBeInTheDocument();
  });
});

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TodoList } from './TodoList';
import { Todo } from '../types/todo';

describe('TodoList', () => {
  const mockTodos: Todo[] = [
    {
      id: 1,
      text: 'First todo',
      completed: false,
      createdAt: '2024-01-01T00:00:00Z',
    },
    {
      id: 2,
      text: 'Second todo',
      completed: true,
      createdAt: '2024-01-02T00:00:00Z',
    },
  ];

  it('renders empty when todos array is empty', () => {
    const onToggle = vi.fn();
    const onDelete = vi.fn();

    const { container } = render(
      <TodoList todos={[]} onToggle={onToggle} onDelete={onDelete} />
    );

    const list = container.querySelector('ul');
    if (list) {
      expect(list.children).toHaveLength(0);
    }
  });

  it('renders multiple TodoItems when todos array has items', () => {
    const onToggle = vi.fn();
    const onDelete = vi.fn();

    render(
      <TodoList todos={mockTodos} onToggle={onToggle} onDelete={onDelete} />
    );

    expect(screen.getByText('First todo')).toBeInTheDocument();
    expect(screen.getByText('Second todo')).toBeInTheDocument();
  });

  it('passes props correctly to TodoItem children', () => {
    const onToggle = vi.fn();
    const onDelete = vi.fn();

    render(
      <TodoList todos={mockTodos} onToggle={onToggle} onDelete={onDelete} />
    );

    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes).toHaveLength(2);
  });

  it('renders semantic HTML with ul/li', () => {
    const onToggle = vi.fn();
    const onDelete = vi.fn();

    const { container } = render(
      <TodoList todos={mockTodos} onToggle={onToggle} onDelete={onDelete} />
    );

    const list = container.querySelector('ul');
    expect(list).toBeInTheDocument();
    expect(list).toHaveAttribute('aria-label', 'Todo list');

    const items = container.querySelectorAll('li');
    expect(items).toHaveLength(2);
  });

  it('renders empty state message when todos array is empty', () => {
    const onToggle = vi.fn();
    const onDelete = vi.fn();

    render(
      <TodoList todos={[]} onToggle={onToggle} onDelete={onDelete} />
    );

    expect(screen.getByText(/No todos yet/i)).toBeInTheDocument();
  });

  it('renders list instead of empty state when todos exist', () => {
    const onToggle = vi.fn();
    const onDelete = vi.fn();

    const { container } = render(
      <TodoList todos={mockTodos} onToggle={onToggle} onDelete={onDelete} />
    );

    const list = container.querySelector('ul');
    expect(list).toBeInTheDocument();
    expect(screen.queryByText(/No todos yet/i)).not.toBeInTheDocument();
  });

  it('renders with Tailwind styling classes', () => {
    const onToggle = vi.fn();
    const onDelete = vi.fn();

    const { container } = render(
      <TodoList todos={mockTodos} onToggle={onToggle} onDelete={onDelete} />
    );

    const list = container.querySelector('ul');
    expect(list).toHaveClass('space-y-0', 'border', 'border-gray-200', 'rounded-lg', 'overflow-hidden', 'shadow-sm');
  });
});

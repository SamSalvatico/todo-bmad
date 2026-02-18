import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TodoItem } from './TodoItem';
import { Todo } from '../types/todo';

describe('TodoItem', () => {
  const mockTodo: Todo = {
    id: 1,
    text: 'Test todo',
    completed: false,
    createdAt: '2024-01-01T00:00:00Z',
  };

  it('renders todo text', () => {
    const onToggle = vi.fn();
    const onDelete = vi.fn();

    render(<TodoItem todo={mockTodo} onToggle={onToggle} onDelete={onDelete} />);

    expect(screen.getByText('Test todo')).toBeInTheDocument();
  });

  it('calls onToggle with todo id when checkbox is clicked', async () => {
    const onToggle = vi.fn();
    const onDelete = vi.fn();
    const user = userEvent.setup();

    render(<TodoItem todo={mockTodo} onToggle={onToggle} onDelete={onDelete} />);

    const checkbox = screen.getByRole('checkbox');
    await user.click(checkbox);

    expect(onToggle).toHaveBeenCalledWith(1);
  });

  it('calls onDelete with todo id when delete button is clicked and confirmed', async () => {
    const onToggle = vi.fn();
    const onDelete = vi.fn();
    const user = userEvent.setup();

    global.confirm = vi.fn(() => true);

    render(<TodoItem todo={mockTodo} onToggle={onToggle} onDelete={onDelete} />);

    const deleteButton = screen.getByRole('button', { name: /delete/i });
    await user.click(deleteButton);

    expect(global.confirm).toHaveBeenCalled();
    expect(onDelete).toHaveBeenCalledWith(1);
  });

  it('does not call onDelete when delete confirmation is cancelled', async () => {
    const onToggle = vi.fn();
    const onDelete = vi.fn();
    const user = userEvent.setup();

    global.confirm = vi.fn(() => false);

    render(<TodoItem todo={mockTodo} onToggle={onToggle} onDelete={onDelete} />);

    const deleteButton = screen.getByRole('button', { name: /delete/i });
    await user.click(deleteButton);

    expect(global.confirm).toHaveBeenCalled();
    expect(onDelete).not.toHaveBeenCalled();
  });

  it('applies line-through style when todo is completed', () => {
    const onToggle = vi.fn();
    const onDelete = vi.fn();
    const completedTodo = { ...mockTodo, completed: true };

    const { container } = render(
      <TodoItem todo={completedTodo} onToggle={onToggle} onDelete={onDelete} />,
    );

    const textElement = screen.getByText('Test todo');
    expect(textElement).toHaveClass('line-through');
  });

  it('does not apply line-through style when todo is not completed', () => {
    const onToggle = vi.fn();
    const onDelete = vi.fn();

    render(<TodoItem todo={mockTodo} onToggle={onToggle} onDelete={onDelete} />);

    const textElement = screen.getByText('Test todo');
    expect(textElement).not.toHaveClass('line-through');
  });

  it('checkbox is checked when todo is completed', () => {
    const onToggle = vi.fn();
    const onDelete = vi.fn();
    const completedTodo = { ...mockTodo, completed: true };

    render(<TodoItem todo={completedTodo} onToggle={onToggle} onDelete={onDelete} />);

    const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
    expect(checkbox.checked).toBe(true);
  });

  it('checkbox is unchecked when todo is not completed', () => {
    const onToggle = vi.fn();
    const onDelete = vi.fn();

    render(<TodoItem todo={mockTodo} onToggle={onToggle} onDelete={onDelete} />);

    const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
    expect(checkbox.checked).toBe(false);
  });

  it('renders with Tailwind styling classes', () => {
    const onToggle = vi.fn();
    const onDelete = vi.fn();

    const { container } = render(
      <TodoItem todo={mockTodo} onToggle={onToggle} onDelete={onDelete} />,
    );

    const listItem = container.querySelector('li');
    expect(listItem).toHaveClass(
      'flex',
      'items-center',
      'gap-4',
      'p-3',
      'border-b',
      'hover:bg-gray-50',
    );
  });

  it('last item should not have bottom border via last:border-b-0', () => {
    const onToggle = vi.fn();
    const onDelete = vi.fn();

    const { container } = render(
      <TodoItem todo={mockTodo} onToggle={onToggle} onDelete={onDelete} />,
    );

    const listItem = container.querySelector('li');
    expect(listItem).toHaveClass('last:border-b-0');
  });
});

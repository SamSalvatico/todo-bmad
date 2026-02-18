import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TodoInput } from './TodoInput';

describe('TodoInput', () => {
  it('renders an input with placeholder "What needs to be done?"', () => {
    const onChange = vi.fn();
    const onSubmit = vi.fn();

    render(
      <TodoInput value="" onChange={onChange} onSubmit={onSubmit} disabled={false} />
    );

    const input = screen.getByPlaceholderText('What needs to be done?');
    expect(input).toBeInTheDocument();
    expect(input).toHaveClass('px-4', 'py-2', 'border', 'border-gray-300', 'rounded-lg', 'focus:ring-blue-500');
  });

  it('calls onChange when input value changes', async () => {
    const onChange = vi.fn();
    const onSubmit = vi.fn();
    const user = userEvent.setup();

    render(
      <TodoInput value="" onChange={onChange} onSubmit={onSubmit} disabled={false} />
    );

    const input = screen.getByPlaceholderText('What needs to be done?');
    await user.type(input, 'Test');

    expect(onChange).toHaveBeenCalled();
    expect(onChange).toHaveBeenCalledWith('T');
    expect(onChange).toHaveBeenCalledWith('e');
    expect(onChange).toHaveBeenCalledWith('s');
    expect(onChange).toHaveBeenCalledWith('t');
  });

  it('calls onSubmit when Enter key is pressed', async () => {
    const onChange = vi.fn();
    const onSubmit = vi.fn();
    const user = userEvent.setup();

    render(
      <TodoInput value="New todo" onChange={onChange} onSubmit={onSubmit} disabled={false} />
    );

    const input = screen.getByPlaceholderText('What needs to be done?');
    await user.click(input);
    await user.keyboard('{Enter}');

    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it('calls onSubmit when submit button is clicked', async () => {
    const onChange = vi.fn();
    const onSubmit = vi.fn();
    const user = userEvent.setup();

    render(
      <TodoInput value="New todo" onChange={onChange} onSubmit={onSubmit} disabled={false} />
    );

    const button = screen.getByRole('button');
    await user.click(button);

    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it('disables input and button when disabled prop is true', () => {
    const onChange = vi.fn();
    const onSubmit = vi.fn();

    render(
      <TodoInput value="" onChange={onChange} onSubmit={onSubmit} disabled={true} />
    );

    const input = screen.getByPlaceholderText('What needs to be done?') as HTMLInputElement;
    const button = screen.getByRole('button') as HTMLButtonElement;

    expect(input.disabled).toBe(true);
    expect(button.disabled).toBe(true);
  });

  it('disables submit button when input is empty', () => {
    const onChange = vi.fn();
    const onSubmit = vi.fn();

    const { rerender } = render(
      <TodoInput value="" onChange={onChange} onSubmit={onSubmit} disabled={false} />
    );

    const button = screen.getByRole('button') as HTMLButtonElement;
    expect(button.disabled).toBe(true);

    rerender(
      <TodoInput value="Test" onChange={onChange} onSubmit={onSubmit} disabled={false} />
    );

    expect(button.disabled).toBe(false);
  });

  it('does not call onSubmit when Enter is pressed with empty value', async () => {
    const onChange = vi.fn();
    const onSubmit = vi.fn();
    const user = userEvent.setup();

    render(
      <TodoInput value="" onChange={onChange} onSubmit={onSubmit} disabled={false} />
    );

    const input = screen.getByPlaceholderText('What needs to be done?');
    await user.click(input);
    await user.keyboard('{Enter}');

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('uses custom submitLabel when provided', () => {
    const onChange = vi.fn();
    const onSubmit = vi.fn();

    render(
      <TodoInput value="" onChange={onChange} onSubmit={onSubmit} disabled={false} submitLabel="Create" />
    );

    const button = screen.getByRole('button', { name: /create/i });
    expect(button).toBeInTheDocument();
  });

  it('renders with the controlled value', () => {
    const onChange = vi.fn();
    const onSubmit = vi.fn();

    const { rerender } = render(
      <TodoInput value="Test value" onChange={onChange} onSubmit={onSubmit} disabled={false} />
    );

    const input = screen.getByPlaceholderText('What needs to be done?') as HTMLInputElement;
    expect(input.value).toBe('Test value');

    rerender(
      <TodoInput value="Updated value" onChange={onChange} onSubmit={onSubmit} disabled={false} />
    );

    expect(input.value).toBe('Updated value');
  });
});

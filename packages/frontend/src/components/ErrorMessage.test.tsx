import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ErrorMessage } from './ErrorMessage';

describe('ErrorMessage', () => {
  it('renders error message text', () => {
    render(<ErrorMessage message="Network error. Please try again." />);
    expect(screen.getByText(/Network error\. Please try again\./i)).toBeInTheDocument();
  });

  it('has role="alert" ARIA attribute', () => {
    render(<ErrorMessage message="Test error" />);
    const container = screen.getByRole('alert');
    expect(container).toBeInTheDocument();
  });

  it('has aria-live="assertive" ARIA attribute', () => {
    render(<ErrorMessage message="Test error" />);
    const container = screen.getByRole('alert');
    expect(container).toHaveAttribute('aria-live', 'assertive');
  });

  it('shows dismiss button when onDismiss is provided', () => {
    const mockDismiss = vi.fn();
    render(<ErrorMessage message="Test error" onDismiss={mockDismiss} />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('does NOT show dismiss button when onDismiss is undefined', () => {
    render(<ErrorMessage message="Test error" />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('calls onDismiss handler when dismiss button is clicked', async () => {
    const mockDismiss = vi.fn();
    const user = userEvent.setup();
    render(<ErrorMessage message="Test error" onDismiss={mockDismiss} />);
    
    const dismissButton = screen.getByRole('button');
    await user.click(dismissButton);
    
    expect(mockDismiss).toHaveBeenCalledTimes(1);
  });

  it('displays with error styling (visual distinctiveness)', () => {
    const { container } = render(<ErrorMessage message="Test error" />);
    const errorDiv = container.querySelector('[role="alert"]');
    expect(errorDiv).toHaveClass('bg-red-50');
    expect(errorDiv).toHaveClass('border-red-200');
  });
});

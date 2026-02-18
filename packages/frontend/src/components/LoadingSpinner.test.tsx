import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LoadingSpinner } from './LoadingSpinner';

describe('LoadingSpinner', () => {
  it('renders default message "Loading..."', () => {
    render(<LoadingSpinner />);
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  });

  it('renders custom message prop when provided', () => {
    render(<LoadingSpinner message="Loading todos..." />);
    expect(screen.getByText(/Loading todos.../i)).toBeInTheDocument();
  });

  it('has role="status" ARIA attribute', () => {
    render(<LoadingSpinner />);
    const container = screen.getByRole('status');
    expect(container).toBeInTheDocument();
  });

  it('has aria-live="polite" ARIA attribute', () => {
    render(<LoadingSpinner />);
    const container = screen.getByRole('status');
    expect(container).toHaveAttribute('aria-live', 'polite');
  });

  it('displays visible spinner indicator', () => {
    const { container } = render(<LoadingSpinner />);
    const spinner = container.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });
});

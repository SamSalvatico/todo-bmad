import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { EmptyState } from './EmptyState';

describe('EmptyState', () => {
  it('renders with expected message', () => {
    render(<EmptyState />);
    expect(screen.getByText(/No todos yet\. Add one to get started!/i)).toBeInTheDocument();
  });

  it('has proper ARIA role attribute', () => {
    render(<EmptyState />);
    const container = screen.getByRole('status');
    expect(container).toBeInTheDocument();
  });

  it('displays message text', () => {
    render(<EmptyState />);
    const message = screen.getByText(/No todos yet/i);
    expect(message).toBeVisible();
  });
});

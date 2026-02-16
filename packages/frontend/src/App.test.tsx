import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import App from './App';

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />);
    expect(document.body).toBeDefined();
  });

  it('renders the app title', () => {
    render(<App />);
    const heading = screen.getByText(/todo app/i);
    expect(heading).toBeInTheDocument();
  });

  it('applies correct styling to the heading', () => {
    render(<App />);
    const heading = screen.getByText(/todo app/i);
    expect(heading).toHaveClass('text-3xl', 'font-semibold', 'text-blue-600');
  });
});

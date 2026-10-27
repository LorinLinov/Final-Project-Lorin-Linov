import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Footer from './Footer';

describe('Footer', () => {
  it('renders a footer element', () => {
    render(<Footer />);
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });

  it('renders the copyright text', () => {
    render(<Footer />);
    expect(
      screen.getByText('© 2026 Veggie Haven. Fresh farm vegetables daily.')
    ).toBeInTheDocument();
  });

  it('renders the text inside a paragraph in the footer', () => {
    render(<Footer />);
    const footer = screen.getByRole('contentinfo');
    expect(footer.querySelector('p')).toHaveTextContent(/veggie haven/i);
  });

  it('matches the snapshot', () => {
    const { container } = render(<Footer />);
    expect(container).toMatchSnapshot();
  });
});
import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import ErrorPage from './Error';

const renderError = () =>
  render(
    <MemoryRouter>
      <ErrorPage />
    </MemoryRouter>
  );

describe('Error (404 page)', () => {
  it('renders the 404 heading', () => {
    renderError();
    expect(
      screen.getByRole('heading', { level: 1, name: '404' })
    ).toBeInTheDocument();
  });

  it('renders the "Page Not Found" heading', () => {
    renderError();
    expect(
      screen.getByRole('heading', { level: 2, name: 'Page Not Found' })
    ).toBeInTheDocument();
  });

  it('renders the explanatory message', () => {
    renderError();
    expect(
      screen.getByText(/this vegetable was already harvested/i)
    ).toBeInTheDocument();
  });

  it('renders a link back to the home page', () => {
    renderError();
    const link = screen.getByRole('link', { name: 'Return to Home' });
    expect(link).toHaveAttribute('href', '/');
    expect(link).toHaveClass('btn');
  });

  it('wraps the content in a centered card', () => {
    renderError();
    const card = screen.getByRole('heading', { level: 1 }).parentElement;
    expect(card).toHaveClass('card', 'text-center');
  });
});
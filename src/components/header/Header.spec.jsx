import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import Header from './Header';
import useAuth from '../../hooks/useAuth';

vi.mock('../../hooks/useAuth', () => ({
  default: vi.fn(),
}));

const renderHeader = (isAuthenticated) => {
  useAuth.mockReturnValue({ isAuthenticated });
  return render(
    <MemoryRouter>
      <Header />
    </MemoryRouter>
  );
};

describe('Header', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('always visible', () => {
    it('renders a header element', () => {
      renderHeader(false);
      expect(screen.getByRole('banner')).toBeInTheDocument();
    });

    it('renders the logo as a link to the home page', () => {
      renderHeader(false);
      const logo = screen.getByRole('link', { name: /veggie haven/i });
      expect(logo).toHaveAttribute('href', '/');
      expect(logo).toHaveClass('logo');
      expect(
        screen.getByRole('heading', { level: 1, name: /veggie haven/i })
      ).toBeInTheDocument();
    });

    it.each([false, true])(
      'renders the Home and Catalog links (isAuthenticated=%s)',
      (isAuthenticated) => {
        renderHeader(isAuthenticated);
        expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/');
        expect(screen.getByRole('link', { name: 'Catalog' })).toHaveAttribute('href', '/catalog');
      }
    );
  });

  describe('guest (not authenticated)', () => {
    it('shows the Login and Sign Up links', () => {
      renderHeader(false);
      expect(screen.getByRole('link', { name: 'Login' })).toHaveAttribute('href', '/login');
      expect(screen.getByRole('link', { name: 'Sign Up' })).toHaveAttribute('href', '/register');
    });

    it('renders them inside the guest container', () => {
      const { container } = renderHeader(false);
      const guest = container.querySelector('#guest');
      expect(guest).toBeInTheDocument();
      expect(within(guest).getAllByRole('link')).toHaveLength(2);
    });

    it('does not show the user links', () => {
      const { container } = renderHeader(false);
      expect(screen.queryByRole('link', { name: 'Add Item' })).not.toBeInTheDocument();
      expect(screen.queryByRole('link', { name: 'Logout' })).not.toBeInTheDocument();
      expect(container.querySelector('#user')).not.toBeInTheDocument();
    });
  });

  describe('authenticated user', () => {
    it('shows the Add Item and Logout links', () => {
      renderHeader(true);
      expect(screen.getByRole('link', { name: 'Add Item' })).toHaveAttribute('href', '/create');
      expect(screen.getByRole('link', { name: 'Logout' })).toHaveAttribute('href', '/logout');
    });

    it('renders them inside the user container', () => {
      const { container } = renderHeader(true);
      const userBox = container.querySelector('#user');
      expect(userBox).toBeInTheDocument();
      expect(within(userBox).getAllByRole('link')).toHaveLength(2);
    });

    it('does not show the guest links', () => {
      const { container } = renderHeader(true);
      expect(screen.queryByRole('link', { name: 'Login' })).not.toBeInTheDocument();
      expect(screen.queryByRole('link', { name: 'Sign Up' })).not.toBeInTheDocument();
      expect(container.querySelector('#guest')).not.toBeInTheDocument();
    });
  });
});
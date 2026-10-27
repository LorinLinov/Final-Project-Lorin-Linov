import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router';
import Logout from './Logout';
import AuthContext from '../../contexts/auth-context';

let logout;

const renderLogout = (contextValue = { logout }) =>
  render(
    <AuthContext.Provider value={contextValue}>
      <MemoryRouter initialEntries={['/logout']}>
        <Routes>
          <Route path="/" element={<div>Home page</div>} />
          <Route path="/logout" element={<Logout />} />
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>
  );

describe('Logout', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    logout = vi.fn();
  });

  it('calls logout on mount', () => {
    renderLogout();
    expect(logout).toHaveBeenCalledTimes(1);
  });

  it('redirects to the home page', () => {
    renderLogout();
    expect(screen.getByText('Home page')).toBeInTheDocument();
  });

  it('does not stay on the logout route', () => {
    renderLogout();
    // Logout renders nothing itself, so only the home route content is shown
    expect(screen.queryByText('Home page')).toBeInTheDocument();
    expect(logout).toHaveBeenCalledTimes(1);
  });

  it('calls logout again if the logout function changes', () => {
    const first = vi.fn();
    const second = vi.fn();

    const { rerender } = render(
      <AuthContext.Provider value={{ logout: first }}>
        <MemoryRouter initialEntries={['/logout']}>
          <Logout />
        </MemoryRouter>
      </AuthContext.Provider>
    );
    expect(first).toHaveBeenCalledTimes(1);

    rerender(
      <AuthContext.Provider value={{ logout: second }}>
        <MemoryRouter initialEntries={['/logout']}>
          <Logout />
        </MemoryRouter>
      </AuthContext.Provider>
    );
    expect(second).toHaveBeenCalledTimes(1);
  });
});
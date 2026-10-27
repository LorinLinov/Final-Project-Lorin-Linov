import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import Login from './Login';
import useAuth from '../../hooks/useAuth';
import { toast } from 'react-toastify';

vi.mock('../../hooks/useAuth', () => ({
  default: vi.fn(),
}));

vi.mock('react-toastify', () => ({
  toast: { error: vi.fn() },
}));

let login;

const renderLogin = () =>
  render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  );

const submit = (u) => u.click(screen.getByRole('button', { name: 'Sign In' }));

describe('Login', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    login = vi.fn();
    useAuth.mockReturnValue({ login });
  });

  describe('rendering', () => {
    it('renders the heading', () => {
      renderLogin();
      expect(screen.getByRole('heading', { name: 'Login' })).toBeInTheDocument();
    });

    it('renders the email and password fields', () => {
      renderLogin();
      const email = screen.getByLabelText('Email Address');
      const password = screen.getByLabelText('Password');

      expect(email).toHaveAttribute('type', 'email');
      expect(email).toHaveAttribute('name', 'email');
      expect(email).toHaveValue('');

      expect(password).toHaveAttribute('type', 'password');
      expect(password).toHaveAttribute('name', 'password');
      expect(password).toHaveValue('');
    });

    it('renders the submit button', () => {
      renderLogin();
      expect(screen.getByRole('button', { name: 'Sign In' })).toHaveAttribute(
        'type',
        'submit'
      );
    });

    it('renders a link to the register page', () => {
      renderLogin();
      const link = screen.getByRole('link', { name: 'Sign up here' });
      expect(link).toHaveAttribute('href', '/register');
      expect(link).toHaveClass('enterBtn');
    });
  });

  describe('typing', () => {
    it('updates the fields as the user types', async () => {
      const u = userEvent.setup();
      renderLogin();

      await u.type(screen.getByLabelText('Email Address'), 'john@example.com');
      await u.type(screen.getByLabelText('Password'), 'secret123');

      expect(screen.getByLabelText('Email Address')).toHaveValue('john@example.com');
      expect(screen.getByLabelText('Password')).toHaveValue('secret123');
    });
  });

  describe('submitting valid data', () => {
    it('calls login with the email and password', async () => {
      const u = userEvent.setup();
      renderLogin();

      await u.type(screen.getByLabelText('Email Address'), 'john@example.com');
      await u.type(screen.getByLabelText('Password'), 'secret123');
      await submit(u);

      await waitFor(() => expect(login).toHaveBeenCalledTimes(1));
      expect(login).toHaveBeenCalledWith({
        email: 'john@example.com',
        password: 'secret123',
      });
      expect(toast.error).not.toHaveBeenCalled();
    });

    it('also submits with the Enter key', async () => {
      const u = userEvent.setup();
      renderLogin();

      await u.type(screen.getByLabelText('Email Address'), 'john@example.com');
      await u.type(screen.getByLabelText('Password'), 'secret123{Enter}');

      await waitFor(() => expect(login).toHaveBeenCalledTimes(1));
    });
  });

  describe('submitting invalid data', () => {
    it('shows an error toast when both fields are empty', async () => {
      const u = userEvent.setup();
      renderLogin();
      await submit(u);

      await waitFor(() =>
        expect(toast.error).toHaveBeenCalledWith('All fields are required!')
      );
      expect(login).not.toHaveBeenCalled();
    });

    it('shows an error toast when the password is missing', async () => {
      const u = userEvent.setup();
      renderLogin();

      await u.type(screen.getByLabelText('Email Address'), 'john@example.com');
      await submit(u);

      await waitFor(() =>
        expect(toast.error).toHaveBeenCalledWith('All fields are required!')
      );
      expect(login).not.toHaveBeenCalled();
    });

    it('shows an error toast when the email is missing', async () => {
      const u = userEvent.setup();
      renderLogin();

      await u.type(screen.getByLabelText('Password'), 'secret123');
      await submit(u);

      await waitFor(() =>
        expect(toast.error).toHaveBeenCalledWith('All fields are required!')
      );
      expect(login).not.toHaveBeenCalled();
    });
  });
});
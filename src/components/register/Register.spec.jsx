import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import Register from './Register';
import useAuth from '../../hooks/useAuth';
import { toast } from 'react-toastify';

vi.mock('../../hooks/useAuth', () => ({
  default: vi.fn(),
}));

vi.mock('react-toastify', () => ({
  toast: { error: vi.fn() },
}));

let register;

const renderRegister = () =>
  render(
    <MemoryRouter>
      <Register />
    </MemoryRouter>
  );

const fill = async (u, { email, password, confirm } = {}) => {
  if (email) await u.type(screen.getByLabelText('Email Address'), email);
  if (password) await u.type(screen.getByLabelText('Password'), password);
  if (confirm) await u.type(screen.getByLabelText('Confirm Password'), confirm);
};

const submit = (u) => u.click(screen.getByRole('button', { name: 'Sign Up' }));

describe('Register', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    register = vi.fn();
    useAuth.mockReturnValue({ register });
  });

  describe('rendering', () => {
    it('renders the heading', () => {
      renderRegister();
      expect(
        screen.getByRole('heading', { name: 'Create an Account' })
      ).toBeInTheDocument();
    });

    it('renders the email, password and confirm password fields', () => {
      renderRegister();

      const email = screen.getByLabelText('Email Address');
      expect(email).toHaveAttribute('type', 'email');
      expect(email).toHaveAttribute('name', 'email');

      const password = screen.getByLabelText('Password');
      expect(password).toHaveAttribute('type', 'password');
      expect(password).toHaveAttribute('name', 'password');

      const confirm = screen.getByLabelText('Confirm Password');
      expect(confirm).toHaveAttribute('type', 'password');
      expect(confirm).toHaveAttribute('name', 'confirm_password');

      [email, password, confirm].forEach((el) => expect(el).toHaveValue(''));
    });

    it('renders the submit button', () => {
      renderRegister();
      expect(screen.getByRole('button', { name: 'Sign Up' })).toHaveAttribute(
        'type',
        'submit'
      );
    });

    it('renders a link to the login page', () => {
      renderRegister();
      const link = screen.getByRole('link', { name: 'Login here' });
      expect(link).toHaveAttribute('href', '/login');
      expect(link).toHaveClass('enterBtn');
    });
  });

  describe('typing', () => {
    it('updates the fields as the user types', async () => {
      const u = userEvent.setup();
      renderRegister();
      await fill(u, {
        email: 'john@example.com',
        password: 'secret123',
        confirm: 'secret123',
      });

      expect(screen.getByLabelText('Email Address')).toHaveValue('john@example.com');
      expect(screen.getByLabelText('Password')).toHaveValue('secret123');
      expect(screen.getByLabelText('Confirm Password')).toHaveValue('secret123');
    });
  });

  describe('submitting valid data', () => {
    it('calls register with only the email and password', async () => {
      const u = userEvent.setup();
      renderRegister();
      await fill(u, {
        email: 'john@example.com',
        password: 'secret123',
        confirm: 'secret123',
      });
      await submit(u);

      await waitFor(() => expect(register).toHaveBeenCalledTimes(1));
      expect(register).toHaveBeenCalledWith({
        email: 'john@example.com',
        password: 'secret123',
      });
      expect(toast.error).not.toHaveBeenCalled();
    });
  });

  describe('password mismatch', () => {
    it('shows an error toast and does not register', async () => {
      const u = userEvent.setup();
      renderRegister();
      await fill(u, {
        email: 'john@example.com',
        password: 'secret123',
        confirm: 'different',
      });
      await submit(u);

      await waitFor(() =>
        expect(toast.error).toHaveBeenCalledWith("Passwords don't match.")
      );
      expect(toast.error).toHaveBeenCalledTimes(1);
      expect(register).not.toHaveBeenCalled();
    });

    it('treats an empty confirmation as a mismatch', async () => {
      const u = userEvent.setup();
      renderRegister();
      await fill(u, { email: 'john@example.com', password: 'secret123' });
      await submit(u);

      await waitFor(() =>
        expect(toast.error).toHaveBeenCalledWith("Passwords don't match.")
      );
      expect(register).not.toHaveBeenCalled();
    });
  });

  describe('missing fields', () => {
    // BUG: the "required" check has no `return`, so register is still called.
    // When the bug is fixed, change these tests to expect register NOT to be called.
    it('shows the "required" toast when everything is empty, but still calls register', async () => {
      const u = userEvent.setup();
      renderRegister();
      await submit(u);

      await waitFor(() =>
        expect(toast.error).toHaveBeenCalledWith('All fields are required!')
      );
      expect(register).toHaveBeenCalledTimes(1);
      expect(register).toHaveBeenCalledWith({ email: '', password: '' });
    });

    it('shows the "required" toast when only the email is missing, but still calls register', async () => {
      const u = userEvent.setup();
      renderRegister();
      await fill(u, { password: 'secret123', confirm: 'secret123' });
      await submit(u);

      await waitFor(() =>
        expect(toast.error).toHaveBeenCalledWith('All fields are required!')
      );
      expect(register).toHaveBeenCalledWith({ email: '', password: 'secret123' });
    });
  });

  describe('register throwing', () => {
    it('logs the error message and shows no toast', async () => {
      const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      register.mockImplementation(() => {
        throw new Error('Email already taken');
      });

      const u = userEvent.setup();
      renderRegister();
      await fill(u, {
        email: 'john@example.com',
        password: 'secret123',
        confirm: 'secret123',
      });
      await submit(u);

      await waitFor(() =>
        expect(logSpy).toHaveBeenCalledWith('Email already taken')
      );
      expect(toast.error).not.toHaveBeenCalled();

      logSpy.mockRestore();
    });
  });
});
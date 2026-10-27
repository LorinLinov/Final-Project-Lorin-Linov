import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Create from './Create';
import { create } from '../../api/products-api.js';
import { toast } from 'react-toastify';

const { navigate } = vi.hoisted(() => ({ navigate: vi.fn() }));

vi.mock('react-router', () => ({
  useNavigate: () => navigate,
}));

vi.mock('../../api/products-api.js', () => ({
  create: vi.fn(),
}));

vi.mock('react-toastify', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

// imported by the component but never used
vi.mock('../../../utils/request.js', () => ({
  default: vi.fn(),
}));

const validValues = {
  'Vegetable Name': 'Bell Peppers',
  'Price per unit': '2.50',
  'Image URL': 'https://example.com/pepper.jpg',
  Description: 'Sweet and crunchy',
  Category: 'Vegetables',
  Farm: 'Green Acres',
  'In Stock': '10',
};

const field = (label) => screen.getByLabelText(new RegExp(label, 'i'));

// sets a value in one step (avoids number-input typing quirks in jsdom)
const setField = (label, value) =>
  fireEvent.change(field(label), { target: { value } });

const fillForm = (overrides = {}) => {
  Object.entries({ ...validValues, ...overrides }).forEach(([label, value]) =>
    setField(label, value)
  );
};

const submit = (u) =>
  u.click(screen.getByRole('button', { name: 'Create Product' }));

describe('Create', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    create.mockResolvedValue({});
  });

  describe('rendering', () => {
    it('renders the heading', () => {
      render(<Create />);
      expect(
        screen.getByRole('heading', { name: 'Add New Vegetable' })
      ).toBeInTheDocument();
    });

    it('renders all fields empty', () => {
      render(<Create />);
      Object.keys(validValues).forEach((label) => {
        // empty number inputs report null, text inputs report ''
        expect(field(label)).toHaveValue(
          ['Price per unit', 'In Stock'].includes(label) ? null : ''
        );
      });
    });

    it('renders the submit button', () => {
      render(<Create />);
      expect(
        screen.getByRole('button', { name: 'Create Product' })
      ).toHaveAttribute('type', 'submit');
    });

    it('uses the correct input types and constraints', () => {
      render(<Create />);
      expect(field('Vegetable Name')).toHaveAttribute('type', 'text');
      expect(field('Image URL')).toHaveAttribute('type', 'url');

      expect(field('Price per unit')).toHaveAttribute('type', 'number');
      expect(field('Price per unit')).toHaveAttribute('min', '0');
      expect(field('Price per unit')).toHaveAttribute('step', '0.01');

      expect(field('In Stock')).toHaveAttribute('type', 'number');
      expect(field('In Stock')).toHaveAttribute('min', '0');
      expect(field('In Stock')).toHaveAttribute('step', '1');
    });
  });

  describe('typing', () => {
    it('updates every field as the user types', async () => {
      const u = userEvent.setup();
      render(<Create />);

      await u.type(field('Vegetable Name'), 'Bell Peppers');
      await u.type(field('Description'), 'Sweet and crunchy');
      await u.type(field('Category'), 'Vegetables');
      await u.type(field('Farm'), 'Green Acres');
      setField('Price per unit', '2.50');
      setField('Image URL', 'https://example.com/pepper.jpg');
      setField('In Stock', '10');

      expect(field('Vegetable Name')).toHaveValue('Bell Peppers');
      expect(field('Description')).toHaveValue('Sweet and crunchy');
      expect(field('Category')).toHaveValue('Vegetables');
      expect(field('Farm')).toHaveValue('Green Acres');
      expect(field('Price per unit')).toHaveValue(2.5);
      expect(field('Image URL')).toHaveValue('https://example.com/pepper.jpg');
      expect(field('In Stock')).toHaveValue(10);
    });

    it('does not start with a leading 0 when typing a number', async () => {
      const u = userEvent.setup();
      render(<Create />);

      await u.type(field('In Stock'), '223');

      expect(field('In Stock')).toHaveValue(223);
    });

    it('lets the user clear a number field completely', async () => {
      const u = userEvent.setup();
      render(<Create />);

      await u.type(field('In Stock'), '5');
      await u.clear(field('In Stock'));

      expect(field('In Stock')).toHaveValue(null);
    });
  });

  describe('blocked keys in number fields', () => {
    it.each([
      ['Price per unit', '-'],
      ['Price per unit', '+'],
      ['Price per unit', 'e'],
      ['Price per unit', 'E'],
      ['In Stock', '-'],
      ['In Stock', '+'],
      ['In Stock', 'e'],
      ['In Stock', 'E'],
    ])('%s ignores the "%s" key', async (label, key) => {
      const u = userEvent.setup();
      render(<Create />);

      await u.type(field(label), `${key}5`);

      expect(field(label)).toHaveValue(5);
    });

    it('does not block the "-" key in text fields', async () => {
      const u = userEvent.setup();
      render(<Create />);

      await u.type(field('Vegetable Name'), 'Bell-Pepper');

      expect(field('Vegetable Name')).toHaveValue('Bell-Pepper');
    });
  });

  describe('submitting valid data', () => {
    it('calls create with the form values, converting price and stock to numbers', async () => {
      const u = userEvent.setup();
      render(<Create />);
      fillForm();
      await submit(u);

      await waitFor(() => expect(create).toHaveBeenCalledTimes(1));
      expect(create).toHaveBeenCalledWith({
        product_name: 'Bell Peppers',
        price: 2.5,
        imageURL: 'https://example.com/pepper.jpg',
        description: 'Sweet and crunchy',
        category: 'Vegetables',
        farm: 'Green Acres',
        inStock: 10,
      });
    });

    it('sends price and inStock as numbers, not strings', async () => {
      const u = userEvent.setup();
      render(<Create />);
      fillForm();
      await submit(u);

      await waitFor(() => expect(create).toHaveBeenCalled());
      const payload = create.mock.calls[0][0];
      expect(typeof payload.price).toBe('number');
      expect(typeof payload.inStock).toBe('number');
    });

    it('accepts 0 as the stock amount', async () => {
      const u = userEvent.setup();
      render(<Create />);
      fillForm({ 'In Stock': '0' });
      await submit(u);

      await waitFor(() => expect(create).toHaveBeenCalledTimes(1));
      expect(create).toHaveBeenCalledWith(
        expect.objectContaining({ inStock: 0 })
      );
      expect(toast.error).not.toHaveBeenCalled();
    });

    it('shows a success toast and navigates to /catalog', async () => {
      const u = userEvent.setup();
      render(<Create />);
      fillForm();
      await submit(u);

      await waitFor(() =>
        expect(toast.success).toHaveBeenCalledWith('Product added succesfully!')
      );
      expect(navigate).toHaveBeenCalledWith('/catalog');
      expect(toast.error).not.toHaveBeenCalled();
    });

    it('shows an error toast and does not navigate when create fails', async () => {
      create.mockRejectedValue(new Error('Server error'));
      const u = userEvent.setup();
      render(<Create />);
      fillForm();
      await submit(u);

      await waitFor(() =>
        expect(toast.error).toHaveBeenCalledWith('Server error')
      );
      expect(toast.success).not.toHaveBeenCalled();
      expect(navigate).not.toHaveBeenCalled();
    });
  });

  describe('validation', () => {
    it('shows "All fields are required!" when the form is empty', async () => {
      const u = userEvent.setup();
      render(<Create />);
      await submit(u);

      await waitFor(() =>
        expect(toast.error).toHaveBeenCalledWith('All fields are required!')
      );
      expect(create).not.toHaveBeenCalled();
      expect(toast.success).not.toHaveBeenCalled();
      expect(navigate).not.toHaveBeenCalled();
    });

    it.each(Object.keys(validValues))(
      'does not submit when "%s" is empty',
      async (label) => {
        const u = userEvent.setup();
        render(<Create />);
        fillForm({ [label]: '' });
        await submit(u);

        await waitFor(() =>
          expect(toast.error).toHaveBeenCalledWith('All fields are required!')
        );
        expect(toast.error).toHaveBeenCalledTimes(1);
        expect(create).not.toHaveBeenCalled();
        expect(navigate).not.toHaveBeenCalled();
      }
    );
  });
});
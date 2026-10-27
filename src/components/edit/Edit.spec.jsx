import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Edit from './Edit';
import request from '../../../utils/request.js';
import { update } from '../../api/products-api.js';
import { toast } from 'react-toastify';

const { navigate } = vi.hoisted(() => ({ navigate: vi.fn() }));

vi.mock('react-router', () => ({
  useNavigate: () => navigate,
  useParams: () => ({ id: '42' }),
}));

vi.mock('../../../utils/request.js', () => ({
  default: vi.fn(),
}));

vi.mock('../../api/products-api.js', () => ({
  update: vi.fn(),
}));

vi.mock('react-toastify', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

const product = {
  id: 42,
  user_id: 'owner-1',
  product_name: 'Tomatoes',
  price: 3.5,
  imageURL: 'https://example.com/tomatoes.jpg',
  description: 'Fresh and juicy tomatoes',
  category: 'Vegetables',
  farm: 'Green Acres',
  inStock: 10,
};

// renders and waits until the product data has been put into the form
const renderEdit = async () => {
  render(<Edit />);
  await waitFor(() =>
    expect(screen.getByLabelText('Vegetable Name')).toHaveValue('Tomatoes')
  );
};

const submit = (u) =>
  u.click(screen.getByRole('button', { name: 'Save Changes' }));

describe('Edit', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    request.mockResolvedValue([product]);
    update.mockResolvedValue({});
  });

  describe('loading', () => {
    it('requests the product by id from the route', async () => {
      await renderEdit();
      expect(request).toHaveBeenCalledTimes(1);
      expect(request).toHaveBeenCalledWith('products?id=eq.42', 'GET');
    });

    it('shows an empty form while the product is loading', () => {
      request.mockReturnValue(new Promise(() => {})); // never resolves
      render(<Edit />);

      expect(screen.getByLabelText('Vegetable Name')).toHaveValue('');
      expect(screen.getByLabelText(/price per unit/i)).toHaveValue(0);
      expect(screen.getByLabelText('Image URL')).toHaveValue('');
      expect(screen.getByLabelText('Description')).toHaveValue('');
      expect(screen.getByLabelText('Category')).toHaveValue('');
      expect(screen.getByLabelText('Farm')).toHaveValue('');
      expect(screen.getByLabelText(/in stock/i)).toHaveValue(0);
    });

    it('shows "Product not found" when the API returns no rows', async () => {
      request.mockResolvedValue([]);
      render(<Edit />);

      expect(await screen.findByText('Product not found')).toBeInTheDocument();
      expect(
        screen.queryByRole('heading', { name: 'Edit Vegetable' })
      ).not.toBeInTheDocument();
    });
  });

  describe('rendering', () => {
    it('renders the heading and the submit button', async () => {
      await renderEdit();
      expect(
        screen.getByRole('heading', { name: 'Edit Vegetable' })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Save Changes' })
      ).toHaveAttribute('type', 'submit');
    });

    it('fills every field with the loaded product', async () => {
      await renderEdit();

      expect(screen.getByLabelText('Vegetable Name')).toHaveValue('Tomatoes');
      expect(screen.getByLabelText(/price per unit/i)).toHaveValue(3.5);
      expect(screen.getByLabelText('Image URL')).toHaveValue(
        'https://example.com/tomatoes.jpg'
      );
      expect(screen.getByLabelText('Description')).toHaveValue(
        'Fresh and juicy tomatoes'
      );
      expect(screen.getByLabelText('Category')).toHaveValue('Vegetables');
      expect(screen.getByLabelText('Farm')).toHaveValue('Green Acres');
      expect(screen.getByLabelText(/in stock/i)).toHaveValue(10);
    });

    it('uses the correct input types', async () => {
      await renderEdit();
      expect(screen.getByLabelText('Vegetable Name')).toHaveAttribute('type', 'text');
      expect(screen.getByLabelText(/price per unit/i)).toHaveAttribute('type', 'number');
      expect(screen.getByLabelText('Image URL')).toHaveAttribute('type', 'url');
      expect(screen.getByLabelText(/in stock/i)).toHaveAttribute('type', 'number');
    });
  });

  describe('typing', () => {
    it('updates a text field as the user types', async () => {
      const u = userEvent.setup();
      await renderEdit();

      const name = screen.getByLabelText('Vegetable Name');
      await u.clear(name);
      await u.type(name, 'Cherry Tomatoes');

      expect(name).toHaveValue('Cherry Tomatoes');
    });

    it('updates the textarea and the number fields', async () => {
      const u = userEvent.setup();
      await renderEdit();

      const description = screen.getByLabelText('Description');
      await u.clear(description);
      await u.type(description, 'Sweet and small');

      const price = screen.getByLabelText(/price per unit/i);
      await u.clear(price);
      await u.type(price, '4.25');

      const stock = screen.getByLabelText(/in stock/i);
      await u.clear(stock);
      await u.type(stock, '7');

      expect(description).toHaveValue('Sweet and small');
      expect(price).toHaveValue(4.25);
      expect(stock).toHaveValue(7);
    });

    it('does not touch the other fields when one field changes', async () => {
      const u = userEvent.setup();
      await renderEdit();

      const farm = screen.getByLabelText('Farm');
      await u.clear(farm);
      await u.type(farm, 'Sunny Fields');

      expect(screen.getByLabelText('Vegetable Name')).toHaveValue('Tomatoes');
      expect(screen.getByLabelText('Category')).toHaveValue('Vegetables');
    });
  });

  describe('submitting', () => {
    it('calls update with the unchanged product and the route id', async () => {
      const u = userEvent.setup();
      await renderEdit();
      await submit(u);

      await waitFor(() => expect(update).toHaveBeenCalledTimes(1));
      expect(update).toHaveBeenCalledWith(product, '42');
    });

    it('calls update with the edited values', async () => {
      const u = userEvent.setup();
      await renderEdit();

      const name = screen.getByLabelText('Vegetable Name');
      await u.clear(name);
      await u.type(name, 'Cherry Tomatoes');

      const price = screen.getByLabelText(/price per unit/i);
      await u.clear(price);
      await u.type(price, '4.25');

      await submit(u);

      await waitFor(() => expect(update).toHaveBeenCalledTimes(1));
      // edited number inputs are stored as strings by the change handler
      expect(update).toHaveBeenCalledWith(
        { ...product, product_name: 'Cherry Tomatoes', price: '4.25' },
        '42'
      );
    });

    it('shows a success toast and navigates to the details page', async () => {
      const u = userEvent.setup();
      await renderEdit();
      await submit(u);

      await waitFor(() =>
        expect(toast.success).toHaveBeenCalledWith(
          'Product was edited succesfully!'
        )
      );
      expect(navigate).toHaveBeenCalledWith('/details/42');
      expect(toast.error).not.toHaveBeenCalled();
    });

    it('shows an error toast and does not navigate when update fails', async () => {
      update.mockRejectedValue(new Error('Update failed'));
      const u = userEvent.setup();
      await renderEdit();
      await submit(u);

      await waitFor(() =>
        expect(toast.error).toHaveBeenCalledWith('Update failed')
      );
      expect(toast.success).not.toHaveBeenCalled();
      expect(navigate).not.toHaveBeenCalled();
    });
  });
});
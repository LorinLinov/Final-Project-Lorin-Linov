import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import Details from './Details';
import request from '../../../utils/request.js';
import { remove } from '../../api/products-api.js';
import useAuth from '../../hooks/useAuth.js';
import { toast } from 'react-toastify';

const { navigate } = vi.hoisted(() => ({ navigate: vi.fn() }));

// keep the real Link, mock only the hooks
vi.mock('react-router', async (importOriginal) => ({
  ...(await importOriginal()),
  useNavigate: () => navigate,
  useParams: () => ({ id: '42' }),
}));

vi.mock('../../../utils/request.js', () => ({
  default: vi.fn(),
}));

vi.mock('../../api/products-api.js', () => ({
  remove: vi.fn(),
}));

vi.mock('../../hooks/useAuth.js', () => ({
  default: vi.fn(),
}));

vi.mock('react-toastify', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

vi.mock('../../contexts/comment-context.jsx', () => ({
  CommentProvider: ({ children }) => <>{children}</>,
}));

vi.mock('../comments/CommentList.jsx', () => ({
  default: ({ product_id, isOwner }) => (
    <div
      data-testid="comment-list"
      data-product-id={product_id}
      data-is-owner={String(Boolean(isOwner))}
    />
  ),
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

const owner = { id: 'owner-1', email: 'owner@example.com' };
const visitor = { id: 'visitor-2', email: 'visitor@example.com' };

const setAuth = (user) =>
  useAuth.mockReturnValue({ isAuthenticated: Boolean(user), user });

// renders and waits until the product has been loaded
const renderDetails = async () => {
  render(
    <MemoryRouter>
      <Details />
    </MemoryRouter>
  );
  await screen.findByRole('heading', { name: product.product_name });
};

describe('Details', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setAuth(null);
    request.mockResolvedValue([product]);
    remove.mockResolvedValue({});
  });

  describe('loading', () => {
    it('requests the product by id from the route', async () => {
      await renderDetails();
      expect(request).toHaveBeenCalledTimes(1);
      expect(request).toHaveBeenCalledWith('products?id=eq.42');
    });

    it('shows "Product not found" while the product is loading', () => {
      request.mockReturnValue(new Promise(() => {})); // never resolves
      render(
        <MemoryRouter>
          <Details />
        </MemoryRouter>
      );
      expect(screen.getByText('Product not found')).toBeInTheDocument();
    });

    it('keeps showing "Product not found" when the API returns no rows', async () => {
      request.mockResolvedValue([]);
      render(
        <MemoryRouter>
          <Details />
        </MemoryRouter>
      );
      await waitFor(() => expect(request).toHaveBeenCalled());
      await act(async () => {}); // let the state update flush
      expect(screen.getByText('Product not found')).toBeInTheDocument();
      expect(screen.queryByRole('heading', { name: 'Tomatoes' })).not.toBeInTheDocument();
    });
  });

  describe('product information', () => {
    it('renders name, image, price and description', async () => {
      await renderDetails();

      const img = screen.getByRole('img', { name: 'Tomatoes' });
      expect(img).toHaveAttribute('src', product.imageURL);
      expect(img).toHaveClass('detailsImage');

      expect(screen.getByText('3.50€ / kg')).toBeInTheDocument();
      expect(screen.getByText('Fresh and juicy tomatoes')).toBeInTheDocument();
    });

    it('renders category, farm and stock', async () => {
      await renderDetails();

      expect(screen.getByText('Category:').closest('li')).toHaveTextContent(
        'Category: Vegetables'
      );
      expect(screen.getByText('Farm:').closest('li')).toHaveTextContent(
        'Farm: Green Acres'
      );
      expect(screen.getByText('In Stock:').closest('li')).toHaveTextContent(
        'In Stock: Yes (10 kg available)'
      );
    });

    it('currently says "Yes" for stock even when inStock is 0', async () => {
      request.mockResolvedValue([{ ...product, inStock: 0 }]);
      await renderDetails();
      expect(screen.getByText('In Stock:').closest('li')).toHaveTextContent(
        'In Stock: Yes (0 kg available)'
      );
    });
  });

  describe('guest (not authenticated)', () => {
    it('shows no comments and no action buttons', async () => {
      await renderDetails();
      expect(screen.queryByTestId('comment-list')).not.toBeInTheDocument();
      expect(screen.queryByText('Edit Product')).not.toBeInTheDocument();
      expect(screen.queryByText('Delete Product')).not.toBeInTheDocument();
      expect(screen.queryByText(/back to catalog/i)).not.toBeInTheDocument();
    });
  });

  describe('authenticated non-owner', () => {
    beforeEach(() => setAuth(visitor));

    it('shows the comment list with isOwner=false and the route id', async () => {
      await renderDetails();
      const list = screen.getByTestId('comment-list');
      expect(list).toHaveAttribute('data-product-id', '42');
      expect(list).toHaveAttribute('data-is-owner', 'false');
    });

    it('does not show the owner actions', async () => {
      await renderDetails();
      expect(screen.queryByText('Edit Product')).not.toBeInTheDocument();
      expect(screen.queryByText('Delete Product')).not.toBeInTheDocument();
      expect(screen.queryByText(/back to catalog/i)).not.toBeInTheDocument();
    });
  });

  describe('authenticated owner', () => {
    beforeEach(() => setAuth(owner));

    it('shows the comment list with isOwner=true', async () => {
      await renderDetails();
      expect(screen.getByTestId('comment-list')).toHaveAttribute(
        'data-is-owner',
        'true'
      );
    });

    it('shows Back, Edit and Delete actions', async () => {
      await renderDetails();

      expect(
        screen.getByRole('link', { name: /back to catalog/i })
      ).toHaveAttribute('href', '/catalog');

      const edit = screen.getByRole('link', { name: 'Edit Product' });
      expect(edit).toHaveAttribute('href', '/edit/42');
      expect(edit).toHaveClass('btn');

      expect(screen.getByText('Delete Product')).toBeInTheDocument();
    });
  });

  describe('deleting', () => {
    let confirmSpy;

    beforeEach(() => {
      setAuth(owner);
      confirmSpy = vi.spyOn(window, 'confirm');
    });

    afterEach(() => {
      confirmSpy.mockRestore();
    });

    it('asks for confirmation before deleting', async () => {
      confirmSpy.mockReturnValue(false);
      const u = userEvent.setup();
      await renderDetails();
      await u.click(screen.getByText('Delete Product'));

      expect(confirmSpy).toHaveBeenCalledWith(
        'Are you sure you want to delete this product?'
      );
    });

    it('does nothing when the user cancels', async () => {
      confirmSpy.mockReturnValue(false);
      const u = userEvent.setup();
      await renderDetails();
      await u.click(screen.getByText('Delete Product'));

      expect(remove).not.toHaveBeenCalled();
      expect(toast.success).not.toHaveBeenCalled();
      expect(navigate).not.toHaveBeenCalled();
    });

    it('removes the product, shows a toast and navigates to /catalog on confirm', async () => {
      confirmSpy.mockReturnValue(true);
      const u = userEvent.setup();
      await renderDetails();
      await u.click(screen.getByText('Delete Product'));

      await waitFor(() => expect(remove).toHaveBeenCalledWith('42'));
      await waitFor(() =>
        expect(toast.success).toHaveBeenCalledWith('Product deleted successfully')
      );
      expect(navigate).toHaveBeenCalledWith('/catalog');
      expect(toast.error).not.toHaveBeenCalled();
    });

    it('shows an error toast and does not navigate when deleting fails', async () => {
      confirmSpy.mockReturnValue(true);
      remove.mockRejectedValue(new Error('boom'));
      const u = userEvent.setup();
      await renderDetails();
      await u.click(screen.getByText('Delete Product'));

      await waitFor(() =>
        expect(toast.error).toHaveBeenCalledWith('Failed to delete product')
      );
      expect(toast.success).not.toHaveBeenCalled();
      expect(navigate).not.toHaveBeenCalled();
    });
  });
});
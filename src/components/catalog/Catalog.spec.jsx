import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import Catalog from './Catalog';
import { getAll } from '../../api/products-api.js';
import useAuth from '../../hooks/useAuth.js';

vi.mock('../../api/products-api.js', () => ({
  getAll: vi.fn(),
}));

vi.mock('../../hooks/useAuth.js', () => ({
  default: vi.fn(),
}));

vi.mock('../cardElement/CardElement.jsx', () => ({
  default: ({ product }) => (
    <div data-testid="card">{product.product_name}</div>
  ),
}));

const products = [
  { id: 1, product_name: 'Tomatoes' },
  { id: 2, product_name: 'Cucumbers' },
  { id: 3, product_name: 'Peppers' },
];

const renderCatalog = () =>
  render(
    <MemoryRouter>
      <Catalog />
    </MemoryRouter>
  );

describe('Catalog', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuth.mockReturnValue({ user: null });
    getAll.mockResolvedValue(products);
  });

  it('renders the page heading', async () => {
    renderCatalog();
    expect(
      screen.getByRole('heading', { name: 'Vegetable Dashboard / Catalog' })
    ).toBeInTheDocument();
    await waitFor(() => expect(getAll).toHaveBeenCalled());
  });

  it('fetches products from /products on mount', async () => {
    renderCatalog();
    await waitFor(() => expect(getAll).toHaveBeenCalledTimes(1));
    expect(getAll).toHaveBeenCalledWith('/products');
  });

  it('renders a card for each product', async () => {
    renderCatalog();
    const cards = await screen.findAllByTestId('card');
    expect(cards).toHaveLength(3);
    expect(screen.getByText('Tomatoes')).toBeInTheDocument();
    expect(screen.getByText('Cucumbers')).toBeInTheDocument();
    expect(screen.getByText('Peppers')).toBeInTheDocument();
  });

  it('renders no cards when the API returns an empty list', async () => {
    getAll.mockResolvedValue([]);
    renderCatalog();
    await waitFor(() => expect(getAll).toHaveBeenCalled());
    expect(screen.queryAllByTestId('card')).toHaveLength(0);
  });

  it('shows the "Add New Vegetable" link when the user is logged in', async () => {
    useAuth.mockReturnValue({ user: { id: 'u1', email: 'a@b.com' } });
    renderCatalog();
    const link = screen.getByRole('link', { name: '+ Add New Vegetable' });
    expect(link).toHaveAttribute('href', '/create');
    expect(link).toHaveClass('btn');
    await waitFor(() => expect(getAll).toHaveBeenCalled());
  });

  it('hides the "Add New Vegetable" link when the user is not logged in', async () => {
    renderCatalog();
    expect(
      screen.queryByRole('link', { name: '+ Add New Vegetable' })
    ).not.toBeInTheDocument();
    await waitFor(() => expect(getAll).toHaveBeenCalled());
  });

  it('logs an error and renders no cards when the fetch fails', async () => {
    const error = new Error('Network error');
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    getAll.mockRejectedValue(error);

    renderCatalog();

    await waitFor(() =>
      expect(consoleSpy).toHaveBeenCalledWith('Error fetching products:', error)
    );
    expect(screen.queryAllByTestId('card')).toHaveLength(0);

    consoleSpy.mockRestore();
  });
});
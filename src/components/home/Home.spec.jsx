import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import Home from './Home';
import request from '../../../utils/request';

vi.mock('../../../utils/request', () => ({
  default: vi.fn(),
}));

vi.mock('../cardElement/CardElement', () => ({
  default: ({ product }) => (
    <div data-testid="card">{product.product_name}</div>
  ),
}));

const products = [
  { id: 1, product_name: 'Tomatoes' },
  { id: 2, product_name: 'Cucumbers' },
  { id: 3, product_name: 'Peppers' },
];

const renderHome = () =>
  render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>
  );

describe('Home', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    request.mockResolvedValue(products);
  });

  describe('hero section', () => {
    it('renders the welcome heading and description', async () => {
      renderHome();
      expect(
        screen.getByRole('heading', { name: 'Welcome to Veggie Haven!' })
      ).toBeInTheDocument();
      expect(
        screen.getByText(/100% organic, freshly picked vegetables/i)
      ).toBeInTheDocument();
      await waitFor(() => expect(request).toHaveBeenCalled());
    });

    it('renders a link to the catalog', async () => {
      renderHome();
      const link = screen.getByRole('link', { name: 'Explore Our Catalog' });
      expect(link).toHaveAttribute('href', '/catalog');
      expect(link).toHaveClass('btn');
      await waitFor(() => expect(request).toHaveBeenCalled());
    });
  });

  describe('newest products', () => {
    it('requests the 3 newest products on mount', async () => {
      renderHome();
      await waitFor(() => expect(request).toHaveBeenCalledTimes(1));
      expect(request).toHaveBeenCalledWith(
        '/products?order=created_at.desc&limit=3'
      );
    });

    it('renders the section title', async () => {
      renderHome();
      expect(
        screen.getByRole('heading', { name: 'The newest products' })
      ).toBeInTheDocument();
      await waitFor(() => expect(request).toHaveBeenCalled());
    });

    it('renders a card for each product', async () => {
      renderHome();
      const cards = await screen.findAllByTestId('card');
      expect(cards).toHaveLength(3);
      expect(screen.getByText('Tomatoes')).toBeInTheDocument();
      expect(screen.getByText('Cucumbers')).toBeInTheDocument();
      expect(screen.getByText('Peppers')).toBeInTheDocument();
    });

    it('renders no cards when the API returns an empty list', async () => {
      request.mockResolvedValue([]);
      renderHome();
      await waitFor(() => expect(request).toHaveBeenCalled());
      expect(screen.queryAllByTestId('card')).toHaveLength(0);
    });

    it('logs an error and renders no cards when the fetch fails', async () => {
      const error = new Error('Network error');
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      request.mockRejectedValue(error);

      renderHome();

      await waitFor(() =>
        expect(consoleSpy).toHaveBeenCalledWith('Error fetching products:', error)
      );
      expect(screen.queryAllByTestId('card')).toHaveLength(0);

      consoleSpy.mockRestore();
    });
  });

  describe('"Why to choose Us" section', () => {
    it('renders the section title', async () => {
      renderHome();
      expect(
        screen.getByRole('heading', { name: 'Why to choose Us' })
      ).toBeInTheDocument();
      await waitFor(() => expect(request).toHaveBeenCalled());
    });

    it.each([
      ['🌱 Organic Certified', /without synthetic pesticides or fertilizers/i],
      ['🚜 Local Farmers', /sourcing directly from community farms/i],
      ['🚚 Fast Delivery', /delivered fresh to your door/i],
    ])('renders the "%s" feature card', async (title, text) => {
      renderHome();
      expect(screen.getByRole('heading', { name: title })).toBeInTheDocument();
      expect(screen.getByText(text)).toBeInTheDocument();
      await waitFor(() => expect(request).toHaveBeenCalled());
    });
  });
});
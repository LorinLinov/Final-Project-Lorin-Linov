import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import CardElement from './CardElement';

const product = {
  id: 42,
  product_name: 'Tomatoes',
  description: 'Fresh and juicy tomatoes',
  price: 3.5,
  imageURL: 'https://example.com/tomatoes.jpg',
};

const renderCard = (props = product) =>
  render(
    <MemoryRouter>
      <CardElement product={props} />
    </MemoryRouter>
  );

describe('CardElement', () => {
  it('renders the product name as a heading', () => {
    renderCard();
    expect(
      screen.getByRole('heading', { level: 3, name: 'Tomatoes' })
    ).toBeInTheDocument();
  });

  it('renders the product description', () => {
    renderCard();
    expect(screen.getByText('Fresh and juicy tomatoes')).toBeInTheDocument();
  });

  it('renders the image with correct src and alt', () => {
    renderCard();
    const img = screen.getByRole('img', { name: 'Tomatoes' });
    expect(img).toHaveAttribute('src', product.imageURL);
    expect(img).toHaveClass('product-image');
  });

  it('formats the price with two decimals and unit', () => {
    renderCard();
    expect(screen.getByText('3.50€ / kg')).toBeInTheDocument();
  });

  it('rounds long prices to two decimals', () => {
    renderCard({ ...product, price: 2.3456 });
    expect(screen.getByText('2.35€ / kg')).toBeInTheDocument();
  });

  it('renders a Details link pointing to the product details page', () => {
    renderCard();
    const link = screen.getByRole('link', { name: 'Details' });
    expect(link).toHaveAttribute('href', '/details/42');
    expect(link).toHaveClass('btn', 'btn-secondary');
  });

  it('has the expected card wrapper classes', () => {
    const { container } = renderCard();
    expect(container.firstChild).toHaveClass('card', 'product-card');
  });
});
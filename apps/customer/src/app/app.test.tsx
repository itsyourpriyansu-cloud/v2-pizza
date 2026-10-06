import { render, screen } from '@testing-library/react';
import { matchRoutes, RouterProvider } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { AppProviders } from './providers';
import { createCustomerMemoryRouter, customerRoutes } from './router';

describe('customer application foundation', () => {
  it('boots the customer application', async () => {
    render(
      <AppProviders>
        <RouterProvider router={createCustomerMemoryRouter(['/'])} />
      </AppProviders>,
    );
    expect(await screen.findByRole('heading', { name: 'Customer home' })).toBeVisible();
  });

  it.each([
    '/',
    '/menu',
    '/menu/pizza-margherita',
    '/cart',
    '/checkout',
    '/checkout/pickup',
    '/auth',
    '/auth/otp',
    '/auth/whatsapp',
    '/auth/magic',
    '/payment',
    '/payment/success',
    '/payment/failure',
    '/orders',
    '/orders/order-pa-1001',
    '/rewards',
    '/passport',
    '/profile',
  ])('resolves route %s', (path) => {
    expect(matchRoutes(customerRoutes, path)).not.toBeNull();
  });

  it('renders mocked menu data through TanStack Query', async () => {
    render(
      <AppProviders>
        <RouterProvider router={createCustomerMemoryRouter(['/menu'])} />
      </AppProviders>,
    );
    expect(await screen.findByRole('link', { name: 'Margherita' })).toBeVisible();
    expect(screen.getByText(/Mock HTTP data through TanStack Query/)).toBeVisible();
  });
});

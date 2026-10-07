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
    expect(await screen.findByRole('heading', { name: 'How would you like to order?' })).toBeVisible();
  });

  it.each([
    '/',
    '/menu',
    '/search',
    '/menu/pizza-margherita',
    '/menu/pizza-margherita/customize',
    '/cart',
    '/checkout',
    '/checkout/pickup',
    '/dine-in/start?t=table-12-valid',
    '/dine-in/table',
    '/dine-in',
    '/dine-in/menu',
    '/dine-in/search',
    '/dine-in/menu/pizza-margherita',
    '/dine-in/menu/pizza-margherita/customize',
    '/dine-in/cart',
    '/dine-in/review',
    '/dine-in/orders/order-pa-2001',
    '/dine-in/orders/order-pa-2001/clarification',
    '/dine-in/orders/order-pa-2001/rejected',
    '/dine-in/orders/order-pa-2001/accepted',
    '/dine-in/orders/order-pa-2001/preparing',
    '/dine-in/orders/order-pa-2001/ready-to-serve',
    '/dine-in/orders/order-pa-2001/served',
    '/dine-in/order-more',
    '/dine-in/bill',
    '/dine-in/bill/request',
    '/dine-in/service',
    '/dine-in/session-complete',
    '/dine-in/expired',
    '/dine-in/wrong-table',
    '/auth',
    '/auth/otp',
    '/auth/whatsapp',
    '/auth/magic',
    '/payment',
    '/payment/checking',
    '/payment/success',
    '/payment/failure',
    '/orders',
    '/orders/order-pa-1001',
    '/rewards',
    '/rewards/passport',
    '/rewards/missions',
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
    expect(await screen.findByRole('link', { name: 'View Classic Margherita Pizza' })).toBeVisible();
    expect(screen.getByText(/Choose a favourite or build your pizza your way/)).toBeVisible();
  });
});

import { render, screen } from '@testing-library/react';
import { matchRoutes, RouterProvider } from 'react-router-dom';
import { expect, it } from 'vitest';
import { AdminProviders } from './providers';
import { adminRoutes, createAdminMemoryRouter } from './router';

it('boots the Admin route shell', async () => {
  render(
    <AdminProviders>
      <RouterProvider router={createAdminMemoryRouter(['/'])} />
    </AdminProviders>,
  );
  expect(await screen.findByRole('heading', { name: 'Admin overview' })).toBeVisible();
});

it.each([
  '/',
  '/login',
  '/orders',
  '/menu',
  '/settings',
  '/staff/waiter',
  '/staff/waiter/requests',
  '/staff/waiter/requests/order-pa-2001',
  '/staff/waiter/tables',
  '/staff/waiter/tables/table-session-12',
  '/staff/waiter/ready',
  '/staff/waiter/service-requests',
  '/staff/waiter/bill-requests',
  '/staff/waiter/assisted-order',
  '/billing',
  '/billing/open',
  '/billing/bill-table-12',
  '/billing/bill-table-12/finalize',
  '/billing/bill-table-12/payment',
  '/payments',
  '/tables',
])('resolves Admin route %s', (path) => {
  expect(matchRoutes(adminRoutes, path)).not.toBeNull();
});

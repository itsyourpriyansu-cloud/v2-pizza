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

it.each(['/', '/login', '/orders', '/menu', '/settings'])('resolves Admin route %s', (path) => {
  expect(matchRoutes(adminRoutes, path)).not.toBeNull();
});

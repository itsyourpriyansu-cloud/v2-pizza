import { render, screen } from '@testing-library/react';
import { matchRoutes, RouterProvider } from 'react-router-dom';
import { expect, it } from 'vitest';
import { KdsProviders } from './providers';
import { createKdsMemoryRouter, kdsRoutes } from './router';

it('boots the KDS route shell', async () => {
  render(
    <KdsProviders>
      <RouterProvider router={createKdsMemoryRouter(['/'])} />
    </KdsProviders>,
  );
  expect(await screen.findByRole('heading', { name: 'KDS home' })).toBeVisible();
});

it.each(['/', '/login', '/orders', '/orders/pickup', '/orders/dine-in', '/orders/order-pa-1001'])('resolves KDS route %s', (path) => {
  expect(matchRoutes(kdsRoutes, path)).not.toBeNull();
});

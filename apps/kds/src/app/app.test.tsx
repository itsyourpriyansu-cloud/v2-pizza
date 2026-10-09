import { render, screen } from '@testing-library/react';
import { matchRoutes, RouterProvider } from 'react-router-dom';
import { expect, it } from 'vitest';
import { KdsProviders } from './providers';
import { createKdsMemoryRouter, kdsRoutes } from './router';

it('boots the KDS route shell', async () => {
  const { container } = render(
    <KdsProviders>
      <RouterProvider router={createKdsMemoryRouter(['/'])} />
    </KdsProviders>,
  );
  expect(await screen.findByRole('heading', { name: 'KDS home' })).toBeVisible();
  expect(screen.getByText('Pizza Avenue')).toBeVisible();
  expect(screen.getByRole('link', { name: 'Overview' })).toHaveAttribute('aria-current', 'page');
  expect(container.querySelector('.app-shell--kds')).toBeInTheDocument();
});

it.each(['/', '/login', '/orders', '/orders/pickup', '/orders/dine-in', '/orders/order-pa-1001'])('resolves KDS route %s', (path) => {
  expect(matchRoutes(kdsRoutes, path)).not.toBeNull();
});

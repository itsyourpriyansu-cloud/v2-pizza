import { render, screen } from '@testing-library/react';
import { RouterProvider } from 'react-router-dom';
import { expect, it } from 'vitest';
import { AdminProviders } from './providers';
import { createAdminMemoryRouter } from './router';

it('boots the Admin route shell', async () => {
  render(
    <AdminProviders>
      <RouterProvider router={createAdminMemoryRouter(['/admin'])} />
    </AdminProviders>,
  );
  expect(await screen.findByRole('heading', { name: 'Admin overview' })).toBeVisible();
});

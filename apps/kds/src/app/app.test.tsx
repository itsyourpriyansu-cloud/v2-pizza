import { render, screen } from '@testing-library/react';
import { RouterProvider } from 'react-router-dom';
import { expect, it } from 'vitest';
import { KdsProviders } from './providers';
import { createKdsMemoryRouter } from './router';

it('boots the KDS route shell', async () => {
  render(
    <KdsProviders>
      <RouterProvider router={createKdsMemoryRouter(['/kds'])} />
    </KdsProviders>,
  );
  expect(await screen.findByRole('heading', { name: 'KDS home' })).toBeVisible();
});

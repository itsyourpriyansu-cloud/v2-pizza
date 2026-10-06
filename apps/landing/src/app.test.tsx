import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { createSurfaceConfig } from '@pizza-avenue/config';
import { LandingPage } from './main';

it('resolves the local customer application URL for the landing CTA', () => {
  const config = createSurfaceConfig({ VITE_APP_ENV: 'local' }, 'http://localhost:5173');
  render(<a href={config.customerAppUrl}>Order now</a>);
  expect(screen.getByRole('link', { name: 'Order now' })).toHaveAttribute(
    'href',
    'http://localhost:5174',
  );
});

it('presents a pickup-first landing hero and routes its primary action to the customer menu', () => {
  render(<LandingPage />);

  expect(screen.getByRole('heading', { name: /pizza made for your avenue/i })).toBeVisible();
  expect(screen.getByRole('link', { name: /start an order/i })).toHaveAttribute(
    'href',
    'http://localhost:5174/menu',
  );
  expect(screen.getByRole('navigation', { name: /main navigation/i })).toBeVisible();
});

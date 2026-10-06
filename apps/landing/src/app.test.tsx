import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { createSurfaceConfig } from '@pizza-avenue/config';

it('resolves the local customer application URL for the landing CTA', () => {
  const config = createSurfaceConfig({ VITE_APP_ENV: 'local' }, 'http://localhost:5173');
  render(<a href={config.customerAppUrl}>Order now</a>);
  expect(screen.getByRole('link', { name: 'Order now' })).toHaveAttribute(
    'href',
    'http://localhost:5174',
  );
});

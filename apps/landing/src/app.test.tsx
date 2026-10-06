import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { createSurfaceConfig } from '@pizza-avenue/config';
import { LandingPage } from './LandingPage';

describe('LandingPage', () => {
  it('explains the offer, location and next action above the fold', () => {
    render(<LandingPage customerAppUrl="http://localhost:5174" />);

    expect(
      screen.getByRole('heading', { name: 'Pizza made the way evenings deserve.' }),
    ).toBeInTheDocument();
    expect(screen.getAllByText(/Sainikpuri/).length).toBeGreaterThan(0);
    expect(screen.getByRole('link', { name: 'Order for pickup' })).toHaveAttribute(
      'href',
      'http://localhost:5174/menu',
    );
  });

  it('sends menu and Passport actions to configured Customer app routes', () => {
    const config = createSurfaceConfig({ VITE_APP_ENV: 'local' }, 'http://localhost:5173');
    render(<LandingPage customerAppUrl={config.customerAppUrl} />);

    expect(screen.getByRole('link', { name: 'Menu' })).toHaveAttribute(
      'href',
      'http://localhost:5174/menu',
    );
    expect(screen.getByRole('link', { name: 'Pizza Passport' })).toHaveAttribute(
      'href',
      'http://localhost:5174/rewards',
    );
    expect(screen.getAllByRole('link', { name: /Choose .* in the ordering app/ })).toHaveLength(4);
  });

  it('supports the loopback host used by local browser and device testing', () => {
    const config = createSurfaceConfig({}, 'http://127.0.0.1:5173');

    expect(config.customerAppUrl).toBe('http://localhost:5174');
  });

  it('renders prototype pricing with an explicit checkout qualification', () => {
    render(<LandingPage customerAppUrl="https://app.example.test" />);

    expect(screen.getAllByText('From ₹520*')).toHaveLength(2);
    expect(
      screen.getByText(/Prototype menu pricing; final availability and totals are confirmed/),
    ).toBeInTheDocument();
  });
});

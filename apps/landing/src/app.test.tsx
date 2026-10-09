import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { LandingPage } from './LandingPage';
import { ComboStrip } from './components/ComboStrip';

describe('Pizza Avenue landing', () => {
  const customerAppUrl = 'http://localhost:5174';

  it('shows the reference inspired landing sections in order with Pizza Avenue branding', () => {
    const { container } = render(<LandingPage customerAppUrl={customerAppUrl} />);

    expect(screen.getByRole('heading', { name: 'CRAVE IT. TAP IT. PICK IT UP.' })).toBeInTheDocument();
    expect(within(screen.getByRole('link', { name: 'Pizza Avenue home' })).getByAltText('Pizza Avenue logo')).toHaveAttribute('src', '/assets/logo/pizza%20avenue.jpeg');
    expect(within(container.querySelector('.hero') as HTMLElement).getByRole('link', { name: /ORDER FOR PICKUP/ })).toHaveAttribute('href', 'http://localhost:5174/menu');
    expect(screen.getByRole('heading', { name: 'PICK YOUR CRAVING' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'FROM CART TO PIZZERIA.' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'BROWSE THEN ORDER' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'COMBOS THAT MAKE SENSE' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'FEED THE CROWD.' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'REAL TALK' })).toBeInTheDocument();

    const sections = ['.hero', '.story-reveal-section', '.craving-menu-section', '.brand-highlights-section', '.customer-flow-section', '.combo-strip-section', '.combos-section', '.catering-section', '.avenue-notes', '.avenue-app-section'];
    const nodes = sections.map((selector) => container.querySelector(selector));
    expect(nodes.every(Boolean)).toBe(true);
    nodes.slice(1).forEach((node, index) => {
      expect(Boolean(nodes[index]!.compareDocumentPosition(node!) & Node.DOCUMENT_POSITION_FOLLOWING)).toBe(true);
    });
    expect(container.querySelectorAll('.story-point-item')).toHaveLength(3);
    expect(within(container.querySelector('.story-reveal-section') as HTMLElement).getAllByRole('heading', { level: 3 }).map((heading) => heading.textContent)).toEqual([
      'IT STARTED WITH A CART',
      'THE IDEA GREW',
      'NOW A PIZZERIA',
    ]);
  });

  it('filters the menu and keeps checkout in the customer app', () => {
    render(<LandingPage customerAppUrl={customerAppUrl} />);
    for (const category of ['HOT SELLING', 'VEG PIZZAS', 'NON-VEG PIZZAS', 'PASTAS', 'BREADS & SIDES', 'DESSERT & DIPS']) {
      expect(screen.getByRole('tab', { name: category })).toBeInTheDocument();
    }
    expect(screen.getByRole('tab', { name: 'HOT SELLING' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getAllByRole('link', { name: /Order .* in the customer app/ }).length).toBeGreaterThan(2);
    expect(screen.getByRole('button', { name: 'Next dishes' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('tab', { name: 'PASTAS' }));
    expect(screen.getByRole('tab', { name: 'PASTAS' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('heading', { name: 'PESTO PASTA' })).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: /Order .* in the customer app/ })[0]).toHaveAttribute('href', 'http://localhost:5174/menu');
    expect(screen.getAllByRole('link', { name: /Order .* in the customer app/ })[0]).toHaveTextContent('ORDER NOW');
    expect(screen.getByText(/Prototype menu pricing; final availability and totals are confirmed/)).toBeInTheDocument();
  });

  it('opens and closes navigation for small screens', () => {
    render(<LandingPage customerAppUrl={customerAppUrl} />);
    const toggle = screen.getByRole('button', { name: 'Open navigation menu' });
    fireEvent.click(toggle);
    expect(screen.getByRole('button', { name: 'Close navigation menu' })).toHaveAttribute('aria-expanded', 'true');
    fireEvent.click(within(screen.getByRole('navigation', { name: 'Primary navigation' })).getByRole('link', { name: 'Deals' }));
    expect(screen.getByRole('button', { name: 'Open navigation menu' })).toHaveAttribute('aria-expanded', 'false');
  });

  it('shows Pizza Avenue menu categories and an embedded location in the footer', () => {
    const { container } = render(<LandingPage customerAppUrl={customerAppUrl} />);
    const footer = container.querySelector('.avenue-footer') as HTMLElement;
    expect(within(footer).getByRole('heading', { name: 'MENU CATEGORIES' })).toBeInTheDocument();
    const categories = footer.querySelector('.avenue-footer__categories') as HTMLElement;
    for (const category of ['HOT SELLING', 'VEG PIZZAS', 'NON-VEG PIZZAS', 'PASTAS', 'BREADS & SIDES', 'DESSERT & DIPS']) {
      expect(within(categories).getByRole('link', { name: category })).toHaveAttribute('href', '#menu');
    }
    fireEvent.click(within(categories).getByRole('link', { name: 'VEG PIZZAS' }));
    expect(screen.getByRole('tab', { name: 'VEG PIZZAS' })).toHaveAttribute('aria-selected', 'true');
    expect(within(footer).getByRole('heading', { name: 'GET THE APP' })).toBeInTheDocument();
    expect(within(footer).getByRole('link', { name: 'Open the Pizza Avenue web app' })).toHaveAttribute('href', 'http://localhost:5174/');
    expect(footer.querySelectorAll('.avenue-footer__webapp a')).toHaveLength(1);
    expect(footer.querySelector('iframe[title="Map of Pizza Avenue in Sainikpuri"]')).toHaveAttribute('src', expect.stringContaining('output=embed'));
    expect(within(footer).getByRole('link', { name: /GET DIRECTIONS/ })).toHaveAttribute('href', expect.stringContaining('google.com/maps/search/'));
  });

  it('advances sourced testimonial cards every two seconds', () => {
    vi.useFakeTimers();
    try {
      const { container } = render(<LandingPage customerAppUrl={customerAppUrl} />);
      const reviews = container.querySelector('.avenue-notes') as HTMLElement;
      const track = reviews.querySelector('.avenue-notes__track') as HTMLElement;
      expect(within(reviews).getByRole('region', { name: 'Customer reviews' })).toBeInTheDocument();
      expect(within(reviews).getAllByRole('link', { name: 'View Pizza Avenue reviews on Google Maps' })[0]).toHaveAttribute('href', expect.stringContaining('maps.app.goo.gl'));
      expect(track).toHaveAttribute('data-slide-index', '0');
      act(() => vi.advanceTimersByTime(1999));
      expect(track).toHaveAttribute('data-slide-index', '0');
      act(() => vi.advanceTimersByTime(1));
      expect(track).toHaveAttribute('data-slide-index', '1');
      act(() => vi.advanceTimersByTime(2000));
      expect(track).toHaveAttribute('data-slide-index', '2');
      act(() => vi.advanceTimersByTime(2000));
      expect(track).toHaveAttribute('data-slide-index', '3');
      fireEvent.transitionEnd(track, { propertyName: 'transform' });
      expect(track).toHaveAttribute('data-slide-index', '0');
    } finally {
      vi.useRealTimers();
    }
  });

  it('shows three catering cards and a separate custom-order banner', () => {
    const { container } = render(<LandingPage customerAppUrl={customerAppUrl} />);
    const catering = container.querySelector('.catering-section') as HTMLElement;
    const cards = catering.querySelectorAll('.catering-card');
    expect(cards).toHaveLength(3);
    for (const card of cards) {
      expect(card.querySelector('.catering-card__media img')).toBeInTheDocument();
      expect(card.querySelector('.catering-card__pills li')).toBeInTheDocument();
      expect(within(card as HTMLElement).getByRole('link', { name: /EXPLORE MENU for/ })).toHaveAttribute('href', 'http://localhost:5174/menu');
    }
    expect(within(cards[2] as HTMLElement).getByLabelText('25–30 guests')).toBeInTheDocument();
    const controls = within(catering).getByRole('group', { name: 'Catering carousel controls' });
    const previous = within(controls).getByRole('button', { name: 'Previous catering package' });
    const next = within(controls).getByRole('button', { name: 'Next catering package' });
    expect(previous).toBeDisabled();
    expect(within(controls).getByRole('button', { name: 'Show OFFICE PARTY' })).toHaveAttribute('aria-current', 'true');
    fireEvent.click(next);
    expect(within(controls).getByRole('button', { name: 'Show GAME NIGHT FEAST' })).toHaveAttribute('aria-current', 'true');
    fireEvent.click(within(controls).getByRole('button', { name: 'Show BIG CELEBRATION' }));
    expect(next).toBeDisabled();
    expect(within(controls).getByRole('button', { name: 'Show BIG CELEBRATION' })).toHaveAttribute('aria-current', 'true');
    expect(within(catering).getByRole('heading', { name: 'CUSTOM EVENT CATERING' })).toBeInTheDocument();
    expect(within(catering).getByRole('link', { name: 'Build custom order for event catering' })).toHaveAttribute('href', 'http://localhost:5174/menu');
  });

  it('auto-advances catering cards on mobile and pauses after manual navigation', () => {
    vi.useFakeTimers();
    vi.stubGlobal('matchMedia', vi.fn((query: string) => ({ matches: query.includes('max-width: 900px') })));
    const hiddenSpy = vi.spyOn(document, 'hidden', 'get').mockReturnValue(false);
    try {
      const { container } = render(<LandingPage customerAppUrl={customerAppUrl} />);
      const controls = within(container.querySelector('.catering-section') as HTMLElement).getByRole('group', { name: 'Catering carousel controls' });
      const active = () => within(controls).getByRole('button', { name: /Show /, current: true });
      expect(active()).toHaveAccessibleName('Show OFFICE PARTY');
      act(() => vi.advanceTimersByTime(4000));
      expect(active()).toHaveAccessibleName('Show GAME NIGHT FEAST');
      fireEvent.click(within(controls).getByRole('button', { name: 'Next catering package' }));
      expect(active()).toHaveAccessibleName('Show BIG CELEBRATION');
      act(() => vi.advanceTimersByTime(4000));
      expect(active()).toHaveAccessibleName('Show BIG CELEBRATION');
      act(() => vi.advanceTimersByTime(4000));
      expect(active()).toHaveAccessibleName('Show OFFICE PARTY');
    } finally {
      hiddenSpy.mockRestore();
      vi.unstubAllGlobals();
      vi.useRealTimers();
    }
  });

  it('cycles the compact combo banner without pagination dots', () => {
    vi.useFakeTimers();
    try {
      const { container } = render(<ComboStrip customerAppUrl={customerAppUrl} />);
      const track = container.querySelector('.combo-strip__track') as HTMLElement;
      expect(track).toHaveAttribute('data-slide-index', '0');
      expect(screen.getByRole('link', { name: 'COMBO MADNESS — Explore Pizza Avenue combos' })).toHaveAttribute('href', 'http://localhost:5174/menu');
      expect(container.querySelector('.combo-strip__pagination')).not.toBeInTheDocument();
      act(() => vi.advanceTimersByTime(2499));
      expect(track).toHaveAttribute('data-slide-index', '0');
      act(() => vi.advanceTimersByTime(1));
      expect(track).toHaveAttribute('data-slide-index', '1');
      act(() => vi.advanceTimersByTime(2500));
      expect(track).toHaveAttribute('data-slide-index', '2');
      act(() => vi.advanceTimersByTime(2500));
      expect(track).toHaveAttribute('data-slide-index', '3');
      fireEvent.transitionEnd(track, { propertyName: 'transform' });
      expect(track).toHaveAttribute('data-slide-index', '0');
    } finally {
      vi.useRealTimers();
    }
  });
});

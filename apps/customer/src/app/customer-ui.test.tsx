import { getScenarioState } from '@pizza-avenue/mocks';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import { RouterProvider } from 'react-router-dom';
import { usePrototypeStore } from '../shared/state/prototype-store';
import { resetCommerceStore } from '../shared/state/commerce-store';
import { AppProviders } from './providers';
import { createCustomerMemoryRouter } from './router';

function renderRoute(path: string) {
  render(
    <AppProviders>
      <RouterProvider router={createCustomerMemoryRouter([path])} />
    </AppProviders>,
  );
}

describe('customer discovery and builder flows', () => {
  beforeEach(() => {
    resetCommerceStore();
    usePrototypeStore.setState({
      selectedScenario: null,
      scenarioState: getScenarioState(),
      builderModifierIds: [],
      serviceContext: null,
    });
  });

  it('moves a new pickup customer from the service gate into discovery', async () => {
    const user = userEvent.setup();
    renderRoute('/?scenario=NEW_CUSTOMER');
    expect(screen.queryByRole('navigation', { name: 'Customer navigation' })).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Order for Pickup' }));

    expect(await screen.findByRole('heading', { name: 'Start with the pizzas Sainikpuri orders most.' })).toBeVisible();
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(screen.getByRole('link', { name: 'Search the Pizza Avenue menu' })).toHaveAttribute('href', '/search');
    expect(screen.getByRole('link', { name: 'Browse menu categories' })).toHaveAttribute('href', '/menu');
    expect(screen.getByRole('navigation', { name: 'Customer navigation' })).toBeVisible();
  });

  it('selects Pickup from the whole card with keyboard activation and records analytics', async () => {
    const user = userEvent.setup();
    const events: Array<{ name: string; properties: Record<string, unknown> }> = [];
    const listener = (event: Event) => events.push((event as CustomEvent).detail);
    window.addEventListener('pizza-avenue:analytics', listener);
    renderRoute('/?scenario=NEW_CUSTOMER');

    const pickupChoice = screen.getByRole('button', { name: 'Order for Pickup' });
    pickupChoice.focus();
    await user.keyboard('{Enter}');

    expect(await screen.findByRole('heading', { name: 'What’s your craving today?' })).toBeVisible();
    expect(events).toContainEqual({ name: 'service_mode_selected', properties: { serviceMode: 'PICKUP', storeId: 'sainikpuri' } });
    window.removeEventListener('pizza-avenue:analytics', listener);
  });

  it('keeps the floating five-destination dock on eligible Pickup routes', async () => {
    const user = userEvent.setup();
    renderRoute('/?scenario=NEW_CUSTOMER');
    await user.click(screen.getByRole('button', { name: 'Order for Pickup' }));
    await user.click(await screen.findByRole('link', { name: 'Menu' }));

    const dock = screen.getByRole('navigation', { name: 'Customer navigation' });
    expect(dock).toHaveClass('customer-dock');
    expect(within(dock).getAllByRole('link')).toHaveLength(5);
    expect(within(dock).getByRole('link', { name: 'Menu' })).toHaveAttribute('aria-current', 'page');
  });

  it('provides a deterministic service-entry review screen', async () => {
    renderRoute('/?review=NEW_CUSTOMER');
    expect(await screen.findByRole('heading', { name: 'Pizza starts with one simple choice.' })).toBeVisible();
  });

  it('provides a deterministic new-Pickup Home review screen', async () => {
    renderRoute('/?review=NEW_PICKUP');
    expect(await screen.findByRole('heading', { name: 'Start with the pizzas Sainikpuri orders most.' })).toBeVisible();
  });

  it('completes the first-batch Home to builder route flow', async () => {
    const user = userEvent.setup();
    renderRoute('/?scenario=NEW_CUSTOMER');
    await user.click(screen.getByRole('button', { name: 'Order for Pickup' }));
    await user.click(await screen.findByRole('link', { name: 'Browse menu categories' }));
    await user.click(await screen.findByRole('link', { name: 'View Classic Margherita Pizza' }));
    await user.click(await screen.findByRole('link', { name: 'Customize' }));
    expect(await screen.findByRole('group', { name: 'Crust' })).toBeVisible();
    expect(screen.getByRole('heading', { name: 'Classic Margherita Pizza' })).toBeVisible();
  });

  it('prioritizes an active pickup order on Home', async () => {
    const user = userEvent.setup();
    renderRoute('/?scenario=ACTIVE_ORDER');

    await user.click(screen.getByRole('button', { name: 'Order for Pickup' }));

    expect(await screen.findByRole('link', { name: 'Track order' })).toBeVisible();
    expect(screen.getByText(/Active Pickup/)).toBeVisible();
  });

  it.each([
    ['STORE_BUSY', 'The kitchen is busy'],
    ['STORE_PAUSED', 'Pickup orders are paused'],
    ['STORE_CLOSED', 'Pickup is closed right now'],
  ])('shows the %s pickup-capacity state', async (scenario, message) => {
    const user = userEvent.setup();
    renderRoute(`/?scenario=${scenario}`);
    await user.click(screen.getByRole('button', { name: /Pickup/ }));
    expect(await screen.findByText(message)).toBeVisible();
  });

  it('shows returning-customer reorder context', async () => {
    renderRoute('/?review=RETURNING_CUSTOMER');
    const cravingHeading = await screen.findByRole('heading', { name: 'What’s your craving today?' });
    const usualHeading = screen.getByRole('heading', { name: 'Your usual, ready when you are.' });
    expect(cravingHeading.compareDocumentPosition(usualHeading) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'Popular at Pizza Avenue' })).toBeVisible();
    expect(screen.getByRole('link', { name: 'View Mushroom Alfredo Pizza' })).toBeVisible();
    expect(usualHeading).toBeVisible();
    expect(screen.getByRole('button', { name: 'Order Again' })).toBeVisible();
    expect(screen.getByRole('heading', { name: 'Your Avenue' })).toBeVisible();
  });

  it('rebuilds a returning customer order with current menu data', async () => {
    const user = userEvent.setup();
    renderRoute('/?review=RETURNING_CUSTOMER');
    await user.click(await screen.findByRole('button', { name: 'Order Again' }));

    expect(await screen.findByRole('heading', { name: 'Your cart' })).toBeVisible();
    expect(screen.getByText('Chicken Pepperoni Pizza')).toBeVisible();
    expect(screen.getAllByText('₹459.00').length).toBeGreaterThan(0);
  });

  it('keeps active Dine-in operations above discovery and retention', async () => {
    renderRoute('/?review=ACTIVE_DINE_IN');
    expect(await screen.findByRole('heading', { name: 'Everything for Table 12, in one place.' })).toBeVisible();
    expect(screen.getByRole('link', { name: 'Order more' })).toBeVisible();
    expect(screen.getByRole('heading', { name: 'Quick add for the table' })).toBeVisible();
    expect(screen.queryByRole('heading', { name: 'Your Avenue' })).not.toBeInTheDocument();
    expect(screen.queryByRole('navigation', { name: 'Customer navigation' })).not.toBeInTheDocument();
  });

  it('shows a recoverable Home failure without losing the Pickup context', async () => {
    const user = userEvent.setup();
    renderRoute('/?review=MENU_FAILURE_PICKUP');

    expect(await screen.findByRole('heading', { name: 'We couldn’t load today’s menu' }, { timeout: 8_000 })).toBeVisible();
    expect(screen.getByText('Your service choice is saved. Try again to see current availability.')).toBeVisible();
    expect(screen.getByRole('button', { name: 'Try again' })).toBeVisible();
    expect(screen.getByRole('navigation', { name: 'Customer navigation' })).toBeVisible();
    await user.click(screen.getByRole('button', { name: 'Change service' }));
    expect(await screen.findByRole('heading', { name: 'Pizza starts with one simple choice.' })).toBeVisible();
  });

  it('offers permission-first trusted table scanning without presenting an error', async () => {
    renderRoute('/dine-in/start');
    expect(await screen.findByRole('heading', { name: 'Scan the QR on your table' })).toBeVisible();
    expect(screen.getByRole('button', { name: /Start camera/ })).toBeVisible();
    expect(screen.getByRole('link', { name: 'Choose Pickup instead' })).toBeVisible();
    expect(screen.queryByText('Needs attention')).not.toBeInTheDocument();
  });

  it('shows the highest-priority loyal-customer retention action', async () => {
    const user = userEvent.setup();
    renderRoute('/?scenario=LOYAL_CUSTOMER');
    await user.click(screen.getByRole('button', { name: 'Order for Pickup' }));
    expect(await screen.findByText('Saved basket')).toBeVisible();
    expect(screen.getByText('Family Friday')).toBeVisible();
    expect(screen.getAllByRole('heading', { name: 'Your Avenue' })).toHaveLength(1);
  });

  it('filters the menu by category', async () => {
    const user = userEvent.setup();
    renderRoute('/menu');
    await screen.findByRole('link', { name: 'View Classic Margherita Pizza' });

    await user.click(screen.getByRole('button', { name: 'Pasta — Tossed & Sauced' }));

    expect(screen.getByRole('link', { name: 'View Alfredo Pasta' })).toBeVisible();
    expect(screen.queryByRole('link', { name: 'View Classic Margherita Pizza' })).not.toBeInTheDocument();
  });

  it('supports empty, matching and no-result search states', async () => {
    const user = userEvent.setup();
    renderRoute('/search');
    expect(await screen.findByRole('heading', { name: 'Recent searches' })).toBeVisible();

    await user.type(screen.getByRole('searchbox', { name: 'Search menu' }), 'Margherita');
    await user.click(screen.getByRole('button', { name: 'Search' }));
    expect(await screen.findByRole('link', { name: 'View Classic Margherita Pizza' })).toBeVisible();

    const input = screen.getByRole('searchbox', { name: 'Search menu' });
    await user.clear(input);
    await user.type(input, 'pineapple spaceship');
    await user.click(screen.getByRole('button', { name: 'Search' }));
    expect(await screen.findByRole('heading', { name: /No match for/ })).toBeVisible();
  });

  it('shows alternatives when a product is sold out', async () => {
    renderRoute('/menu/pizza-margherita?scenario=PRODUCT_SOLD_OUT');

    expect(await screen.findByText('Sold out today')).toBeVisible();
    expect(screen.getByRole('heading', { name: 'Try one of these instead' })).toBeVisible();
  });

  it('clears the injected menu outage and recovers when the customer retries', async () => {
    const user = userEvent.setup();
    renderRoute('/menu?scenario=MENU_NETWORK_ERROR');
    expect(await screen.findByRole('heading', { name: 'The menu is taking a breather' }, { timeout: 4_000 })).toBeVisible();
    await user.click(screen.getByRole('button', { name: 'Try again' }));

    expect(await screen.findByRole('link', { name: 'View Classic Margherita Pizza' })).toBeVisible();
    expect(screen.queryByRole('heading', { name: 'The menu is taking a breather' })).not.toBeInTheDocument();
  });

  it('validates required builder options and adds a configured item', async () => {
    const user = userEvent.setup();
    renderRoute('/menu/pizza-margherita/customize');
    const addButton = await screen.findByRole('button', { name: 'Add to pickup cart' });

    await user.click(addButton);
    expect(screen.getByText('Choose at least 1 option.')).toBeVisible();

    await user.click(screen.getByRole('radio', { name: 'Classic' }));
    await user.click(screen.getByRole('checkbox', { name: 'Extra cheese' }));
    const summary = screen.getByRole('complementary', { name: 'Your pizza summary' });
    expect(within(summary).getByText('+₹80.00')).toBeVisible();
    await user.click(addButton);

    expect(await screen.findByText('Classic Margherita Pizza added to your pickup cart.')).toBeVisible();
    expect(await screen.findByRole('heading', { name: 'Your cart' })).toBeVisible();
  });

  it('disables an unavailable modifier without hiding it', async () => {
    renderRoute('/menu/pizza-margherita/customize?scenario=MODIFIER_UNAVAILABLE');

    expect(await screen.findByRole('checkbox', { name: /Extra cheese — unavailable/ })).toBeDisabled();
  });

  it('enforces the maximum number of extra toppings', async () => {
    const user = userEvent.setup();
    renderRoute('/menu/pizza-margherita/customize');
    await screen.findByRole('group', { name: 'Extra toppings' });
    await user.click(screen.getByRole('checkbox', { name: 'Mushroom' }));
    await user.click(screen.getByRole('checkbox', { name: 'Jalapeño' }));
    await user.click(screen.getByRole('checkbox', { name: 'Olives' }));
    expect(screen.getByRole('checkbox', { name: 'Onion' })).toBeDisabled();
  });
});

import { getScenarioState } from '@pizza-avenue/mocks';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import { RouterProvider } from 'react-router-dom';
import { usePrototypeStore } from '../shared/state/prototype-store';
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
    usePrototypeStore.setState({
      selectedScenario: null,
      scenarioState: getScenarioState(),
      builderModifierIds: [],
      cartId: null,
      cartItemCount: 0,
      serviceContext: null,
    });
  });

  it('moves a new pickup customer from the service gate into discovery', async () => {
    const user = userEvent.setup();
    renderRoute('/?scenario=NEW_CUSTOMER');
    expect(screen.queryByRole('navigation', { name: 'Customer navigation' })).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Choose Pickup' }));

    expect(await screen.findByRole('heading', { name: 'Good pizza, without the queue.' })).toBeVisible();
    expect(screen.getByRole('link', { name: 'Browse the menu' })).toHaveAttribute('href', '/menu');
    expect(screen.getByRole('navigation', { name: 'Customer navigation' })).toBeVisible();
  });

  it('completes the first-batch Home to builder route flow', async () => {
    const user = userEvent.setup();
    renderRoute('/?scenario=NEW_CUSTOMER');
    await user.click(screen.getByRole('button', { name: 'Choose Pickup' }));
    await user.click(await screen.findByRole('link', { name: 'Browse the menu' }));
    await user.click(await screen.findByRole('link', { name: 'View Margherita' }));
    await user.click(await screen.findByRole('link', { name: 'Customize' }));
    expect(await screen.findByRole('heading', { name: 'Margherita' })).toBeVisible();
    expect(screen.getByRole('group', { name: 'Crust' })).toBeVisible();
  });

  it('prioritizes an active pickup order on Home', async () => {
    const user = userEvent.setup();
    renderRoute('/?scenario=ACTIVE_ORDER');

    await user.click(screen.getByRole('button', { name: 'Choose Pickup' }));

    expect(await screen.findByRole('link', { name: 'Track order' })).toBeVisible();
    expect(screen.getByText(/Active pickup/)).toBeVisible();
  });

  it.each([
    ['STORE_BUSY', 'The kitchen is busy'],
    ['STORE_PAUSED', 'Pickup orders are paused'],
    ['STORE_CLOSED', 'Pickup is closed right now'],
  ])('shows the %s pickup-capacity state', async (scenario, message) => {
    const user = userEvent.setup();
    renderRoute(`/?scenario=${scenario}`);
    await user.click(screen.getByRole('button', { name: 'Choose Pickup' }));
    expect(await screen.findByText(message)).toBeVisible();
  });

  it('shows returning-customer reorder context', async () => {
    const user = userEvent.setup();
    renderRoute('/?scenario=RETURNING_CUSTOMER');
    await user.click(screen.getByRole('button', { name: 'Choose Pickup' }));
    expect(await screen.findByRole('heading', { name: 'Order again' })).toBeVisible();
  });

  it('shows loyal-customer passport progress', async () => {
    const user = userEvent.setup();
    renderRoute('/?scenario=LOYAL_CUSTOMER');
    await user.click(screen.getByRole('button', { name: 'Choose Pickup' }));
    expect(await screen.findByRole('heading', { name: 'Pizza Passport' })).toBeVisible();
  });

  it('filters the menu by category', async () => {
    const user = userEvent.setup();
    renderRoute('/menu');
    await screen.findByRole('link', { name: 'View Margherita' });

    await user.click(screen.getByRole('button', { name: 'Pastas' }));

    expect(screen.getByRole('link', { name: 'View Alfredo Pasta' })).toBeVisible();
    expect(screen.queryByRole('link', { name: 'View Margherita' })).not.toBeInTheDocument();
  });

  it('supports empty, matching and no-result search states', async () => {
    const user = userEvent.setup();
    renderRoute('/search');
    expect(await screen.findByRole('heading', { name: 'Recent searches' })).toBeVisible();

    await user.type(screen.getByRole('searchbox', { name: 'Search menu' }), 'Margherita');
    await user.click(screen.getByRole('button', { name: 'Search' }));
    expect(await screen.findByRole('link', { name: 'View Margherita' })).toBeVisible();

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

  it('offers recovery when the menu request fails', async () => {
    renderRoute('/menu?scenario=MENU_NETWORK_ERROR');
    expect(await screen.findByRole('heading', { name: 'The menu is taking a breather' }, { timeout: 4_000 })).toBeVisible();
    expect(screen.getByRole('button', { name: 'Try again' })).toBeVisible();
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

    expect(await screen.findByText('Margherita added to your pickup cart.')).toBeVisible();
    expect(screen.getByRole('link', { name: 'View cart with 1 item' })).toBeVisible();
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

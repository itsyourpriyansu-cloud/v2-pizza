import { completeMission, getLoyaltyAccount, getPassportProgress } from '@pizza-avenue/api-client';
import { getScenarioState, setScenario, setScenarioState } from '@pizza-avenue/mocks';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import { RouterProvider } from 'react-router-dom';
import { resetCommerceStore } from '../shared/state/commerce-store';
import { usePrototypeStore } from '../shared/state/prototype-store';
import { AppProviders } from './providers';
import { createCustomerMemoryRouter } from './router';

function renderRoute(path: string) { return render(<AppProviders><RouterProvider router={createCustomerMemoryRouter([path])} /></AppProviders>); }
function setPickupContext() { usePrototypeStore.getState().setServiceContext({ mode: 'PICKUP', storeId: 'sainikpuri', tableId: null, tableLabel: null, tableSessionId: null, confirmedAt: new Date().toISOString() }); }
function setDineInContext() { usePrototypeStore.getState().setServiceContext({ mode: 'DINE_IN', storeId: 'sainikpuri', tableId: 'table-12', tableLabel: 'Table 12', tableSessionId: 'table-session-12', confirmedAt: new Date().toISOString() }); }

describe('customer retention end-to-end missions', () => {
  beforeEach(() => { resetCommerceStore(); usePrototypeStore.setState({ selectedScenario: null, scenarioState: getScenarioState(), builderModifierIds: [], serviceContext: null }); });

  it('01. opens one-left Passport from Home and preserves source into Product Detail', async () => {
    const user = userEvent.setup();
    const state = setScenarioState({ customer: 'LOYAL_CUSTOMER', rewards: 'REWARD_LOCKED', passport: 'PASSPORT_ONE_LEFT', savedBasket: 'SAVED_BASKETS_EMPTY', occasion: 'NO_OCCASIONS' });
    usePrototypeStore.setState({ scenarioState: state }); setPickupContext(); renderRoute('/');
    await user.click(await screen.findByRole('link', { name: /Pizza Passport/ }));
    expect(await screen.findByText('5 of 6 discovered')).toBeVisible();
    const productLink = screen.getByRole('link', { name: 'View pizza' });
    expect(productLink).toHaveAttribute('href', '/menu/pizza-meat-lovers?source=PASSPORT');
    await user.click(productLink);
    expect(await screen.findByRole('heading', { name: 'Meat Lovers Pizza' })).toBeVisible();
  });

  it('02. reserves and releases a reward without consuming it', async () => {
    const user = userEvent.setup(); renderRoute('/rewards');
    await user.click(await screen.findByRole('button', { name: 'Use reward' }));
    expect(await screen.findByText(/has not been consumed/i)).toBeVisible();
    expect(screen.getByText('Reserved for this order')).toBeVisible();
    await user.click(screen.getByRole('button', { name: 'Release' }));
    expect(await screen.findByText(/available again/i)).toBeVisible();
  });

  it('03. moves Passport from five stamps to complete without duplicates', async () => {
    setScenario('PASSPORT_ONE_LEFT');
    const before = await getPassportProgress();
    expect(before.completedItemIds).toHaveLength(5);
    setScenario('PASSPORT_COMPLETED');
    const complete = await getPassportProgress();
    expect(new Set(complete.completedItemIds).size).toBe(6);
    renderRoute('/rewards/passport');
    expect(await screen.findByRole('heading', { name: 'Passport complete' })).toBeVisible();
    expect(screen.getByText('Your completion reward is unlocked.')).toBeVisible();
  });

  it('04. completes a Personal mission and grants XP exactly once', async () => {
    setScenario('PERSONAL_MISSION_PARTIAL');
    const first = await completeMission('mission-personal-veggie');
    const duplicate = await completeMission('mission-personal-veggie');
    expect(first.personal.find((mission) => mission.id === 'mission-personal-veggie')?.status).toBe('COMPLETED');
    expect(first.avenueXp).toBe(260);
    expect(duplicate.avenueXp).toBe(260);
    setScenario('PERSONAL_MISSION_COMPLETE'); renderRoute('/rewards/missions');
    expect(await screen.findAllByText('Complete')).not.toHaveLength(0);
  });

  it('05. completes a Common mission and grants XP exactly once', async () => {
    setScenario('COMMON_MISSION_ACTIVE');
    const first = await completeMission('mission-common-pasta');
    const duplicate = await completeMission('mission-common-pasta');
    expect(first.common.find((mission) => mission.id === 'mission-common-pasta')?.status).toBe('COMPLETED');
    expect(first.avenueXp).toBe(220);
    expect(duplicate.avenueXp).toBe(220);
    setScenario('COMMON_MISSION_COMPLETE'); renderRoute('/rewards/missions');
    expect(await screen.findByRole('heading', { name: 'Common missions' })).toBeVisible();
    expect(screen.getAllByText('Complete').length).toBeGreaterThan(0);
  });

  it('06. keeps served Dine-in Points pending until TABLE_BILL_PAID', async () => {
    setScenario('DINE_IN_LOYALTY_PENDING');
    expect(await getLoyaltyAccount()).toMatchObject({ pointsBalance: 840, pendingPoints: 130 });
    setScenario('DINE_IN_LOYALTY_PAID');
    expect(await getLoyaltyAccount()).toMatchObject({ pointsBalance: 970, pendingPoints: 0 });
  });

  it('07. saves a typed profile preference and recovers from save failure', async () => {
    const user = userEvent.setup(); renderRoute('/profile');
    await user.click(await screen.findByRole('radio', { name: 'Vegetarian' }));
    await user.click(screen.getByRole('button', { name: 'Save preferences' }));
    expect(await screen.findByText('Preferences saved.')).toBeVisible();
    setScenario('PROFILE_SAVE_FAILURE');
    await user.click(screen.getByRole('checkbox', { name: 'Occasional offers' }));
    await user.click(screen.getByRole('button', { name: 'Save preferences' }));
    expect(await screen.findByRole('alert')).toHaveTextContent(/previous settings are unchanged/i);
  });

  it('08. keeps an active Pickup order above the secondary retention module', async () => {
    const state = setScenarioState({ customer: 'ACTIVE_ORDER', rewards: 'REWARD_AVAILABLE' });
    usePrototypeStore.setState({ scenarioState: state }); setPickupContext(); renderRoute('/');
    const track = await screen.findByRole('link', { name: 'Track order' });
    const retention = screen.getByLabelText('Your next loyalty action');
    expect(track.compareDocumentPosition(retention) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it('09. keeps active Table context, Order More and Current Bill above retention', async () => {
    setDineInContext(); renderRoute('/');
    expect(await screen.findByRole('heading', { name: 'Table 12 is active.' })).toBeVisible();
    expect(screen.getByRole('link', { name: 'Order more' })).toHaveAttribute('href', '/dine-in/order-more');
    expect(screen.getByRole('link', { name: 'Current bill' })).toHaveAttribute('href', '/dine-in/bill');
    expect(screen.queryByLabelText('Your next loyalty action')).not.toBeInTheDocument();
  });

  it('10. shows ordinary Passport progress after higher-priority Home actions are absent', async () => {
    const state = setScenarioState({ customer: 'LOYAL_CUSTOMER', savedBasket: 'SAVED_BASKETS_EMPTY', occasion: 'NO_OCCASIONS', rewards: 'REWARD_LOCKED', passport: 'PASSPORT_PROGRESS', missions: 'NO_ACTIVE_MISSIONS' });
    usePrototypeStore.setState({ scenarioState: state }); setPickupContext(); renderRoute('/');
    expect(await screen.findByText('Keep exploring the signature menu.')).toBeVisible();
    expect(screen.getByText('4 of 6 discovered')).toBeVisible();
  });
});

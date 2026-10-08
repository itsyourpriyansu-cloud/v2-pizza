import {
  addGroupItem,
  addHouseholdMember,
  advanceReferral,
  checkoutGroupOrder,
  createGroupOrder,
  createOccasion,
  getGroupOrder,
  getLeague,
  getLoyaltyAccount,
  getReferrals,
  getTasteCard,
  joinGroupOrder,
  shareTasteCard,
  updateHouseholdMember,
  voteGroupPoll,
} from '@pizza-avenue/api-client';
import { getScenarioState, setScenario, setScenarioState } from '@pizza-avenue/mocks';
import { render, screen, within } from '@testing-library/react';
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

describe('customer engagement complete end-to-end missions', () => {
  beforeEach(() => { resetCommerceStore(); usePrototypeStore.setState({ selectedScenario: null, scenarioState: getScenarioState(), builderModifierIds: [], serviceContext: null }); });

  it('01. revalidates a ready Saved Basket and hands it to the existing cart', async () => {
    const user = userEvent.setup(); setPickupContext(); renderRoute('/profile/saved-baskets/basket-family-friday');
    await user.click(await screen.findByRole('button', { name: 'Order again' }));
    expect(await screen.findByRole('heading', { name: 'Your cart' })).toBeVisible();
    expect(screen.getByText(/Chicken Pepperoni Pizza/)).toBeVisible();
    expect(screen.getByRole('link', { name: 'Choose pickup time' })).toBeVisible();
  }, 10_000);

  it('02. preserves valid Saved Basket items when one product is unavailable', async () => {
    const user = userEvent.setup(); setScenario('SAVED_BASKET_STALE'); setPickupContext(); renderRoute('/profile/saved-baskets/basket-family-friday');
    await user.click(await screen.findByRole('button', { name: 'Order again' }));
    expect(await screen.findByText('Chicken Pepperoni is currently unavailable.')).toBeVisible();
    expect(screen.getByText('Garlic Knots now cost ₹169.00.')).toBeVisible();
    expect(screen.getByText('4 items remain ready.')).toBeVisible();
    await user.click(screen.getByRole('button', { name: 'Continue with preserved basket' }));
    expect(await screen.findByRole('heading', { name: 'Your cart' })).toBeVisible();
    expect(screen.queryByText(/Chicken Pepperoni Pizza/)).not.toBeInTheDocument();
    expect(screen.getByText(/Pesto Pizza/)).toBeVisible();
  });

  it('03. adds and edits a private Household member', async () => {
    const added = await addHouseholdMember({ displayName: 'Kabir', relationship: 'FRIEND', birthday: { day: 3, month: 5 }, foodPreference: 'NON_VEG', favouritePizza: 'Farmhouse Pizza', favouriteSide: null, avoidIngredients: ['olives'] });
    const updated = await updateHouseholdMember(added.id, { ...added, favouriteSide: 'Garlic Knots' });
    expect(updated).toMatchObject({ displayName: 'Kabir', relationship: 'FRIEND', favouriteSide: 'Garlic Knots' });
    renderRoute('/profile/family');
    const card = (await screen.findByRole('heading', { name: 'Kabir' })).closest('article')!;
    expect(within(card).getByText(/Garlic Knots/)).toBeVisible();
  });

  it('04. creates an Occasion linked to a Saved Basket and plans it into cart', async () => {
    const user = userEvent.setup(); setPickupContext();
    await createOccasion({ title: 'Team celebration', type: 'OFFICE_PIZZA_DAY', date: '2026-10-21', householdMemberId: null, savedBasketId: 'basket-family-friday', peopleCount: 6, reminderPreference: 'ONE_WEEK' });
    renderRoute('/profile/occasions');
    const card = (await screen.findByRole('heading', { name: 'Team celebration' })).closest('article')!;
    await user.click(within(card).getByRole('button', { name: 'Plan order' }));
    expect(await screen.findByRole('heading', { name: 'Your cart' })).toBeVisible();
  });

  it('05. advances Referral from pending to qualified to rewarded', async () => {
    setScenario('REFERRAL_PENDING');
    const pending = (await getReferrals())[0]!;
    expect(pending.status).toBe('FIRST_ORDER_PENDING');
    const qualified = await advanceReferral(pending.id);
    expect(qualified).toMatchObject({ status: 'QUALIFIED', qualifyingOrderCompleted: true });
    const rewarded = await advanceReferral(pending.id);
    expect(rewarded.status).toBe('REWARDED');
  });

  it('06. previews a Taste Card with a privacy-safe share payload', async () => {
    const card = await getTasteCard();
    const shared = await shareTasteCard();
    const payload = JSON.stringify(shared.payload).toLowerCase();
    expect(card.picks).toHaveLength(3);
    expect(payload).toContain('pesto pizza');
    for (const forbidden of ['phone', 'email', 'birthday', 'points', 'order history', 'household']) expect(payload).not.toContain(forbidden);
  });

  it('07. opts into League and shows season, nearby ranking and threshold', async () => {
    const user = userEvent.setup(); setScenario('LEAGUE_NOT_JOINED'); renderRoute('/rewards/league');
    expect(await screen.findByRole('heading', { name: 'Join when it feels fun' })).toBeVisible();
    await user.click(screen.getByRole('button', { name: 'Join this season' }));
    expect(await screen.findByText('#12 this month')).toBeVisible();
    expect(screen.getByLabelText('Avenue League positions near you')).toBeVisible();
    expect(screen.getByText('60 XP to Top 10')).toBeVisible();
  });

  it('08. creates a Group Order, joins a participant, contributes and returns host review state', async () => {
    const group = await createGroupOrder();
    const joined = await joinGroupOrder(group.id, 'Kabir');
    expect(joined.participants.some((participant) => participant.displayName === 'Kabir')).toBe(true);
    const contributed = await addGroupItem(group.id, 'pizza-farmhouse');
    expect(contributed.participants.flatMap((participant) => participant.contributions).some((item) => item.productId === 'pizza-farmhouse')).toBe(true);
    expect((await getGroupOrder(group.id)).currentParticipantRole).toBe('HOST');
  });

  it('09. records a deterministic Group Poll vote only once', async () => {
    const group = await createGroupOrder();
    const first = await voteGroupPoll(group.id, 'poll-pesto');
    const duplicate = await voteGroupPoll(group.id, 'poll-pesto');
    const firstVotes = first.poll?.options.find((option) => option.id === 'poll-pesto')?.votes;
    const duplicateVotes = duplicate.poll?.options.find((option) => option.id === 'poll-pesto')?.votes;
    expect(firstVotes).toBe(5);
    expect(duplicateVotes).toBe(5);
  });

  it('10. hands the Group Basket to the existing one-host checkout cart', async () => {
    const group = await createGroupOrder();
    const result = await checkoutGroupOrder(group.id);
    expect(result.cart.serviceMode).toBe('PICKUP');
    expect(result.cart.items.length).toBeGreaterThan(0);
    expect(result.differences).toEqual([]);
  });

  it('11. shows contextual reactivation instead of a generic discount', async () => {
    const state = setScenarioState({ customer: 'RETURNING_CUSTOMER', engagement: 'REACTIVATION_CUSTOMER', savedBasket: 'SAVED_BASKETS_EMPTY', occasion: 'NO_OCCASIONS', rewards: 'REWARD_LOCKED', passport: 'PASSPORT_NEW', missions: 'NO_ACTIVE_MISSIONS' });
    usePrototypeStore.setState({ scenarioState: state }); setPickupContext(); renderRoute('/');
    expect(await screen.findByText("It's been a while.")).toBeVisible();
    expect(screen.getByText('Your Family Friday basket is ready whenever you are.')).toBeVisible();
    expect(screen.queryByText(/discount/i)).not.toBeInTheDocument();
  });

  it('12. keeps active Pickup above an upcoming Occasion', async () => {
    const state = setScenarioState({ customer: 'ACTIVE_ORDER', savedBasket: 'SAVED_BASKETS_EMPTY', occasion: 'UPCOMING_OCCASION', rewards: 'REWARD_LOCKED', passport: 'PASSPORT_NEW', missions: 'NO_ACTIVE_MISSIONS' });
    usePrototypeStore.setState({ scenarioState: state }); setPickupContext(); renderRoute('/');
    const track = await screen.findByRole('link', { name: 'Track order' });
    expect(track).toBeVisible();
    expect(screen.queryByText("Mom's birthday")).not.toBeInTheDocument();
  });

  it('13. keeps active Dine-in above League progress and hides engagement modules', async () => {
    setScenario('LEAGUE_ACTIVE'); setDineInContext(); renderRoute('/');
    expect(await screen.findByRole('heading', { name: 'Everything for Table 12, in one place.' })).toBeVisible();
    expect(screen.getByRole('link', { name: 'Order more' })).toBeVisible();
    expect(screen.queryByText(/Gold League/i)).not.toBeInTheDocument();
  });

  it('14. keeps Served but unpaid Dine-in loyalty and League progression unfinalized', async () => {
    setScenarioState({ operations: 'DINE_IN_SERVED', rewards: 'DINE_IN_LOYALTY_PENDING', league: 'LEAGUE_ACTIVE' });
    const beforeLeague = await getLeague();
    const loyalty = await getLoyaltyAccount();
    const afterLeague = await getLeague();
    expect(loyalty).toMatchObject({ pointsBalance: 840, pendingPoints: 130 });
    expect(afterLeague.currentXp).toBe(beforeLeague.currentXp);
    expect(afterLeague.currentRank).toBe(beforeLeague.currentRank);
  });
});

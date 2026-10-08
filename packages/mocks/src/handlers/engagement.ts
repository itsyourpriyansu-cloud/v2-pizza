import type {
  Cart,
  GroupOrder,
  HouseholdMember,
  HouseholdMemberInput,
  LeagueOverview,
  Occasion,
  OccasionInput,
  Referral,
  ReferralStatus,
  SavedBasket,
  SavedBasketValidationResult,
} from '@pizza-avenue/types';
import { HttpResponse, http } from 'msw';
import { groupOrder as baseGroupOrder, householdMembers as baseHousehold, leagueOverview, occasions as baseOccasions, referral as baseReferral, savedBaskets as baseSavedBaskets, tasteCard } from '../data';
import { menu } from '../data/menu';
import { formatMoney } from '@pizza-avenue/utils';
import { money } from '../factories';
import { getScenarioState } from '../scenarios';
import { seedCartData } from './cart';

let baskets: SavedBasket[] = [];
let household: HouseholdMember[] = [];
let occasions: Occasion[] = [];
let referralState: Referral = structuredClone(baseReferral);
let leagueState: LeagueOverview = structuredClone(leagueOverview);
let groupState: GroupOrder = structuredClone(baseGroupOrder);

export function resetEngagementData() {
  baskets = structuredClone(baseSavedBaskets);
  household = structuredClone(baseHousehold);
  occasions = structuredClone(baseOccasions);
  referralState = structuredClone(baseReferral);
  leagueState = structuredClone(leagueOverview);
  groupState = structuredClone(baseGroupOrder);
}
resetEngagementData();

function unavailable(message: string) {
  return HttpResponse.json({ error: { code: 'ENGAGEMENT_UNAVAILABLE', message, details: {} } }, { status: 503 });
}

function basketCart(basket: SavedBasket, stale = false): SavedBasketValidationResult {
  const preserved = stale ? basket.items.filter((item) => item.productId !== 'pizza-chicken-pepperoni') : basket.items;
  const currentPrice = (item: SavedBasket['items'][number]) => {
    const product = menu.products.find((candidate) => candidate.id === item.productId);
    return product?.variants.find((variant) => variant.id === item.variantId)?.basePrice
      ?? product?.variants.find((variant) => variant.availability === 'AVAILABLE')?.basePrice
      ?? item.historicalUnitPrice;
  };
  const cart: Cart = {
    id: `cart-saved-${basket.id}`,
    storeId: 'sainikpuri',
    serviceMode: 'PICKUP',
    status: 'ACTIVE',
    expiresAt: new Date(Date.now() + 120 * 60_000).toISOString(),
    items: preserved.map((item, index) => ({
      id: `cart-saved-item-${index + 1}`,
      productId: item.productId,
      productNameSnapshot: item.productName,
      variantId: item.variantId,
      variantNameSnapshot: item.variantName,
      selectedModifiers: item.modifiers,
      quantity: item.quantity,
      notes: null,
      provisionalUnitPrice: currentPrice(item),
    })),
  };
  seedCartData(cart);
  return {
    basket,
    cart,
    preservedItemCount: cart.items.length,
    differences: stale ? [
      { code: 'ITEM_UNAVAILABLE', itemId: 'family-1', message: 'Chicken Pepperoni is currently unavailable.', recoverable: true },
      { code: 'PRICE_CHANGED', itemId: 'family-4', message: `Garlic Knots now cost ${formatMoney(currentPrice(basket.items.find((item) => item.id === 'family-4')!))}.`, recoverable: true },
      { code: 'MODIFIER_CHANGED', itemId: 'family-3', message: 'Your old extra-cheese option has changed.', recoverable: true },
    ] : [],
  };
}

function referralForScenario(): Referral {
  if (referralState.status !== baseReferral.status) return referralState;
  const status: Partial<Record<string, ReferralStatus>> = {
    REFERRAL_PENDING: 'FIRST_ORDER_PENDING', REFERRAL_QUALIFIED: 'QUALIFIED', REFERRAL_REWARDED: 'REWARDED', REFERRAL_EXPIRED: 'EXPIRED',
  };
  const nextStatus = status[getScenarioState().referral] ?? referralState.status;
  return { ...referralState, status: nextStatus, qualifyingOrderCompleted: nextStatus === 'QUALIFIED' || nextStatus === 'REWARDED' };
}

function leagueForScenario(): LeagueOverview {
  const scenario = getScenarioState().league;
  if (scenario === 'LEAGUE_NOT_JOINED') return { ...leagueState, optedIn: false, meaningfulParticipation: false, currentRank: null, progressMessage: 'Join when you want your Avenue XP to count toward a season.', nearby: [] };
  if (scenario === 'LEAGUE_TOP_10') return { ...leagueState, currentRank: 8, currentXp: 710, progressMessage: '90 XP to Top 5', nearby: leagueState.nearby.map((entry, index) => ({ ...entry, rank: 6 + index, isCurrentCustomer: index === 2, displayName: index === 2 ? 'You' : entry.displayName })) };
  return leagueState;
}

function groupForScenario(): GroupOrder {
  const scenario = getScenarioState().groupOrder;
  if (scenario === 'GROUP_ORDER_EXPIRED') return { ...groupState, status: 'EXPIRED', notices: ['This invite has expired. Ask the host to start a new group.'] };
  if (scenario === 'GROUP_ORDER_CLOSED') return { ...groupState, status: 'CLOSED', notices: ['The host has closed this group order.'] };
  if (scenario === 'GROUP_ORDER_HOST_LEFT') return { ...groupState, status: 'HOST_LEFT', notices: ['The host left this group. Start a new group to continue.'] };
  if (scenario === 'GROUP_ITEM_UNAVAILABLE') return { ...groupState, notices: ['Chicken Pepperoni is unavailable. Other contributions are preserved.'] };
  if (scenario === 'GROUP_BASKET_CHANGED') return { ...groupState, notices: ['The combined basket changed. Review the latest items before checkout.'] };
  if (scenario === 'GROUP_PARTICIPANT_REMOVED') return { ...groupState, notices: ['One participant was removed. Their private profile was never shared.'] };
  if (scenario === 'GROUP_ORDER_PARTICIPANT') return { ...groupState, currentParticipantRole: 'PARTICIPANT' };
  return groupState;
}

export const engagementHandlers = [
  http.get('*/api/v1/me/engagement-summary', () => {
    const state = getScenarioState();
    const reactivation = state.engagement === 'REACTIVATION_CUSTOMER';
    return HttpResponse.json({
      savedBasket: reactivation || state.savedBasket === 'SAVED_BASKETS_EMPTY' ? null : (({ id, name, lastOrderedAt, peopleCount }) => ({ id, name, lastOrderedAt, peopleCount }))(baskets[0]!),
      occasion: reactivation || state.occasion === 'NO_OCCASIONS' ? null : (({ id, title, daysAway, savedBasketId }) => ({ id, title, daysAway, savedBasketId }))(occasions[0]!),
      referral: reactivation ? null : (({ id, inviteeDisplayName, status }) => ({ id, inviteeDisplayName, status }))(referralForScenario()),
      league: reactivation ? null : (({ optedIn, currentTier, currentRank, progressMessage }) => ({ optedIn, currentTier, currentRank, progressMessage }))(leagueForScenario()),
      reactivation: reactivation ? { title: "It's been a while.", body: 'Your Family Friday basket is ready whenever you are.', ctaLabel: 'Review Family Friday', ctaHref: '/profile/saved-baskets/basket-family-friday' } : null,
    });
  }),
  http.get('*/api/v1/me/saved-baskets', () => {
    const scenario = getScenarioState().savedBasket;
    if (scenario === 'SAVED_BASKETS_NETWORK_ERROR') return unavailable('Saved baskets are temporarily unavailable.');
    return HttpResponse.json(scenario === 'SAVED_BASKETS_EMPTY' ? [] : baskets);
  }),
  http.post('*/api/v1/me/saved-baskets', async ({ request }) => {
    const input = await request.json() as Pick<SavedBasket, 'name' | 'kind' | 'peopleCount'>;
    const basket: SavedBasket = { ...input, id: `basket-custom-${baskets.length + 1}`, items: [], lastOrderedAt: null, estimatedCurrentPrice: money(0) };
    baskets = [...baskets, basket];
    return HttpResponse.json(basket, { status: 201 });
  }),
  http.get('*/api/v1/me/saved-baskets/:basketId', ({ params }) => {
    const basket = baskets.find((entry) => entry.id === params.basketId);
    return basket ? HttpResponse.json(basket) : HttpResponse.json({ error: { code: 'SAVED_BASKET_NOT_FOUND', message: 'Saved basket not found.', details: {} } }, { status: 404 });
  }),
  http.patch('*/api/v1/me/saved-baskets/:basketId', async ({ params, request }) => {
    const input = await request.json() as Pick<SavedBasket, 'name' | 'peopleCount'>;
    const index = baskets.findIndex((entry) => entry.id === params.basketId);
    if (index < 0) return new HttpResponse(null, { status: 404 });
    baskets[index] = { ...baskets[index]!, ...input };
    return HttpResponse.json(baskets[index]);
  }),
  http.delete('*/api/v1/me/saved-baskets/:basketId', ({ params }) => {
    baskets = baskets.filter((entry) => entry.id !== params.basketId);
    return new HttpResponse(null, { status: 204 });
  }),
  http.post('*/api/v1/me/saved-baskets/:basketId/reorder', ({ params }) => {
    const basket = baskets.find((entry) => entry.id === params.basketId);
    if (!basket) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json(basketCart(basket, getScenarioState().savedBasket === 'SAVED_BASKET_STALE'));
  }),
  http.post('*/api/v1/me/saved-baskets/:basketId/share', ({ params }) => {
    const basket = baskets.find((entry) => entry.id === params.basketId);
    return basket ? HttpResponse.json({ text: `${basket.name}: ${basket.items.map((item) => `${item.quantity}× ${item.productName}`).join(', ')}` }) : new HttpResponse(null, { status: 404 });
  }),
  http.get('*/api/v1/me/household', () => {
    if (getScenarioState().family === 'FAMILY_NETWORK_ERROR') return unavailable('Family profiles are temporarily unavailable.');
    return HttpResponse.json(getScenarioState().family === 'NO_FAMILY_MEMBERS' ? [] : household);
  }),
  http.post('*/api/v1/me/household', async ({ request }) => {
    const input = await request.json() as HouseholdMemberInput;
    const member = { ...input, id: `household-${household.length + 1}` };
    household = [...household, member];
    return HttpResponse.json(member, { status: 201 });
  }),
  http.patch('*/api/v1/me/household/:memberId', async ({ params, request }) => {
    const input = await request.json() as HouseholdMemberInput;
    const index = household.findIndex((entry) => entry.id === params.memberId);
    if (index < 0) return new HttpResponse(null, { status: 404 });
    household[index] = { ...input, id: household[index]!.id };
    return HttpResponse.json(household[index]);
  }),
  http.get('*/api/v1/me/occasions', () => {
    if (getScenarioState().occasion === 'OCCASION_NETWORK_ERROR') return unavailable('Occasions are temporarily unavailable.');
    return HttpResponse.json(getScenarioState().occasion === 'NO_OCCASIONS' ? [] : occasions);
  }),
  http.post('*/api/v1/me/occasions', async ({ request }) => {
    const input = await request.json() as OccasionInput;
    const occasion: Occasion = { ...input, id: `occasion-${occasions.length + 1}`, daysAway: 14 };
    occasions = [...occasions, occasion];
    return HttpResponse.json(occasion, { status: 201 });
  }),
  http.post('*/api/v1/me/occasions/:occasionId/plan', ({ params }) => {
    const occasion = occasions.find((entry) => entry.id === params.occasionId);
    const basket = baskets.find((entry) => entry.id === occasion?.savedBasketId);
    return basket ? HttpResponse.json(basketCart(basket)) : HttpResponse.json({ error: { code: 'OCCASION_BASKET_MISSING', message: 'Link a saved basket before planning this order.', details: {} } }, { status: 409 });
  }),
  http.get('*/api/v1/me/referrals', () => HttpResponse.json([referralForScenario()])),
  http.post('*/api/v1/me/referrals/share', () => {
    referralState = { ...baseReferral, id: 'referral-new', inviteeDisplayName: 'Invite sent', status: 'SHARED', sharedAt: new Date().toISOString() };
    return HttpResponse.json(referralState, { status: 201 });
  }),
  http.post('*/api/v1/me/referrals/:referralId/advance', () => {
    const next: Partial<Record<ReferralStatus, ReferralStatus>> = { SHARED: 'CLICKED', CLICKED: 'REGISTERED', REGISTERED: 'VERIFIED', VERIFIED: 'FIRST_ORDER_PENDING', FIRST_ORDER_PENDING: 'QUALIFIED', QUALIFIED: 'REWARDED' };
    referralState = { ...referralForScenario(), status: next[referralForScenario().status] ?? referralForScenario().status };
    referralState.qualifyingOrderCompleted = referralState.status === 'QUALIFIED' || referralState.status === 'REWARDED';
    return HttpResponse.json(referralState);
  }),
  http.get('*/api/v1/me/taste-card', () => HttpResponse.json(tasteCard)),
  http.post('*/api/v1/me/taste-card/share', () => HttpResponse.json({ payload: tasteCard.sharePayload })),
  http.get('*/api/v1/me/league', () => getScenarioState().league === 'LEAGUE_NETWORK_ERROR' ? unavailable('League is temporarily unavailable.') : HttpResponse.json(leagueForScenario())),
  http.post('*/api/v1/me/league/opt-in', () => {
    leagueState = { ...leagueOverview, optedIn: true, meaningfulParticipation: true };
    return HttpResponse.json(leagueState);
  }),
  http.post('*/api/v1/group-orders', () => {
    groupState = structuredClone(baseGroupOrder);
    return HttpResponse.json(groupState, { status: 201 });
  }),
  http.get('*/api/v1/group-orders/:groupId', () => getScenarioState().groupOrder === 'GROUP_ORDER_NETWORK_ERROR' ? unavailable('The group could not be refreshed.') : HttpResponse.json(groupForScenario())),
  http.post('*/api/v1/group-orders/:groupId/join', async ({ request }) => {
    const { displayName } = await request.json() as { displayName: string };
    groupState = { ...groupState, participants: [...groupState.participants, { id: `participant-${groupState.participants.length + 1}`, displayName, role: 'PARTICIPANT', contributions: [] }] };
    return HttpResponse.json(groupState);
  }),
  http.post('*/api/v1/group-orders/:groupId/items', async ({ request }) => {
    const { productId } = await request.json() as { productId: string };
    if (getScenarioState().groupOrder === 'GROUP_ITEM_UNAVAILABLE' && productId === 'pizza-chicken-pepperoni') return HttpResponse.json({ error: { code: 'GROUP_ITEM_UNAVAILABLE', message: 'Chicken Pepperoni is unavailable. Existing choices are preserved.', details: {} } }, { status: 409 });
    const products: Record<string, string> = { 'pizza-pesto': 'Pesto Pizza', 'pizza-chicken-pepperoni': 'Chicken Pepperoni Pizza', 'pizza-farmhouse': 'Farmhouse Pizza' };
    const participantId = groupState.currentParticipantRole === 'HOST' ? 'participant-host' : groupState.participants.at(-1)?.id;
    groupState = { ...groupState, participants: groupState.participants.map((entry) => entry.id === participantId ? { ...entry, contributions: [...entry.contributions, { productId, productName: products[productId] ?? 'Pizza', quantity: 1 }] } : entry) };
    return HttpResponse.json(groupState);
  }),
  http.post('*/api/v1/group-orders/:groupId/poll', async ({ request }) => {
    const { optionId } = await request.json() as { optionId: string };
    groupState = { ...groupState, poll: groupState.poll ? { ...groupState.poll, options: groupState.poll.options.map((option) => option.id === optionId ? { ...option, votes: option.selectedByCurrentParticipant ? option.votes : option.votes + 1, selectedByCurrentParticipant: true } : option) } : null };
    return HttpResponse.json(groupState);
  }),
  http.post('*/api/v1/group-orders/:groupId/checkout', () => {
    const pseudoBasket: SavedBasket = {
      id: 'group-basket', name: groupState.name, kind: 'CUSTOM', peopleCount: groupState.participants.length, lastOrderedAt: null, estimatedCurrentPrice: money(136700),
      items: groupState.participants.flatMap((participant, participantIndex) => participant.contributions.map((item, itemIndex) => ({ id: `group-${participantIndex}-${itemIndex}`, productId: item.productId, productName: item.productName, variantId: `${item.productId}-regular`, variantName: 'Regular', modifiers: [], quantity: item.quantity, historicalUnitPrice: money(item.productId === 'pizza-chicken-pepperoni' ? 48900 : 42900) }))),
    };
    groupState = { ...groupState, status: 'CHECKOUT_READY' };
    const result = basketCart(pseudoBasket);
    if (getScenarioState().groupOrder === 'GROUP_BASKET_CHANGED') result.differences = [{ code: 'PRICE_CHANGED', itemId: result.cart.items[0]?.id ?? 'group-item', message: 'The combined basket changed. Review current prices before checkout.', recoverable: true }];
    return HttpResponse.json(result);
  }),
];

import { resetScenarioState, setScenarioState, type MockScenarioState } from '@pizza-avenue/mocks';
import type { ServiceContext } from '@pizza-avenue/types';

export const reviewPersonaNames = [
  'NEW_CUSTOMER',
  'NEW_PICKUP',
  'RETURNING_CUSTOMER',
  'ACTIVE_PICKUP',
  'ACTIVE_DINE_IN',
  'BUSY_PICKUP',
  'PAUSED_PICKUP',
  'CLOSED_PICKUP',
  'MENU_FAILURE_PICKUP',
  'REWARD_AVAILABLE',
  'PASSPORT_ONE_LEFT',
  'PERSONAL_MISSION_ACTIVE',
  'COMMON_MISSION_ACTIVE',
  'FAMILY_CUSTOMER',
  'OCCASION_UPCOMING',
  'SAVED_BASKET_READY',
  'REFERRAL_PENDING',
  'LEAGUE_ACTIVE',
  'GROUP_ORDER_HOST',
  'REACTIVATION_CUSTOMER',
] as const;

export type ReviewPersonaName = (typeof reviewPersonaNames)[number];

interface ReviewPersonaPreset {
  scenario: Partial<MockScenarioState>;
  serviceContext: ServiceContext | null;
}

const pickupContext: ServiceContext = {
  mode: 'PICKUP',
  storeId: 'sainikpuri',
  tableId: null,
  tableLabel: null,
  tableSessionId: null,
  confirmedAt: '2026-10-08T12:00:00.000Z',
};

const dineInContext: ServiceContext = {
  mode: 'DINE_IN',
  storeId: 'sainikpuri',
  tableId: 'table-12',
  tableLabel: 'Table 12',
  tableSessionId: 'table-session-12',
  confirmedAt: '2026-10-08T12:00:00.000Z',
};

const quietHome: Partial<MockScenarioState> = {
  savedBasket: 'SAVED_BASKETS_EMPTY',
  occasion: 'NO_OCCASIONS',
  rewards: 'REWARD_LOCKED',
  passport: 'PASSPORT_NEW',
  missions: 'NO_ACTIVE_MISSIONS',
  referral: 'REFERRAL_REWARDED',
  league: 'LEAGUE_NOT_JOINED',
};

export const reviewPersonaPresets: Record<ReviewPersonaName, ReviewPersonaPreset> = {
  NEW_CUSTOMER: {
    scenario: { customer: 'NEW_CUSTOMER' },
    serviceContext: null,
  },
  NEW_PICKUP: {
    scenario: { ...quietHome, customer: 'NEW_CUSTOMER' },
    serviceContext: pickupContext,
  },
  RETURNING_CUSTOMER: {
    scenario: { ...quietHome, customer: 'RETURNING_CUSTOMER' },
    serviceContext: pickupContext,
  },
  ACTIVE_PICKUP: {
    scenario: { ...quietHome, customer: 'ACTIVE_ORDER', order: 'PICKUP_PREPARING', operations: 'PICKUP_NORMAL' },
    serviceContext: pickupContext,
  },
  ACTIVE_DINE_IN: {
    scenario: { ...quietHome, customer: 'RETURNING_CUSTOMER', operations: 'DINE_IN_WAITER_CONFIRMED', cart: 'DINE_IN_CART' },
    serviceContext: dineInContext,
  },
  BUSY_PICKUP: {
    scenario: { ...quietHome, customer: 'NEW_CUSTOMER', store: 'STORE_BUSY' },
    serviceContext: pickupContext,
  },
  PAUSED_PICKUP: {
    scenario: { ...quietHome, customer: 'NEW_CUSTOMER', store: 'STORE_PAUSED' },
    serviceContext: pickupContext,
  },
  CLOSED_PICKUP: {
    scenario: { ...quietHome, customer: 'NEW_CUSTOMER', store: 'STORE_CLOSED' },
    serviceContext: pickupContext,
  },
  MENU_FAILURE_PICKUP: {
    scenario: { ...quietHome, customer: 'NEW_CUSTOMER', menu: 'MENU_NETWORK_ERROR' },
    serviceContext: pickupContext,
  },
  REWARD_AVAILABLE: {
    scenario: { ...quietHome, customer: 'LOYAL_CUSTOMER', rewards: 'REWARD_AVAILABLE' },
    serviceContext: pickupContext,
  },
  PASSPORT_ONE_LEFT: {
    scenario: { ...quietHome, customer: 'LOYAL_CUSTOMER', passport: 'PASSPORT_ONE_LEFT' },
    serviceContext: pickupContext,
  },
  PERSONAL_MISSION_ACTIVE: {
    scenario: { ...quietHome, customer: 'LOYAL_CUSTOMER', missions: 'PERSONAL_MISSION_ACTIVE' },
    serviceContext: pickupContext,
  },
  COMMON_MISSION_ACTIVE: {
    scenario: { ...quietHome, customer: 'LOYAL_CUSTOMER', missions: 'COMMON_MISSION_ACTIVE' },
    serviceContext: pickupContext,
  },
  FAMILY_CUSTOMER: {
    scenario: { customer: 'LOYAL_CUSTOMER', family: 'FAMILY_CUSTOMER' },
    serviceContext: pickupContext,
  },
  OCCASION_UPCOMING: {
    scenario: { ...quietHome, customer: 'LOYAL_CUSTOMER', occasion: 'UPCOMING_OCCASION' },
    serviceContext: pickupContext,
  },
  SAVED_BASKET_READY: {
    scenario: { ...quietHome, customer: 'RETURNING_CUSTOMER', savedBasket: 'SAVED_BASKET_READY' },
    serviceContext: pickupContext,
  },
  REFERRAL_PENDING: {
    scenario: { ...quietHome, customer: 'LOYAL_CUSTOMER', referral: 'REFERRAL_PENDING' },
    serviceContext: pickupContext,
  },
  LEAGUE_ACTIVE: {
    scenario: { ...quietHome, customer: 'LOYAL_CUSTOMER', league: 'LEAGUE_ACTIVE' },
    serviceContext: pickupContext,
  },
  GROUP_ORDER_HOST: {
    scenario: { customer: 'RETURNING_CUSTOMER', groupOrder: 'GROUP_ORDER_HOST' },
    serviceContext: pickupContext,
  },
  REACTIVATION_CUSTOMER: {
    scenario: { ...quietHome, customer: 'RETURNING_CUSTOMER', engagement: 'REACTIVATION_CUSTOMER' },
    serviceContext: pickupContext,
  },
};

export function isReviewPersonaName(value: string): value is ReviewPersonaName {
  return reviewPersonaNames.includes(value as ReviewPersonaName);
}

export function applyReviewPersona(name: ReviewPersonaName) {
  resetScenarioState();
  const preset = reviewPersonaPresets[name];
  return {
    scenarioState: setScenarioState(preset.scenario),
    serviceContext: preset.serviceContext,
  };
}

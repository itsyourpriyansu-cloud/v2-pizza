export type CustomerScenario =
  | 'NEW_CUSTOMER'
  | 'RETURNING_CUSTOMER'
  | 'LOYAL_CUSTOMER'
  | 'ACTIVE_ORDER';
export type StoreScenario =
  | 'STORE_OPEN'
  | 'STORE_BUSY'
  | 'STORE_PAUSED'
  | 'STORE_CLOSED';
export type MenuScenario =
  | 'NORMAL_MENU'
  | 'PRODUCT_SOLD_OUT'
  | 'MODIFIER_UNAVAILABLE'
  | 'MENU_NETWORK_ERROR';
export type CartScenario =
  | 'PICKUP_CART'
  | 'PICKUP_CART_PRICE_CHANGED'
  | 'PICKUP_ITEM_UNAVAILABLE'
  | 'PICKUP_MODIFIER_UNAVAILABLE'
  | 'RESTORED_CART'
  | 'SERVICE_MODE_CONFLICT'
  | 'DINE_IN_CART';
export type AuthScenario =
  | 'AUTH_NORMAL'
  | 'OTP_INVALID'
  | 'OTP_EXPIRED'
  | 'OTP_RATE_LIMITED'
  | 'SESSION_RESTORED'
  | 'MAGIC_LINK_SUCCESS'
  | 'MAGIC_LINK_EXPIRED'
  | 'MAGIC_LINK_USED'
  | 'MAGIC_LINK_INVALID';
export type PickupScenario =
  | 'PICKUP_AVAILABLE'
  | 'PICKUP_NEAR_FULL'
  | 'PICKUP_FULL'
  | 'PICKUP_ASAP'
  | 'PICKUP_SCHEDULED'
  | 'PICKUP_SLOT_FULL'
  | 'PICKUP_HOLD_EXPIRED'
  | 'PICKUP_NO_SLOTS'
  | 'PICKUP_UNAVAILABLE';
export type PaymentScenario =
  | 'PAYMENT_SUCCESS'
  | 'PAYMENT_FAILURE'
  | 'PICKUP_PAYMENT_SUCCESS'
  | 'PICKUP_PAYMENT_FAILED'
  | 'PICKUP_PAYMENT_TIMEOUT'
  | 'PICKUP_PAYMENT_CHECKING'
  | 'PICKUP_PAYMENT_ALREADY_PAID';
export type OrderScenario =
  | 'ORDER_CONFIRMED'
  | 'ORDER_PREPARING'
  | 'ORDER_READY'
  | 'PICKUP_ORDER_CONFIRMED'
  | 'PICKUP_PREPARING'
  | 'PICKUP_READY'
  | 'PICKUP_PICKED_UP'
  | 'PICKUP_COMPLETED'
  | 'PICKUP_DELAYED'
  | 'PICKUP_STATUS_UNAVAILABLE';
export type OperationsScenario =
  | 'GENERAL_ENTRY'
  | 'PICKUP_NORMAL'
  | 'DINE_IN_VALID_QR'
  | 'DINE_IN_WRONG_TABLE'
  | 'DINE_IN_EXPIRED_QR'
  | 'DINE_IN_GUEST'
  | 'DINE_IN_AUTHENTICATED'
  | 'DINE_IN_ORDER_SUBMITTED'
  | 'DINE_IN_SUBMITTED'
  | 'DINE_IN_WAITING_WAITER'
  | 'DINE_IN_WAITER_REVIEW'
  | 'DINE_IN_WAITER_CONFIRMED'
  | 'DINE_IN_NEEDS_CLARIFICATION'
  | 'DINE_IN_REJECTED'
  | 'DINE_IN_PREPARING'
  | 'DINE_IN_READY_TO_SERVE'
  | 'DINE_IN_SERVED'
  | 'DINE_IN_ROUND_2'
  | 'DINE_IN_MULTIPLE_CUSTOMERS'
  | 'DINE_IN_BILL_REQUESTED'
  | 'DINE_IN_ACTIVE_ORDER_BILL_REQUEST'
  | 'DINE_IN_BILL_FINALIZED'
  | 'DINE_IN_PAYMENT_PENDING'
  | 'DINE_IN_PAYMENT_FAILED'
  | 'DINE_IN_PAYMENT_PAID'
  | 'DINE_IN_SESSION_CLOSED'
  | 'WAITER_SERVICE_REQUEST'
  | 'PICKUP_AND_DINEIN_SIMULTANEOUS';
export type RewardsScenario =
  | 'NO_REWARDS' | 'REWARD_LOCKED' | 'REWARD_AVAILABLE' | 'REWARD_RESERVED'
  | 'REWARD_APPLIED' | 'REWARD_RELEASED' | 'REWARD_CONSUMED' | 'REWARD_UNAVAILABLE'
  | 'POINTS_NEAR_REWARD' | 'DINE_IN_LOYALTY_PENDING' | 'DINE_IN_LOYALTY_PAID' | 'REWARDS_NETWORK_ERROR' | 'REWARD_RESERVATION_CONFLICT';
export type PassportScenario =
  | 'PASSPORT_NEW'
  | 'PASSPORT_IN_PROGRESS'
  | 'PASSPORT_PROGRESS'
  | 'PASSPORT_ONE_LEFT'
  | 'PASSPORT_COMPLETED'
  | 'PASSPORT_ITEM_UNAVAILABLE'
  | 'PASSPORT_NETWORK_ERROR';
export type MissionsScenario =
  | 'MISSIONS_ZERO_PROGRESS' | 'PERSONAL_MISSION_0_PROGRESS' | 'PERSONAL_MISSION_ACTIVE' | 'PERSONAL_MISSION_PARTIAL' | 'PERSONAL_MISSION_COMPLETE'
  | 'COMMON_MISSION_ACTIVE' | 'COMMON_MISSION_COMPLETE' | 'MISSION_EXPIRED'
  | 'MULTIPLE_MISSIONS' | 'NO_ACTIVE_MISSIONS' | 'MISSIONS_NETWORK_ERROR';
export type ProfileScenario = 'PROFILE_COMPLETE' | 'PROFILE_PARTIAL' | 'PROFILE_NETWORK_ERROR' | 'PROFILE_SAVE_SUCCESS' | 'PROFILE_SAVE_FAILURE';

export type MockScenarioName =
  | CustomerScenario
  | StoreScenario
  | MenuScenario
  | CartScenario
  | AuthScenario
  | PickupScenario
  | PaymentScenario
  | OrderScenario
  | OperationsScenario
  | RewardsScenario
  | PassportScenario
  | MissionsScenario
  | ProfileScenario;

export interface MockScenarioState {
  customer: CustomerScenario;
  store: StoreScenario;
  menu: MenuScenario;
  cart: CartScenario;
  auth: AuthScenario;
  pickup: PickupScenario;
  payment: PaymentScenario;
  order: OrderScenario;
  operations: OperationsScenario;
  rewards: RewardsScenario;
  passport: PassportScenario;
  missions: MissionsScenario;
  profile: ProfileScenario;
}

const defaults: MockScenarioState = {
  customer: 'RETURNING_CUSTOMER',
  store: 'STORE_OPEN',
  menu: 'NORMAL_MENU',
  cart: 'PICKUP_CART',
  auth: 'AUTH_NORMAL',
  pickup: 'PICKUP_AVAILABLE',
  payment: 'PAYMENT_SUCCESS',
  order: 'ORDER_CONFIRMED',
  operations: 'GENERAL_ENTRY',
  rewards: 'REWARD_AVAILABLE',
  passport: 'PASSPORT_IN_PROGRESS',
  missions: 'MULTIPLE_MISSIONS',
  profile: 'PROFILE_COMPLETE',
};

let state: MockScenarioState = { ...defaults };

const groups = {
  customer: ['NEW_CUSTOMER', 'RETURNING_CUSTOMER', 'LOYAL_CUSTOMER', 'ACTIVE_ORDER'],
  store: ['STORE_OPEN', 'STORE_BUSY', 'STORE_PAUSED', 'STORE_CLOSED'],
  menu: ['NORMAL_MENU', 'PRODUCT_SOLD_OUT', 'MODIFIER_UNAVAILABLE', 'MENU_NETWORK_ERROR'],
  cart: [
    'PICKUP_CART',
    'PICKUP_CART_PRICE_CHANGED',
    'PICKUP_ITEM_UNAVAILABLE',
    'PICKUP_MODIFIER_UNAVAILABLE',
    'RESTORED_CART',
    'SERVICE_MODE_CONFLICT',
    'DINE_IN_CART',
  ],
  auth: [
    'AUTH_NORMAL',
    'OTP_INVALID',
    'OTP_EXPIRED',
    'OTP_RATE_LIMITED',
    'SESSION_RESTORED',
    'MAGIC_LINK_SUCCESS',
    'MAGIC_LINK_EXPIRED',
    'MAGIC_LINK_USED',
    'MAGIC_LINK_INVALID',
  ],
  pickup: ['PICKUP_AVAILABLE', 'PICKUP_NEAR_FULL', 'PICKUP_FULL', 'PICKUP_ASAP', 'PICKUP_SCHEDULED', 'PICKUP_SLOT_FULL', 'PICKUP_HOLD_EXPIRED', 'PICKUP_NO_SLOTS', 'PICKUP_UNAVAILABLE'],
  payment: ['PAYMENT_SUCCESS', 'PAYMENT_FAILURE', 'PICKUP_PAYMENT_SUCCESS', 'PICKUP_PAYMENT_FAILED', 'PICKUP_PAYMENT_TIMEOUT', 'PICKUP_PAYMENT_CHECKING', 'PICKUP_PAYMENT_ALREADY_PAID'],
  order: ['ORDER_CONFIRMED', 'ORDER_PREPARING', 'ORDER_READY', 'PICKUP_ORDER_CONFIRMED', 'PICKUP_PREPARING', 'PICKUP_READY', 'PICKUP_PICKED_UP', 'PICKUP_COMPLETED', 'PICKUP_DELAYED', 'PICKUP_STATUS_UNAVAILABLE'],
  operations: [
    'GENERAL_ENTRY',
    'PICKUP_NORMAL',
    'DINE_IN_VALID_QR',
    'DINE_IN_WRONG_TABLE',
    'DINE_IN_EXPIRED_QR',
    'DINE_IN_GUEST',
    'DINE_IN_AUTHENTICATED',
    'DINE_IN_ORDER_SUBMITTED',
    'DINE_IN_SUBMITTED',
    'DINE_IN_WAITING_WAITER',
    'DINE_IN_WAITER_REVIEW',
    'DINE_IN_WAITER_CONFIRMED',
    'DINE_IN_NEEDS_CLARIFICATION',
    'DINE_IN_REJECTED',
    'DINE_IN_PREPARING',
    'DINE_IN_READY_TO_SERVE',
    'DINE_IN_SERVED',
    'DINE_IN_ROUND_2',
    'DINE_IN_MULTIPLE_CUSTOMERS',
    'DINE_IN_BILL_REQUESTED',
    'DINE_IN_ACTIVE_ORDER_BILL_REQUEST',
    'DINE_IN_BILL_FINALIZED',
    'DINE_IN_PAYMENT_PENDING',
    'DINE_IN_PAYMENT_FAILED',
    'DINE_IN_PAYMENT_PAID',
    'DINE_IN_SESSION_CLOSED',
    'WAITER_SERVICE_REQUEST',
    'PICKUP_AND_DINEIN_SIMULTANEOUS',
  ],
  rewards: ['NO_REWARDS', 'REWARD_LOCKED', 'REWARD_AVAILABLE', 'REWARD_RESERVED', 'REWARD_APPLIED', 'REWARD_RELEASED', 'REWARD_CONSUMED', 'REWARD_UNAVAILABLE', 'POINTS_NEAR_REWARD', 'DINE_IN_LOYALTY_PENDING', 'DINE_IN_LOYALTY_PAID', 'REWARDS_NETWORK_ERROR', 'REWARD_RESERVATION_CONFLICT'],
  passport: ['PASSPORT_NEW', 'PASSPORT_IN_PROGRESS', 'PASSPORT_PROGRESS', 'PASSPORT_ONE_LEFT', 'PASSPORT_COMPLETED', 'PASSPORT_ITEM_UNAVAILABLE', 'PASSPORT_NETWORK_ERROR'],
  missions: ['MISSIONS_ZERO_PROGRESS', 'PERSONAL_MISSION_0_PROGRESS', 'PERSONAL_MISSION_ACTIVE', 'PERSONAL_MISSION_PARTIAL', 'PERSONAL_MISSION_COMPLETE', 'COMMON_MISSION_ACTIVE', 'COMMON_MISSION_COMPLETE', 'MISSION_EXPIRED', 'MULTIPLE_MISSIONS', 'NO_ACTIVE_MISSIONS', 'MISSIONS_NETWORK_ERROR'],
  profile: ['PROFILE_COMPLETE', 'PROFILE_PARTIAL', 'PROFILE_NETWORK_ERROR', 'PROFILE_SAVE_SUCCESS', 'PROFILE_SAVE_FAILURE'],
} as const satisfies Record<keyof MockScenarioState, readonly MockScenarioName[]>;

export function setScenario(name: MockScenarioName): MockScenarioState {
  for (const [key, values] of Object.entries(groups) as Array<
    [keyof MockScenarioState, readonly MockScenarioName[]]
  >) {
    if (values.includes(name)) {
      state = { ...state, [key]: name };
      return getScenarioState();
    }
  }
  return getScenarioState();
}

export function setScenarioState(
  next: Partial<MockScenarioState>,
): MockScenarioState {
  state = { ...state, ...next };
  return getScenarioState();
}

export function getScenarioState(): MockScenarioState {
  return { ...state };
}

export function resetScenarioState(): MockScenarioState {
  state = { ...defaults };
  return getScenarioState();
}

export function isMockScenarioName(value: string): value is MockScenarioName {
  return Object.values(groups).some((values) =>
    (values as readonly string[]).includes(value),
  );
}

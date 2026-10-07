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
export type PickupScenario =
  | 'PICKUP_AVAILABLE'
  | 'PICKUP_NEAR_FULL'
  | 'PICKUP_FULL';
export type PaymentScenario = 'PAYMENT_SUCCESS' | 'PAYMENT_FAILURE';
export type OrderScenario =
  | 'ORDER_CONFIRMED'
  | 'ORDER_PREPARING'
  | 'ORDER_READY';
export type OperationsScenario =
  | 'GENERAL_ENTRY'
  | 'PICKUP_NORMAL'
  | 'DINE_IN_VALID_QR'
  | 'DINE_IN_WRONG_TABLE'
  | 'DINE_IN_EXPIRED_QR'
  | 'DINE_IN_GUEST'
  | 'DINE_IN_AUTHENTICATED'
  | 'DINE_IN_ORDER_SUBMITTED'
  | 'DINE_IN_WAITING_WAITER'
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
export type RewardsScenario = 'NO_REWARDS' | 'REWARD_AVAILABLE';
export type PassportScenario =
  | 'PASSPORT_NEW'
  | 'PASSPORT_IN_PROGRESS'
  | 'PASSPORT_COMPLETED';

export type MockScenarioName =
  | CustomerScenario
  | StoreScenario
  | MenuScenario
  | PickupScenario
  | PaymentScenario
  | OrderScenario
  | OperationsScenario
  | RewardsScenario
  | PassportScenario;

export interface MockScenarioState {
  customer: CustomerScenario;
  store: StoreScenario;
  menu: MenuScenario;
  pickup: PickupScenario;
  payment: PaymentScenario;
  order: OrderScenario;
  operations: OperationsScenario;
  rewards: RewardsScenario;
  passport: PassportScenario;
}

const defaults: MockScenarioState = {
  customer: 'RETURNING_CUSTOMER',
  store: 'STORE_OPEN',
  menu: 'NORMAL_MENU',
  pickup: 'PICKUP_AVAILABLE',
  payment: 'PAYMENT_SUCCESS',
  order: 'ORDER_CONFIRMED',
  operations: 'GENERAL_ENTRY',
  rewards: 'REWARD_AVAILABLE',
  passport: 'PASSPORT_IN_PROGRESS',
};

let state: MockScenarioState = { ...defaults };

const groups = {
  customer: ['NEW_CUSTOMER', 'RETURNING_CUSTOMER', 'LOYAL_CUSTOMER', 'ACTIVE_ORDER'],
  store: ['STORE_OPEN', 'STORE_BUSY', 'STORE_PAUSED', 'STORE_CLOSED'],
  menu: ['NORMAL_MENU', 'PRODUCT_SOLD_OUT', 'MODIFIER_UNAVAILABLE', 'MENU_NETWORK_ERROR'],
  pickup: ['PICKUP_AVAILABLE', 'PICKUP_NEAR_FULL', 'PICKUP_FULL'],
  payment: ['PAYMENT_SUCCESS', 'PAYMENT_FAILURE'],
  order: ['ORDER_CONFIRMED', 'ORDER_PREPARING', 'ORDER_READY'],
  operations: [
    'GENERAL_ENTRY',
    'PICKUP_NORMAL',
    'DINE_IN_VALID_QR',
    'DINE_IN_WRONG_TABLE',
    'DINE_IN_EXPIRED_QR',
    'DINE_IN_GUEST',
    'DINE_IN_AUTHENTICATED',
    'DINE_IN_ORDER_SUBMITTED',
    'DINE_IN_WAITING_WAITER',
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
  rewards: ['NO_REWARDS', 'REWARD_AVAILABLE'],
  passport: ['PASSPORT_NEW', 'PASSPORT_IN_PROGRESS', 'PASSPORT_COMPLETED'],
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

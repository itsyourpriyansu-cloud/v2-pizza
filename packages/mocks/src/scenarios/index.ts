export type CustomerScenario =
  | 'NEW_CUSTOMER'
  | 'RETURNING_CUSTOMER'
  | 'LOYAL_CUSTOMER';
export type StoreScenario = 'STORE_OPEN' | 'STORE_BUSY' | 'STORE_PAUSED';
export type MenuScenario = 'NORMAL_MENU' | 'PRODUCT_SOLD_OUT';
export type PickupScenario =
  | 'PICKUP_AVAILABLE'
  | 'PICKUP_NEAR_FULL'
  | 'PICKUP_FULL';
export type PaymentScenario = 'PAYMENT_SUCCESS' | 'PAYMENT_FAILURE';
export type OrderScenario =
  | 'ORDER_CONFIRMED'
  | 'ORDER_PREPARING'
  | 'ORDER_READY';
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
  | RewardsScenario
  | PassportScenario;

export interface MockScenarioState {
  customer: CustomerScenario;
  store: StoreScenario;
  menu: MenuScenario;
  pickup: PickupScenario;
  payment: PaymentScenario;
  order: OrderScenario;
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
  rewards: 'REWARD_AVAILABLE',
  passport: 'PASSPORT_IN_PROGRESS',
};

let state: MockScenarioState = { ...defaults };

const groups = {
  customer: ['NEW_CUSTOMER', 'RETURNING_CUSTOMER', 'LOYAL_CUSTOMER'],
  store: ['STORE_OPEN', 'STORE_BUSY', 'STORE_PAUSED'],
  menu: ['NORMAL_MENU', 'PRODUCT_SOLD_OUT'],
  pickup: ['PICKUP_AVAILABLE', 'PICKUP_NEAR_FULL', 'PICKUP_FULL'],
  payment: ['PAYMENT_SUCCESS', 'PAYMENT_FAILURE'],
  order: ['ORDER_CONFIRMED', 'ORDER_PREPARING', 'ORDER_READY'],
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

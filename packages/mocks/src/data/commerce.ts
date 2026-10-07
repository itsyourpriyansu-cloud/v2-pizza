import type {
  Cart,
  CartQuote,
  PassportProgram,
  PassportProgress,
  Payment,
  PickupOptions,
  Reward,
  Store,
} from '@pizza-avenue/types';
import { makePickupSlot, money } from '../factories';

export const store: Store = {
  id: 'sainikpuri',
  name: 'The Pizza Avenue',
  locality: 'Sainikpuri, Hyderabad',
  timezone: 'Asia/Kolkata',
  state: 'OPEN',
  currentPickupEstimateMinutes: 30,
  serviceModes: {
    pickupOrderingEnabled: true,
    dineInOrderingEnabled: true,
    dineInEstimatedWaitMinutes: { minimum: 20, maximum: 30 },
  },
};

export const emptyCart: Cart = {
  id: 'cart-mock-1',
  storeId: 'sainikpuri',
  status: 'ACTIVE',
  items: [],
  expiresAt: '2026-10-05T15:00:00.000Z',
};

export const cartQuote: CartQuote = {
  cartId: emptyCart.id,
  version: 'quote-1',
  subtotal: money(44900),
  discount: money(0),
  tax: money(0),
  payableTotal: money(44900),
  quotedAt: '2026-10-05T14:02:00.000Z',
  expiresAt: '2026-10-05T14:12:00.000Z',
};

export const pickupOptions: PickupOptions = {
  asap: makePickupSlot('slot-asap', 'AVAILABLE', 30),
  scheduled: [
    makePickupSlot('slot-1430', 'AVAILABLE', 30),
    makePickupSlot('slot-1500', 'NEARLY_FULL', 60),
    makePickupSlot('slot-1530', 'FULL', 90),
  ],
};

export const payment: Payment = {
  id: 'payment-mock-1',
  target: { type: 'ORDER', id: 'order-pa-1001' },
  status: 'SUCCESS',
  method: 'UPI',
  amount: money(44900),
  providerReference: 'mock-provider-reference',
  createdAt: '2026-10-05T14:05:00.000Z',
};

export const rewards: Reward[] = [
  { id: 'reward-dip', name: 'Free dip', pointsCost: 300, active: true },
  { id: 'reward-garlic-bread', name: 'Garlic Bread', pointsCost: 900, active: true },
  { id: 'reward-upgrade', name: 'Pizza size upgrade', pointsCost: 1200, active: true },
];

export const passportProgram: PassportProgram = {
  id: 'passport-signatures',
  name: 'Pizza Avenue Passport',
  active: true,
  items: [
    { id: 'passport-margherita', productId: 'pizza-margherita', label: 'Margherita', displayOrder: 1 },
    { id: 'passport-diavola', productId: 'pizza-diavola', label: 'Diavola', displayOrder: 2 },
    { id: 'passport-funghi', productId: 'pizza-funghi', label: 'Funghi', displayOrder: 3 },
    {
      id: 'passport-quattro',
      productId: 'pizza-quattro-formaggi',
      label: 'Quattro Formaggi',
      displayOrder: 4,
    },
    {
      id: 'passport-avenue',
      productId: 'pizza-avenue-signature',
      label: 'Avenue Signature',
      displayOrder: 5,
    },
    { id: 'passport-seasonal', productId: 'pizza-seasonal', label: 'Seasonal Pizza', displayOrder: 6 },
  ],
  milestoneRewardId: 'reward-garlic-bread',
};

export const passportProgress: Record<'new' | 'inProgress' | 'completed', PassportProgress> = {
  new: {
    programId: passportProgram.id,
    customerId: 'customer-aisha',
    completedItemIds: [],
    completed: false,
    unlockedRewardId: null,
  },
  inProgress: {
    programId: passportProgram.id,
    customerId: 'customer-arjun',
    completedItemIds: [
      'passport-margherita',
      'passport-diavola',
      'passport-funghi',
      'passport-quattro',
    ],
    completed: false,
    unlockedRewardId: null,
  },
  completed: {
    programId: passportProgram.id,
    customerId: 'customer-neha',
    completedItemIds: passportProgram.items.map((item) => item.id),
    completed: true,
    unlockedRewardId: 'reward-garlic-bread',
  },
};

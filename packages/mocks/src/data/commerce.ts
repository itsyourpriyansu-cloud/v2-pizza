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
  serviceMode: 'PICKUP',
  status: 'ACTIVE',
  items: [],
  expiresAt: '2026-10-08T15:00:00.000Z',
};

export const cartQuote: CartQuote = {
  cartId: emptyCart.id,
  version: 'quote-1',
  subtotal: money(44900),
  discount: money(0),
  tax: money(0),
  payableTotal: money(44900),
  quotedAt: '2026-10-07T14:02:00.000Z',
  expiresAt: '2026-10-07T14:12:00.000Z',
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
  { id: 'reward-dip', name: 'Free dip', description: 'Choose Viva Rosso or Pesto with an eligible order.', pointsCost: 300, status: 'AVAILABLE', remainingPoints: 0, active: true },
  { id: 'reward-garlic-bread', name: 'Garlic Bread', description: 'A warm Garlic Bread on your next eligible order.', pointsCost: 900, status: 'LOCKED', remainingPoints: 60, active: true },
  { id: 'reward-upgrade', name: 'Pizza size upgrade', description: 'Upgrade one eligible regular pizza to large.', pointsCost: 1200, status: 'LOCKED', remainingPoints: 360, active: true },
];

export const passportProgram: PassportProgram = {
  id: 'passport-signatures',
  name: 'Pizza Avenue Passport',
  active: true,
  items: [
    { id: 'passport-margherita', productId: 'pizza-margherita', label: 'Classic Margherita', displayOrder: 1, availability: 'AVAILABLE' },
    { id: 'passport-diavola', productId: 'pizza-diavola', label: 'Chicken Pepperoni', displayOrder: 2, availability: 'AVAILABLE' },
    { id: 'passport-funghi', productId: 'pizza-mushroom-alfredo', label: 'Mushroom Alfredo', displayOrder: 3, availability: 'AVAILABLE' },
    {
      id: 'passport-quattro',
      productId: 'pizza-paneer-makhani',
      label: 'Paneer Makhani',
      displayOrder: 4,
      availability: 'AVAILABLE',
    },
    {
      id: 'passport-avenue',
      productId: 'pizza-farmhouse',
      label: 'Farmhouse',
      displayOrder: 5,
      availability: 'AVAILABLE',
    },
    { id: 'passport-seasonal', productId: 'pizza-meat-lovers', label: 'Meat Lovers', displayOrder: 6, availability: 'AVAILABLE' },
  ],
  milestoneRewardId: 'reward-garlic-bread',
};

export const passportProgress: Record<'new' | 'inProgress' | 'completed', PassportProgress> = {
  new: {
    program: passportProgram,
    programId: passportProgram.id,
    customerId: 'customer-aisha',
    completedItemIds: [],
    completed: false,
    status: 'NEW',
    nextItemId: 'passport-margherita',
    unlockedRewardId: null,
  },
  inProgress: {
    program: passportProgram,
    programId: passportProgram.id,
    customerId: 'customer-arjun',
    completedItemIds: [
      'passport-margherita',
      'passport-diavola',
      'passport-funghi',
      'passport-quattro',
    ],
    completed: false,
    status: 'NEAR_COMPLETE',
    nextItemId: 'passport-avenue',
    unlockedRewardId: null,
  },
  completed: {
    program: passportProgram,
    programId: passportProgram.id,
    customerId: 'customer-neha',
    completedItemIds: passportProgram.items.map((item) => item.id),
    completed: true,
    status: 'COMPLETE',
    nextItemId: null,
    unlockedRewardId: 'reward-garlic-bread',
  },
};

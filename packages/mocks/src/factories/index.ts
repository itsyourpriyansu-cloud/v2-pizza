import type {
  Customer,
  Money,
  Order,
  OrderStatus,
  PickupSlot,
  PickupSlotState,
} from '@pizza-avenue/types';
import { inrFromPaise } from '@pizza-avenue/utils';

export const money = (paise: number): Money => inrFromPaise(paise);

export function makeCustomer(
  overrides: Partial<Customer> & Pick<Customer, 'id' | 'name'>,
): Customer {
  return {
    phoneMasked: '+91 ******0000',
    createdAt: '2026-09-01T10:00:00.000Z',
    ...overrides,
  };
}

export function makePickupSlot(
  id: string,
  state: PickupSlotState,
  minutesFromNow: number,
): PickupSlot {
  const base = new Date('2026-10-05T14:00:00.000Z');
  const startsAt = new Date(base.getTime() + minutesFromNow * 60_000);
  const endsAt = new Date(startsAt.getTime() + 30 * 60_000);
  return {
    id,
    storeId: 'sainikpuri',
    startsAt: startsAt.toISOString(),
    endsAt: endsAt.toISOString(),
    state,
    remainingCapacityUnits: state === 'FULL' ? 0 : state === 'NEARLY_FULL' ? 2 : 12,
  };
}

export function makeOrder(
  id: string,
  publicNumber: string,
  status: OrderStatus,
): Order {
  const unitPrice = money(44900);
  return {
    id,
    publicNumber,
    customerId: 'customer-arjun',
    storeId: 'sainikpuri',
    source: 'PWA',
    status,
    pickupType: 'ASAP',
    promisedReadyAt: '2026-10-05T14:30:00.000Z',
    items: [
      {
        id: `${id}-item-1`,
        productId: 'pizza-diavola',
        productNameSnapshot: 'Diavola',
        variantNameSnapshot: 'Regular',
        modifiers: [],
        unitPrice,
        quantity: 1,
        lineTotal: unitPrice,
      },
    ],
    subtotal: unitPrice,
    discount: money(0),
    tax: money(0),
    total: unitPrice,
    createdAt: '2026-10-05T14:00:00.000Z',
    version: 1,
  };
}

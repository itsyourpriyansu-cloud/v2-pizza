import type { Order } from '@pizza-avenue/types';
import { kitchenPriority } from './kds-priority';
import { roleHasPermission } from './permissions';

describe('operational permissions', () => {
  it('allows waiter confirmation but denies waiter payment settlement', () => {
    expect(roleHasPermission('WAITER', 'CONFIRM_DINE_IN_ORDER')).toBe(true);
    expect(roleHasPermission('WAITER', 'RECORD_TABLE_PAYMENT')).toBe(false);
  });

  it('allows authorized Counter settlement', () => {
    expect(roleHasPermission('COUNTER', 'FINALIZE_TABLE_BILL')).toBe(true);
    expect(roleHasPermission('COUNTER', 'RECORD_TABLE_PAYMENT')).toBe(true);
  });
});

describe('unified kitchen priority', () => {
  const now = new Date('2026-10-06T12:30:00.000Z');

  it('uses promised time for Pickup and elapsed service time for Dine-in', () => {
    const pickup = {
      serviceMode: 'PICKUP',
      promisedReadyAt: '2026-10-06T12:35:00.000Z',
      createdAt: '2026-10-06T12:00:00.000Z',
    } as Order;
    const dineIn = {
      serviceMode: 'DINE_IN',
      promisedReadyAt: null,
      createdAt: '2026-10-06T12:10:00.000Z',
    } as Order;

    expect(kitchenPriority(pickup, now).basis).toBe('PICKUP_PROMISE');
    expect(kitchenPriority(dineIn, now)).toEqual({
      score: 20,
      basis: 'DINE_IN_ELAPSED_SERVICE',
    });
  });
});

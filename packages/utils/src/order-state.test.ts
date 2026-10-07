import type { DineInBill, Order } from '@pizza-avenue/types';
import { eligibleSpendByCustomer, getBillFinalizationBlockers } from './dine-in-state';
import { inrFromPaise } from './money';
import {
  assertOrderTransition,
  canTransitionOrder,
  isKitchenEligible,
  readyMeaning,
} from './order-state';

const pickupOrder = {
  serviceMode: 'PICKUP',
  status: 'CONFIRMED',
  paymentStatus: 'SUCCESS',
  waiterConfirmedAt: null,
} as Order;

const dineInOrder = {
  serviceMode: 'DINE_IN',
  status: 'CONFIRMED',
  paymentStatus: null,
  waiterConfirmedAt: '2026-10-06T10:01:00.000Z',
} as Order;

describe('mode-aware order state transitions', () => {
  it('preserves payment-first pickup', () => {
    expect(canTransitionOrder('DRAFT', 'PAYMENT_PENDING', 'PICKUP')).toBe(true);
    expect(canTransitionOrder('PREPARING', 'READY_FOR_PICKUP', 'PICKUP')).toBe(true);
    expect(isKitchenEligible(pickupOrder)).toBe(true);
    expect(isKitchenEligible({ ...pickupOrder, paymentStatus: 'PENDING' })).toBe(false);
  });

  it('requires waiter confirmation for dine-in kitchen entry', () => {
    expect(canTransitionOrder('DRAFT', 'CUSTOMER_SUBMITTED', 'DINE_IN')).toBe(true);
    expect(canTransitionOrder('WAITER_REVIEW', 'CONFIRMED', 'DINE_IN')).toBe(true);
    expect(isKitchenEligible(dineInOrder)).toBe(true);
    expect(isKitchenEligible({ ...dineInOrder, waiterConfirmedAt: null })).toBe(false);
  });

  it('keeps pickup and dine-in ready meanings distinct', () => {
    expect(readyMeaning({ ...pickupOrder, status: 'READY_FOR_PICKUP' })).toBe('PICKUP');
    expect(readyMeaning({ ...dineInOrder, status: 'READY_TO_SERVE' })).toBe('SERVE');
  });

  it('rejects cross-mode shortcuts', () => {
    expect(() => assertOrderTransition('DRAFT', 'READY_TO_SERVE', 'DINE_IN')).toThrow(
      'Invalid DINE_IN order transition: DRAFT -> READY_TO_SERVE',
    );
  });
});

describe('dine-in billing invariants', () => {
  const bill = {
    status: 'BILL_REQUESTED',
    includedOrderIds: ['one'],
    lines: [],
  } as unknown as DineInBill;

  it('blocks finalization while an included order is active', () => {
    expect(
      getBillFinalizationBlockers(bill, [{ id: 'one', status: 'PREPARING' } as Order]),
    ).toEqual(['1 order(s) are not resolved.']);
  });

  it('attributes eligible spend to each authenticated order owner', () => {
    expect(
      eligibleSpendByCustomer([
        { customerId: 'aarav', voidState: 'ACTIVE', lineTotal: inrFromPaise(70000) },
        { customerId: 'priya', voidState: 'ACTIVE', lineTotal: inrFromPaise(50000) },
        { customerId: null, voidState: 'ACTIVE', lineTotal: inrFromPaise(20000) },
      ] as DineInBill['lines']),
    ).toEqual({ aarav: 70000, priya: 50000 });
  });
});

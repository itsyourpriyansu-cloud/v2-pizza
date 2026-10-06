import type { OrderStatus } from '@pizza-avenue/types';

const transitions: Readonly<Record<OrderStatus, readonly OrderStatus[]>> = {
  DRAFT: ['PAYMENT_PENDING', 'CANCELLED'],
  PAYMENT_PENDING: ['CONFIRMED', 'PAYMENT_FAILED', 'CANCELLED'],
  PAYMENT_FAILED: ['PAYMENT_PENDING', 'CANCELLED'],
  CONFIRMED: ['PREPARING', 'CANCELLED'],
  PREPARING: ['READY', 'CANCELLED'],
  READY: ['PICKED_UP'],
  PICKED_UP: ['COMPLETED'],
  COMPLETED: [],
  CANCELLED: [],
};

export function canTransitionOrder(
  current: OrderStatus,
  next: OrderStatus,
): boolean {
  return transitions[current].includes(next);
}

export function assertOrderTransition(
  current: OrderStatus,
  next: OrderStatus,
): void {
  if (!canTransitionOrder(current, next)) {
    throw new Error(`Invalid order transition: ${current} -> ${next}`);
  }
}

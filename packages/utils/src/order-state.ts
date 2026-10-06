import type { Order, OrderStatus, ServiceMode } from '@pizza-avenue/types';

const pickupTransitions: Readonly<Record<OrderStatus, readonly OrderStatus[]>> = {
  DRAFT: ['PAYMENT_PENDING', 'CANCELLED'],
  PAYMENT_PENDING: ['CONFIRMED', 'PAYMENT_FAILED', 'CANCELLED'],
  PAYMENT_FAILED: ['PAYMENT_PENDING', 'CANCELLED'],
  CUSTOMER_SUBMITTED: [],
  WAITER_REVIEW: [],
  NEEDS_CLARIFICATION: [],
  REJECTED: [],
  CONFIRMED: ['PREPARING', 'CANCELLED'],
  PREPARING: ['READY_FOR_PICKUP', 'CANCELLED'],
  READY_FOR_PICKUP: ['PICKED_UP'],
  READY_TO_SERVE: [],
  PICKED_UP: ['COMPLETED'],
  SERVED: [],
  COMPLETED: [],
  CANCELLED: [],
};

const dineInTransitions: Readonly<Record<OrderStatus, readonly OrderStatus[]>> = {
  DRAFT: ['CUSTOMER_SUBMITTED', 'CANCELLED'],
  PAYMENT_PENDING: [],
  PAYMENT_FAILED: [],
  CUSTOMER_SUBMITTED: ['WAITER_REVIEW', 'CONFIRMED', 'CANCELLED'],
  WAITER_REVIEW: ['CONFIRMED', 'NEEDS_CLARIFICATION', 'REJECTED', 'CANCELLED'],
  NEEDS_CLARIFICATION: ['CUSTOMER_SUBMITTED', 'REJECTED', 'CANCELLED'],
  REJECTED: [],
  CONFIRMED: ['PREPARING', 'CANCELLED'],
  PREPARING: ['READY_TO_SERVE', 'CANCELLED'],
  READY_FOR_PICKUP: [],
  READY_TO_SERVE: ['SERVED'],
  PICKED_UP: [],
  SERVED: ['COMPLETED'],
  COMPLETED: [],
  CANCELLED: [],
};

export function canTransitionOrder(
  current: OrderStatus,
  next: OrderStatus,
  serviceMode: ServiceMode,
): boolean {
  const transitions = serviceMode === 'PICKUP' ? pickupTransitions : dineInTransitions;
  return transitions[current].includes(next);
}

export function assertOrderTransition(
  current: OrderStatus,
  next: OrderStatus,
  serviceMode: ServiceMode,
): void {
  if (!canTransitionOrder(current, next, serviceMode)) {
    throw new Error(`Invalid ${serviceMode} order transition: ${current} -> ${next}`);
  }
}

const kitchenStatuses = new Set<OrderStatus>([
  'CONFIRMED',
  'PREPARING',
  'READY_FOR_PICKUP',
  'READY_TO_SERVE',
]);

export function isKitchenEligible(order: Order): boolean {
  if (!kitchenStatuses.has(order.status)) return false;
  if (order.serviceMode === 'PICKUP') return order.paymentStatus === 'SUCCESS';
  return order.waiterConfirmedAt !== null;
}

export function readyMeaning(order: Order): 'PICKUP' | 'SERVE' | null {
  if (order.status === 'READY_FOR_PICKUP') return 'PICKUP';
  if (order.status === 'READY_TO_SERVE') return 'SERVE';
  return null;
}

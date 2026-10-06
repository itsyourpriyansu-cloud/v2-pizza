import type { Order } from '@pizza-avenue/types';

export interface KitchenPriority {
  score: number;
  basis: 'PICKUP_PROMISE' | 'DINE_IN_ELAPSED_SERVICE';
}

export function kitchenPriority(order: Order, now: Date): KitchenPriority {
  if (order.serviceMode === 'PICKUP') {
    const promise = order.promisedReadyAt ? new Date(order.promisedReadyAt).getTime() : now.getTime();
    const minutesUntilPromise = Math.floor((promise - now.getTime()) / 60_000);
    return { score: 10_000 - minutesUntilPromise, basis: 'PICKUP_PROMISE' };
  }

  const elapsedMinutes = Math.max(
    0,
    Math.floor((now.getTime() - new Date(order.createdAt).getTime()) / 60_000),
  );
  return { score: elapsedMinutes, basis: 'DINE_IN_ELAPSED_SERVICE' };
}

export function compareKitchenPriority(left: Order, right: Order, now: Date): number {
  return kitchenPriority(right, now).score - kitchenPriority(left, now).score;
}

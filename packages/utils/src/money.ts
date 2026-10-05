import type { Money } from '@pizza-avenue/types';

export function inrFromPaise(amount: number): Money {
  if (!Number.isSafeInteger(amount)) {
    throw new TypeError('Money amount must be a safe integer number of paise.');
  }
  return { amount, currency: 'INR' };
}

export function formatMoney(money: Money): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: money.currency,
  }).format(money.amount / 100);
}

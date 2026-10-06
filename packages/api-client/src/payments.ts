import type { Payment } from '@pizza-avenue/types';
import { apiRequest } from './client';

export function createPaymentAttempt(
  cartId: string,
  idempotencyKey: string,
): Promise<Payment> {
  return apiRequest('payments', {
    method: 'POST',
    headers: { 'Idempotency-Key': idempotencyKey },
    body: JSON.stringify({ cartId }),
  });
}

export function getPayment(paymentId: string): Promise<Payment> {
  return apiRequest(`payments/${paymentId}`);
}

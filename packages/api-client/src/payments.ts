import type { Payment, PaymentMethod, PaymentTarget } from '@pizza-avenue/types';
import { apiRequest } from './client';

export function createPaymentAttempt(
  target: PaymentTarget,
  method: PaymentMethod,
  idempotencyKey: string,
): Promise<Payment> {
  return apiRequest('payments', {
    method: 'POST',
    headers: { 'Idempotency-Key': idempotencyKey },
    body: JSON.stringify({ target, method }),
  });
}

export function getPayment(paymentId: string): Promise<Payment> {
  return apiRequest(`payments/${paymentId}`);
}

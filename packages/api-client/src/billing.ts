import type {
  DineInBill,
  Money,
  Payment,
  PaymentMethod,
  TableSession,
} from '@pizza-avenue/types';
import { apiRequest } from './client';

export function listAdminBills(): Promise<DineInBill[]> {
  return apiRequest('admin/bills');
}

export function getAdminBill(billId: string): Promise<DineInBill> {
  return apiRequest(`admin/bills/${billId}`);
}

export function finalizeAdminBill(billId: string, idempotencyKey: string): Promise<DineInBill> {
  return apiRequest(`admin/bills/${billId}/finalize`, {
    method: 'POST',
    headers: { 'Idempotency-Key': idempotencyKey },
  });
}

export function applyAdminBillDiscount(
  billId: string,
  amount: Money,
  reason: string,
): Promise<DineInBill> {
  return apiRequest(`admin/bills/${billId}/discount`, {
    method: 'POST',
    body: JSON.stringify({ amount, reason }),
  });
}

export function createAdminBillPayment(input: {
  billId: string;
  method: PaymentMethod;
  idempotencyKey: string;
}): Promise<Payment> {
  return apiRequest(`admin/bills/${input.billId}/payments`, {
    method: 'POST',
    headers: { 'Idempotency-Key': input.idempotencyKey },
    body: JSON.stringify({ method: input.method }),
  });
}

export function getAdminPayment(paymentId: string): Promise<Payment> {
  return apiRequest(`admin/payments/${paymentId}`);
}

export function closeAdminTableSession(
  sessionId: string,
  idempotencyKey: string,
): Promise<TableSession> {
  return apiRequest(`admin/table-sessions/${sessionId}/close`, {
    method: 'POST',
    headers: { 'Idempotency-Key': idempotencyKey },
  });
}

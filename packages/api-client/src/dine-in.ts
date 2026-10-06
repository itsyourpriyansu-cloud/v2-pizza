import type {
  DineInBill,
  Order,
  ServiceRequest,
  ServiceRequestType,
  TableContextResolution,
  TableSession,
} from '@pizza-avenue/types';
import { apiRequest } from './client';

export function resolveTableContext(token: string): Promise<TableContextResolution> {
  return apiRequest('dine-in/table-context/resolve', {
    method: 'POST',
    body: JSON.stringify({ token }),
  });
}

export function getDineInSession(): Promise<TableSession> {
  return apiRequest('dine-in/session');
}

export function getDineInBill(): Promise<DineInBill> {
  return apiRequest('dine-in/session/bill');
}

export function submitDineInOrder(input: {
  cartId: string;
  tableSessionId: string;
  idempotencyKey: string;
}): Promise<Order> {
  return apiRequest('dine-in/orders', {
    method: 'POST',
    headers: { 'Idempotency-Key': input.idempotencyKey },
    body: JSON.stringify(input),
  });
}

export function getDineInOrder(orderId: string): Promise<Order> {
  return apiRequest(`dine-in/orders/${orderId}`);
}

export function cancelDineInOrder(orderId: string): Promise<Order> {
  return apiRequest(`dine-in/orders/${orderId}/cancel`, { method: 'POST' });
}

export function requestDineInBill(idempotencyKey: string): Promise<DineInBill> {
  return apiRequest('dine-in/bill-request', {
    method: 'POST',
    headers: { 'Idempotency-Key': idempotencyKey },
  });
}

export function createServiceRequest(
  type: ServiceRequestType,
  idempotencyKey: string,
): Promise<ServiceRequest> {
  return apiRequest('dine-in/service-requests', {
    method: 'POST',
    headers: { 'Idempotency-Key': idempotencyKey },
    body: JSON.stringify({ type }),
  });
}

import type {
  Order,
  ServiceRequest,
  TableSession,
  WaiterTableDetail,
} from '@pizza-avenue/types';
import { apiRequest } from './client';

export function listWaiterOrderRequests(): Promise<Order[]> {
  return apiRequest('staff/waiter/order-requests');
}

export function getWaiterOrder(orderId: string): Promise<Order> {
  return apiRequest(`staff/waiter/orders/${orderId}`);
}

export function confirmWaiterOrder(orderId: string, idempotencyKey: string): Promise<Order> {
  return apiRequest(`staff/waiter/orders/${orderId}/confirm`, {
    method: 'POST',
    headers: { 'Idempotency-Key': idempotencyKey },
  });
}

export function rejectWaiterOrder(orderId: string, reason: string): Promise<Order> {
  return apiRequest(`staff/waiter/orders/${orderId}/reject`, {
    method: 'POST',
    body: JSON.stringify({ reason }),
  });
}

export function requestOrderClarification(orderId: string, reason: string): Promise<Order> {
  return apiRequest(`staff/waiter/orders/${orderId}/clarification`, {
    method: 'POST',
    body: JSON.stringify({ reason }),
  });
}

export function listWaiterTables(): Promise<TableSession[]> {
  return apiRequest('staff/waiter/tables');
}

export function getWaiterTable(sessionId: string): Promise<WaiterTableDetail> {
  return apiRequest(`staff/waiter/tables/${sessionId}`);
}

export function markDineInOrderServed(orderId: string, idempotencyKey: string): Promise<Order> {
  return apiRequest(`staff/waiter/orders/${orderId}/served`, {
    method: 'POST',
    headers: { 'Idempotency-Key': idempotencyKey },
  });
}

export function listWaiterServiceRequests(): Promise<ServiceRequest[]> {
  return apiRequest('staff/waiter/service-requests');
}

export function acknowledgeServiceRequest(requestId: string): Promise<ServiceRequest> {
  return apiRequest(`staff/waiter/service-requests/${requestId}/acknowledge`, { method: 'POST' });
}

export function resolveServiceRequest(requestId: string): Promise<ServiceRequest> {
  return apiRequest(`staff/waiter/service-requests/${requestId}/resolve`, { method: 'POST' });
}

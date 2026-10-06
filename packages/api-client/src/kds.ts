import type { Order } from '@pizza-avenue/types';
import { apiRequest } from './client';

export function listKdsOrders(): Promise<Order[]> {
  return apiRequest('kds/orders');
}

export function markOrderPreparing(orderId: string): Promise<Order> {
  return apiRequest(`orders/${orderId}/preparing`, { method: 'POST' });
}

export function markOrderReady(orderId: string): Promise<Order> {
  return apiRequest(`orders/${orderId}/ready`, { method: 'POST' });
}

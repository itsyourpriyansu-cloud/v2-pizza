import type { Order, ServiceMode } from '@pizza-avenue/types';
import { apiRequest } from './client';

export function listKdsOrders(serviceMode?: ServiceMode): Promise<Order[]> {
  const query = serviceMode ? `?serviceMode=${serviceMode}` : '';
  return apiRequest(`kds/orders${query}`);
}

export function markOrderPreparing(orderId: string): Promise<Order> {
  return apiRequest(`orders/${orderId}/preparing`, { method: 'POST' });
}

export function markOrderReady(orderId: string): Promise<Order> {
  return apiRequest(`orders/${orderId}/ready`, { method: 'POST' });
}

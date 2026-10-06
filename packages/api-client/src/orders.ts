import type { Order, PaginatedResult } from '@pizza-avenue/types';
import { apiRequest } from './client';

export function getOrder(orderId: string): Promise<Order> {
  return apiRequest(`orders/${orderId}`);
}

export function listOrders(): Promise<PaginatedResult<Order>> {
  return apiRequest('orders/me');
}

export function reorder(orderId: string): Promise<{ cartId: string }> {
  return apiRequest(`orders/${orderId}/reorder`, { method: 'POST' });
}

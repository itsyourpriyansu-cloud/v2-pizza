import type { Cart, CartItem, CartQuote, ServiceMode } from '@pizza-avenue/types';
import { apiRequest } from './client';

export function createCart(storeId: string, serviceMode: ServiceMode = 'PICKUP'): Promise<Cart> {
  return apiRequest('carts', {
    method: 'POST',
    body: JSON.stringify({ storeId, serviceMode }),
  });
}

export function getCart(cartId: string): Promise<Cart> {
  return apiRequest(`carts/${cartId}`);
}

export function addCartItem(
  cartId: string,
  item: Omit<CartItem, 'id'>,
): Promise<Cart> {
  return apiRequest(`carts/${cartId}/items`, {
    method: 'POST',
    body: JSON.stringify(item),
  });
}

export function updateCartItem(
  cartId: string,
  itemId: string,
  item: Partial<CartItem>,
): Promise<Cart> {
  return apiRequest(`carts/${cartId}/items/${itemId}`, {
    method: 'PATCH',
    body: JSON.stringify(item),
  });
}

export function removeCartItem(cartId: string, itemId: string): Promise<Cart> {
  return apiRequest(`carts/${cartId}/items/${itemId}`, { method: 'DELETE' });
}

export function getCartQuote(cartId: string): Promise<CartQuote> {
  return apiRequest(`carts/${cartId}/quote`, { method: 'POST' });
}

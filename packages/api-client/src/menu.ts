import type { Menu, Product } from '@pizza-avenue/types';
import { apiRequest } from './client';

export function getMenu(storeId: string): Promise<Menu> {
  return apiRequest(`stores/${storeId}/menu`);
}

export function getProduct(productId: string): Promise<Product> {
  return apiRequest(`products/${productId}`);
}

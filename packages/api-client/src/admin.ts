import type { Store, StoreState } from '@pizza-avenue/types';
import { apiRequest } from './client';

export function updateStoreState(
  storeId: string,
  state: StoreState,
): Promise<Store> {
  return apiRequest('admin/store-state', {
    method: 'PUT',
    body: JSON.stringify({ storeId, state }),
  });
}

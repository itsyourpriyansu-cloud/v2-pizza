import { HttpResponse, http } from 'msw';
import type { StoreState } from '@pizza-avenue/types';
import { store } from '../data';

export const adminHandlers = [
  http.put('*/api/v1/admin/store-state', async ({ request }) => {
    const input = (await request.json()) as { storeId: string; state: StoreState };
    return HttpResponse.json({ ...store, id: input.storeId, state: input.state });
  }),
];

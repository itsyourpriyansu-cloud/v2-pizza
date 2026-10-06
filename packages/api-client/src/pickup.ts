import type {
  PickupOptions,
  PickupReservation,
  PickupType,
} from '@pizza-avenue/types';
import { apiRequest } from './client';

export function getPickupSlots(storeId: string): Promise<PickupOptions> {
  return apiRequest(`stores/${storeId}/pickup-options`);
}

export function createPickupReservation(input: {
  cartId: string;
  slotId: string;
  pickupType: PickupType;
  reservedCapacityUnits: number;
}): Promise<PickupReservation> {
  return apiRequest('pickup/reservations', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

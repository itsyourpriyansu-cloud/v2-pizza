import type { EntityId, ISODateTime } from './common';

export type PickupType = 'ASAP' | 'SCHEDULED';
export type PickupSlotState = 'AVAILABLE' | 'NEARLY_FULL' | 'FULL';
export type PickupReservationStatus =
  | 'HELD'
  | 'CONSUMED'
  | 'RELEASED'
  | 'EXPIRED';

export interface PickupSlot {
  id: EntityId;
  storeId: EntityId;
  startsAt: ISODateTime;
  endsAt: ISODateTime;
  state: PickupSlotState;
  remainingCapacityUnits: number;
}

export interface PickupReservation {
  id: EntityId;
  cartId: EntityId;
  slotId: EntityId;
  pickupType: PickupType;
  reservedCapacityUnits: number;
  status: PickupReservationStatus;
  expiresAt: ISODateTime;
}

export interface PickupOptions {
  asap: PickupSlot | null;
  scheduled: PickupSlot[];
}

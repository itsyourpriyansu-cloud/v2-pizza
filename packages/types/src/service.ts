import type { EntityId, ISODateTime } from './common';

export type ServiceMode = 'PICKUP' | 'DINE_IN';

export interface ServiceContext {
  mode: ServiceMode;
  storeId: EntityId;
  tableId: EntityId | null;
  tableLabel: string | null;
  tableSessionId: EntityId | null;
  confirmedAt: ISODateTime | null;
}

export interface ServiceModeAvailability {
  pickupOrderingEnabled: boolean;
  dineInOrderingEnabled: boolean;
  dineInEstimatedWaitMinutes: { minimum: number; maximum: number } | null;
}

export type AvailabilityScope = 'GLOBAL' | ServiceMode;

import type { EntityId } from './common';

export type StoreState = 'OPEN' | 'BUSY' | 'PAUSED' | 'CLOSED';

export interface Store {
  id: EntityId;
  name: string;
  locality: string;
  timezone: string;
  state: StoreState;
  currentPickupEstimateMinutes: number | null;
}

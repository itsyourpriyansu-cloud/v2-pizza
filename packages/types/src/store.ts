import type { EntityId } from './common';
import type { ServiceModeAvailability } from './service';

export type StoreState = 'OPEN' | 'BUSY' | 'PAUSED' | 'CLOSED';

export interface Store {
  id: EntityId;
  name: string;
  locality: string;
  timezone: string;
  state: StoreState;
  currentPickupEstimateMinutes: number | null;
  serviceModes: ServiceModeAvailability;
}

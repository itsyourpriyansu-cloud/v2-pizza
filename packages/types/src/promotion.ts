import type { EntityId, ISODateTime } from './common';
import type { Money } from './money';

export interface Promotion {
  id: EntityId;
  name: string;
  active: boolean;
  minimumCartValue: Money | null;
  startsAt: ISODateTime;
  endsAt: ISODateTime;
  stackable: boolean;
}

export interface UpsellSuggestion {
  id: EntityId;
  productId: EntityId;
  reason: 'ADD_DRINK' | 'ADD_SIDE' | 'ADD_DESSERT' | 'LOYALTY_PROGRESS';
  incrementalPrice: Money;
}

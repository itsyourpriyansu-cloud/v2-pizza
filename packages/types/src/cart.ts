import type { EntityId, ISODateTime } from './common';
import type { Money } from './money';
import type { ServiceMode } from './service';

export type CartStatus = 'ACTIVE' | 'QUOTED' | 'CONVERTED' | 'EXPIRED';

export interface ModifierSelection {
  modifierId: EntityId;
  groupId: EntityId;
  nameSnapshot: string;
  quantity: number;
  provisionalPriceDelta: Money;
}

export interface CartItem {
  id: EntityId;
  productId: EntityId;
  productNameSnapshot: string;
  variantId: EntityId;
  variantNameSnapshot: string;
  selectedModifiers: ModifierSelection[];
  quantity: number;
  notes: string | null;
  provisionalUnitPrice: Money;
}

export interface Cart {
  id: EntityId;
  storeId: EntityId;
  serviceMode: ServiceMode;
  status: CartStatus;
  items: CartItem[];
  expiresAt: ISODateTime;
}

export interface CartQuote {
  cartId: EntityId;
  version: string;
  subtotal: Money;
  discount: Money;
  tax: Money;
  payableTotal: Money;
  quotedAt: ISODateTime;
  expiresAt: ISODateTime;
  changes?: Array<{
    code: 'PRICE_CHANGED' | 'ITEM_UNAVAILABLE' | 'MODIFIER_UNAVAILABLE';
    itemId: EntityId;
    message: string;
  }>;
}

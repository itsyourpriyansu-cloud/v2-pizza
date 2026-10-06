import type { EntityId, ISODateTime } from './common';
import type { ModifierSelection } from './cart';
import type { Money } from './money';
import type { PickupType } from './pickup';

export type OrderStatus =
  | 'DRAFT'
  | 'PAYMENT_PENDING'
  | 'PAYMENT_FAILED'
  | 'CONFIRMED'
  | 'PREPARING'
  | 'READY'
  | 'PICKED_UP'
  | 'COMPLETED'
  | 'CANCELLED';

export type OrderSource =
  | 'PWA'
  | 'COUNTER'
  | 'POS'
  | 'SWIGGY'
  | 'ZOMATO'
  | 'DISTRICT'
  | 'WHATSAPP_ASSISTED';

export interface OrderItem {
  id: EntityId;
  productId: EntityId | null;
  productNameSnapshot: string;
  variantNameSnapshot: string;
  modifiers: ModifierSelection[];
  unitPrice: Money;
  quantity: number;
  lineTotal: Money;
}

export interface Order {
  id: EntityId;
  publicNumber: string;
  customerId: EntityId;
  storeId: EntityId;
  source: OrderSource;
  status: OrderStatus;
  pickupType: PickupType;
  promisedReadyAt: ISODateTime;
  items: OrderItem[];
  subtotal: Money;
  discount: Money;
  tax: Money;
  total: Money;
  createdAt: ISODateTime;
  version: number;
}

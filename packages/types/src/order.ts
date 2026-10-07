import type { EntityId, ISODateTime } from './common';
import type { ModifierSelection } from './cart';
import type { Money } from './money';
import type { PaymentStatus } from './payment';
import type { PickupType } from './pickup';
import type { ServiceMode } from './service';

export type OrderStatus =
  | 'DRAFT'
  | 'PAYMENT_PENDING'
  | 'PAYMENT_FAILED'
  | 'CUSTOMER_SUBMITTED'
  | 'WAITER_REVIEW'
  | 'NEEDS_CLARIFICATION'
  | 'REJECTED'
  | 'CONFIRMED'
  | 'PREPARING'
  | 'READY_FOR_PICKUP'
  | 'READY_TO_SERVE'
  | 'PICKED_UP'
  | 'SERVED'
  | 'COMPLETED'
  | 'CANCELLED';

export type OrderSource =
  | 'PWA_PICKUP'
  | 'TABLE_QR'
  | 'WAITER_ASSISTED'
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
  customerId: EntityId | null;
  storeId: EntityId;
  serviceMode: ServiceMode;
  source: OrderSource;
  status: OrderStatus;
  paymentStatus: PaymentStatus | null;
  pickupType: PickupType | null;
  promisedReadyAt: ISODateTime | null;
  tableSessionId: EntityId | null;
  tableId: EntityId | null;
  tableLabel: string | null;
  roundNumber: number | null;
  waiterConfirmedAt: ISODateTime | null;
  servedAt: ISODateTime | null;
  items: OrderItem[];
  subtotal: Money;
  discount: Money;
  tax: Money;
  total: Money;
  createdAt: ISODateTime;
  version: number;
}

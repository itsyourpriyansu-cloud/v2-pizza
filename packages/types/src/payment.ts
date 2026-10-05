import type { EntityId, ISODateTime } from './common';
import type { Money } from './money';

export type PaymentStatus =
  | 'CREATED'
  | 'PENDING'
  | 'SUCCESS'
  | 'FAILED'
  | 'EXPIRED'
  | 'REFUND_PENDING'
  | 'PARTIALLY_REFUNDED'
  | 'REFUNDED'
  | 'REFUND_FAILED';

export interface Payment {
  id: EntityId;
  cartId: EntityId;
  orderId: EntityId | null;
  status: PaymentStatus;
  amount: Money;
  providerReference: string | null;
  createdAt: ISODateTime;
}

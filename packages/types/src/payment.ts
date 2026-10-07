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

export type PaymentTargetType = 'ORDER' | 'TABLE_BILL';
export type PaymentMethod = 'CASH' | 'UPI' | 'CARD' | 'OTHER';

export interface PaymentTarget {
  type: PaymentTargetType;
  id: EntityId;
}

export interface Payment {
  id: EntityId;
  target: PaymentTarget;
  status: PaymentStatus;
  method: PaymentMethod | null;
  amount: Money;
  providerReference: string | null;
  createdAt: ISODateTime;
}

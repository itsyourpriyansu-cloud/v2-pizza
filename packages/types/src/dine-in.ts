import type { EntityId, ISODateTime } from './common';
import type { Money } from './money';
import type { Order } from './order';

export type TableStatus =
  | 'AVAILABLE'
  | 'ACTIVE'
  | 'ORDER_WAITING_CONFIRMATION'
  | 'PREPARING'
  | 'READY_TO_SERVE'
  | 'DINING'
  | 'BILL_REQUESTED'
  | 'PAYMENT_PENDING';

export type TableSessionStatus =
  | 'OPEN'
  | 'ACTIVE'
  | 'BILL_REQUESTED'
  | 'PAYMENT_PENDING'
  | 'PAID'
  | 'CLOSED'
  | 'EXPIRED'
  | 'CANCELLED';

export interface RestaurantTable {
  id: EntityId;
  storeId: EntityId;
  label: string;
  status: TableStatus;
  activeSessionId: EntityId | null;
}

export interface TableSession {
  id: EntityId;
  storeId: EntityId;
  tableId: EntityId;
  tableLabel: string;
  status: TableSessionStatus;
  primaryCustomerId: EntityId | null;
  assignedWaiterId: EntityId | null;
  orderIds: EntityId[];
  billId: EntityId;
  openedAt: ISODateTime;
  lastActivityAt: ISODateTime;
  billRequestedAt: ISODateTime | null;
  finalizedAt: ISODateTime | null;
  paidAt: ISODateTime | null;
  closedAt: ISODateTime | null;
  expiresAt: ISODateTime;
  version: number;
}

export type TableContextResolutionStatus =
  | 'VALID'
  | 'INVALID'
  | 'EXPIRED'
  | 'REVOKED';

export interface TableContextResolution {
  status: TableContextResolutionStatus;
  session: TableSession | null;
}

export type DineInBillStatus =
  | 'OPEN'
  | 'BILL_REQUESTED'
  | 'FINALIZED'
  | 'PAYMENT_PENDING'
  | 'PAID'
  | 'VOID';

export type BillLineVoidState = 'ACTIVE' | 'VOID_PENDING' | 'VOIDED';

export interface DineInBillLine {
  id: EntityId;
  orderId: EntityId;
  orderItemId: EntityId;
  customerId: EntityId | null;
  snapshotName: string;
  quantity: number;
  unitPrice: Money;
  modifierTotal: Money;
  tax: Money;
  lineTotal: Money;
  voidState: BillLineVoidState;
}

export interface LoyaltyAttribution {
  customerId: EntityId | null;
  customerLabel: string;
  eligibleSpend: Money;
}

export interface DineInBill {
  id: EntityId;
  tableSessionId: EntityId;
  status: DineInBillStatus;
  lines: DineInBillLine[];
  includedOrderIds: EntityId[];
  subtotal: Money;
  tax: Money;
  serviceCharge: Money;
  discountTotal: Money;
  rewardTotal: Money;
  grandTotal: Money;
  loyaltyAttribution: LoyaltyAttribution[];
  finalizedAt: ISODateTime | null;
  paidAt: ISODateTime | null;
  closedAt: ISODateTime | null;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
  version: number;
}

export type ServiceRequestType = 'CALL_WAITER' | 'REQUEST_BILL';
export type ServiceRequestStatus =
  | 'OPEN'
  | 'ACKNOWLEDGED'
  | 'RESOLVED'
  | 'CANCELLED';

export interface ServiceRequest {
  id: EntityId;
  tableSessionId: EntityId;
  tableLabel: string;
  type: ServiceRequestType;
  status: ServiceRequestStatus;
  createdAt: ISODateTime;
  acknowledgedAt: ISODateTime | null;
  resolvedAt: ISODateTime | null;
}

export interface WaiterTableDetail {
  session: TableSession;
  orders: Order[];
  bill: DineInBill;
}

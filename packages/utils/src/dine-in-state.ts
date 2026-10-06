import type {
  DineInBill,
  DineInBillLine,
  DineInBillStatus,
  Order,
  ServiceRequestStatus,
  TableSessionStatus,
} from '@pizza-avenue/types';

const tableSessionTransitions: Readonly<Record<TableSessionStatus, readonly TableSessionStatus[]>> = {
  OPEN: ['ACTIVE', 'CANCELLED', 'EXPIRED'],
  ACTIVE: ['BILL_REQUESTED', 'CANCELLED', 'EXPIRED'],
  BILL_REQUESTED: ['ACTIVE', 'PAYMENT_PENDING', 'CANCELLED'],
  PAYMENT_PENDING: ['PAID', 'BILL_REQUESTED'],
  PAID: ['CLOSED'],
  CLOSED: [],
  EXPIRED: [],
  CANCELLED: [],
};

const billTransitions: Readonly<Record<DineInBillStatus, readonly DineInBillStatus[]>> = {
  OPEN: ['BILL_REQUESTED', 'FINALIZED', 'VOID'],
  BILL_REQUESTED: ['OPEN', 'FINALIZED', 'VOID'],
  FINALIZED: ['PAYMENT_PENDING', 'PAID', 'VOID'],
  PAYMENT_PENDING: ['FINALIZED', 'PAID'],
  PAID: [],
  VOID: [],
};

const serviceRequestTransitions: Readonly<
  Record<ServiceRequestStatus, readonly ServiceRequestStatus[]>
> = {
  OPEN: ['ACKNOWLEDGED', 'CANCELLED'],
  ACKNOWLEDGED: ['RESOLVED', 'CANCELLED'],
  RESOLVED: [],
  CANCELLED: [],
};

export function canTransitionTableSession(current: TableSessionStatus, next: TableSessionStatus) {
  return tableSessionTransitions[current].includes(next);
}

export function canTransitionBill(current: DineInBillStatus, next: DineInBillStatus) {
  return billTransitions[current].includes(next);
}

export function canTransitionServiceRequest(
  current: ServiceRequestStatus,
  next: ServiceRequestStatus,
) {
  return serviceRequestTransitions[current].includes(next);
}

const unresolvedBillOrderStates = new Set([
  'DRAFT',
  'CUSTOMER_SUBMITTED',
  'WAITER_REVIEW',
  'NEEDS_CLARIFICATION',
  'CONFIRMED',
  'PREPARING',
  'READY_TO_SERVE',
]);

export function getBillFinalizationBlockers(
  bill: DineInBill,
  orders: readonly Order[],
): string[] {
  const blockers: string[] = [];
  if (!['OPEN', 'BILL_REQUESTED'].includes(bill.status)) blockers.push(`Bill is ${bill.status}.`);
  const unresolvedOrders = orders.filter(
    (order) => bill.includedOrderIds.includes(order.id) && unresolvedBillOrderStates.has(order.status),
  );
  if (unresolvedOrders.length > 0) blockers.push(`${unresolvedOrders.length} order(s) are not resolved.`);
  if (bill.lines.some((line) => line.voidState === 'VOID_PENDING')) {
    blockers.push('A void request is unresolved.');
  }
  return blockers;
}

export function eligibleSpendByCustomer(
  lines: readonly DineInBillLine[],
): Readonly<Record<string, number>> {
  return lines.reduce<Record<string, number>>((totals, line) => {
    if (line.customerId === null || line.voidState !== 'ACTIVE') return totals;
    totals[line.customerId] = (totals[line.customerId] ?? 0) + line.lineTotal.amount;
    return totals;
  }, {});
}

import type {
  DineInBill,
  Payment,
  ServiceRequest,
  TableSession,
} from '@pizza-avenue/types';
import { makeOrder, money } from '../factories';

export const tableSession: TableSession = {
  id: 'table-session-12',
  storeId: 'sainikpuri',
  tableId: 'table-12',
  tableLabel: 'Table 12',
  status: 'ACTIVE',
  primaryCustomerId: 'customer-arjun',
  assignedWaiterId: 'staff-rahul',
  orderIds: ['order-pa-2001', 'order-pa-2002', 'order-pa-2004', 'order-pa-guest'],
  billId: 'bill-table-12',
  openedAt: '2026-10-06T12:00:00.000Z',
  lastActivityAt: '2026-10-06T12:20:00.000Z',
  billRequestedAt: null,
  finalizedAt: null,
  paidAt: null,
  closedAt: null,
  expiresAt: '2026-10-06T18:00:00.000Z',
  version: 1,
};

export const dineInOrders = [
  makeOrder('order-pa-2001', 'PA-2001', 'CUSTOMER_SUBMITTED', 'DINE_IN'),
  makeOrder('order-pa-2002', 'PA-2002', 'SERVED', 'DINE_IN'),
  {
    ...makeOrder('order-pa-2004', 'PA-2004', 'SERVED', 'DINE_IN'),
    customerId: 'customer-aisha',
    roundNumber: 2,
  },
  {
    ...makeOrder('order-pa-guest', 'PA-2003', 'SERVED', 'DINE_IN'),
    customerId: null,
    roundNumber: 2,
  },
];

export const dineInBill: DineInBill = {
  id: 'bill-table-12',
  tableSessionId: tableSession.id,
  status: 'OPEN',
  lines: [
    {
      id: 'bill-line-1',
      orderId: 'order-pa-2002',
      orderItemId: 'order-pa-2002-item-1',
      customerId: 'customer-arjun',
      snapshotName: 'Diavola — Regular',
      quantity: 1,
      unitPrice: money(44900),
      modifierTotal: money(0),
      tax: money(0),
      lineTotal: money(44900),
      voidState: 'ACTIVE',
    },
    {
      id: 'bill-line-2',
      orderId: 'order-pa-guest',
      orderItemId: 'order-pa-guest-item-1',
      customerId: null,
      snapshotName: 'Garlic Bread',
      quantity: 1,
      unitPrice: money(17900),
      modifierTotal: money(0),
      tax: money(0),
      lineTotal: money(17900),
      voidState: 'ACTIVE',
    },
    {
      id: 'bill-line-3',
      orderId: 'order-pa-2004',
      orderItemId: 'order-pa-2004-item-1',
      customerId: 'customer-aisha',
      snapshotName: 'Quattro Formaggi — Regular',
      quantity: 1,
      unitPrice: money(50000),
      modifierTotal: money(0),
      tax: money(0),
      lineTotal: money(50000),
      voidState: 'ACTIVE',
    },
  ],
  includedOrderIds: ['order-pa-2002', 'order-pa-2004', 'order-pa-guest'],
  subtotal: money(112800),
  tax: money(0),
  serviceCharge: money(0),
  discountTotal: money(0),
  rewardTotal: money(0),
  grandTotal: money(112800),
  loyaltyAttribution: [
    { customerId: 'customer-arjun', customerLabel: 'Arjun Rao', eligibleSpend: money(44900) },
    { customerId: 'customer-aisha', customerLabel: 'Aisha Khan', eligibleSpend: money(50000) },
    { customerId: null, customerLabel: 'Guest', eligibleSpend: money(0) },
  ],
  finalizedAt: null,
  paidAt: null,
  closedAt: null,
  createdAt: '2026-10-06T12:00:00.000Z',
  updatedAt: '2026-10-06T12:20:00.000Z',
  version: 1,
};

export const serviceRequests: ServiceRequest[] = [
  {
    id: 'service-request-1',
    tableSessionId: tableSession.id,
    tableLabel: tableSession.tableLabel,
    type: 'CALL_WAITER',
    status: 'OPEN',
    createdAt: '2026-10-06T12:21:00.000Z',
    acknowledgedAt: null,
    resolvedAt: null,
  },
];

export const dineInPayment: Payment = {
  id: 'payment-bill-12',
  target: { type: 'TABLE_BILL', id: dineInBill.id },
  status: 'SUCCESS',
  method: 'CASH',
  amount: dineInBill.grandTotal,
  providerReference: null,
  createdAt: '2026-10-06T13:00:00.000Z',
};

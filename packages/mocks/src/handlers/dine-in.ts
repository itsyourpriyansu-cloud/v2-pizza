import { HttpResponse, http } from 'msw';
import type { OrderStatus, ServiceRequestType } from '@pizza-avenue/types';
import { dineInBill, dineInOrders, serviceRequests, tableSession } from '../data';
import { getScenarioState } from '../scenarios';

function currentOrderStatus(): OrderStatus {
  const scenario = getScenarioState().operations;
  if (scenario === 'DINE_IN_NEEDS_CLARIFICATION') return 'NEEDS_CLARIFICATION';
  if (scenario === 'DINE_IN_REJECTED') return 'REJECTED';
  if (scenario === 'DINE_IN_WAITER_CONFIRMED') return 'CONFIRMED';
  if (scenario === 'DINE_IN_PREPARING') return 'PREPARING';
  if (scenario === 'DINE_IN_READY_TO_SERVE') return 'READY_TO_SERVE';
  if (scenario === 'DINE_IN_SERVED') return 'SERVED';
  if (scenario === 'DINE_IN_WAITING_WAITER' || scenario === 'DINE_IN_WAITER_REVIEW') return 'WAITER_REVIEW';
  return 'CUSTOMER_SUBMITTED';
}

function currentDineInOrder() {
  const base = dineInOrders[0]!;
  const status = currentOrderStatus();
  return {
    ...base,
    status,
    waiterConfirmedAt: ['CONFIRMED', 'PREPARING', 'READY_TO_SERVE', 'SERVED'].includes(status)
      ? '2026-10-06T12:22:00.000Z'
      : null,
    servedAt: status === 'SERVED' ? '2026-10-06T12:50:00.000Z' : null,
  };
}

function currentBill() {
  const scenario = getScenarioState().operations;
  const status = scenario === 'DINE_IN_BILL_REQUESTED' || scenario === 'DINE_IN_ACTIVE_ORDER_BILL_REQUEST'
    ? 'BILL_REQUESTED'
    : scenario === 'DINE_IN_BILL_FINALIZED'
      ? 'FINALIZED'
      : scenario === 'DINE_IN_PAYMENT_PENDING' || scenario === 'DINE_IN_PAYMENT_FAILED'
        ? 'PAYMENT_PENDING'
        : scenario === 'DINE_IN_PAYMENT_PAID' || scenario === 'DINE_IN_SESSION_CLOSED'
          ? 'PAID'
          : 'OPEN';
  return { ...dineInBill, status } as typeof dineInBill;
}

export const dineInHandlers = [
  http.post('*/api/v1/dine-in/table-context/resolve', async ({ request }) => {
    const { token } = (await request.json()) as { token: string };
    const scenario = getScenarioState().operations;
    if (token === 'expired-token' || scenario === 'DINE_IN_EXPIRED_QR') {
      return HttpResponse.json({ status: 'EXPIRED', session: null });
    }
    if (token !== 'table-12-valid' || scenario === 'DINE_IN_WRONG_TABLE') {
      return HttpResponse.json({ status: 'INVALID', session: null });
    }
    return HttpResponse.json({ status: 'VALID', session: tableSession });
  }),
  http.get('*/api/v1/dine-in/session', () => HttpResponse.json(tableSession)),
  http.get('*/api/v1/dine-in/session/bill', () => HttpResponse.json(currentBill())),
  http.post('*/api/v1/dine-in/orders', () => HttpResponse.json(currentDineInOrder(), { status: 201 })),
  http.get('*/api/v1/dine-in/orders/:orderId', () => HttpResponse.json(currentDineInOrder())),
  http.post('*/api/v1/dine-in/orders/:orderId/cancel', () =>
    HttpResponse.json({ ...currentDineInOrder(), status: 'CANCELLED' as const }),
  ),
  http.post('*/api/v1/dine-in/bill-request', () =>
    HttpResponse.json({ ...currentBill(), status: 'BILL_REQUESTED' as const }),
  ),
  http.post('*/api/v1/dine-in/service-requests', async ({ request }) => {
    const { type } = (await request.json()) as { type: ServiceRequestType };
    return HttpResponse.json({ ...serviceRequests[0], type }, { status: 201 });
  }),
];

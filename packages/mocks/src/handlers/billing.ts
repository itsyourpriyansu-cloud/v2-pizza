import { HttpResponse, http } from 'msw';
import { dineInBill, dineInPayment, tableSession } from '../data';
import { getScenarioState } from '../scenarios';

export const billingHandlers = [
  http.get('*/api/v1/admin/bills', () => HttpResponse.json([dineInBill])),
  http.get('*/api/v1/admin/bills/:billId', () => HttpResponse.json(dineInBill)),
  http.post('*/api/v1/admin/bills/:billId/finalize', () => {
    if (getScenarioState().operations === 'DINE_IN_ACTIVE_ORDER_BILL_REQUEST') {
      return HttpResponse.json(
        { error: { code: 'ACTIVE_ORDERS_REMAIN', message: 'Resolve active orders first.', details: {} } },
        { status: 409 },
      );
    }
    return HttpResponse.json({
      ...dineInBill,
      status: 'FINALIZED' as const,
      finalizedAt: '2026-10-06T12:58:00.000Z',
    });
  }),
  http.post('*/api/v1/admin/bills/:billId/discount', () => HttpResponse.json(dineInBill)),
  http.post('*/api/v1/admin/bills/:billId/reward', () => HttpResponse.json(dineInBill)),
  http.post('*/api/v1/admin/bills/:billId/payments', async ({ request }) => {
    const { method } = (await request.json()) as { method: typeof dineInPayment.method };
    const scenario = getScenarioState().operations;
    const status = scenario === 'DINE_IN_PAYMENT_FAILED'
      ? 'FAILED'
      : method === 'CASH' || scenario === 'DINE_IN_PAYMENT_PAID'
        ? 'SUCCESS'
        : 'PENDING';
    return HttpResponse.json({ ...dineInPayment, method, status }, { status: 201 });
  }),
  http.get('*/api/v1/admin/payments/:paymentId', () => HttpResponse.json(dineInPayment)),
  http.post('*/api/v1/admin/table-sessions/:sessionId/close', () =>
    HttpResponse.json({
      ...tableSession,
      status: 'CLOSED' as const,
      closedAt: '2026-10-06T13:01:00.000Z',
    }),
  ),
  http.post('*/api/v1/admin/bills/:billId/void', () =>
    HttpResponse.json({ ...dineInBill, status: 'VOID' as const }),
  ),
  http.post('*/api/v1/admin/payments/:paymentId/refund', () =>
    HttpResponse.json({ ...dineInPayment, status: 'REFUND_PENDING' as const }),
  ),
];

import { HttpResponse, http } from 'msw';
import { dineInBill, dineInOrders, serviceRequests, tableSession } from '../data';

const requestedOrder = () => ({
  ...dineInOrders[0]!,
  status: 'WAITER_REVIEW' as const,
});

export const waiterHandlers = [
  http.get('*/api/v1/staff/waiter/order-requests', () => HttpResponse.json([requestedOrder()])),
  http.get('*/api/v1/staff/waiter/orders/:orderId', () => HttpResponse.json(requestedOrder())),
  http.post('*/api/v1/staff/waiter/orders/:orderId/confirm', () =>
    HttpResponse.json({
      ...requestedOrder(),
      status: 'CONFIRMED' as const,
      waiterConfirmedAt: '2026-10-06T12:22:00.000Z',
      version: requestedOrder().version + 1,
    }),
  ),
  http.post('*/api/v1/staff/waiter/orders/:orderId/reject', () =>
    HttpResponse.json({ ...requestedOrder(), status: 'REJECTED' as const }),
  ),
  http.post('*/api/v1/staff/waiter/orders/:orderId/clarification', () =>
    HttpResponse.json({ ...requestedOrder(), status: 'NEEDS_CLARIFICATION' as const }),
  ),
  http.get('*/api/v1/staff/waiter/tables', () => HttpResponse.json([tableSession])),
  http.get('*/api/v1/staff/waiter/tables/:sessionId', () =>
    HttpResponse.json({ session: tableSession, orders: dineInOrders, bill: dineInBill }),
  ),
  http.post('*/api/v1/staff/waiter/orders/:orderId/served', () =>
    HttpResponse.json({
      ...dineInOrders[1]!,
      status: 'SERVED' as const,
      servedAt: '2026-10-06T12:50:00.000Z',
    }),
  ),
  http.get('*/api/v1/staff/waiter/service-requests', () => HttpResponse.json(serviceRequests)),
  http.post('*/api/v1/staff/waiter/service-requests/:requestId/acknowledge', () =>
    HttpResponse.json({ ...serviceRequests[0]!, status: 'ACKNOWLEDGED' as const }),
  ),
  http.post('*/api/v1/staff/waiter/service-requests/:requestId/resolve', () =>
    HttpResponse.json({ ...serviceRequests[0]!, status: 'RESOLVED' as const }),
  ),
];

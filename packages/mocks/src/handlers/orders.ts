import { HttpResponse, http } from 'msw';
import type { Order, OrderStatus, PaginatedResult } from '@pizza-avenue/types';
import { assertOrderTransition } from '@pizza-avenue/utils';
import { orders } from '../data';
import { getScenarioState } from '../scenarios';

const scenarioStatus = (): OrderStatus => {
  const scenario = getScenarioState().order;
  if (scenario === 'ORDER_PREPARING') return 'PREPARING';
  if (scenario === 'ORDER_READY') return 'READY';
  return 'CONFIRMED';
};

const scenarioOrders = (): Order[] =>
  orders.map((order, index) =>
    index === 0 ? { ...order, status: scenarioStatus() } : order,
  );

function transition(orderId: string, next: OrderStatus) {
  const order = scenarioOrders().find((candidate) => candidate.id === orderId);
  if (!order) return null;
  assertOrderTransition(order.status, next);
  return { ...order, status: next, version: order.version + 1 };
}

export const orderHandlers = [
  http.get('*/api/v1/orders/me', () => {
    const items = scenarioOrders();
    const result: PaginatedResult<Order> = {
      items,
      page: 1,
      pageSize: items.length,
      total: items.length,
    };
    return HttpResponse.json(result);
  }),
  http.get('*/api/v1/orders/:orderId', ({ params }) => {
    const order = scenarioOrders().find((candidate) => candidate.id === params.orderId);
    return order
      ? HttpResponse.json(order)
      : HttpResponse.json(
          { error: { code: 'NOT_FOUND', message: 'Order not found.', details: {} } },
          { status: 404 },
        );
  }),
  http.post('*/api/v1/orders/:orderId/reorder', () =>
    HttpResponse.json({ cartId: 'cart-reorder-1' }),
  ),
  http.get('*/api/v1/kds/orders', () =>
    HttpResponse.json(
      scenarioOrders().filter((order) =>
        ['CONFIRMED', 'PREPARING', 'READY'].includes(order.status),
      ),
    ),
  ),
  http.post('*/api/v1/orders/:orderId/preparing', ({ params }) => {
    const order = transition(String(params.orderId), 'PREPARING');
    return order
      ? HttpResponse.json(order)
      : HttpResponse.json(
          { error: { code: 'CONFLICT', message: 'Order cannot move to preparing.', details: {} } },
          { status: 409 },
        );
  }),
  http.post('*/api/v1/orders/:orderId/ready', ({ params }) => {
    const order = transition(String(params.orderId), 'READY');
    return order
      ? HttpResponse.json(order)
      : HttpResponse.json(
          { error: { code: 'CONFLICT', message: 'Order cannot move to ready.', details: {} } },
          { status: 409 },
        );
  }),
];

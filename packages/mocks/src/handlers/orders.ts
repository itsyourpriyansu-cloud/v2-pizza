import { HttpResponse, http } from 'msw';
import type { Order, OrderStatus, PaginatedResult } from '@pizza-avenue/types';
import { assertOrderTransition, isKitchenEligible } from '@pizza-avenue/utils';
import { orders } from '../data';
import { getScenarioState } from '../scenarios';

const scenarioStatus = (): OrderStatus => {
  const scenario = getScenarioState().order;
  if (scenario === 'ORDER_PREPARING') return 'PREPARING';
  if (scenario === 'ORDER_READY') return 'READY_FOR_PICKUP';
  return 'CONFIRMED';
};

const scenarioOrders = (): Order[] =>
  orders.map((order, index) =>
    index === 0 ? { ...order, status: scenarioStatus() } : order,
  );

function transition(orderId: string, next: OrderStatus) {
  const order = scenarioOrders().find((candidate) => candidate.id === orderId);
  if (!order) return null;
  assertOrderTransition(order.status, next, order.serviceMode);
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
  http.get('*/api/v1/kds/orders', ({ request }) => {
    const serviceMode = new URL(request.url).searchParams.get('serviceMode');
    return HttpResponse.json(
      scenarioOrders().filter(
        (order) => isKitchenEligible(order) && (!serviceMode || order.serviceMode === serviceMode),
      ),
    );
  }),
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
    const source = scenarioOrders().find((candidate) => candidate.id === params.orderId);
    const next = source?.serviceMode === 'DINE_IN' ? 'READY_TO_SERVE' : 'READY_FOR_PICKUP';
    const order = transition(String(params.orderId), next);
    return order
      ? HttpResponse.json(order)
      : HttpResponse.json(
          { error: { code: 'CONFLICT', message: 'Order cannot move to ready.', details: {} } },
          { status: 409 },
        );
  }),
];

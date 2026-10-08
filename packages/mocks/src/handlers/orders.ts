import { HttpResponse, http } from 'msw';
import type { Cart, Order, OrderStatus, PaginatedResult } from '@pizza-avenue/types';
import { assertOrderTransition, isKitchenEligible } from '@pizza-avenue/utils';
import { orders } from '../data';
import { menu } from '../data/menu';
import { getScenarioState } from '../scenarios';
import { seedCartData } from './cart';

const scenarioStatus = (): OrderStatus => {
  const scenario = getScenarioState().order;
  if (scenario === 'ORDER_PREPARING' || scenario === 'PICKUP_PREPARING' || scenario === 'PICKUP_DELAYED' || scenario === 'PICKUP_STATUS_UNAVAILABLE') return 'PREPARING';
  if (scenario === 'ORDER_READY' || scenario === 'PICKUP_READY') return 'READY_FOR_PICKUP';
  if (scenario === 'PICKUP_PICKED_UP') return 'PICKED_UP';
  if (scenario === 'PICKUP_COMPLETED') return 'COMPLETED';
  return 'CONFIRMED';
};

const scenarioOrders = (): Order[] =>
  orders.map((order, index) =>
    index === 0 ? {
      ...order,
      status: scenarioStatus(),
      promisedReadyAt: getScenarioState().order === 'PICKUP_DELAYED'
        ? '2026-10-07T15:00:00.000Z'
        : order.promisedReadyAt,
    } : order,
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
  http.post('*/api/v1/orders/:orderId/reorder', ({ params }) => {
    const order = scenarioOrders().find((candidate) => candidate.id === params.orderId);
    if (!order || order.serviceMode !== 'PICKUP' || order.status !== 'COMPLETED') {
      return HttpResponse.json(
        { error: { code: 'REORDER_NOT_AVAILABLE', message: 'This order cannot be reordered.', details: {} } },
        { status: 409 },
      );
    }
    const cart: Cart = {
      id: 'cart-reorder-1',
      storeId: order.storeId,
      serviceMode: 'PICKUP',
      status: 'ACTIVE',
      expiresAt: new Date(Date.now() + 120 * 60_000).toISOString(),
      items: order.items.flatMap((item, index) => {
        const product = menu.products.find((candidate) => candidate.id === item.productId);
        const variant = product?.variants.find((candidate) => candidate.name === item.variantNameSnapshot)
          ?? product?.variants.find((candidate) => candidate.availability === 'AVAILABLE');
        if (!product || product.availability !== 'AVAILABLE' || !variant) return [];
        return [{
          id: `cart-reorder-item-${index + 1}`,
          productId: product.id,
          productNameSnapshot: product.name,
          variantId: variant.id,
          variantNameSnapshot: variant.name,
          selectedModifiers: [],
          quantity: item.quantity,
          notes: null,
          provisionalUnitPrice: variant.basePrice,
        }];
      }),
    };
    seedCartData(cart);
    return HttpResponse.json({ cartId: cart.id });
  }),
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

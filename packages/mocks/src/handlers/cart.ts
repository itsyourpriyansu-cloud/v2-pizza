import { HttpResponse, http } from 'msw';
import type { Cart, CartItem, CartQuote, ServiceMode } from '@pizza-avenue/types';
import { money } from '../factories';
import { getScenarioState } from '../scenarios';

let carts = new Map<string, Cart>();

function futureIso(minutes: number) {
  return new Date(Date.now() + minutes * 60_000).toISOString();
}

function findCart(id: string) {
  return carts.get(id);
}

export function resetCartData() {
  carts = new Map();
}

export function seedCartData(cart: Cart) {
  carts.set(cart.id, cart);
}

export const cartHandlers = [
  http.post('*/api/v1/carts', async ({ request }) => {
    const input = (await request.json()) as { storeId: string; serviceMode?: ServiceMode };
    const serviceMode = input.serviceMode ?? 'PICKUP';
    const id = serviceMode === 'DINE_IN' ? 'cart-dine-in-1' : 'cart-pickup-1';
    const existing = carts.get(id);
    if (existing) return HttpResponse.json(existing);
    const cart: Cart = {
      id,
      storeId: input.storeId,
      serviceMode,
      status: 'ACTIVE',
      items: [],
      expiresAt: futureIso(120),
    };
    carts.set(id, cart);
    return HttpResponse.json(cart, { status: 201 });
  }),
  http.get('*/api/v1/carts/:cartId', ({ params }) => {
    const cart = findCart(String(params.cartId));
    return cart
      ? HttpResponse.json(cart)
      : HttpResponse.json(
          { error: { code: 'CART_NOT_FOUND', message: 'This cart is no longer available.', details: {} } },
          { status: 404 },
        );
  }),
  http.post('*/api/v1/carts/:cartId/items', async ({ params, request }) => {
    const cart = findCart(String(params.cartId));
    if (!cart) {
      return HttpResponse.json(
        { error: { code: 'CART_NOT_FOUND', message: 'This cart is no longer available.', details: {} } },
        { status: 404 },
      );
    }
    const input = (await request.json()) as Omit<CartItem, 'id'>;
    const next = {
      ...cart,
      items: [...cart.items, { ...input, id: `${cart.id}-item-${cart.items.length + 1}` }],
    };
    carts.set(cart.id, next);
    return HttpResponse.json(next);
  }),
  http.patch('*/api/v1/carts/:cartId/items/:itemId', async ({ params, request }) => {
    const cart = findCart(String(params.cartId));
    if (!cart) return new HttpResponse(null, { status: 404 });
    const input = (await request.json()) as Partial<CartItem>;
    const next = {
      ...cart,
      items: cart.items.map((item) =>
        item.id === params.itemId ? { ...item, ...input, id: item.id } : item,
      ),
    };
    carts.set(cart.id, next);
    return HttpResponse.json(next);
  }),
  http.delete('*/api/v1/carts/:cartId/items/:itemId', ({ params }) => {
    const cart = findCart(String(params.cartId));
    if (!cart) return new HttpResponse(null, { status: 404 });
    const next = {
      ...cart,
      items: cart.items.filter((item) => item.id !== params.itemId),
    };
    carts.set(cart.id, next);
    return HttpResponse.json(next);
  }),
  http.post('*/api/v1/carts/:cartId/quote', ({ params }) => {
    const cart = findCart(String(params.cartId));
    if (!cart) return new HttpResponse(null, { status: 404 });
    const scenario = getScenarioState().cart;
    const baseSubtotal = cart.items.reduce(
      (sum, item) => sum + item.provisionalUnitPrice.amount * item.quantity,
      0,
    );
    const priceAdjustment = scenario === 'PICKUP_CART_PRICE_CHANGED' && cart.items.length ? 2000 : 0;
    const changes: NonNullable<CartQuote['changes']> = [];
    const firstItem = cart.items[0];
    if (firstItem && scenario === 'PICKUP_CART_PRICE_CHANGED') {
      changes.push({ code: 'PRICE_CHANGED', itemId: firstItem.id, message: `${firstItem.productNameSnapshot} is now ₹20 more. Review the updated total.` });
    }
    if (firstItem && scenario === 'PICKUP_ITEM_UNAVAILABLE') {
      changes.push({ code: 'ITEM_UNAVAILABLE', itemId: firstItem.id, message: `${firstItem.productNameSnapshot} just sold out. Remove or edit it to continue.` });
    }
    if (firstItem && scenario === 'PICKUP_MODIFIER_UNAVAILABLE') {
      changes.push({ code: 'MODIFIER_UNAVAILABLE', itemId: firstItem.id, message: 'One selected modifier is no longer available. Edit this item to continue.' });
    }
    const subtotal = baseSubtotal + priceAdjustment;
    const quote: CartQuote = {
      cartId: cart.id,
      version: `quote-${cart.items.length}-${scenario}`,
      subtotal: money(subtotal),
      discount: money(0),
      tax: money(0),
      payableTotal: money(subtotal),
      quotedAt: new Date().toISOString(),
      expiresAt: futureIso(10),
      changes,
    };
    return HttpResponse.json(quote);
  }),
];

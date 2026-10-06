import { HttpResponse, http } from 'msw';
import type { CartItem } from '@pizza-avenue/types';
import { cartQuote, emptyCart } from '../data';

let cart = structuredClone(emptyCart);

export function resetCartData() {
  cart = structuredClone(emptyCart);
}

export const cartHandlers = [
  http.post('*/api/v1/carts', () => HttpResponse.json(cart)),
  http.get('*/api/v1/carts/:cartId', () => HttpResponse.json(cart)),
  http.post('*/api/v1/carts/:cartId/items', async ({ request }) => {
    const input = (await request.json()) as Omit<CartItem, 'id'>;
    cart = {
      ...cart,
      items: [...cart.items, { ...input, id: `cart-item-${cart.items.length + 1}` }],
    };
    return HttpResponse.json(cart);
  }),
  http.patch('*/api/v1/carts/:cartId/items/:itemId', async ({ params, request }) => {
    const input = (await request.json()) as Partial<CartItem>;
    cart = {
      ...cart,
      items: cart.items.map((item) =>
        item.id === params.itemId ? { ...item, ...input, id: item.id } : item,
      ),
    };
    return HttpResponse.json(cart);
  }),
  http.delete('*/api/v1/carts/:cartId/items/:itemId', ({ params }) => {
    cart = {
      ...cart,
      items: cart.items.filter((item) => item.id !== params.itemId),
    };
    return HttpResponse.json(cart);
  }),
  http.post('*/api/v1/carts/:cartId/quote', () => HttpResponse.json(cartQuote)),
];

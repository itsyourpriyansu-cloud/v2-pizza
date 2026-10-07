import { HttpResponse, http } from 'msw';
import type { Menu, Product } from '@pizza-avenue/types';
import { menu, products } from '../data';
import { getScenarioState } from '../scenarios';

function applyProductScenario(value: Product): Product {
  const response = structuredClone(value);
  const scenario = getScenarioState().menu;

  if (scenario === 'PRODUCT_SOLD_OUT' && response.id === products[0]?.id) response.availability = 'SOLD_OUT';

  if (scenario === 'MODIFIER_UNAVAILABLE') {
    const modifier = response.modifierGroups
      .flatMap((group) => group.modifiers)
      .find((candidate) => candidate.id === 'topping-extra-cheese');
    if (modifier) modifier.availability = 'UNAVAILABLE';
  }

  return response;
}

function applyMenuScenario(value: Menu): Menu {
  const response = structuredClone(value);
  response.products = response.products.map(applyProductScenario);
  return response;
}

export const menuHandlers = [
  http.get('*/api/v1/stores/:storeId/menu', ({ params }) => {
    if (getScenarioState().menu === 'MENU_NETWORK_ERROR') {
      return HttpResponse.json(
        { error: { code: 'NETWORK_UNAVAILABLE', message: 'Menu is temporarily unavailable.', details: {} } },
        { status: 503 },
      );
    }
    const response = applyMenuScenario(menu);
    response.storeId = String(params.storeId);
    return HttpResponse.json(response);
  }),
  http.get('*/api/v1/products/:productId', ({ params }) => {
    const product = products.find((item) => item.id === params.productId);
    return product
      ? HttpResponse.json(applyProductScenario(product))
      : HttpResponse.json(
          { error: { code: 'NOT_FOUND', message: 'Product not found.', details: {} } },
          { status: 404 },
        );
  }),
];

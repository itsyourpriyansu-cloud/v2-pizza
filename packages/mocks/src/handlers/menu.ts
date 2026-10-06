import { HttpResponse, http } from 'msw';
import { menu, products } from '../data';
import { getScenarioState } from '../scenarios';

export const menuHandlers = [
  http.get('*/api/v1/stores/:storeId/menu', ({ params }) => {
    const response = structuredClone(menu);
    response.storeId = String(params.storeId);
    if (getScenarioState().menu === 'PRODUCT_SOLD_OUT' && response.products[0]) {
      response.products[0].availability = 'SOLD_OUT';
    }
    return HttpResponse.json(response);
  }),
  http.get('*/api/v1/products/:productId', ({ params }) => {
    const product = products.find((item) => item.id === params.productId);
    return product
      ? HttpResponse.json(product)
      : HttpResponse.json(
          { error: { code: 'NOT_FOUND', message: 'Product not found.', details: {} } },
          { status: 404 },
        );
  }),
];

import { createPaymentAttempt, getMenu, getPickupSlots } from './index';
import { setScenario } from '@pizza-avenue/mocks';

describe('typed API client over MSW', () => {
  it('receives the realistic mocked menu', async () => {
    const menu = await getMenu('sainikpuri');
    expect(menu.products.map((product) => product.name)).toContain('Avenue Signature');
    expect(menu.products[0]?.variants[0]?.basePrice.currency).toBe('INR');
  });

  it('selects the payment failure scenario programmatically', async () => {
    setScenario('PAYMENT_FAILURE');
    const payment = await createPaymentAttempt('cart-mock-1', 'test-idempotency-key');
    expect(payment.status).toBe('FAILED');
    expect(payment.orderId).toBeNull();
  });

  it('represents a full pickup scenario', async () => {
    setScenario('PICKUP_FULL');
    const options = await getPickupSlots('sainikpuri');
    expect(options.asap?.state).toBe('FULL');
    expect(options.scheduled.every((slot) => slot.state === 'FULL')).toBe(true);
  });
});

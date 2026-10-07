import {
  confirmWaiterOrder,
  createAdminBillPayment,
  createPaymentAttempt,
  getMenu,
  getPickupSlots,
  resolveTableContext,
} from './index';
import { setScenario } from '@pizza-avenue/mocks';

describe('typed API client over MSW', () => {
  it('receives the realistic mocked menu', async () => {
    const menu = await getMenu('sainikpuri');
    expect(menu.products.map((product) => product.name)).toContain('Farmhouse Pizza');
    expect(menu.products).toHaveLength(29);
    expect(menu.products[0]?.variants[0]?.basePrice.currency).toBe('INR');
  });

  it('selects the payment failure scenario programmatically', async () => {
    setScenario('PAYMENT_FAILURE');
    const payment = await createPaymentAttempt(
      { type: 'ORDER', id: 'order-pa-1001' },
      'UPI',
      'test-idempotency-key',
    );
    expect(payment.status).toBe('FAILED');
    expect(payment.target).toEqual({ type: 'ORDER', id: 'order-pa-1001' });
  });

  it('represents a full pickup scenario', async () => {
    setScenario('PICKUP_FULL');
    const options = await getPickupSlots('sainikpuri');
    expect(options.asap?.state).toBe('FULL');
    expect(options.scheduled.every((slot) => slot.state === 'FULL')).toBe(true);
  });

  it('resolves an opaque table token and keeps the table session server-owned', async () => {
    const result = await resolveTableContext('table-12-valid');
    expect(result.status).toBe('VALID');
    expect(result.session?.tableLabel).toBe('Table 12');
  });

  it('lets waiter confirmation—not customer submission—admit dine-in to kitchen', async () => {
    const order = await confirmWaiterOrder('order-pa-2001', 'confirm-once');
    const replay = await confirmWaiterOrder('order-pa-2001', 'confirm-once');
    expect(order.status).toBe('CONFIRMED');
    expect(order.waiterConfirmedAt).not.toBeNull();
    expect(order.paymentStatus).toBeNull();
    expect(replay).toEqual(order);
  });

  it('creates a table-bill payment from the Admin boundary', async () => {
    const payment = await createAdminBillPayment({
      billId: 'bill-table-12',
      method: 'CASH',
      idempotencyKey: 'cash-once',
    });
    expect(payment.target).toEqual({ type: 'TABLE_BILL', id: 'bill-table-12' });
    expect(payment.status).toBe('SUCCESS');
  });
});

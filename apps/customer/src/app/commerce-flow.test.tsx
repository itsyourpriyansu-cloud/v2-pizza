import { addCartItem, createCart, createPickupReservation, getPickupSlots, getProduct, verifyOtp } from '@pizza-avenue/api-client';
import { getScenarioState, setScenario } from '@pizza-avenue/mocks';
import type { ServiceMode } from '@pizza-avenue/types';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import { RouterProvider } from 'react-router-dom';
import { resetCommerceStore, useCommerceStore } from '../shared/state/commerce-store';
import { usePrototypeStore } from '../shared/state/prototype-store';
import { AppProviders } from './providers';
import { createCustomerMemoryRouter } from './router';

function renderRoute(path: string) {
  return render(<AppProviders><RouterProvider router={createCustomerMemoryRouter([path])} /></AppProviders>);
}

async function seedCart(mode: ServiceMode) {
  const base = await createCart('sainikpuri', mode);
  const product = await getProduct('pizza-margherita');
  const variant = product.variants[0]!;
  const cart = await addCartItem(base.id, {
    productId: product.id,
    productNameSnapshot: product.name,
    variantId: variant.id,
    variantNameSnapshot: variant.name,
    selectedModifiers: [],
    quantity: 1,
    notes: null,
    provisionalUnitPrice: variant.basePrice,
  });
  useCommerceStore.getState().setCartSummary(mode, cart.id, 1);
  return cart;
}

function setPickupContext() {
  usePrototypeStore.getState().setServiceContext({
    mode: 'PICKUP',
    storeId: 'sainikpuri',
    tableId: null,
    tableLabel: null,
    tableSessionId: null,
    confirmedAt: new Date().toISOString(),
  });
}

function setDineInContext() {
  usePrototypeStore.getState().setServiceContext({
    mode: 'DINE_IN',
    storeId: 'sainikpuri',
    tableId: 'table-12',
    tableLabel: 'Table 12',
    tableSessionId: 'table-session-12',
    confirmedAt: new Date().toISOString(),
  });
}

describe('customer commerce missions', () => {
  beforeEach(() => {
    resetCommerceStore();
    usePrototypeStore.setState({
      selectedScenario: null,
      scenarioState: getScenarioState(),
      builderModifierIds: [],
      serviceContext: null,
    });
  });

  it('keeps Pickup and Dine-in carts isolated', async () => {
    const pickup = await seedCart('PICKUP');
    const dineIn = await seedCart('DINE_IN');
    expect(pickup.id).not.toBe(dineIn.id);
    expect(useCommerceStore.getState().carts).toEqual({
      PICKUP: { cartId: pickup.id, itemCount: 1 },
      DINE_IN: { cartId: dineIn.id, itemCount: 1 },
    });
  });

  it('shows an authoritative price-change recovery without discarding the cart', async () => {
    await seedCart('PICKUP');
    setPickupContext();
    setScenario('PICKUP_CART_PRICE_CHANGED');
    renderRoute('/cart');
    expect(await screen.findByText(/now ₹20 more/)).toBeVisible();
    expect(screen.getAllByText('₹369.00')).toHaveLength(2);
    expect(useCommerceStore.getState().carts.PICKUP.itemCount).toBe(1);
  });

  it('preserves cart and service context through invalid OTP and successful retry', async () => {
    const user = userEvent.setup();
    await seedCart('PICKUP');
    setPickupContext();
    renderRoute('/auth?returnTo=%2Fcheckout');
    await user.type(await screen.findByLabelText('Mobile number'), '+919876543210');
    await user.click(screen.getByRole('button', { name: 'Send verification code' }));
    await screen.findByRole('heading', { name: 'Enter the six-digit code' });
    await user.type(screen.getByLabelText('Verification code'), '000000');
    await user.click(screen.getByRole('button', { name: 'Verify and continue' }));
    expect(await screen.findByText(/not correct/)).toBeVisible();
    expect(useCommerceStore.getState().carts.PICKUP.itemCount).toBe(1);
    expect(usePrototypeStore.getState().serviceContext?.mode).toBe('PICKUP');
    setScenario('AUTH_NORMAL');
    await user.clear(screen.getByLabelText('Verification code'));
    await user.type(screen.getByLabelText('Verification code'), '123456');
    await user.click(screen.getByRole('button', { name: 'Verify and continue' }));
    expect(await screen.findByRole('heading', { name: 'Choose a pickup time first' })).toBeVisible();
    expect(useCommerceStore.getState().session).not.toBeNull();
  });

  it('holds an available scheduled pickup slot and keeps the cart', async () => {
    const user = userEvent.setup();
    await seedCart('PICKUP');
    setPickupContext();
    renderRoute('/checkout/pickup');
    const [scheduled] = await screen.findAllByRole('radio', { name: /Today/ });
    await user.click(scheduled!);
    await user.click(screen.getByRole('button', { name: 'Hold this pickup time' }));
    expect(await screen.findByText(/Pickup held for/)).toBeVisible();
    expect(useCommerceStore.getState().pickupSelection?.type).toBe('SCHEDULED');
    expect(useCommerceStore.getState().carts.PICKUP.itemCount).toBe(1);
  });

  it('blocks a full slot and preserves the cart', async () => {
    await seedCart('PICKUP');
    setPickupContext();
    renderRoute('/checkout/pickup?scenario=PICKUP_SLOT_FULL');
    const asap = await screen.findByRole('radio', { name: /As soon as possible/ });
    expect(asap).toBeDisabled();
    expect(useCommerceStore.getState().carts.PICKUP.itemCount).toBe(1);
  });

  it('recovers when an available slot fills after selection', async () => {
    const user = userEvent.setup();
    await seedCart('PICKUP');
    setPickupContext();
    renderRoute('/checkout/pickup');
    await user.click(await screen.findByRole('radio', { name: /As soon as possible/ }));
    setScenario('PICKUP_SLOT_FULL');
    await user.click(screen.getByRole('button', { name: 'Hold this pickup time' }));
    expect(await screen.findByText('That pickup time just filled up.')).toBeVisible();
    expect(useCommerceStore.getState().pickupSelection).toBeNull();
    expect(useCommerceStore.getState().carts.PICKUP.itemCount).toBe(1);
  });

  it('shows hold-expiry recovery without returning to the menu', async () => {
    const user = userEvent.setup();
    await seedCart('PICKUP');
    setPickupContext();
    renderRoute('/checkout/pickup?scenario=PICKUP_HOLD_EXPIRED');
    await user.click(await screen.findByRole('radio', { name: /As soon as possible/ }));
    await user.click(screen.getByRole('button', { name: 'Hold this pickup time' }));
    expect(await screen.findByText('Your pickup hold expired')).toBeVisible();
    expect(useCommerceStore.getState().carts.PICKUP.itemCount).toBe(1);
  });

  it('keeps the Pickup cart out of the kitchen after payment failure', async () => {
    const user = userEvent.setup();
    await seedCart('PICKUP');
    setPickupContext();
    const options = await getPickupSlots('sainikpuri');
    const slot = options.asap!;
    const reservation = await createPickupReservation({ cartId: useCommerceStore.getState().carts.PICKUP.cartId!, slotId: slot.id, pickupType: 'ASAP', reservedCapacityUnits: 1 });
    useCommerceStore.getState().setPickupSelection({ type: 'ASAP', slot, reservation });
    setScenario('PICKUP_PAYMENT_FAILED');
    renderRoute('/payment');
    await user.click(await screen.findByRole('button', { name: 'Pay securely' }));
    expect(await screen.findByRole('heading', { name: 'Payment failed.' })).toBeVisible();
    expect(screen.getByText('Your cart is safe. Nothing was sent to the kitchen.')).toBeVisible();
    expect(useCommerceStore.getState().pickupOrderId).toBeNull();
    expect(useCommerceStore.getState().carts.PICKUP.itemCount).toBe(1);
  });

  it('does not create a second payment while status is uncertain', async () => {
    const user = userEvent.setup();
    await seedCart('PICKUP');
    setPickupContext();
    const options = await getPickupSlots('sainikpuri');
    const slot = options.asap!;
    const reservation = await createPickupReservation({ cartId: useCommerceStore.getState().carts.PICKUP.cartId!, slotId: slot.id, pickupType: 'ASAP', reservedCapacityUnits: 1 });
    useCommerceStore.getState().setPickupSelection({ type: 'ASAP', slot, reservation });
    setScenario('PICKUP_PAYMENT_CHECKING');
    renderRoute('/payment');
    await user.click(await screen.findByRole('button', { name: 'Pay securely' }));
    expect(await screen.findByRole('heading', { name: 'We’re checking your payment.' })).toBeVisible();
    expect(screen.getByText('Don’t pay again yet.')).toBeVisible();
    expect(screen.getByRole('button', { name: 'Check status again' })).toBeVisible();
  });

  it('submits Dine-in to the waiter before any kitchen state appears', async () => {
    const user = userEvent.setup();
    await seedCart('DINE_IN');
    setDineInContext();
    renderRoute('/dine-in/review?scenario=DINE_IN_SUBMITTED');
    await user.click(await screen.findByRole('button', { name: 'Send Order to Waiter' }));
    expect(await screen.findByRole('heading', { name: 'Waiting for waiter confirmation' })).toBeVisible();
    expect(screen.getByText(/Nothing has reached the kitchen yet/)).toBeVisible();
    expect(screen.queryByText('In the kitchen')).not.toBeInTheDocument();
  });

  it('maps waiter confirmation to Accepted before Preparing', async () => {
    setDineInContext();
    renderRoute('/dine-in/orders/order-pa-2001?scenario=DINE_IN_WAITER_CONFIRMED');
    expect(await screen.findByRole('heading', { name: 'Your waiter confirmed this round' })).toBeVisible();
    expect(screen.getByText('It has now been sent to the kitchen.')).toBeVisible();
  });

  it('preserves Dine-in recovery actions after waiter rejection', async () => {
    await seedCart('DINE_IN');
    setDineInContext();
    renderRoute('/dine-in/orders/order-pa-2001?scenario=DINE_IN_REJECTED');
    expect(await screen.findByRole('heading', { name: 'One item is unavailable' })).toBeVisible();
    expect(screen.getByRole('link', { name: 'Review Order' })).toHaveAttribute('href', '/dine-in/cart');
    expect(useCommerceStore.getState().carts.DINE_IN.itemCount).toBe(1);
  });

  it('shows served second-round readiness and the existing bill path', async () => {
    const user = userEvent.setup();
    await seedCart('DINE_IN');
    setDineInContext();
    renderRoute('/dine-in/orders/order-pa-2001?scenario=DINE_IN_SERVED');
    expect(await screen.findByRole('heading', { name: 'Served' })).toBeVisible();
    expect(screen.getByRole('link', { name: 'View Current Bill' })).toHaveAttribute('href', '/dine-in/bill');
    await user.click(screen.getByRole('button', { name: 'Order More' }));
    expect(usePrototypeStore.getState().serviceContext?.mode).toBe('DINE_IN');
    expect(useCommerceStore.getState().carts.DINE_IN.itemCount).toBe(0);
    expect(await screen.findByText('Dine in · Table 12')).toBeVisible();
  });

  it('renders the read-only Dine-in bill and requests staff action', async () => {
    const user = userEvent.setup();
    setDineInContext();
    renderRoute('/dine-in/bill');
    expect(await screen.findByRole('heading', { name: 'Current table bill' })).toBeVisible();
    expect(screen.getByRole('heading', { name: 'Round 1' })).toBeVisible();
    expect(screen.queryByRole('button', { name: /mark paid/i })).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Request Bill' }));
    expect(await screen.findByText('Staff has been notified.')).toBeVisible();
  });

  it('confirms Pickup only after mock payment success', async () => {
    const user = userEvent.setup();
    await seedCart('PICKUP');
    setPickupContext();
    const auth = await verifyOtp('+919876543210', '123456');
    useCommerceStore.getState().restoreSession(auth.customer, auth.session);
    const options = await getPickupSlots('sainikpuri');
    const slot = options.asap!;
    const reservation = await createPickupReservation({ cartId: useCommerceStore.getState().carts.PICKUP.cartId!, slotId: slot.id, pickupType: 'ASAP', reservedCapacityUnits: 1 });
    useCommerceStore.getState().setPickupSelection({ type: 'ASAP', slot, reservation });
    setScenario('PICKUP_PAYMENT_SUCCESS');
    renderRoute('/payment');
    await user.click(await screen.findByRole('button', { name: 'Pay securely' }));
    expect(await screen.findByRole('heading', { name: 'Order Confirmed' })).toBeVisible();
    expect(useCommerceStore.getState().pickupOrderId).toBe('order-pa-1001');
    expect(screen.getByRole('link', { name: 'Track Order' })).toHaveAttribute('href', '/orders/order-pa-1001');
  });
});

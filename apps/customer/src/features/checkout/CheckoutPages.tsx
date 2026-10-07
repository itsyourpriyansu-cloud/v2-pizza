import { createPickupReservation, getCart, getCartQuote, getPickupSlots } from '@pizza-avenue/api-client';
import type { PickupSlot, PickupType } from '@pizza-avenue/types';
import { formatMoney, queryKeys } from '@pizza-avenue/utils';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { trackCustomerEvent } from '../../shared/analytics/analytics';
import { Badge, Button, ButtonLink, ErrorState, PageHeader, PageSkeleton, Surface } from '../../shared/components/Primitives';
import { useCommerceStore } from '../../shared/state/commerce-store';
import { usePrototypeStore } from '../../shared/state/prototype-store';
import { useScenarioFromUrl } from '../../shared/state/use-scenario-from-url';
import { CartSummary } from '../cart/CartComponents';

function slotTime(slot: PickupSlot) {
  return new Intl.DateTimeFormat('en-IN', { hour: 'numeric', minute: '2-digit', timeZone: 'Asia/Kolkata' }).format(new Date(slot.startsAt));
}

function HoldCountdown({ expiresAt, onExpire }: { expiresAt: string; onExpire: () => void }) {
  const [remaining, setRemaining] = useState(() => Math.max(0, new Date(expiresAt).getTime() - Date.now()));
  useEffect(() => {
    const update = () => {
      const next = Math.max(0, new Date(expiresAt).getTime() - Date.now());
      setRemaining(next);
      if (next === 0) onExpire();
    };
    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, [expiresAt, onExpire]);
  const totalSeconds = Math.ceil(remaining / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return <strong aria-live="polite">Pickup held for {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}</strong>;
}

export function CheckoutPickupPage() {
  useScenarioFromUrl();
  const navigate = useNavigate();
  const pickupCart = useCommerceStore((state) => state.carts.PICKUP);
  const selection = useCommerceStore((state) => state.pickupSelection);
  const setSelection = useCommerceStore((state) => state.setPickupSelection);
  const scenarioStore = usePrototypeStore((state) => state.scenarioState.store);
  const [selected, setSelected] = useState<{ slot: PickupSlot; type: PickupType } | null>(
    selection ? { slot: selection.slot, type: selection.type } : null,
  );
  const [expired, setExpired] = useState(false);
  const pickupQuery = useQuery({
    queryKey: queryKeys.pickupSlots('sainikpuri'),
    queryFn: () => getPickupSlots('sainikpuri'),
  });
  const reservationMutation = useMutation({
    mutationFn: ({ slot, type }: { slot: PickupSlot; type: PickupType }) => createPickupReservation({
      cartId: pickupCart.cartId!,
      slotId: slot.id,
      pickupType: type,
      reservedCapacityUnits: Math.max(1, pickupCart.itemCount),
    }),
    onSuccess: (reservation, input) => {
      setSelection({ type: input.type, slot: input.slot, reservation });
      trackCustomerEvent('pickup_slot_selected', { pickupType: input.type, slotId: input.slot.id });
      setExpired(false);
    },
  });

  useEffect(() => {
    trackCustomerEvent('pickup_options_viewed', { storeId: 'sainikpuri' });
  }, []);

  if (!pickupCart.cartId || pickupCart.itemCount === 0) {
    return <ErrorState title="Your Pickup cart is empty" body="Add an item before choosing a pickup time." onRetry={() => navigate('/menu')} />;
  }
  if (pickupQuery.isPending) return <PageSkeleton label="pickup options" />;
  if (pickupQuery.isError) return <ErrorState title="Pickup times could not be loaded" body="Your cart is safe. Try loading availability again." onRetry={() => void pickupQuery.refetch()} />;
  const storeBlocked = scenarioStore === 'STORE_PAUSED' || scenarioStore === 'STORE_CLOSED';
  const noSlots = !pickupQuery.data.asap && pickupQuery.data.scheduled.length === 0;

  function choose(slot: PickupSlot, type: PickupType) {
    if (slot.state === 'FULL' || slot.state === 'UNAVAILABLE' || storeBlocked) return;
    setSelected({ slot, type });
    setSelection(null);
    trackCustomerEvent('pickup_mode_selected', { pickupType: type });
  }

  return (
    <div className="page-stack">
      <PageHeader eyebrow="Pickup" title="When should we have it ready?" description={scenarioStore === 'STORE_BUSY' ? 'The kitchen is busy. These times already include the longer preparation estimate.' : 'Choose an actual ready time—not an arrival window.'} />
      {storeBlocked ? <Surface className="recovery-notice"><strong>{scenarioStore === 'STORE_CLOSED' ? 'The store is closed' : 'New orders are paused'}</strong><p>Your cart is safe. Browse now and choose a time when ordering reopens.</p></Surface> : null}
      {expired ? <Surface className="recovery-notice" role="alert"><strong>Your pickup hold expired</strong><p>Your entire cart is safe. Choose another available time to continue.</p></Surface> : null}
      {reservationMutation.isError ? <Surface className="recovery-notice" role="alert"><strong>That pickup time just filled up.</strong><p>Your cart is safe. Choose the next available time or another slot.</p></Surface> : null}
      {noSlots ? <ErrorState title="No pickup times are available" body="Your cart is safe. Check again shortly or return when the store reopens capacity." onRetry={() => void pickupQuery.refetch()} /> : (
        <section className="pickup-grid" aria-label="Pickup options">
          {pickupQuery.data.asap ? (
            <label className={'pickup-slot' + (selected?.slot.id === pickupQuery.data.asap.id ? ' is-selected' : '') + (pickupQuery.data.asap.state === 'FULL' ? ' is-unavailable' : '')}>
              <input type="radio" name="pickup-slot" checked={selected?.slot.id === pickupQuery.data.asap.id} disabled={pickupQuery.data.asap.state === 'FULL' || storeBlocked} onChange={() => choose(pickupQuery.data.asap!, 'ASAP')} />
              <span><strong>As soon as possible</strong><small>Ready around {slotTime(pickupQuery.data.asap)} · About 25–30 min</small></span>
              <Badge tone={pickupQuery.data.asap.state === 'NEARLY_FULL' ? 'warning' : pickupQuery.data.asap.state === 'FULL' ? 'danger' : 'success'}>{pickupQuery.data.asap.state.replace('_', ' ')}</Badge>
            </label>
          ) : null}
          <h2>Schedule for today</h2>
          {pickupQuery.data.scheduled.map((slot) => (
            <label className={'pickup-slot' + (selected?.slot.id === slot.id ? ' is-selected' : '') + (slot.state === 'FULL' ? ' is-unavailable' : '')} key={slot.id}>
              <input type="radio" name="pickup-slot" checked={selected?.slot.id === slot.id} disabled={slot.state === 'FULL' || slot.state === 'UNAVAILABLE' || storeBlocked} onChange={() => choose(slot, 'SCHEDULED')} />
              <span><strong>Today · {slotTime(slot)}</strong><small>{slot.state === 'FULL' ? 'This time is full' : slot.state === 'NEARLY_FULL' ? 'Only a few spots left' : 'Available'}</small></span>
              <Badge tone={slot.state === 'NEARLY_FULL' ? 'warning' : slot.state === 'FULL' ? 'danger' : 'success'}>{slot.state.replace('_', ' ')}</Badge>
            </label>
          ))}
        </section>
      )}
      {selection ? (
        <Surface className="hold-banner" role="status">
          <HoldCountdown
            expiresAt={selection.reservation.expiresAt}
            onExpire={() => {
              if (useCommerceStore.getState().pickupSelection) {
                setSelection(null);
                setExpired(true);
                trackCustomerEvent('pickup_slot_expired', { slotId: selection.slot.id });
              }
            }}
          />
          <span>{selection.type === 'ASAP' ? 'ASAP' : 'Scheduled'} · {slotTime(selection.slot)}</span>
        </Surface>
      ) : null}
      <div className="sticky-action">
        {selection ? (
          <Button type="button" onClick={() => navigate(useCommerceStore.getState().session ? '/checkout' : '/auth?returnTo=%2Fcheckout')}>Continue to review</Button>
        ) : (
          <Button type="button" disabled={!selected || reservationMutation.isPending || storeBlocked} onClick={() => selected && reservationMutation.mutate(selected)}>
            {reservationMutation.isPending ? 'Holding pickup time…' : 'Hold this pickup time'}
          </Button>
        )}
      </div>
    </div>
  );
}

export function CheckoutPage() {
  useScenarioFromUrl();
  const pickupCart = useCommerceStore((state) => state.carts.PICKUP);
  const customer = useCommerceStore((state) => state.customer);
  const session = useCommerceStore((state) => state.session);
  const selection = useCommerceStore((state) => state.pickupSelection);
  const cartQuery = useQuery({
    queryKey: queryKeys.cart(pickupCart.cartId ?? 'empty'),
    queryFn: () => getCart(pickupCart.cartId!),
    enabled: Boolean(pickupCart.cartId),
  });
  const quoteQuery = useQuery({
    queryKey: [...queryKeys.cart(pickupCart.cartId ?? 'empty'), 'quote'],
    queryFn: () => getCartQuote(pickupCart.cartId!),
    enabled: Boolean(pickupCart.cartId),
  });
  useEffect(() => {
    if (quoteQuery.data) trackCustomerEvent('quote_generated', { quoteVersion: quoteQuery.data.version, serviceMode: 'PICKUP' });
  }, [quoteQuery.data]);
  if (!pickupCart.cartId || !selection) return <ErrorState title="Choose a pickup time first" body="Your cart is safe. Select and hold an available pickup time before review." />;
  if (!session || !customer) {
    return <Surface className="state-card"><h1>Verify your contact to continue</h1><p>Your cart and pickup hold stay in place while you sign in.</p><ButtonLink to="/auth?returnTo=%2Fcheckout">Continue with phone</ButtonLink></Surface>;
  }
  if (cartQuery.isPending || quoteQuery.isPending) return <PageSkeleton label="checkout review" />;
  if (cartQuery.isError || quoteQuery.isError || !cartQuery.data || !quoteQuery.data) return <ErrorState title="Review could not be loaded" body="Nothing was submitted. Your cart and pickup selection are unchanged." />;
  return (
    <div className="page-stack checkout-review">
      <PageHeader eyebrow="Final review" title="Everything look right?" description="Payment will be verified by the server before anything reaches the kitchen." />
      <Surface>
        <h2>Order</h2>
        <ul className="review-list">
          {cartQuery.data.items.map((item) => <li key={item.id}><span>{item.quantity} × {item.productNameSnapshot}<small>{item.variantNameSnapshot}{item.selectedModifiers.length ? ' · ' + item.selectedModifiers.map((modifier) => modifier.nameSnapshot).join(', ') : ''}</small></span><strong>{formatMoney({ ...item.provisionalUnitPrice, amount: item.provisionalUnitPrice.amount * item.quantity })}</strong></li>)}
        </ul>
      </Surface>
      <div className="checkout-review__grid">
        <Surface><h2>Pickup</h2><p><strong>{selection.type === 'ASAP' ? 'As soon as possible' : 'Scheduled'}</strong><br />Today · {slotTime(selection.slot)}<br />Pizza Avenue, Sainikpuri</p><ButtonLink variant="ghost" to="/checkout/pickup">Change time</ButtonLink></Surface>
        <Surface><h2>Contact</h2><p><strong>{customer.name}</strong><br />{customer.phoneMasked}</p><Badge tone="success">Verified</Badge></Surface>
      </div>
      <CartSummary quote={quoteQuery.data} />
      <div className="sticky-action"><ButtonLink to="/payment">Pay {formatMoney(quoteQuery.data.payableTotal)}</ButtonLink></div>
    </div>
  );
}

import { createPaymentAttempt, getPayment } from '@pizza-avenue/api-client';
import type { PaymentMethod } from '@pizza-avenue/types';
import { formatMoney } from '@pizza-avenue/utils';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { trackCustomerEvent } from '../../shared/analytics/analytics';
import { Badge, Button, ButtonLink, ErrorState, PageHeader, Surface } from '../../shared/components/Primitives';
import { formatCustomerState } from '../../shared/copy/customer-copy';
import { useCommerceStore } from '../../shared/state/commerce-store';
import { usePrototypeStore } from '../../shared/state/prototype-store';
import { useScenarioFromUrl } from '../../shared/state/use-scenario-from-url';

export function PaymentPage() {
  useScenarioFromUrl();
  const navigate = useNavigate();
  const selection = useCommerceStore((state) => state.pickupSelection);
  const currentPayment = useCommerceStore((state) => state.payment);
  const setPayment = useCommerceStore((state) => state.setPayment);
  const [method, setMethod] = useState<PaymentMethod>('UPI');
  const idempotencyKey = useRef(crypto.randomUUID());
  const mutation = useMutation({
    mutationFn: () => createPaymentAttempt({ type: 'ORDER', id: 'order-pa-1001' }, method, idempotencyKey.current),
    onSuccess: (payment) => {
      setPayment(payment);
      if (payment.status === 'SUCCESS') navigate('/payment/success');
      else if (payment.status === 'FAILED' || payment.status === 'EXPIRED') navigate('/payment/failure');
      else navigate('/payment/checking');
    },
  });
  if (!selection) return <ErrorState title="Pickup time required" body="Nothing has been charged. Return to checkout and hold a pickup time first." />;
  return (
    <div className="page-stack">
      <PageHeader eyebrow="Payment preview" title="Choose how to pay" description="The final amount is verified before your order is confirmed with the kitchen." />
      <Surface>
        <fieldset className="payment-methods">
          <legend>Payment method</legend>
          {(['UPI', 'CARD'] as PaymentMethod[]).map((value) => (
            <label className={'option-row' + (method === value ? ' is-selected' : '')} key={value}>
              <span className="option-row__control"><input type="radio" name="payment-method" checked={method === value} onChange={() => setMethod(value)} />{value === 'UPI' ? 'UPI' : 'Card'}</span>
              <Badge>{value === 'UPI' ? 'Recommended' : 'Demo mode'}</Badge>
            </label>
          ))}
        </fieldset>
      </Surface>
      {currentPayment ? <p className="muted">Previous payment attempt: {formatCustomerState(currentPayment.status)}. A new attempt starts only when you choose it.</p> : null}
      {mutation.isError ? <p className="validation-message" role="alert">Payment could not start. Nothing was sent to the kitchen.</p> : null}
      <div className="sticky-action">
        <Button type="button" disabled={mutation.isPending} onClick={() => {
          trackCustomerEvent('payment_started', { serviceMode: 'PICKUP', method });
          mutation.mutate();
        }}>{mutation.isPending ? 'Starting payment…' : 'Pay securely'}</Button>
      </div>
    </div>
  );
}

export function PaymentCheckingPage() {
  useScenarioFromUrl();
  const payment = useCommerceStore((state) => state.payment);
  const setPayment = useCommerceStore((state) => state.setPayment);
  const navigate = useNavigate();
  const query = useQuery({
    queryKey: ['payment', payment?.id],
    queryFn: () => getPayment(payment!.id),
    enabled: false,
  });
  useEffect(() => {
    trackCustomerEvent('payment_checking', { paymentId: payment?.id ?? null });
  }, [payment?.id]);
  if (!payment) return <ErrorState title="No payment to check" body="Return to review. No second payment was created." />;
  async function checkAgain() {
    const result = await query.refetch();
    if (!result.data) return;
    setPayment(result.data);
    if (result.data.status === 'SUCCESS') navigate('/payment/success');
    if (result.data.status === 'FAILED' || result.data.status === 'EXPIRED') navigate('/payment/failure');
  }
  return (
    <Surface className="state-card payment-state">
      <Badge tone="warning">Verification pending</Badge>
      <h1>We’re checking your payment.</h1>
      <p><strong>Don’t pay again yet.</strong> Nothing enters the kitchen until payment is verified.</p>
      {query.isError ? <p className="validation-message" role="alert">Status is temporarily unavailable. This did not create another payment.</p> : null}
      <Button type="button" disabled={query.isFetching} onClick={() => void checkAgain()}>{query.isFetching ? 'Checking…' : 'Check status again'}</Button>
      <ButtonLink variant="ghost" to="/orders">View orders</ButtonLink>
    </Surface>
  );
}

export function PaymentSuccessPage() {
  useScenarioFromUrl();
  const payment = useCommerceStore((state) => state.payment);
  const setPickupOrderId = useCommerceStore((state) => state.setPickupOrderId);
  const scenario = usePrototypeStore((state) => state.scenarioState.payment);
  useEffect(() => {
    if (payment?.status !== 'SUCCESS') return;
    setPickupOrderId('order-pa-1001');
    trackCustomerEvent('payment_verified', { paymentId: payment.id, serviceMode: 'PICKUP' });
    trackCustomerEvent('payment_success', { paymentId: payment.id, serviceMode: 'PICKUP' });
    trackCustomerEvent('order_confirmed', { orderId: 'order-pa-1001', serviceMode: 'PICKUP' });
  }, [payment, setPickupOrderId]);
  if (!payment) return <ErrorState title="Payment result unavailable" body="Do not pay again. Check the order list or payment status first." />;
  if (payment.status !== 'SUCCESS') return <PaymentCheckingPage />;
  return (
    <div className="confirmation-page">
      <Badge tone="success">{scenario === 'PICKUP_PAYMENT_ALREADY_PAID' ? 'Already verified' : 'Payment verified'}</Badge>
      <h1>Order Confirmed</h1>
      <p>Your order reached the kitchen only after payment verification.</p>
      <dl className="confirmation-details">
        <div><dt>Order</dt><dd>PA-1001</dd></div>
        <div><dt>Pickup</dt><dd>Ready around 7:45 PM</dd></div>
        <div><dt>Pickup code</dt><dd><strong>4182</strong></dd></div>
        <div><dt>Paid</dt><dd>{formatMoney(payment.amount)}</dd></div>
      </dl>
      <ButtonLink to="/orders/order-pa-1001">Track Order</ButtonLink>
    </div>
  );
}

export function PaymentFailurePage() {
  useScenarioFromUrl();
  const payment = useCommerceStore((state) => state.payment);
  useEffect(() => {
    trackCustomerEvent('payment_failed', { paymentId: payment?.id ?? null, serviceMode: 'PICKUP', status: payment?.status ?? 'UNKNOWN' });
  }, [payment]);
  return (
    <Surface className="state-card payment-state">
      <Badge tone="danger">{payment?.status === 'EXPIRED' ? 'Payment timed out' : 'Payment failed'}</Badge>
      <h1>{payment?.status === 'EXPIRED' ? 'We could not verify that payment.' : 'Payment failed.'}</h1>
      <p>Your cart is safe. Nothing was sent to the kitchen.</p>
      <ButtonLink to="/payment">Try Again</ButtonLink>
      <ButtonLink variant="secondary" to="/payment">Change Method</ButtonLink>
      <ButtonLink variant="ghost" to="/cart">Back to cart</ButtonLink>
    </Surface>
  );
}

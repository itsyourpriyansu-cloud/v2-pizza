import { createServiceRequest, getCart, getCartQuote, getDineInBill, getDineInOrder, getDineInSession, requestDineInBill, resolveTableContext, submitDineInOrder } from '@pizza-avenue/api-client';
import type { OrderStatus } from '@pizza-avenue/types';
import { formatMoney, queryKeys } from '@pizza-avenue/utils';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { QrCode } from 'lucide-react';
import { useEffect, type ReactNode } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { trackCustomerEvent } from '../../shared/analytics/analytics';
import { Badge, Button, ButtonLink, ErrorState, PageHeader, PageSkeleton, Surface } from '../../shared/components/Primitives';
import { formatCustomerState } from '../../shared/copy/customer-copy';
import { useCommerceStore } from '../../shared/state/commerce-store';
import { usePrototypeStore } from '../../shared/state/prototype-store';
import { useScenarioFromUrl } from '../../shared/state/use-scenario-from-url';
import { CartSummary } from '../cart/CartComponents';

export function TableContextBanner({ children }: { children?: ReactNode }) {
  const context = usePrototypeStore((state) => state.serviceContext);
  return (
    <div className="table-context-banner" role="status">
      <span><strong>Dine In · {context?.tableLabel ?? 'Table context required'}</strong><small>Pizza Avenue · Sainikpuri</small></span>
      {children}
    </div>
  );
}

export function DineInStartPage() {
  useScenarioFromUrl();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('t') ?? '';
  const setServiceContext = usePrototypeStore((state) => state.setServiceContext);
  const resolution = useQuery({
    queryKey: queryKeys.tableContext(token),
    queryFn: () => resolveTableContext(token),
    enabled: Boolean(token),
  });
  useEffect(() => {
    trackCustomerEvent('table_qr_scanned', { hasToken: Boolean(token) });
  }, [token]);
  useEffect(() => {
    if (!token || resolution.isPending) return;
    if (resolution.isError || (resolution.data && resolution.data.status !== 'VALID')) {
      trackCustomerEvent('table_context_failed', { status: resolution.data?.status ?? 'NETWORK_ERROR' });
    }
  }, [resolution.data, resolution.isError, resolution.isPending, token]);
  if (!token) return <div className="page-stack dine-in-scan-guide">
    <PageHeader eyebrow="Dine In" title="Scan the QR on your table" description="Each table has its own secure QR. Scanning it connects your order to the right table—typing a table number is never enough." />
    <Surface className="dine-in-scan-card">
      <span className="dine-in-scan-card__icon" aria-hidden="true"><QrCode /></span>
      <ol>
        <li><strong>Open your camera</strong><span>Point it at the QR on your current table.</span></li>
        <li><strong>Confirm the table</strong><span>We’ll show the table before you start ordering.</span></li>
        <li><strong>Send each round</strong><span>Your waiter confirms it before the kitchen receives it.</span></li>
      </ol>
      <ButtonLink to="/" variant="secondary">Choose Pickup instead</ButtonLink>
    </Surface>
  </div>;
  if (resolution.isPending) return <p role="status">Checking table QR…</p>;
  if (resolution.isError || resolution.data.status !== 'VALID' || !resolution.data.session) {
    return <DineInWrongTablePage />;
  }
  const { session } = resolution.data;
  return (
    <div className="page-stack">
      <PageHeader eyebrow="Table verified" title={'You’re at ' + session.tableLabel} description="This QR confirms table context only. It does not identify or authenticate a person." />
      <Surface className="state-card">
        <p>Pizza Avenue · Sainikpuri</p>
        <p>Current kitchen estimate: <strong>20–30 minutes</strong></p>
        <Link className="button button--primary" to="/dine-in" onClick={() => {
          setServiceContext({ mode: 'DINE_IN', storeId: session.storeId, tableId: session.tableId, tableLabel: session.tableLabel, tableSessionId: session.id, confirmedAt: new Date().toISOString() });
          trackCustomerEvent('table_context_validated', { tableSessionId: session.id, storeId: session.storeId });
        }}>Start Ordering</Link>
        <Link className="button button--ghost" to="/dine-in/wrong-table">Scan Another QR</Link>
      </Surface>
    </div>
  );
}

export function DineInHomePage() {
  const sessionQuery = useQuery({ queryKey: queryKeys.tableSession(), queryFn: getDineInSession });
  if (sessionQuery.isPending) return <PageSkeleton label="table session" />;
  if (sessionQuery.isError) return <ErrorState title="Table session could not be loaded" body="Scan the current table QR again. A typed table number is never trusted." />;
  return (
    <div className="page-stack">
      <TableContextBanner><Badge tone="success">{sessionQuery.data.status === 'ACTIVE' ? 'Table connected' : formatCustomerState(sessionQuery.data.status)}</Badge></TableContextBanner>
      <PageHeader eyebrow="Your table" title="Order when you’re ready" description="Every round is sent to your waiter first, then enters the kitchen after confirmation." />
      <div className="service-action-grid">
        <ButtonLink to="/dine-in/menu">View Menu</ButtonLink>
        <ButtonLink variant="secondary" to="/dine-in/bill">Current Bill</ButtonLink>
        <ButtonLink variant="ghost" to="/dine-in/service">Call Waiter</ButtonLink>
      </div>
    </div>
  );
}

export function DineInReviewPage() {
  useScenarioFromUrl();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const context = usePrototypeStore((state) => state.serviceContext);
  const cartSummary = useCommerceStore((state) => state.carts.DINE_IN);
  const addOrder = useCommerceStore((state) => state.addDineInOrderId);
  const cartQuery = useQuery({ queryKey: queryKeys.cart(cartSummary.cartId ?? 'empty'), queryFn: () => getCart(cartSummary.cartId!), enabled: Boolean(cartSummary.cartId) });
  const quoteQuery = useQuery({ queryKey: [...queryKeys.cart(cartSummary.cartId ?? 'empty'), 'quote'], queryFn: () => getCartQuote(cartSummary.cartId!), enabled: Boolean(cartSummary.cartId) });
  const mutation = useMutation({
    mutationFn: () => submitDineInOrder({ cartId: cartSummary.cartId!, tableSessionId: context!.tableSessionId!, idempotencyKey: crypto.randomUUID() }),
    onSuccess: (order) => {
      addOrder(order.id);
      queryClient.setQueryData(queryKeys.order(order.id), order);
      trackCustomerEvent('dine_in_order_submitted', { orderId: order.id, tableSessionId: context?.tableSessionId ?? null, round: order.roundNumber ?? 1 });
      trackCustomerEvent('waiter_confirmation_wait_started', { orderId: order.id });
      navigate('/dine-in/orders/' + order.id);
    },
  });
  if (!context || context.mode !== 'DINE_IN' || !context.tableSessionId) return <ErrorState title="Table context required" body="Scan the QR at your current table before sending an order." />;
  if (!cartSummary.cartId) return <ErrorState title="Your Dine-in cart is empty" body="Choose something from the menu before review." />;
  if (cartQuery.isPending || quoteQuery.isPending) return <PageSkeleton label="dine-in review" />;
  if (cartQuery.isError || quoteQuery.isError || !cartQuery.data || !quoteQuery.data) return <ErrorState title="Review could not be loaded" body="Nothing was sent. Your Dine-in cart is still safe." />;
  return (
    <div className="page-stack">
      <TableContextBanner><Badge>20–30 min</Badge></TableContextBanner>
      <PageHeader eyebrow="Dine-in review" title="Send this round to your waiter" description="Your waiter will confirm this order before it is sent to the kitchen." />
      <Surface>
        <h2>Items</h2>
        <ul className="review-list">
          {cartQuery.data.items.map((item) => <li key={item.id}><span>{item.quantity} × {item.productNameSnapshot}<small>{item.variantNameSnapshot}{item.selectedModifiers.length ? ' · ' + item.selectedModifiers.map((modifier) => modifier.nameSnapshot).join(', ') : ''}{item.notes ? ' · ' + item.notes : ''}</small></span><strong>{formatMoney({ ...item.provisionalUnitPrice, amount: item.provisionalUnitPrice.amount * item.quantity })}</strong></li>)}
        </ul>
      </Surface>
      <CartSummary quote={quoteQuery.data} />
      {mutation.isError ? <p className="validation-message" role="alert">Your request was not sent. The full cart is preserved—try again or call your waiter.</p> : null}
      <div className="sticky-action"><Button type="button" disabled={mutation.isPending} onClick={() => mutation.mutate()}>{mutation.isPending ? 'Sending request…' : 'Send Order to Waiter'}</Button></div>
    </div>
  );
}

type CustomerDineInState = { eyebrow: string; title: string; body: string; tone: 'neutral' | 'success' | 'warning' | 'danger'; step: number };
function customerState(status: OrderStatus): CustomerDineInState {
  if (status === 'WAITER_REVIEW') return { eyebrow: 'Waiter reviewing', title: 'Waiting for waiter confirmation', body: 'This round is not in the kitchen yet.', tone: 'warning', step: 1 };
  if (status === 'NEEDS_CLARIFICATION') return { eyebrow: 'Needs clarification', title: 'Your waiter needs one detail', body: 'The full order is preserved. Please review it or call your waiter.', tone: 'warning', step: 1 };
  if (status === 'REJECTED') return { eyebrow: 'Not accepted', title: 'One item is unavailable', body: 'One item is currently unavailable. Review the preserved order or ask your waiter for help.', tone: 'danger', step: 1 };
  if (status === 'CONFIRMED') return { eyebrow: 'Order accepted', title: 'Your waiter confirmed this round', body: 'It has now been sent to the kitchen.', tone: 'success', step: 2 };
  if (status === 'PREPARING') return { eyebrow: 'In the kitchen', title: 'Preparing', body: 'The kitchen is preparing this round for your table.', tone: 'neutral', step: 3 };
  if (status === 'READY_TO_SERVE') return { eyebrow: 'Kitchen complete', title: 'Ready to be served', body: 'A waiter or runner will bring it to your table.', tone: 'success', step: 4 };
  if (status === 'SERVED') return { eyebrow: 'At your table', title: 'Served', body: 'Enjoy this round. You can order more or review your current bill.', tone: 'success', step: 5 };
  return { eyebrow: 'Request sent', title: 'Waiting for waiter confirmation', body: 'Order request sent. Nothing has reached the kitchen yet.', tone: 'warning', step: 0 };
}

export function DineInOrderPage() {
  useScenarioFromUrl();
  const { orderId = '' } = useParams();
  const navigate = useNavigate();
  const clearCart = useCommerceStore((state) => state.clearCart);
  const orderQuery = useQuery({ queryKey: queryKeys.order(orderId), queryFn: () => getDineInOrder(orderId), enabled: Boolean(orderId) });
  useEffect(() => {
    if (!orderQuery.data) return;
    if (orderQuery.data.status === 'CONFIRMED') trackCustomerEvent('waiter_confirmation_received', { orderId });
    if (orderQuery.data.status === 'REJECTED') trackCustomerEvent('dine_in_order_rejected', { orderId, reason: 'ITEM_UNAVAILABLE' });
    if (orderQuery.data.status === 'SERVED') trackCustomerEvent('dine_in_order_served', { orderId });
  }, [orderId, orderQuery.data]);
  if (orderQuery.isPending) return <PageSkeleton label="dine-in order" />;
  if (orderQuery.isError || !orderQuery.data) return <ErrorState title="Dine-in status could not be loaded" body="Your request is still preserved. Refresh to recover the latest confirmed status." onRetry={() => void orderQuery.refetch()} />;
  const order = orderQuery.data;
  const state = customerState(order.status);
  const steps = ['Requested', 'Waiter confirming', 'Accepted', 'Preparing', 'Ready to serve', 'Served'];
  return (
    <div className="page-stack order-tracking">
      <TableContextBanner><Badge tone={state.tone}>{order.publicNumber}</Badge></TableContextBanner>
      <Surface className="tracking-hero">
        <p className="eyebrow">{state.eyebrow}</p>
        <h1>{state.title}</h1>
        <p><strong>Table {order.tableLabel?.replace(/table\s*/i, '') ?? '12'} · Current estimate 20–30 min</strong></p>
        <p>{state.body}</p>
      </Surface>
      <Surface><h2>Round {order.roundNumber ?? 1}</h2><ol className="status-timeline">{steps.map((step, index) => <li className={index <= state.step ? 'is-complete' : ''} key={step}><span aria-hidden="true">{index < state.step ? '✓' : index === state.step ? '●' : '○'}</span><span><strong>{step}</strong>{index === state.step ? <small>Current</small> : null}</span></li>)}</ol></Surface>
      {(order.status === 'NEEDS_CLARIFICATION' || order.status === 'REJECTED') ? <div className="service-action-grid"><ButtonLink to="/dine-in/cart">Review Order</ButtonLink><ButtonLink variant="secondary" to="/dine-in/service">Call Waiter</ButtonLink></div> : null}
      {order.status === 'SERVED' ? <div className="service-action-grid"><Button type="button" onClick={() => { clearCart('DINE_IN'); trackCustomerEvent('order_more_clicked', { tableSessionId: order.tableSessionId }); navigate('/dine-in/menu'); }}>Order More</Button><ButtonLink variant="secondary" to="/dine-in/bill">View Current Bill</ButtonLink></div> : null}
    </div>
  );
}

export function DineInBillPage() {
  useScenarioFromUrl();
  const queryClient = useQueryClient();
  const billQuery = useQuery({ queryKey: queryKeys.tableBill(), queryFn: getDineInBill });
  const mutation = useMutation({
    mutationFn: () => requestDineInBill(crypto.randomUUID()),
    onSuccess: (bill) => {
      queryClient.setQueryData(queryKeys.tableBill(), bill);
      trackCustomerEvent('bill_requested', { billId: bill.id, tableSessionId: bill.tableSessionId });
    },
  });
  if (billQuery.isPending) return <PageSkeleton label="current table bill" />;
  if (billQuery.isError || !billQuery.data) return <ErrorState title="Current bill could not be loaded" body="Ask your waiter for help. You cannot settle or mark a bill paid from this screen." />;
  const bill = billQuery.data;
  const orderIds = [...new Set(bill.lines.map((line) => line.orderId))];
  return (
    <div className="page-stack">
      <TableContextBanner><Badge tone={bill.status === 'BILL_REQUESTED' ? 'warning' : 'neutral'}>{formatCustomerState(bill.status)}</Badge></TableContextBanner>
      <PageHeader eyebrow="Read-only estimate" title="Current table bill" description="Staff finalizes and records payment after service. This screen cannot mark the bill paid." />
      {orderIds.map((orderId, index) => <Surface key={orderId}><h2>Round {index + 1}</h2><ul className="review-list">{bill.lines.filter((line) => line.orderId === orderId).map((line) => <li key={line.id}><span>{line.quantity} × {line.snapshotName}</span><strong>{formatMoney(line.lineTotal)}</strong></li>)}</ul></Surface>)}
      <Surface className="commerce-summary"><h2>Current total</h2><dl><div><dt>Subtotal</dt><dd>{formatMoney(bill.subtotal)}</dd></div>{bill.tax.amount ? <div><dt>Tax</dt><dd>{formatMoney(bill.tax)}</dd></div> : null}{bill.serviceCharge.amount ? <div><dt>Service charge</dt><dd>{formatMoney(bill.serviceCharge)}</dd></div> : null}<div className="commerce-summary__total"><dt>Estimated total</dt><dd>{formatMoney(bill.grandTotal)}</dd></div></dl></Surface>
      {bill.status === 'BILL_REQUESTED' || mutation.isSuccess ? <Surface className="state-card"><Badge tone="success">Bill Requested</Badge><h2>Staff has been notified.</h2><p>New customer rounds pause unless staff reopens the session.</p></Surface> : <Button type="button" disabled={mutation.isPending} onClick={() => mutation.mutate()}>{mutation.isPending ? 'Requesting…' : 'Request Bill'}</Button>}
    </div>
  );
}

export function DineInServicePage() {
  const mutation = useMutation({ mutationFn: () => createServiceRequest('CALL_WAITER', crypto.randomUUID()) });
  return (
    <div className="page-stack"><TableContextBanner /><PageHeader eyebrow="Table service" title="Need help?" description="This creates one active service request; repeated taps do not create a new operational request." /><Surface className="state-card"><Button type="button" disabled={mutation.isPending || mutation.isSuccess} onClick={() => mutation.mutate()}>{mutation.isPending ? 'Notifying…' : mutation.isSuccess ? 'Waiter notified' : 'Call Waiter'}</Button>{mutation.isSuccess ? <p role="status">Your waiter has been notified.</p> : null}</Surface></div>
  );
}

export function DineInShellPage({ title, guidance }: { title: string; guidance: string }) {
  return <div className="page-stack"><TableContextBanner /><Surface className="state-card"><h1>{title}</h1><p>{guidance}</p></Surface></div>;
}

export function DineInWrongTablePage() {
  return <ErrorState title="Table could not be confirmed" body="Scan the QR at your current table. A typed table number is not accepted." onRetry={() => { window.location.assign('/dine-in/start'); }} />;
}

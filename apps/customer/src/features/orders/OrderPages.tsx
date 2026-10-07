import { getLeague, getLoyaltyAccount, getMissions, getOrder, getPassportProgress, listOrders } from '@pizza-avenue/api-client';
import type { Order, OrderStatus } from '@pizza-avenue/types';
import { formatMoney, queryKeys } from '@pizza-avenue/utils';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { trackCustomerEvent } from '../../shared/analytics/analytics';
import { Badge, ButtonLink, ErrorState, PageHeader, PageSkeleton, Surface } from '../../shared/components/Primitives';
import { usePrototypeStore } from '../../shared/state/prototype-store';
import { useScenarioFromUrl } from '../../shared/state/use-scenario-from-url';

const pickupSteps: OrderStatus[] = ['CONFIRMED', 'PREPARING', 'READY_FOR_PICKUP', 'PICKED_UP', 'COMPLETED'];

function pickupStatusContent(order: Order, delayed: boolean) {
  if (order.status === 'READY_FOR_PICKUP') return { title: 'Ready for Pickup', body: 'Head to Pizza Avenue and show pickup code 4182 at the counter.', action: 'Collect your order' };
  if (order.status === 'PICKED_UP') return { title: 'Picked up', body: 'Your order was handed over. We’re completing the final checks.', action: 'Enjoy your pizza' };
  if (order.status === 'COMPLETED') return { title: 'Completed', body: 'This pickup is complete. Your eligible loyalty progress is processed by the server.', action: 'Order again when ready' };
  if (order.status === 'PREPARING') return { title: delayed ? 'Preparing · updated time' : 'Preparing', body: delayed ? 'The kitchen needs a little longer. Your new ready time is shown below.' : 'You don’t need to leave yet. We’ll notify you when it’s ready.', action: 'Wait for Ready for Pickup' };
  return { title: 'Confirmed', body: 'Payment is verified and the kitchen has your order.', action: 'We’ll start preparing shortly' };
}

function OrderCard({ order }: { order: Order }) {
  return (
    <Link className="surface order-list-card" to={'/orders/' + order.id}>
      <span><strong>{order.publicNumber}</strong><small>{order.serviceMode === 'DINE_IN' ? order.tableLabel : 'Pickup'} · {order.items.length} item</small></span>
      <span><Badge>{order.status.replaceAll('_', ' ')}</Badge><strong>{formatMoney(order.total)}</strong></span>
    </Link>
  );
}

export function OrdersPage() {
  const ordersQuery = useQuery({ queryKey: queryKeys.orders(), queryFn: listOrders });
  if (ordersQuery.isPending) return <PageSkeleton label="orders" />;
  if (ordersQuery.isError) return <ErrorState title="Orders could not be loaded" body="Try again to recover the latest server state." onRetry={() => void ordersQuery.refetch()} />;
  const active = ordersQuery.data.items.filter((order) => !['COMPLETED', 'CANCELLED', 'REJECTED'].includes(order.status));
  const history = ordersQuery.data.items.filter((order) => ['COMPLETED', 'CANCELLED', 'REJECTED'].includes(order.status));
  return (
    <div className="page-stack">
      <PageHeader eyebrow="Your orders" title="What’s happening now" description="Pickup and Dine-in orders remain separate and can be active at the same time." />
      <section className="page-stack"><h2>Active</h2>{active.map((order) => <OrderCard key={order.id} order={order} />)}</section>
      {history.length ? <section className="page-stack"><h2>History</h2>{history.map((order) => <OrderCard key={order.id} order={order} />)}</section> : null}
    </div>
  );
}

export function OrderDetailPage() {
  useScenarioFromUrl();
  const { orderId = '' } = useParams();
  const orderScenario = usePrototypeStore((state) => state.scenarioState.order);
  const orderQuery = useQuery({
    queryKey: queryKeys.order(orderId),
    queryFn: () => getOrder(orderId),
    enabled: Boolean(orderId),
    refetchOnWindowFocus: true,
  });
  const completedPickup = orderQuery.data?.serviceMode === 'PICKUP' && orderQuery.data.status === 'COMPLETED';
  const loyaltyQuery = useQuery({ queryKey: queryKeys.loyalty(), queryFn: getLoyaltyAccount, enabled: completedPickup });
  const passportQuery = useQuery({ queryKey: queryKeys.passport(), queryFn: getPassportProgress, enabled: completedPickup });
  const missionsQuery = useQuery({ queryKey: queryKeys.missions(), queryFn: getMissions, enabled: completedPickup });
  const leagueQuery = useQuery({ queryKey: queryKeys.league(), queryFn: getLeague, enabled: completedPickup });
  useEffect(() => {
    if (orderQuery.data) trackCustomerEvent('order_tracking_viewed', { orderId: orderQuery.data.id, serviceMode: orderQuery.data.serviceMode });
  }, [orderQuery.data]);
  if (orderScenario === 'PICKUP_STATUS_UNAVAILABLE') {
    return <ErrorState title="Live status is temporarily unavailable" body="Your confirmed order is still safe. Reconnect and refresh to recover the latest server state." onRetry={() => void orderQuery.refetch()} />;
  }
  if (orderQuery.isPending) return <PageSkeleton label="order tracking" />;
  if (orderQuery.isError || !orderQuery.data) return <ErrorState title="Order could not be loaded" body="Check your connection and try again. We never infer operational state from a stale screen." onRetry={() => void orderQuery.refetch()} />;
  const order = orderQuery.data;
  if (order.serviceMode === 'DINE_IN') return <ErrorState title="Open this order from your table" body="Dine-in tracking stays in its table context." />;
  const delayed = orderScenario === 'PICKUP_DELAYED';
  const content = pickupStatusContent(order, delayed);
  const currentIndex = Math.max(0, pickupSteps.indexOf(order.status));
  return (
    <div className="page-stack order-tracking">
      <Surface className="tracking-hero">
        <Badge tone={order.status === 'READY_FOR_PICKUP' ? 'success' : delayed ? 'warning' : 'neutral'}>{order.status.replaceAll('_', ' ')}</Badge>
        <h1>{content.title}</h1>
        {delayed ? <p><span className="muted">Previous ETA: 7:45 PM</span><br /><strong>New ETA: 8:30 PM</strong></p> : <p><strong>Ready around 7:45 PM</strong></p>}
        <p>{content.body}</p>
        <strong>{content.action}</strong>
      </Surface>
      <Surface>
        <h2>Order progress</h2>
        <ol className="status-timeline">
          {pickupSteps.map((step, index) => (
            <li className={index <= currentIndex ? 'is-complete' : ''} key={step}>
              <span aria-hidden="true">{index < currentIndex ? '✓' : index === currentIndex ? '●' : '○'}</span>
              <span><strong>{step.replaceAll('_', ' ')}</strong>{index === currentIndex ? <small>Current</small> : null}</span>
            </li>
          ))}
        </ol>
      </Surface>
      {order.status === 'READY_FOR_PICKUP' ? (
        <Surface className="pickup-code">
          <p className="eyebrow">Pickup code</p>
          <strong>4182</strong>
          <p>Pizza Avenue · Sainikpuri</p>
        </Surface>
      ) : null}
      <Surface>
        <h2>{order.publicNumber}</h2>
        {order.items.map((item) => <p key={item.id}>{item.quantity} × {item.productNameSnapshot} · {item.variantNameSnapshot}</p>)}
        <strong>Total {formatMoney(order.total)}</strong>
      </Surface>
      {order.status === 'COMPLETED' && loyaltyQuery.data && passportQuery.data && missionsQuery.data ? <Surface className="post-order-retention"><Badge tone="success">Progress updated</Badge><h2>Your visit counted</h2><div className="post-order-retention__stats"><span><strong>{loyaltyQuery.data.pointsBalance}</strong><small>Points balance</small></span><span><strong>{passportQuery.data.completedItemIds.length}/{passportQuery.data.program.items.length}</strong><small>Passport</small></span><span><strong>{missionsQuery.data.avenueXp}</strong><small>Avenue XP</small></span>{leagueQuery.data?.optedIn ? <span><strong>{leagueQuery.data.currentTier.replaceAll('_', ' ')}</strong><small>{leagueQuery.data.currentRank ? `#${leagueQuery.data.currentRank} this season` : 'League progress'}</small></span> : null}</div><ButtonLink to="/rewards" variant="secondary">View Your Avenue</ButtonLink></Surface> : null}
      <ButtonLink variant="secondary" to="/orders">All orders</ButtonLink>
    </div>
  );
}

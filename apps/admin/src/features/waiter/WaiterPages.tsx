import {
  getWaiterOrder,
  getWaiterTable,
  listWaiterOrderRequests,
  listWaiterServiceRequests,
  listWaiterTables,
} from '@pizza-avenue/api-client';
import { RoutePlaceholder } from '@pizza-avenue/ui';
import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';

export function WaiterDashboardPage() {
  const requests = useQuery({ queryKey: ['waiter', 'requests'], queryFn: listWaiterOrderRequests });
  const tables = useQuery({ queryKey: ['waiter', 'tables'], queryFn: listWaiterTables });
  if (requests.isPending || tables.isPending) return <p role="status">Loading waiter operations…</p>;
  if (requests.isError || tables.isError) return <p role="alert">Waiter operations could not be loaded.</p>;
  return (
    <RoutePlaceholder title="Waiter dashboard">
      <p>New order requests: {requests.data.length}</p>
      <p>Active tables: {tables.data.length}</p>
      <Link to="/staff/waiter/requests">Review order requests</Link>
      <Link to="/staff/waiter/ready">Ready to Serve</Link>
      <Link to="/staff/waiter/bill-requests">Bill Requests</Link>
    </RoutePlaceholder>
  );
}

export function WaiterRequestsPage() {
  const query = useQuery({ queryKey: ['waiter', 'requests'], queryFn: listWaiterOrderRequests });
  if (query.isPending) return <p role="status">Loading order requests…</p>;
  if (query.isError) return <p role="alert">Order requests could not be loaded.</p>;
  return (
    <RoutePlaceholder title="New order requests">
      {query.data.map((order) => (
        <p key={order.id}>
          {order.tableLabel} · Round {order.roundNumber} · <Link to={`/staff/waiter/requests/${order.id}`}>Review</Link>
        </p>
      ))}
    </RoutePlaceholder>
  );
}

export function WaiterRequestDetailPage() {
  const { orderId = '' } = useParams();
  const query = useQuery({
    queryKey: ['waiter', 'orders', orderId],
    queryFn: () => getWaiterOrder(orderId),
    enabled: Boolean(orderId),
  });
  if (query.isPending) return <p role="status">Loading order request…</p>;
  if (query.isError) return <p role="alert">Order request could not be loaded.</p>;
  return (
    <RoutePlaceholder title={`Review ${query.data.publicNumber}`}>
      <p>{query.data.tableLabel} · Round {query.data.roundNumber}</p>
      <p>Actions: Confirm &amp; Send to Kitchen · Needs Clarification · Reject Order.</p>
      <p>Customer-requested items cannot be silently edited.</p>
    </RoutePlaceholder>
  );
}

export function WaiterTablesPage() {
  const query = useQuery({ queryKey: ['waiter', 'tables'], queryFn: listWaiterTables });
  if (query.isPending) return <p role="status">Loading active tables…</p>;
  if (query.isError) return <p role="alert">Active tables could not be loaded.</p>;
  return (
    <RoutePlaceholder title="Active tables">
      {query.data.map((session) => (
        <p key={session.id}><Link to={`/staff/waiter/tables/${session.id}`}>{session.tableLabel}</Link> · {session.status}</p>
      ))}
    </RoutePlaceholder>
  );
}

export function WaiterTableDetailPage() {
  const { sessionId = '' } = useParams();
  const query = useQuery({
    queryKey: ['waiter', 'tables', sessionId],
    queryFn: () => getWaiterTable(sessionId),
    enabled: Boolean(sessionId),
  });
  if (query.isPending) return <p role="status">Loading table detail…</p>;
  if (query.isError) return <p role="alert">Table detail could not be loaded.</p>;
  return (
    <RoutePlaceholder title={query.data.session.tableLabel}>
      <p>Session {query.data.session.id} · {query.data.orders.length} rounds · Bill {query.data.bill.status}</p>
    </RoutePlaceholder>
  );
}

export function WaiterServiceRequestsPage() {
  const query = useQuery({ queryKey: ['waiter', 'service-requests'], queryFn: listWaiterServiceRequests });
  if (query.isPending) return <p role="status">Loading service requests…</p>;
  if (query.isError) return <p role="alert">Service requests could not be loaded.</p>;
  return <RoutePlaceholder title="Service requests"><p>Open requests: {query.data.length}</p></RoutePlaceholder>;
}

export function WaiterShellPage({ title, guidance }: { title: string; guidance: string }) {
  return <RoutePlaceholder title={title}><p>{guidance}</p></RoutePlaceholder>;
}

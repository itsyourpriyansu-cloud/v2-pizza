import { getOrder, listOrders } from '@pizza-avenue/api-client';
import { RoutePlaceholder } from '@pizza-avenue/ui';
import { queryKeys } from '@pizza-avenue/utils';
import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';

export function OrdersPage() {
  const ordersQuery = useQuery({ queryKey: queryKeys.orders(), queryFn: listOrders });
  if (ordersQuery.isPending) return <p role="status">Loading orders…</p>;
  if (ordersQuery.isError) return <p role="alert">Orders could not be loaded.</p>;
  return (
    <RoutePlaceholder title="Orders">
      <ul>
        {ordersQuery.data.items.map((order) => (
          <li key={order.id}>
            <Link to={`/orders/${order.id}`}>{order.publicNumber}</Link> — {order.status}
          </li>
        ))}
      </ul>
    </RoutePlaceholder>
  );
}

export function OrderDetailPage() {
  const { orderId = '' } = useParams();
  const orderQuery = useQuery({
    queryKey: queryKeys.order(orderId),
    queryFn: () => getOrder(orderId),
    enabled: Boolean(orderId),
  });
  if (orderQuery.isPending) return <p role="status">Loading order…</p>;
  if (orderQuery.isError) return <p role="alert">Order could not be loaded.</p>;
  return (
    <RoutePlaceholder title={orderQuery.data.publicNumber}>
      <p>Canonical state: {orderQuery.data.status}</p>
    </RoutePlaceholder>
  );
}

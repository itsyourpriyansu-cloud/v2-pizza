import { listKdsOrders } from '@pizza-avenue/api-client';
import { AppShell, RouteError, RoutePlaceholder } from '@pizza-avenue/ui';
import { queryKeys } from '@pizza-avenue/utils';
import { useQuery } from '@tanstack/react-query';
import {
  createBrowserRouter,
  createMemoryRouter,
  Link,
  Outlet,
  useParams,
  type RouteObject,
} from 'react-router-dom';

function KdsLayout() {
  return (
    <AppShell
      title="Pizza Avenue — KDS Foundation"
      navigation={
        <>
          <Link to="/kds">KDS</Link>
          <Link to="/kds/orders">Orders</Link>
          <Link to="/kds/login">Login</Link>
        </>
      }
    >
      <Outlet />
    </AppShell>
  );
}

function KdsOrdersPage() {
  const ordersQuery = useQuery({
    queryKey: queryKeys.kdsOrders(),
    queryFn: listKdsOrders,
  });
  if (ordersQuery.isPending) return <p role="status">Loading KDS orders…</p>;
  if (ordersQuery.isError) return <p role="alert">KDS orders could not be loaded.</p>;
  return (
    <RoutePlaceholder title="KDS orders">
      <ul>
        {ordersQuery.data.map((order) => (
          <li key={order.id}>
            <Link to={`/kds/orders/${order.id}`}>{order.publicNumber}</Link> — {order.status}
          </li>
        ))}
      </ul>
    </RoutePlaceholder>
  );
}

function KdsOrderDetailPage() {
  const { orderId } = useParams();
  return <RoutePlaceholder title={`KDS order ${orderId ?? ''}`} />;
}

export const kdsRoutes: RouteObject[] = [
  {
    path: '/kds',
    element: <KdsLayout />,
    errorElement: <RouteError />,
    children: [
      { index: true, element: <RoutePlaceholder title="KDS home" /> },
      { path: 'login', element: <RoutePlaceholder title="KDS login" /> },
      { path: 'orders', element: <KdsOrdersPage /> },
      { path: 'orders/:orderId', element: <KdsOrderDetailPage /> },
      { path: '*', element: <RoutePlaceholder title="KDS route not found" /> },
    ],
  },
];

export const kdsRouter = createBrowserRouter(kdsRoutes);

export function createKdsMemoryRouter(initialEntries: string[] = ['/kds']) {
  return createMemoryRouter(kdsRoutes, { initialEntries });
}

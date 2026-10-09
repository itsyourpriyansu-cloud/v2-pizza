import { listKdsOrders } from '@pizza-avenue/api-client';
import { AppShell, RouteError, RoutePlaceholder } from '@pizza-avenue/ui';
import { queryKeys } from '@pizza-avenue/utils';
import { useQuery } from '@tanstack/react-query';
import type { ServiceMode } from '@pizza-avenue/types';
import {
  createBrowserRouter,
  createMemoryRouter,
  Link,
  NavLink,
  Outlet,
  useParams,
  type RouteObject,
} from 'react-router-dom';

function KdsLayout() {
  return (
    <AppShell
      title="Kitchen display"
      className="app-shell--kds"
      navigation={
        <>
          <NavLink to="/" end>Overview</NavLink>
          <NavLink to="/orders" end>Orders</NavLink>
          <NavLink to="/orders/pickup" end>Pickup</NavLink>
          <NavLink to="/orders/dine-in" end>Dine In</NavLink>
          <NavLink to="/login">Login</NavLink>
        </>
      }
    >
      <Outlet />
    </AppShell>
  );
}

function KdsOrdersPage({ serviceMode }: { serviceMode?: ServiceMode }) {
  const ordersQuery = useQuery({
    queryKey: queryKeys.kdsOrders(serviceMode),
    queryFn: () => listKdsOrders(serviceMode),
  });
  if (ordersQuery.isPending) return <p role="status">Loading KDS orders…</p>;
  if (ordersQuery.isError) return <p role="alert">KDS orders could not be loaded.</p>;
  return (
    <RoutePlaceholder title={`${serviceMode ?? 'All'} KDS orders`}>
      <p>Pickup appears only after verified payment. Dine-in appears only after waiter confirmation.</p>
      <ul>
        {ordersQuery.data.map((order) => (
          <li key={order.id}>
            <Link to={`/orders/${order.id}`}>{order.publicNumber}</Link> — {order.serviceMode} — {order.status}
          </li>
        ))}
      </ul>
    </RoutePlaceholder>
  );
}

function KdsOrderDetailPage() {
  const { orderId } = useParams();
  return (
    <RoutePlaceholder title={`KDS order ${orderId ?? ''}`}>
      <p>Ticket renders service mode, Pickup promise or Dine-in table/round, elapsed time, waiter, items and modifiers.</p>
    </RoutePlaceholder>
  );
}

export const kdsRoutes: RouteObject[] = [
  {
    path: '/',
    element: <KdsLayout />,
    errorElement: <RouteError />,
    children: [
      { index: true, element: <RoutePlaceholder title="KDS home" /> },
      { path: 'login', element: <RoutePlaceholder title="KDS login" /> },
      { path: 'orders', element: <KdsOrdersPage /> },
      { path: 'orders/pickup', element: <KdsOrdersPage serviceMode="PICKUP" /> },
      { path: 'orders/dine-in', element: <KdsOrdersPage serviceMode="DINE_IN" /> },
      { path: 'orders/:orderId', element: <KdsOrderDetailPage /> },
      { path: '*', element: <RoutePlaceholder title="KDS route not found" /> },
    ],
  },
];

export const kdsRouter = createBrowserRouter(kdsRoutes);

export function createKdsMemoryRouter(initialEntries: string[] = ['/']) {
  return createMemoryRouter(kdsRoutes, { initialEntries });
}

import { AppShell, RouteError, RoutePlaceholder } from '@pizza-avenue/ui';
import {
  createBrowserRouter,
  createMemoryRouter,
  NavLink,
  Outlet,
  type RouteObject,
} from 'react-router-dom';
import {
  WaiterDashboardPage,
  WaiterRequestDetailPage,
  WaiterRequestsPage,
  WaiterServiceRequestsPage,
  WaiterShellPage,
  WaiterTableDetailPage,
  WaiterTablesPage,
} from '../features/waiter/WaiterPages';
import {
  BillDetailPage,
  BillingShellPage,
  OpenBillsPage,
} from '../features/billing/BillingPages';

function AdminLayout() {
  const links = [
    ['Overview', '/'],
    ['Orders', '/orders'],
    ['Menu', '/menu'],
    ['Availability', '/availability'],
    ['Pickup', '/pickup'],
    ['Loyalty', '/loyalty'],
    ['Passport', '/passport'],
    ['Analytics', '/analytics'],
    ['Staff', '/staff'],
    ['Waiter', '/staff/waiter'],
    ['Billing', '/billing'],
    ['Tables', '/tables'],
    ['Settings', '/settings'],
  ] as const;
  return (
    <AppShell
      title="Admin & service"
      className="app-shell--admin"
      navigation={links.map(([label, href]) => (
        <NavLink key={href} to={href} end>{label}</NavLink>
      ))}
    >
      <Outlet />
    </AppShell>
  );
}

const placeholder = (title: string) => <RoutePlaceholder title={title} />;

export const adminRoutes: RouteObject[] = [
  {
    path: '/',
    element: <AdminLayout />,
    errorElement: <RouteError />,
    children: [
      { index: true, element: placeholder('Admin overview') },
      { path: 'login', element: placeholder('Admin login') },
      { path: 'orders', element: placeholder('Admin orders') },
      { path: 'menu', element: placeholder('Menu administration') },
      { path: 'availability', element: placeholder('Availability controls') },
      { path: 'pickup', element: placeholder('Pickup capacity') },
      { path: 'loyalty', element: placeholder('Loyalty administration') },
      { path: 'passport', element: placeholder('Passport administration') },
      { path: 'analytics', element: placeholder('Analytics') },
      { path: 'staff', element: placeholder('Staff administration') },
      { path: 'staff/waiter', element: <WaiterDashboardPage /> },
      { path: 'staff/waiter/requests', element: <WaiterRequestsPage /> },
      { path: 'staff/waiter/requests/:orderId', element: <WaiterRequestDetailPage /> },
      { path: 'staff/waiter/tables', element: <WaiterTablesPage /> },
      { path: 'staff/waiter/tables/:sessionId', element: <WaiterTableDetailPage /> },
      { path: 'staff/waiter/ready', element: <WaiterShellPage title="Ready to Serve" guidance="Dine-in fulfillment queue; Waiter can mark served but cannot settle payment." /> },
      { path: 'staff/waiter/service-requests', element: <WaiterServiceRequestsPage /> },
      { path: 'staff/waiter/bill-requests', element: <WaiterShellPage title="Bill requests" guidance="Requests may be forwarded to Admin; unresolved orders block finalization." /> },
      { path: 'staff/waiter/assisted-order', element: <WaiterShellPage title="Staff-assisted order" guidance="Architecture-ready and auditable; only verified customer identity receives loyalty." /> },
      { path: 'billing', element: <OpenBillsPage /> },
      { path: 'billing/open', element: <OpenBillsPage /> },
      { path: 'billing/:billId', element: <BillDetailPage /> },
      { path: 'billing/:billId/finalize', element: <BillingShellPage title="Finalize bill" guidance="Blocked while waiter review, preparation, Ready to Serve, or void work remains." /> },
      { path: 'billing/:billId/payment', element: <BillingShellPage title="Take payment" guidance="Admin/Counter only: Cash, UPI, Card, or another approved method." /> },
      { path: 'payments', element: <BillingShellPage title="Payments" guidance="Table-bill and order payment targets share one payment architecture." /> },
      { path: 'tables', element: <BillingShellPage title="Live tables" guidance="Table state summarizes the session rather than one order." /> },
      { path: 'settings', element: placeholder('Settings') },
      { path: '*', element: placeholder('Admin route not found') },
    ],
  },
];

export const adminRouter = createBrowserRouter(adminRoutes);

export function createAdminMemoryRouter(initialEntries: string[] = ['/']) {
  return createMemoryRouter(adminRoutes, { initialEntries });
}

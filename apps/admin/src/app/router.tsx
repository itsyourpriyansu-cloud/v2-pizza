import { AppShell, RouteError, RoutePlaceholder } from '@pizza-avenue/ui';
import {
  createBrowserRouter,
  createMemoryRouter,
  Link,
  Outlet,
  type RouteObject,
} from 'react-router-dom';

function AdminLayout() {
  const links = [
    ['Orders', '/orders'],
    ['Menu', '/menu'],
    ['Availability', '/availability'],
    ['Pickup', '/pickup'],
    ['Loyalty', '/loyalty'],
    ['Passport', '/passport'],
    ['Analytics', '/analytics'],
    ['Staff', '/staff'],
    ['Settings', '/settings'],
  ] as const;
  return (
    <AppShell
      title="Pizza Avenue — Admin Foundation"
      navigation={links.map(([label, href]) => (
        <Link key={href} to={href}>{label}</Link>
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
      { path: 'settings', element: placeholder('Settings') },
      { path: '*', element: placeholder('Admin route not found') },
    ],
  },
];

export const adminRouter = createBrowserRouter(adminRoutes);

export function createAdminMemoryRouter(initialEntries: string[] = ['/']) {
  return createMemoryRouter(adminRoutes, { initialEntries });
}

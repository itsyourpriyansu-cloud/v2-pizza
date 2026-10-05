import {
  createBrowserRouter,
  createMemoryRouter,
  type RouteObject,
} from 'react-router-dom';
import { RouteError } from '@pizza-avenue/ui';
import { CustomerLayout } from './layout';
import {
  AuthMagicPage,
  AuthOtpPage,
  AuthPage,
  AuthWhatsAppPage,
  CartPage,
  CheckoutPage,
  CheckoutPickupPage,
  HomePage,
  MenuPage,
  NotFoundPage,
  OrderDetailPage,
  OrdersPage,
  PassportPage,
  PaymentFailurePage,
  PaymentPage,
  PaymentSuccessPage,
  ProductPage,
  ProfilePage,
  RewardsPage,
} from '../routes';

export const customerRoutes: RouteObject[] = [
  {
    path: '/',
    element: <CustomerLayout />,
    errorElement: <RouteError />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'menu', element: <MenuPage /> },
      { path: 'menu/:productId', element: <ProductPage /> },
      { path: 'cart', element: <CartPage /> },
      { path: 'checkout', element: <CheckoutPage /> },
      { path: 'checkout/pickup', element: <CheckoutPickupPage /> },
      { path: 'auth', element: <AuthPage /> },
      { path: 'auth/otp', element: <AuthOtpPage /> },
      { path: 'auth/whatsapp', element: <AuthWhatsAppPage /> },
      { path: 'auth/magic', element: <AuthMagicPage /> },
      { path: 'payment', element: <PaymentPage /> },
      { path: 'payment/success', element: <PaymentSuccessPage /> },
      { path: 'payment/failure', element: <PaymentFailurePage /> },
      { path: 'orders', element: <OrdersPage /> },
      { path: 'orders/:orderId', element: <OrderDetailPage /> },
      { path: 'rewards', element: <RewardsPage /> },
      { path: 'passport', element: <PassportPage /> },
      { path: 'profile', element: <ProfilePage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
];

export const customerRouter = createBrowserRouter(customerRoutes);

export function createCustomerMemoryRouter(initialEntries: string[] = ['/']) {
  return createMemoryRouter(customerRoutes, { initialEntries });
}

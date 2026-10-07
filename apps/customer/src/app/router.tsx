import { lazy, Suspense, type ComponentType, type ReactElement } from 'react';
import { createBrowserRouter, createMemoryRouter, Navigate, type RouteObject } from 'react-router-dom';
import { RouteError, RoutePending } from '@pizza-avenue/ui';
import { CustomerLayout } from './layout';
import { HomePage } from '../features/home/HomePage';
import { NotFoundPage } from '../routes/NotFoundPage';

function lazyNamed<P = Record<string, never>>(loader: () => Promise<Record<string, unknown>>, name: string) {
  return lazy(async () => ({ default: (await loader())[name] as ComponentType<P> }));
}

function pending(element: ReactElement) {
  return <Suspense fallback={<RoutePending />}>{element}</Suspense>;
}

const MenuPage = lazyNamed(() => import('../features/menu/MenuPage'), 'MenuPage');
const SearchPage = lazyNamed(() => import('../features/search/SearchPage'), 'SearchPage');
const ProductPage = lazyNamed(() => import('../features/product/ProductPage'), 'ProductPage');
const ProductBuilderPage = lazyNamed(() => import('../features/product/ProductBuilderPage'), 'ProductBuilderPage');
const CartPage = lazyNamed(() => import('../features/cart/CartPage'), 'CartPage');
const CheckoutPage = lazyNamed(() => import('../features/checkout/CheckoutPages'), 'CheckoutPage');
const CheckoutPickupPage = lazyNamed(() => import('../features/checkout/CheckoutPages'), 'CheckoutPickupPage');
const AuthPage = lazyNamed(() => import('../features/auth/AuthPages'), 'AuthPage');
const AuthOtpPage = lazyNamed(() => import('../features/auth/AuthPages'), 'AuthOtpPage');
const AuthWhatsAppPage = lazyNamed(() => import('../features/auth/AuthPages'), 'AuthWhatsAppPage');
const AuthMagicPage = lazyNamed(() => import('../features/auth/AuthPages'), 'AuthMagicPage');
const PaymentPage = lazyNamed(() => import('../features/payment/PaymentPages'), 'PaymentPage');
const PaymentCheckingPage = lazyNamed(() => import('../features/payment/PaymentPages'), 'PaymentCheckingPage');
const PaymentSuccessPage = lazyNamed(() => import('../features/payment/PaymentPages'), 'PaymentSuccessPage');
const PaymentFailurePage = lazyNamed(() => import('../features/payment/PaymentPages'), 'PaymentFailurePage');
const OrdersPage = lazyNamed(() => import('../features/orders/OrderPages'), 'OrdersPage');
const OrderDetailPage = lazyNamed(() => import('../features/orders/OrderPages'), 'OrderDetailPage');
const DineInStartPage = lazyNamed(() => import('../features/dine-in/DineInPages'), 'DineInStartPage');
const DineInHomePage = lazyNamed(() => import('../features/dine-in/DineInPages'), 'DineInHomePage');
const DineInReviewPage = lazyNamed(() => import('../features/dine-in/DineInPages'), 'DineInReviewPage');
const DineInOrderPage = lazyNamed(() => import('../features/dine-in/DineInPages'), 'DineInOrderPage');
const DineInBillPage = lazyNamed(() => import('../features/dine-in/DineInPages'), 'DineInBillPage');
const DineInServicePage = lazyNamed(() => import('../features/dine-in/DineInPages'), 'DineInServicePage');
const DineInShellPage = lazyNamed<{ title: string; guidance: string }>(() => import('../features/dine-in/DineInPages'), 'DineInShellPage');
const DineInWrongTablePage = lazyNamed(() => import('../features/dine-in/DineInPages'), 'DineInWrongTablePage');
const RewardsPage = lazyNamed(() => import('../features/loyalty/RewardsPage'), 'RewardsPage');
const PassportPage = lazyNamed(() => import('../features/passport/PassportPage'), 'PassportPage');
const MissionsPage = lazyNamed(() => import('../features/missions/MissionsPage'), 'MissionsPage');
const ProfilePage = lazyNamed(() => import('../features/profile/ProfilePage'), 'ProfilePage');

export const customerRoutes: RouteObject[] = [
  {
    path: '/',
    element: <CustomerLayout />,
    errorElement: <RouteError />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'menu', element: pending(<MenuPage />) },
      { path: 'search', element: pending(<SearchPage />) },
      { path: 'menu/:productId', element: pending(<ProductPage />) },
      { path: 'menu/:productId/customize', element: pending(<ProductBuilderPage />) },
      { path: 'cart', element: pending(<CartPage />) },
      { path: 'checkout', element: pending(<CheckoutPage />) },
      { path: 'checkout/pickup', element: pending(<CheckoutPickupPage />) },
      { path: 'dine-in/start', element: pending(<DineInStartPage />) },
      { path: 'dine-in/table', element: pending(<DineInShellPage title="Confirm your table" guidance="Confirm the server-resolved table context before ordering." />) },
      { path: 'dine-in', element: pending(<DineInHomePage />) },
      { path: 'dine-in/menu', element: pending(<MenuPage />) },
      { path: 'dine-in/search', element: pending(<SearchPage />) },
      { path: 'dine-in/menu/:productId', element: pending(<ProductPage />) },
      { path: 'dine-in/menu/:productId/customize', element: pending(<ProductBuilderPage />) },
      { path: 'dine-in/cart', element: pending(<CartPage />) },
      { path: 'dine-in/review', element: pending(<DineInReviewPage />) },
      { path: 'dine-in/orders/:orderId', element: pending(<DineInOrderPage />) },
      { path: 'dine-in/orders/:orderId/clarification', element: pending(<DineInOrderPage />) },
      { path: 'dine-in/orders/:orderId/rejected', element: pending(<DineInOrderPage />) },
      { path: 'dine-in/orders/:orderId/accepted', element: pending(<DineInOrderPage />) },
      { path: 'dine-in/orders/:orderId/preparing', element: pending(<DineInOrderPage />) },
      { path: 'dine-in/orders/:orderId/ready-to-serve', element: pending(<DineInOrderPage />) },
      { path: 'dine-in/orders/:orderId/served', element: pending(<DineInOrderPage />) },
      { path: 'dine-in/order-more', element: pending(<MenuPage />) },
      { path: 'dine-in/bill', element: pending(<DineInBillPage />) },
      { path: 'dine-in/bill/request', element: pending(<DineInBillPage />) },
      { path: 'dine-in/service', element: pending(<DineInServicePage />) },
      { path: 'dine-in/session-complete', element: pending(<DineInShellPage title="Table session complete" guidance="Payment was handled by staff and the table session is closed." />) },
      { path: 'dine-in/expired', element: pending(<DineInShellPage title="Your previous table session has ended" guidance="Scan the current table QR or choose Pickup." />) },
      { path: 'dine-in/wrong-table', element: pending(<DineInWrongTablePage />) },
      { path: 'auth', element: pending(<AuthPage />) },
      { path: 'auth/otp', element: pending(<AuthOtpPage />) },
      { path: 'auth/whatsapp', element: pending(<AuthWhatsAppPage />) },
      { path: 'auth/magic', element: pending(<AuthMagicPage />) },
      { path: 'payment', element: pending(<PaymentPage />) },
      { path: 'payment/checking', element: pending(<PaymentCheckingPage />) },
      { path: 'payment/success', element: pending(<PaymentSuccessPage />) },
      { path: 'payment/failure', element: pending(<PaymentFailurePage />) },
      { path: 'orders', element: pending(<OrdersPage />) },
      { path: 'orders/:orderId', element: pending(<OrderDetailPage />) },
      { path: 'rewards', element: pending(<RewardsPage />) },
      { path: 'rewards/passport', element: pending(<PassportPage />) },
      { path: 'rewards/missions', element: pending(<MissionsPage />) },
      { path: 'passport', element: <Navigate to="/rewards/passport" replace /> },
      { path: 'profile', element: pending(<ProfilePage />) },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
];

export const customerRouter = createBrowserRouter(customerRoutes);

export function createCustomerMemoryRouter(initialEntries: string[] = ['/']) {
  return createMemoryRouter(customerRoutes, { initialEntries });
}

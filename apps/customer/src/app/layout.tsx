import { AppShell } from '@pizza-avenue/ui';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { BottomNavigation } from '../shared/components/BottomNavigation';
import { useCommerceStore } from '../shared/state/commerce-store';
import { usePrototypeStore } from '../shared/state/prototype-store';

export function CustomerLayout() {
  const location = useLocation();
  const serviceContext = usePrototypeStore((state) => state.serviceContext);
  const serviceMode = serviceContext?.mode ?? 'PICKUP';
  const cartItemCount = useCommerceStore((state) => state.carts[serviceMode].itemCount);
  const isDineInRoute = location.pathname.startsWith('/dine-in');
  const isDiscoveryRoute = location.pathname === '/menu'
    || location.pathname.startsWith('/menu/')
    || location.pathname === '/search'
    || location.pathname === '/dine-in'
    || location.pathname === '/dine-in/menu'
    || location.pathname.startsWith('/dine-in/menu/')
    || location.pathname === '/dine-in/search';
  const showBottomNavigation = !isDineInRoute && (Boolean(serviceContext) || location.pathname !== '/');
  const contextLabel = serviceContext?.mode === 'DINE_IN'
    ? serviceContext.tableLabel ?? 'Dine-in'
    : serviceContext?.mode === 'PICKUP'
      ? 'Sainikpuri pickup'
      : 'Choose service';

  return (
    <AppShell
      title="Pizza Avenue"
      className="customer-shell"
      navigation={showBottomNavigation ? <BottomNavigation /> : undefined}
      navigationPosition="footer"
      header={
        <header className="customer-topbar">
          <Link className="brand-wordmark" to="/" aria-label="Pizza Avenue home">
            Pizza Avenue
          </Link>
          <div className="customer-topbar__context">
            <span className={`status-dot${serviceContext ? '' : ' status-dot--neutral'}`} aria-hidden="true" />
            <span>{contextLabel}</span>
          </div>
        </header>
      }
    >
      <Outlet />
      {cartItemCount > 0 && isDiscoveryRoute ? (
        <Link className="floating-cart" to={serviceMode === 'DINE_IN' ? '/dine-in/cart' : '/cart'} aria-label={`View ${serviceMode === 'DINE_IN' ? 'dine-in ' : ''}cart with ${cartItemCount} item${cartItemCount === 1 ? '' : 's'}`}>
          <span>View cart</span>
          <strong>{cartItemCount}</strong>
        </Link>
      ) : null}
    </AppShell>
  );
}

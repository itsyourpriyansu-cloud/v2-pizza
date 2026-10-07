import { AppShell } from '@pizza-avenue/ui';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { BottomNavigation } from '../shared/components/BottomNavigation';
import { usePrototypeStore } from '../shared/state/prototype-store';

export function CustomerLayout() {
  const location = useLocation();
  const cartItemCount = usePrototypeStore((state) => state.cartItemCount);
  const serviceContext = usePrototypeStore((state) => state.serviceContext);
  const isDineInRoute = location.pathname.startsWith('/dine-in');
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
      {cartItemCount > 0 && !isDineInRoute ? (
        <Link className="floating-cart" to="/cart" aria-label={`View cart with ${cartItemCount} item${cartItemCount === 1 ? '' : 's'}`}>
          <span>View cart</span>
          <strong>{cartItemCount}</strong>
        </Link>
      ) : null}
    </AppShell>
  );
}

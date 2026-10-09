import { AppShell } from '@pizza-avenue/ui';
import { ShoppingBag } from '@phosphor-icons/react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { BottomNavigation } from '../shared/components/BottomNavigation';
import { useCommerceStore } from '../shared/state/commerce-store';
import { usePrototypeStore } from '../shared/state/prototype-store';

export function CustomerLayout() {
  const location = useLocation();
  const serviceContext = usePrototypeStore((state) => state.serviceContext);
  const serviceMode = serviceContext?.mode ?? 'PICKUP';
  const storeState = usePrototypeStore((state) => state.scenarioState.store);
  const cartItemCount = useCommerceStore((state) => state.carts[serviceMode].itemCount);
  const isDineInRoute = location.pathname.startsWith('/dine-in');
  const isDiscoveryRoute = location.pathname === '/menu'
    || location.pathname.startsWith('/menu/')
    || location.pathname === '/search'
    || location.pathname === '/dine-in'
    || location.pathname === '/dine-in/menu'
    || location.pathname.startsWith('/dine-in/menu/')
    || location.pathname === '/dine-in/search';
  const showBottomNavigation = serviceContext?.mode !== 'DINE_IN'
    && !isDineInRoute
    && (Boolean(serviceContext) || location.pathname !== '/');
  const contextLabel = serviceContext?.mode === 'DINE_IN'
    ? `${serviceContext.tableLabel ?? 'Dine-in'} · 20–30 min`
    : serviceContext?.mode === 'PICKUP'
      ? storeState === 'STORE_BUSY'
        ? 'Pickup · 45–60 min'
        : storeState === 'STORE_PAUSED' || storeState === 'STORE_CLOSED'
          ? 'Pickup · Browse only'
          : 'Pickup · About 30 min'
      : 'Choose service';
  const contextTone = !serviceContext
    ? ' status-dot--neutral'
    : storeState === 'STORE_BUSY' || storeState === 'STORE_PAUSED'
      ? ' status-dot--warning'
      : storeState === 'STORE_CLOSED'
        ? ' status-dot--danger'
        : '';

  return (
    <AppShell
      title="Pizza Avenue"
      className="customer-shell"
      navigation={showBottomNavigation ? <BottomNavigation floating={location.pathname === '/'} /> : undefined}
      navigationPosition="footer"
      header={
        <header className="customer-topbar">
          <Link className="brand-wordmark" to="/" aria-label="Pizza Avenue home">
            Pizza Avenue
          </Link>
          <div className="customer-topbar__actions">
            <div className="customer-topbar__context">
              <span className={`status-dot${contextTone}`} aria-hidden="true" />
              <span>{contextLabel}</span>
            </div>
            {serviceContext ? (
              <Link className="topbar-cart" to={serviceMode === 'DINE_IN' ? '/dine-in/cart' : '/cart'} aria-label={`Open ${serviceMode === 'DINE_IN' ? 'dine-in ' : ''}cart with ${cartItemCount} item${cartItemCount === 1 ? '' : 's'}`}>
                <ShoppingBag aria-hidden="true" />
                {cartItemCount > 0 ? <strong>{cartItemCount}</strong> : null}
              </Link>
            ) : null}
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

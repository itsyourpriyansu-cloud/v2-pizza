import { getMenu, getPassportProgress, listOrders } from '@pizza-avenue/api-client';
import { queryKeys } from '@pizza-avenue/utils';
import { useQuery } from '@tanstack/react-query';
import { CakeSlice, CookingPot, CupSoda, Pizza, Search, Utensils } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge, Button, ButtonLink, ErrorState, PageSkeleton, SectionHeader, Surface } from '../../shared/components/Primitives';
import { usePrototypeStore } from '../../shared/state/prototype-store';
import { useScenarioFromUrl } from '../../shared/state/use-scenario-from-url';
import { ProductCard } from '../menu/components/ProductCard';

export function HomePage() {
  useScenarioFromUrl();
  const serviceContext = usePrototypeStore((state) => state.serviceContext);
  const scenarioState = usePrototypeStore((state) => state.scenarioState);
  const setServiceContext = usePrototypeStore((state) => state.setServiceContext);

  const pickupSelected = serviceContext?.mode === 'PICKUP';
  const menuQuery = useQuery({
    queryKey: queryKeys.menu('sainikpuri'),
    queryFn: () => getMenu('sainikpuri'),
    enabled: pickupSelected,
  });
  const ordersQuery = useQuery({
    queryKey: queryKeys.orders(),
    queryFn: listOrders,
    enabled: pickupSelected && scenarioState.customer !== 'NEW_CUSTOMER',
  });
  const passportQuery = useQuery({
    queryKey: queryKeys.passport(),
    queryFn: getPassportProgress,
    enabled: pickupSelected && scenarioState.customer === 'LOYAL_CUSTOMER',
  });

  function choosePickup() {
    setServiceContext({
      mode: 'PICKUP',
      storeId: 'sainikpuri',
      tableId: null,
      tableLabel: null,
      tableSessionId: null,
      confirmedAt: new Date().toISOString(),
    });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }

  if (!pickupSelected) {
    return (
      <div className="service-choice">
        <div className="service-choice__intro">
          <p className="eyebrow">The Pizza Avenue · Sainikpuri</p>
          <h1>How would you like to order?</h1>
          <p className="muted">Choose pickup to order ahead, or scan your table QR when you're dining with us.</p>
        </div>
        <div className="service-choice__grid">
          <section className="service-card" aria-labelledby="pickup-mode">
            <Badge tone="success">About 30 minutes</Badge>
            <h2 id="pickup-mode">Pickup</h2>
            <p className="muted">Order ahead, pay securely, then collect when your order is ready.</p>
            <Button
              type="button"
              onClick={choosePickup}
            >
              Choose Pickup
            </Button>
          </section>
          <section className="service-card" aria-labelledby="dine-in-mode">
            <Badge>At the restaurant</Badge>
            <h2 id="dine-in-mode">Dine In</h2>
            <p className="muted">Scan the QR on your table so we can securely connect your order to the right table.</p>
            <ButtonLink to="/dine-in/start" variant="secondary">I have a table QR</ButtonLink>
          </section>
        </div>
      </div>
    );
  }

  if (menuQuery.isPending) return <PageSkeleton label="home" />;
  if (menuQuery.isError) return <ErrorState title="We couldn't load today's menu" body="Your pickup mode is saved. Retry to see current availability." onRetry={() => void menuQuery.refetch()} />;

  const activeOrder = scenarioState.customer === 'ACTIVE_ORDER'
    ? ordersQuery.data?.items.find((order) => order.serviceMode === 'PICKUP' && ['CONFIRMED', 'PREPARING', 'READY_FOR_PICKUP'].includes(order.status))
    : null;
  const featured = menuQuery.data.products.filter((product) => product.flags.includes('SIGNATURE') || product.flags.includes('BESTSELLER')).slice(0, 3);
  const returning = scenarioState.customer === 'RETURNING_CUSTOMER' || scenarioState.customer === 'LOYAL_CUSTOMER';
  const favourite = returning ? menuQuery.data.products.find((product) => product.id === 'pizza-diavola') : null;
  const pastOrder = ordersQuery.data?.items.find((order) => order.serviceMode === 'PICKUP' && order.status === 'COMPLETED');
  const storeMessage = {
    STORE_OPEN: ['Pickup is open', 'Ready in about 30 minutes'],
    STORE_BUSY: ['The kitchen is busy', 'Pickup is about 45–60 minutes'],
    STORE_PAUSED: ['Pickup orders are paused', 'You can still browse the live menu'],
    STORE_CLOSED: ['Pickup is closed right now', 'Browse now and come back when we reopen'],
  }[scenarioState.store];

  return (
    <div className="page-stack">
      <div className="availability-banner" role="status">
        <div><strong>{storeMessage[0]}</strong><p>{storeMessage[1]}</p></div>
        <Badge tone={scenarioState.store === 'STORE_OPEN' ? 'success' : scenarioState.store === 'STORE_BUSY' ? 'warning' : 'danger'}>{scenarioState.store.replace('STORE_', '').toLocaleLowerCase()}</Badge>
      </div>
      {activeOrder ? (
        <Surface className="order-status-card">
          <Badge tone="success">Active pickup · {activeOrder.publicNumber}</Badge>
          <h1>{activeOrder.status === 'READY_FOR_PICKUP' ? 'Your order is ready' : activeOrder.status === 'PREPARING' ? 'Your pizza is in the oven' : 'Your order is confirmed'}</h1>
          <p>Live order status takes priority so you always know what happens next.</p>
          <ButtonLink to={`/orders/${activeOrder.id}`}>Track order</ButtonLink>
        </Surface>
      ) : (
        <section className="hero-panel">
          <img className="hero-panel__image" src="/assets/seed/hero-main-pizza.png" alt="Fresh vegetable pizza with a cheese pull" />
          <div className="hero-panel__shade" aria-hidden="true" />
          <div className="hero-panel__content">
            <p className="eyebrow">{returning ? 'Welcome back' : 'Made for pickup'}</p>
            <h1>{returning ? 'Your favourites are waiting.' : 'Good pizza, without the queue.'}</h1>
            <p>{returning ? 'Reorder a familiar favourite or try one of today’s signatures.' : 'Explore the Sainikpuri menu, customize every pizza and choose your pickup time.'}</p>
            <ButtonLink to="/menu">Browse the menu</ButtonLink>
          </div>
        </section>
      )}
      <Link className="search-entry" to="/search"><Search aria-hidden="true" /><span>What are you craving?</span></Link>
      {!returning ? (
        <section className="page-stack" aria-labelledby="category-title">
          <SectionHeader id="category-title" title="What are you craving?" action={<Link className="text-link" to="/menu">Full menu</Link>} />
          <div className="category-rail">
            {menuQuery.data.categories.filter((category) => category.availability === 'AVAILABLE').map((category) => {
              const Icon = category.id === 'pizzas' ? Pizza
                : category.id === 'pastas' ? CookingPot
                  : category.id === 'drinks' ? CupSoda
                    : category.id === 'desserts' ? CakeSlice
                      : Utensils;
              return (
                <Link className="category-tile" to={`/menu?category=${category.id}`} key={category.id}>
                  <span><Icon aria-hidden="true" /></span>
                  <strong>{category.name}</strong>
                </Link>
              );
            })}
          </div>
        </section>
      ) : null}
      {favourite ? (
        <section className="page-stack" aria-labelledby="favourite-title">
          <SectionHeader id="favourite-title" title="Your favourite" action={<Link className="text-link" to="/menu">See menu</Link>} />
          <div className="product-grid product-grid--compact"><ProductCard product={favourite} /></div>
        </section>
      ) : null}
      {returning && pastOrder ? (
        <Surface>
          <SectionHeader title="Order again" action={<Link className="text-link" to={`/orders/${pastOrder.id}`}>View order</Link>} />
          <p className="muted">Your previous pickup order is ready to review before reordering.</p>
        </Surface>
      ) : null}
      {scenarioState.customer === 'LOYAL_CUSTOMER' && passportQuery.data ? (
        <Surface>
          <SectionHeader title="Pizza Passport" action={<Link className="text-link" to="/passport">View passport</Link>} />
          <p>{passportQuery.data.completedItemIds.length} signature pizzas discovered.</p>
          <div className="progress-track" aria-label={`${passportQuery.data.completedItemIds.length} passport items completed`}><span style={{ width: `${Math.min(100, passportQuery.data.completedItemIds.length / 6 * 100)}%` }} /></div>
        </Surface>
      ) : null}
      <section className="page-stack" aria-labelledby="featured-menu">
        <SectionHeader id="featured-menu" title="Popular at Pizza Avenue" action={<Link className="text-link" to="/menu">See all</Link>} />
        <div className="product-grid">{featured.map((product) => <ProductCard key={product.id} product={product} />)}</div>
      </section>
    </div>
  );
}

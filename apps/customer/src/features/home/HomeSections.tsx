import type { Order, Product } from '@pizza-avenue/types';
import { formatMoney } from '@pizza-avenue/utils';
import {
  ArrowRight,
  BellRinging as BellRing,
  Clock as Clock3,
  Fire as Flame,
  ForkKnife,
  Leaf,
  MapPin,
  Pizza,
  QrCode,
  MagnifyingGlass as Search,
  ShieldCheck,
  ShoppingBag,
  Sparkle as Sparkles,
} from '@phosphor-icons/react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Badge, Button, ButtonLink, SectionHeader, Surface } from '../../shared/components/Primitives';
import { ProductCard } from '../menu/components/ProductCard';
import { ProductMedia } from '../menu/components/ProductMedia';

export type StoreScenario = 'STORE_OPEN' | 'STORE_BUSY' | 'STORE_PAUSED' | 'STORE_CLOSED';

const storePresentation: Record<StoreScenario, {
  title: string;
  detail: string;
  badge: string;
  tone: 'success' | 'warning' | 'danger';
  pickupLabel: string;
}> = {
  STORE_OPEN: {
    title: 'Pickup is open',
    detail: 'Ready in about 30 minutes',
    badge: 'Open',
    tone: 'success',
    pickupLabel: 'Order for Pickup',
  },
  STORE_BUSY: {
    title: 'The kitchen is busy',
    detail: 'Pickup is about 45–60 minutes',
    badge: 'Busy',
    tone: 'warning',
    pickupLabel: 'Choose Pickup',
  },
  STORE_PAUSED: {
    title: 'Pickup orders are paused',
    detail: 'The current menu is still available to browse',
    badge: 'Browse only',
    tone: 'warning',
    pickupLabel: 'Browse Pickup Menu',
  },
  STORE_CLOSED: {
    title: 'Pickup is closed right now',
    detail: 'Browse the current menu and return when ordering reopens',
    badge: 'Closed',
    tone: 'danger',
    pickupLabel: 'Browse Pickup Menu',
  },
};

function currentStartingPrice(product: Product | undefined) {
  return product?.variants
    .filter((variant) => variant.availability === 'AVAILABLE')
    .sort((a, b) => a.basePrice.amount - b.basePrice.amount)[0]?.basePrice;
}

export function ServiceEntry({
  storeState,
  onChoosePickup,
}: {
  storeState: StoreScenario;
  onChoosePickup: () => void;
}) {
  const store = storePresentation[storeState];
  return (
    <div className="service-entry">
      <header className="service-entry__visual">
        <img src="/assets/seed/hero-main-pizza.png" alt="Fresh Pizza Avenue pizza ready to serve" />
        <div className="service-entry__scrim" aria-hidden="true" />
        <div className="service-entry__intro">
          <p className="eyebrow">The Pizza Avenue · Sainikpuri</p>
          <h1>Pizza starts with one simple choice.</h1>
          <p>Order ahead for Pickup, or connect your table when you’re dining with us.</p>
        </div>
      </header>

      <section className="service-entry__chooser" aria-labelledby="service-choice-title">
        <div className="service-entry__chooser-heading">
          <span className="service-entry__step">01</span>
          <div>
            <p className="eyebrow">Choose how you’re ordering</p>
            <h2 id="service-choice-title">Where will you enjoy it?</h2>
          </div>
        </div>
        <div className="service-entry__grid">
          <section className="service-entry-card service-entry-card--pickup" aria-labelledby="pickup-mode">
            <div className="service-entry-card__top">
              <span className="service-entry-card__icon" aria-hidden="true"><ShoppingBag weight="duotone" /></span>
              <Badge tone={store.tone}>{store.badge}</Badge>
            </div>
            <div>
              <p className="eyebrow">Order ahead</p>
              <h2 id="pickup-mode">Pickup</h2>
              <p>{store.detail}. Pay securely, then collect from Sainikpuri.</p>
            </div>
            <Button type="button" onClick={onChoosePickup}>{store.pickupLabel}<ArrowRight aria-hidden="true" /></Button>
          </section>

          <section className="service-entry-card service-entry-card--dine-in" aria-labelledby="dine-in-mode">
            <div className="service-entry-card__top">
              <span className="service-entry-card__icon" aria-hidden="true"><QrCode weight="duotone" /></span>
              <Badge>At your table</Badge>
            </div>
            <div>
              <p className="eyebrow">Dining with us</p>
              <h2 id="dine-in-mode">Dine In</h2>
              <p>Scan the QR on your table to connect securely before your waiter confirms each round.</p>
            </div>
            <ButtonLink to="/dine-in/start" variant="secondary">Scan your table QR<ArrowRight aria-hidden="true" /></ButtonLink>
          </section>
        </div>

        <div className="service-entry__assurance" aria-label="Service information">
          <span><MapPin aria-hidden="true" /> Sainikpuri, Hyderabad</span>
          <span><ShieldCheck aria-hidden="true" /> No delivery address needed</span>
        </div>
      </section>
    </div>
  );
}

export function StoreContextBar({
  storeState,
  onChangeService,
}: {
  storeState: StoreScenario;
  onChangeService: () => void;
}) {
  const store = storePresentation[storeState];
  return (
    <div className="home-context-bar" role="status">
      <span className="home-context-bar__icon" aria-hidden="true"><Clock3 /></span>
      <span><strong>{store.title}</strong><small>{store.detail}</small></span>
      <Button type="button" variant="ghost" onClick={onChangeService}>Change</Button>
    </div>
  );
}

export function NewCustomerHero() {
  return (
    <section className="home-order-hero home-order-hero--new" aria-labelledby="home-new-title">
      <img src="/assets/seed/hero-main-pizza.png" alt="Fresh vegetable pizza ready to share" />
      <div className="home-order-hero__scrim" aria-hidden="true" />
      <div className="home-order-hero__content">
        <div className="home-order-hero__kicker">
          <span className="home-order-hero__number">01</span>
          <p className="eyebrow">First time here?</p>
        </div>
        <h1 id="home-new-title">Start with the pizzas Sainikpuri orders most.</h1>
        <p>Choose a proven favourite, or make one your own. No deal maze and no hidden add-ons.</p>
        <div className="home-button-row">
          <a className="button button--primary" href="#best-sellers">See Bestsellers</a>
          <ButtonLink to="/menu/pizza-margherita" variant="secondary">Customize a favourite</ButtonLink>
        </div>
      </div>
    </section>
  );
}

export function CravingRoutes() {
  const routes: Array<{ label: string; detail: string; href: string; icon: ReactNode }> = [
    { label: 'Bestsellers', detail: 'The easiest first choice', href: '#best-sellers', icon: <Sparkles /> },
    { label: 'Build yours', detail: 'Start with Margherita', href: '/menu/pizza-margherita', icon: <Pizza /> },
    { label: 'Vegetarian', detail: 'Six pizza choices', href: '/menu?category=veggie-haven', icon: <Leaf /> },
    { label: 'Non-Veg', detail: 'Chicken-led favourites', href: '/menu?category=non-veg-paradise', icon: <Flame /> },
  ];
  return (
    <section className="home-section" aria-labelledby="craving-routes-title">
      <div className="home-discovery-heading">
        <div>
          <p className="eyebrow">Quick discovery</p>
          <SectionHeader id="craving-routes-title" title="What are you craving today?" action={<Link className="text-link" to="/menu">Full menu</Link>} />
        </div>
        <Link className="home-search-control" to="/search" aria-label="Search the Pizza Avenue menu"><Search aria-hidden="true" /><span>Search menu</span></Link>
      </div>
      <div className="home-route-grid">
        {routes.map((route) => (
          <Link className="home-route-card" to={route.href} key={route.label}>
            <span aria-hidden="true">{route.icon}</span>
            <strong>{route.label}</strong>
            <small>{route.detail}</small>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function UsualOrderCard({
  order,
  product,
  isPending,
  isError,
  onOrderAgain,
}: {
  order: Order;
  product: Product | undefined;
  isPending: boolean;
  isError: boolean;
  onOrderAgain: () => void;
}) {
  const currentPrice = currentStartingPrice(product);
  const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
  return (
    <section className="usual-order" aria-labelledby="usual-order-title">
      <div className="usual-order__copy">
        <p className="eyebrow">Welcome back</p>
        <h1 id="usual-order-title">Your usual, ready when you are.</h1>
        <p className="muted">We’ll recheck today’s menu, availability and price before anything reaches checkout.</p>
        <div className="usual-order__summary">
          <span><strong>{order.items[0]?.productNameSnapshot ?? 'Your last pickup'}</strong><small>{itemCount} item{itemCount === 1 ? '' : 's'} · {order.items[0]?.variantNameSnapshot ?? 'Saved configuration'}</small></span>
          <strong>{currentPrice ? `From ${formatMoney(currentPrice)} today` : 'Current price checked next'}</strong>
        </div>
        <div className="home-button-row">
          <Button type="button" onClick={onOrderAgain} disabled={isPending}>{isPending ? 'Checking today’s menu…' : 'Order Again'}</Button>
          <ButtonLink to={product ? `/menu/${product.id}/customize?source=usual` : '/menu'} variant="secondary">Edit</ButtonLink>
        </div>
        {isError ? <p className="validation-message" role="alert">We couldn’t rebuild that order. Your previous order is unchanged—open the menu to try again.</p> : null}
      </div>
      {product?.imageUrl ? (
        <ProductMedia product={product} className="usual-order__media" />
      ) : (
        <div className="usual-order__media usual-order__media--empty" role="img" aria-label={`${product?.name ?? 'Usual order'} visual`}>
          <Pizza aria-hidden="true" />
          <span>{product?.name ?? 'Your usual order'}</span>
          <small>Current menu item</small>
        </div>
      )}
    </section>
  );
}

export function CompleteMealCard({ returning }: { returning: boolean }) {
  return (
    <Surface className="meal-plan-card">
      <div className="meal-plan-card__icon" aria-hidden="true"><ForkKnife weight="duotone" /></div>
      <div>
        <p className="eyebrow">Complete the meal</p>
        <h2>Dinner for two, without the guesswork.</h2>
        <p>Choose two pizzas, then add Garlic Knots and two drinks. Every addition stays optional and visible.</p>
        <ul aria-label="Suggested dinner for two">
          <li>2 pizzas of your choice</li>
          <li>Garlic Knots</li>
          <li>2 chilled drinks</li>
        </ul>
      </div>
      <ButtonLink to={returning ? '/menu?category=veggie-haven' : '/menu'}>Choose your pizzas<ArrowRight aria-hidden="true" /></ButtonLink>
    </Surface>
  );
}

export function BestSellers({ products }: { products: Product[] }) {
  return (
    <section className="home-section" id="best-sellers" aria-labelledby="best-sellers-title">
      <SectionHeader id="best-sellers-title" title="Most ordered at Pizza Avenue" action={<Link className="text-link" to="/menu">See all</Link>} />
      <p className="home-section__intro">Four confident choices when you don’t want to study the whole menu.</p>
      <div className="product-grid home-product-grid">{products.map((product) => <ProductCard key={product.id} product={product} />)}</div>
    </section>
  );
}

export function TasteDiscovery() {
  const tastes = [
    { label: 'Something cheesy', href: '/search?q=mozzarella', icon: <Sparkles /> },
    { label: 'Something spicy', href: '/search?q=chilli', icon: <Flame /> },
    { label: 'Something vegetarian', href: '/menu?category=veggie-haven', icon: <Leaf /> },
    { label: 'Something herby', href: '/search?q=pesto', icon: <Leaf /> },
  ];
  return (
    <section className="home-section" aria-labelledby="taste-title">
      <SectionHeader id="taste-title" title="Choose by mood" />
      <div className="taste-grid">
        {tastes.map((taste) => <Link className="taste-card-link" to={taste.href} key={taste.label}><span aria-hidden="true">{taste.icon}</span><strong>{taste.label}</strong><ArrowRight aria-hidden="true" /></Link>)}
      </div>
    </section>
  );
}

export function MealCompleters({ products }: { products: Product[] }) {
  return (
    <section className="home-section" aria-labelledby="meal-completers-title">
      <SectionHeader id="meal-completers-title" title="Make it a full meal" action={<Link className="text-link" to="/menu?category=breads-sides">All sides</Link>} />
      <p className="home-section__intro">Add only what makes the meal better. Nothing is preselected.</p>
      <div className="product-grid home-product-grid">{products.map((product) => <ProductCard key={product.id} product={product} />)}</div>
    </section>
  );
}

export function BrandReassurance() {
  return (
    <section className="home-trust" aria-labelledby="home-trust-title">
      <p className="eyebrow">Made here in Sainikpuri</p>
      <h2 id="home-trust-title">Handcrafted pizza. Clear choices. No ordering theatre.</h2>
      <div className="home-trust__points">
        <span><Pizza aria-hidden="true" /><strong>Made to order</strong><small>Customize before it reaches the kitchen.</small></span>
        <span><Clock3 aria-hidden="true" /><strong>Visible timing</strong><small>See the current Pickup or table estimate.</small></span>
        <span><ShieldCheck aria-hidden="true" /><strong>Clear next step</strong><small>Payment and waiter confirmation follow the right service flow.</small></span>
      </div>
      <footer className="home-utility">
        <span><MapPin aria-hidden="true" /> The Pizza Avenue · Sainikpuri</span>
        <Link to="/profile">Help & information</Link>
      </footer>
    </section>
  );
}

export function ActivePickupHome({ order }: { order: Order }) {
  const ready = order.status === 'READY_FOR_PICKUP';
  const preparing = order.status === 'PREPARING';
  return (
    <Surface className="active-service-card active-service-card--pickup">
      <div className="active-service-card__heading"><Badge tone="success">Active Pickup · {order.publicNumber}</Badge><span><BellRing aria-hidden="true" /> Live status</span></div>
      <h1>{ready ? 'Your order is ready.' : preparing ? 'Your pizza is in the oven.' : 'The kitchen has your order.'}</h1>
      <p>{ready ? 'Head to Pizza Avenue and use your pickup code at the counter.' : 'Stay here for the latest confirmed status. We’ll tell you when it is time to leave.'}</p>
      <ButtonLink to={`/orders/${order.id}`}>Track order<ArrowRight aria-hidden="true" /></ButtonLink>
    </Surface>
  );
}

export function ActiveDineInHome({
  tableLabel,
  quickAdds,
}: {
  tableLabel: string;
  quickAdds: Product[];
}) {
  return (
    <div className="page-stack dine-in-home">
      <section className="active-service-card active-service-card--dine-in" aria-labelledby="dine-in-home-title">
        <div className="active-service-card__heading"><Badge tone="success">Table connected</Badge><span><Clock3 aria-hidden="true" /> Kitchen about 20–30 min</span></div>
        <p className="eyebrow">Dine In · {tableLabel}</p>
        <h1 id="dine-in-home-title">Everything for {tableLabel}, in one place.</h1>
        <p>Order another round, see the current table bill, or ask your waiter for help. Every new round is confirmed before it reaches the kitchen.</p>
        <div className="home-button-row">
          <ButtonLink to="/dine-in/order-more">Order more</ButtonLink>
          <ButtonLink to="/dine-in/bill" variant="secondary">Current bill</ButtonLink>
          <ButtonLink to="/dine-in/service" variant="ghost">Call waiter</ButtonLink>
        </div>
      </section>
      {quickAdds.length ? (
        <section className="home-section" aria-labelledby="table-quick-add-title">
          <SectionHeader id="table-quick-add-title" title="Quick add for the table" action={<Link className="text-link" to="/dine-in/menu">Full menu</Link>} />
          <p className="home-section__intro">Sides, drinks and dessert for the table. Nothing is added until you choose it.</p>
          <div className="product-grid home-product-grid">{quickAdds.map((product) => <ProductCard key={product.id} product={product} href={`/dine-in/menu/${product.id}`} />)}</div>
        </section>
      ) : null}
      <Link className="search-entry" to="/dine-in/search"><Search aria-hidden="true" /><span>Search the dine-in menu</span></Link>
    </div>
  );
}

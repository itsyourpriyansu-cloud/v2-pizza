import { getEngagementSummary, getLoyaltyAccount, getMenu, getMissions, getPassportProgress, getRewards, listOrders } from '@pizza-avenue/api-client';
import { queryKeys } from '@pizza-avenue/utils';
import { useQuery } from '@tanstack/react-query';
import { CakeSlice, CalendarHeart, CookingPot, Crown, CupSoda, Pizza, RotateCcw, Search, ShoppingBasket, Star, Trophy, UserPlus, Utensils } from 'lucide-react';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Badge, Button, ButtonLink, ErrorState, PageSkeleton, SectionHeader, Surface } from '../../shared/components/Primitives';
import { formatCustomerState } from '../../shared/copy/customer-copy';
import { usePrototypeStore } from '../../shared/state/prototype-store';
import { useScenarioFromUrl } from '../../shared/state/use-scenario-from-url';
import { ProductCard } from '../menu/components/ProductCard';
import { RetentionLinkCard } from '../retention/RetentionComponents';
import { trackCustomerEvent } from '../../shared/analytics/analytics';

export function HomePage() {
  useScenarioFromUrl();
  const serviceContext = usePrototypeStore((state) => state.serviceContext);
  const scenarioState = usePrototypeStore((state) => state.scenarioState);
  const setServiceContext = usePrototypeStore((state) => state.setServiceContext);

  const pickupSelected = serviceContext?.mode === 'PICKUP';
  const dineInSelected = serviceContext?.mode === 'DINE_IN';
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
    enabled: pickupSelected && scenarioState.customer !== 'NEW_CUSTOMER',
  });
  const loyaltyQuery = useQuery({ queryKey: queryKeys.loyalty(), queryFn: getLoyaltyAccount, enabled: pickupSelected && scenarioState.customer !== 'NEW_CUSTOMER' });
  const rewardsQuery = useQuery({ queryKey: queryKeys.rewards(), queryFn: getRewards, enabled: pickupSelected && scenarioState.customer !== 'NEW_CUSTOMER' });
  const missionsQuery = useQuery({ queryKey: queryKeys.missions(), queryFn: getMissions, enabled: pickupSelected && scenarioState.customer !== 'NEW_CUSTOMER' });
  const engagementQuery = useQuery({ queryKey: queryKeys.engagementSummary(), queryFn: getEngagementSummary, enabled: pickupSelected && scenarioState.customer !== 'NEW_CUSTOMER' });
  useEffect(() => {
    if (engagementQuery.data?.reactivation) trackCustomerEvent('reactivation_module_viewed', { href: engagementQuery.data.reactivation.ctaHref });
  }, [engagementQuery.data?.reactivation]);

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

  if (dineInSelected) {
    return <div className="page-stack"><Surface className="order-status-card"><Badge tone="success">Active Dine-in · {serviceContext.tableLabel ?? 'Your table'}</Badge><h1>{serviceContext.tableLabel ?? 'Your table'} is active.</h1><p>Your active table order and service actions take priority over rewards.</p><div className="service-action-grid"><ButtonLink to="/dine-in/order-more">Order more</ButtonLink><ButtonLink to="/dine-in/bill" variant="secondary">Current bill</ButtonLink></div></Surface><ButtonLink to="/dine-in" variant="secondary">Open table workspace</ButtonLink></div>;
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
  const returning = scenarioState.customer === 'RETURNING_CUSTOMER' || scenarioState.customer === 'LOYAL_CUSTOMER' || scenarioState.customer === 'ACTIVE_ORDER';
  const favourite = returning ? menuQuery.data.products.find((product) => product.id === 'pizza-diavola') : null;
  const pastOrder = ordersQuery.data?.items.find((order) => order.serviceMode === 'PICKUP' && order.status === 'COMPLETED');
  const storeMessage = {
    STORE_OPEN: ['Pickup is open', 'Ready in about 30 minutes'],
    STORE_BUSY: ['The kitchen is busy', 'Pickup is about 45–60 minutes'],
    STORE_PAUSED: ['Pickup orders are paused', 'You can still browse the live menu'],
    STORE_CLOSED: ['Pickup is closed right now', 'Browse now and come back when we reopen'],
  }[scenarioState.store];
  const availableReward = rewardsQuery.data?.find((reward) => reward.status === 'AVAILABLE');
  const activeMission = missionsQuery.data?.personal.find((mission) => !['COMPLETED', 'EXPIRED', 'CANCELLED'].includes(mission.status));
  const commonMission = missionsQuery.data?.common.find((mission) => !['COMPLETED', 'EXPIRED', 'CANCELLED'].includes(mission.status));
  const engagement = engagementQuery.data;
  const retentionModule = engagement?.savedBasket
    ? <RetentionLinkCard eyebrow="Saved basket" title={engagement.savedBasket.name} body={engagement.savedBasket.peopleCount ? `Ready to revalidate · Serves ${engagement.savedBasket.peopleCount}` : 'Ready to revalidate'} href={`/profile/saved-baskets/${engagement.savedBasket.id}`} icon={<ShoppingBasket />} />
    : engagement?.occasion
      ? <RetentionLinkCard eyebrow={`${engagement.occasion.daysAway} days away`} title={engagement.occasion.title} body="Plan the family order." href="/profile/occasions" icon={<CalendarHeart />} />
      : availableReward
    ? <RetentionLinkCard eyebrow="Reward ready" title={availableReward.name} body={`${loyaltyQuery.data?.pointsBalance ?? 0} Pizza Points available`} href="/rewards" icon={<Star />} />
    : passportQuery.data?.status === 'NEAR_COMPLETE'
      ? <RetentionLinkCard eyebrow="Pizza Passport" title={`${passportQuery.data.completedItemIds.length} of ${passportQuery.data.program.items.length} discovered`} body="Your next signature is waiting." href="/rewards/passport" icon={<Pizza />} />
      : activeMission
        ? <RetentionLinkCard eyebrow="Personal mission" title={activeMission.title} body={activeMission.progress.label} href="/rewards/missions" icon={<Trophy />} />
        : passportQuery.data?.status === 'IN_PROGRESS' && passportQuery.data.completedItemIds.length > 0
          ? <RetentionLinkCard eyebrow="Pizza Passport" title={`${passportQuery.data.completedItemIds.length} of ${passportQuery.data.program.items.length} discovered`} body="Keep exploring the signature menu." href="/rewards/passport" icon={<Pizza />} />
        : engagement?.referral && engagement.referral.status !== 'REWARDED'
          ? <RetentionLinkCard eyebrow="Invite update" title={`${engagement.referral.inviteeDisplayName} joined Pizza Avenue`} body="A qualifying completed order unlocks your reward." href="/rewards/invite" icon={<UserPlus />} />
          : commonMission
            ? <RetentionLinkCard eyebrow="Common mission" title={commonMission.title} body={commonMission.progress.label} href="/rewards/missions" icon={<Trophy />} />
            : engagement?.league?.optedIn
              ? <RetentionLinkCard eyebrow={`${formatCustomerState(engagement.league.currentTier)} League`} title={engagement.league.currentRank ? `#${engagement.league.currentRank} this month` : 'Season in progress'} body={engagement.league.progressMessage} href="/rewards/league" icon={<Crown />} />
              : engagement?.reactivation
                ? <RetentionLinkCard eyebrow="Welcome back" title={engagement.reactivation.title} body={engagement.reactivation.body} href={engagement.reactivation.ctaHref} icon={<RotateCcw />} onClick={() => trackCustomerEvent('reactivation_cta_clicked', { href: engagement.reactivation?.ctaHref ?? '/menu' })} />
                : null;

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
      {returning && pastOrder && !retentionModule ? (
        <Surface>
          <SectionHeader title="Order again" action={<Link className="text-link" to={`/orders/${pastOrder.id}`}>View order</Link>} />
          <p className="muted">Your previous pickup order is ready to review before reordering.</p>
        </Surface>
      ) : null}
      {returning && retentionModule ? <section aria-label="Your next loyalty action">{retentionModule}</section> : null}
      <section className="page-stack" aria-labelledby="featured-menu">
        <SectionHeader id="featured-menu" title="Popular at Pizza Avenue" action={<Link className="text-link" to="/menu">See all</Link>} />
        <div className="product-grid">{featured.map((product) => <ProductCard key={product.id} product={product} />)}</div>
      </section>
    </div>
  );
}

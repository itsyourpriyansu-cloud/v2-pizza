import {
  getEngagementSummary,
  getLoyaltyAccount,
  getMenu,
  getMissions,
  getPassportProgress,
  getRewards,
  listOrders,
  reorder,
} from '@pizza-avenue/api-client';
import type { Product } from '@pizza-avenue/types';
import { queryKeys } from '@pizza-avenue/utils';
import { useMutation, useQuery } from '@tanstack/react-query';
import { CalendarHeart, Crown, Pizza, RotateCcw, ShoppingBasket, Star, Trophy, UserPlus } from 'lucide-react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { trackCustomerEvent } from '../../shared/analytics/analytics';
import { ErrorState, PageSkeleton } from '../../shared/components/Primitives';
import { formatCustomerState } from '../../shared/copy/customer-copy';
import { useCommerceStore } from '../../shared/state/commerce-store';
import { usePrototypeStore } from '../../shared/state/prototype-store';
import { useScenarioFromUrl } from '../../shared/state/use-scenario-from-url';
import { RetentionLinkCard } from '../retention/RetentionComponents';
import {
  ActiveDineInHome,
  ActivePickupHome,
  BestSellers,
  BrandReassurance,
  CompleteMealCard,
  CravingRoutes,
  MealCompleters,
  NewCustomerHero,
  ServiceEntry,
  StoreContextBar,
  TasteDiscovery,
  UsualOrderCard,
  type StoreScenario,
} from './HomeSections';

export function HomePage() {
  useScenarioFromUrl();
  const navigate = useNavigate();
  const serviceContext = usePrototypeStore((state) => state.serviceContext);
  const scenarioState = usePrototypeStore((state) => state.scenarioState);
  const setServiceContext = usePrototypeStore((state) => state.setServiceContext);
  const setCartSummary = useCommerceStore((state) => state.setCartSummary);

  const pickupSelected = serviceContext?.mode === 'PICKUP';
  const dineInSelected = serviceContext?.mode === 'DINE_IN';
  const knownCustomer = scenarioState.customer !== 'NEW_CUSTOMER';
  const storeState = scenarioState.store as StoreScenario;

  const menuQuery = useQuery({
    queryKey: queryKeys.menu('sainikpuri'),
    queryFn: () => getMenu('sainikpuri'),
    enabled: Boolean(serviceContext),
  });
  const ordersQuery = useQuery({
    queryKey: queryKeys.orders(),
    queryFn: listOrders,
    enabled: knownCustomer && Boolean(serviceContext),
  });
  const passportQuery = useQuery({ queryKey: queryKeys.passport(), queryFn: getPassportProgress, enabled: pickupSelected && knownCustomer });
  const loyaltyQuery = useQuery({ queryKey: queryKeys.loyalty(), queryFn: getLoyaltyAccount, enabled: pickupSelected && knownCustomer });
  const rewardsQuery = useQuery({ queryKey: queryKeys.rewards(), queryFn: getRewards, enabled: pickupSelected && knownCustomer });
  const missionsQuery = useQuery({ queryKey: queryKeys.missions(), queryFn: getMissions, enabled: pickupSelected && knownCustomer });
  const engagementQuery = useQuery({ queryKey: queryKeys.engagementSummary(), queryFn: getEngagementSummary, enabled: pickupSelected && knownCustomer });

  const pastOrder = ordersQuery.data?.items.find((order) => order.serviceMode === 'PICKUP' && order.status === 'COMPLETED');
  const reorderMutation = useMutation({
    mutationFn: () => reorder(pastOrder!.id),
    onSuccess: ({ cartId }) => {
      const itemCount = pastOrder?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0;
      setCartSummary('PICKUP', cartId, itemCount);
      trackCustomerEvent('reorder_clicked', { orderId: pastOrder?.id ?? null, source: 'HOME_USUAL' });
      navigate('/cart');
    },
  });

  useEffect(() => {
    if (engagementQuery.data?.reactivation) {
      trackCustomerEvent('reactivation_module_viewed', { href: engagementQuery.data.reactivation.ctaHref });
    }
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
    trackCustomerEvent('service_mode_selected', { serviceMode: 'PICKUP', storeId: 'sainikpuri' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }

  function changeService() {
    setServiceContext(null);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }

  if (!serviceContext) return <ServiceEntry storeState={storeState} onChoosePickup={choosePickup} />;
  if (menuQuery.isPending) return <PageSkeleton label="home" />;
  if (menuQuery.isError) {
    return <ErrorState title="We couldn’t load today’s menu" body="Your service choice is saved. Try again to see current availability." onRetry={() => void menuQuery.refetch()} />;
  }

  const quickAdds = ['side-garlic-knots', 'drink-coke', 'dessert-tiramisu']
    .map((id) => menuQuery.data.products.find((product) => product.id === id))
    .filter((product): product is Product => Boolean(product));

  if (dineInSelected) {
    return <ActiveDineInHome tableLabel={serviceContext.tableLabel ?? 'your table'} quickAdds={quickAdds} />;
  }

  const activeOrder = scenarioState.customer === 'ACTIVE_ORDER'
    ? ordersQuery.data?.items.find((order) => order.serviceMode === 'PICKUP' && ['CONFIRMED', 'PREPARING', 'READY_FOR_PICKUP'].includes(order.status))
    : null;
  const returning = knownCustomer;
  const usualProduct = pastOrder?.items[0]?.productId
    ? menuQuery.data.products.find((product) => product.id === pastOrder.items[0]?.productId)
    : undefined;
  const bestSellers = menuQuery.data.products
    .filter((product) => product.availability === 'AVAILABLE' && (product.flags.includes('BESTSELLER') || product.flags.includes('SIGNATURE')))
    .slice(0, 4);
  const mealCompleters = ['side-garlic-knots', 'dip-viva-rosso', 'dessert-tiramisu', 'drink-coke']
    .map((id) => menuQuery.data.products.find((product) => product.id === id))
    .filter((product): product is Product => Boolean(product));

  const availableReward = rewardsQuery.data?.find((reward) => reward.status === 'AVAILABLE');
  const activeMission = missionsQuery.data?.personal.find((mission) => !['COMPLETED', 'EXPIRED', 'CANCELLED'].includes(mission.status));
  const commonMission = missionsQuery.data?.common.find((mission) => !['COMPLETED', 'EXPIRED', 'CANCELLED'].includes(mission.status));
  const engagement = engagementQuery.data;
  const loyalty = loyaltyQuery.data;
  const pointsRemaining = loyalty?.nextRewardAt ? Math.max(0, loyalty.nextRewardAt - loyalty.pointsBalance) : null;

  const adaptiveModule = engagement?.savedBasket
    ? <RetentionLinkCard eyebrow="Saved basket" title={engagement.savedBasket.name} body={engagement.savedBasket.peopleCount ? `Ready to revalidate · Serves ${engagement.savedBasket.peopleCount}` : 'Ready to revalidate'} href={`/profile/saved-baskets/${engagement.savedBasket.id}`} icon={<ShoppingBasket />} />
    : engagement?.occasion
      ? <RetentionLinkCard eyebrow={`${engagement.occasion.daysAway} days away`} title={engagement.occasion.title} body="Plan the family order." href="/profile/occasions" icon={<CalendarHeart />} />
      : availableReward
        ? <RetentionLinkCard eyebrow="Reward available" title={availableReward.name} body={`${loyalty?.pointsBalance ?? 0} Pizza Points available`} href="/rewards" icon={<Star />} />
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
                      : pointsRemaining !== null && pointsRemaining > 0
                        ? <RetentionLinkCard eyebrow="Pizza Points" title={`${loyalty?.pointsBalance ?? 0} Points · ${pointsRemaining} to your next reward`} body="One clear balance—Avenue XP never replaces Pizza Points." href="/rewards" icon={<Star />} />
                        : null;

  return (
    <div className="page-stack home-page">
      <StoreContextBar storeState={storeState} onChangeService={changeService} />

      {activeOrder ? <ActivePickupHome order={activeOrder} /> : returning && pastOrder ? (
        <UsualOrderCard
          order={pastOrder}
          product={usualProduct}
          isPending={reorderMutation.isPending}
          isError={reorderMutation.isError}
          onOrderAgain={() => reorderMutation.mutate()}
        />
      ) : <NewCustomerHero />}

      {!activeOrder && !returning ? <CravingRoutes /> : null}
      {!activeOrder ? <CompleteMealCard returning={returning} /> : null}
      <BestSellers products={bestSellers} />

      {!activeOrder && returning && adaptiveModule ? (
        <section className="home-section" aria-labelledby="your-avenue-title">
          <h2 className="home-section__title" id="your-avenue-title">Your Avenue</h2>
          {adaptiveModule}
        </section>
      ) : null}

      {!activeOrder ? <TasteDiscovery /> : null}
      <MealCompleters products={mealCompleters} />
      <BrandReassurance />
    </div>
  );
}

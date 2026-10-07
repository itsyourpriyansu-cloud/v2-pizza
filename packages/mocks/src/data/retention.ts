import type {
  CustomerProfile,
  LoyaltyTransaction,
  MissionOverview,
} from '@pizza-avenue/types';

export const loyaltyActivity: LoyaltyTransaction[] = [
  {
    id: 'loyalty-txn-3', accountId: 'loyalty-arjun', pointsDelta: 90,
    type: 'EARN', sourceId: 'order-pickup-completed', sourceType: 'PICKUP_ORDER',
    displayLabel: 'Pickup order PA-1042', createdAt: '2026-10-05T15:40:00.000Z',
  },
  {
    id: 'loyalty-txn-2', accountId: 'loyalty-arjun', pointsDelta: 130,
    type: 'EARN', sourceId: 'bill-table-12', sourceType: 'DINE_IN_ORDER',
    displayLabel: 'Paid table bill · Table 12', createdAt: '2026-09-28T20:10:00.000Z',
  },
  {
    id: 'loyalty-txn-1', accountId: 'loyalty-arjun', pointsDelta: -300,
    type: 'REDEEM', sourceId: 'reward-dip', sourceType: 'REWARD',
    displayLabel: 'Free dip reward', createdAt: '2026-09-18T14:30:00.000Z',
  },
];

export const missionOverview: MissionOverview = {
  avenueXp: 180,
  personal: [
    {
      id: 'mission-personal-veggie', scope: 'PERSONAL', title: 'Explore the veggie side',
      requirement: 'Try 2 different Veggie Haven pizzas.', status: 'IN_PROGRESS',
      progress: { current: 1, target: 2, label: '1 of 2 pizzas' }, rewardXp: 80,
      ctaLabel: 'Explore veggie pizzas', ctaHref: '/menu?category=veggie-haven', expiresAt: '2026-10-31T18:29:59.000Z',
    },
    {
      id: 'mission-personal-reorder', scope: 'PERSONAL', title: 'Back for your favourite',
      requirement: 'Complete one Pickup reorder.', status: 'ACTIVE',
      progress: { current: 0, target: 1, label: 'Not started' }, rewardXp: 60,
      ctaLabel: 'View past orders', ctaHref: '/orders', expiresAt: '2026-10-31T18:29:59.000Z',
    },
  ],
  common: [
    {
      id: 'mission-common-passport', scope: 'COMMON', title: 'Passport starter',
      requirement: 'Discover any 2 Passport pizzas.', status: 'COMPLETED',
      progress: { current: 2, target: 2, label: 'Complete' }, rewardXp: 50,
      ctaLabel: 'View Passport', ctaHref: '/rewards/passport', expiresAt: null,
    },
    {
      id: 'mission-common-pasta', scope: 'COMMON', title: 'Tossed & sauced',
      requirement: 'Order from the Pasta collection once.', status: 'ACTIVE',
      progress: { current: 0, target: 1, label: '0 of 1 order' }, rewardXp: 40,
      ctaLabel: 'Browse pasta', ctaHref: '/menu?category=pasta', expiresAt: null,
    },
    {
      id: 'mission-common-dine-in', scope: 'COMMON', title: 'Avenue table night',
      requirement: 'Complete one paid Dine-in table bill.', status: 'ACTIVE',
      progress: { current: 0, target: 1, label: '0 of 1 visit' }, rewardXp: 100,
      ctaLabel: null, ctaHref: null, expiresAt: null,
    },
  ],
};

export const profiles: Record<'complete' | 'partial', CustomerProfile> = {
  complete: {
    customerId: 'customer-arjun', name: 'Arjun Rao', phoneMasked: '+91 ******1001', phoneVerified: true,
    foodPreference: 'NO_PREFERENCE', avoidMushrooms: false, preferredCrust: 'THIN',
    favouriteProductIds: ['pizza-diavola', 'side-garlic-bread'],
    notifications: { transactional: true, offers: true, loyalty: true },
  },
  partial: {
    customerId: 'customer-aisha', name: 'Aisha Khan', phoneMasked: '+91 ******2002', phoneVerified: true,
    foodPreference: 'NO_PREFERENCE', avoidMushrooms: false, preferredCrust: null,
    favouriteProductIds: [], notifications: { transactional: true, offers: false, loyalty: true },
  },
};

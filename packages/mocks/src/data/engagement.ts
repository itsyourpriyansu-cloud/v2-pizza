import type {
  GroupOrder,
  HouseholdMember,
  LeagueOverview,
  Occasion,
  Referral,
  SavedBasket,
  TasteCard,
} from '@pizza-avenue/types';
import { money } from '../factories';

const basketItem = (id: string, productId: string, productName: string, quantity: number, amount: number) => ({
  id,
  productId,
  productName,
  variantId: `${productId}-regular`,
  variantName: 'Regular',
  modifiers: [],
  quantity,
  historicalUnitPrice: money(amount),
});

export const savedBaskets: SavedBasket[] = [
  {
    id: 'basket-family-friday', name: 'Family Friday', kind: 'FAMILY_FRIDAY', peopleCount: 4,
    lastOrderedAt: '2026-09-16T14:30:00.000Z', estimatedCurrentPrice: money(204400),
    items: [
      basketItem('family-1', 'pizza-chicken-pepperoni', 'Chicken Pepperoni Pizza', 1, 48900),
      basketItem('family-2', 'pizza-pesto', 'Pesto Pizza', 1, 42900),
      basketItem('family-3', 'pizza-margherita', 'Classic Margherita Pizza', 1, 34900),
      basketItem('family-4', 'side-garlic-knots', 'Garlic Knots', 2, 21900),
      basketItem('family-5', 'drink-coke', 'Coke', 3, 9900),
    ],
  },
  {
    id: 'basket-my-usual', name: 'My Usual', kind: 'MY_USUAL', peopleCount: 1,
    lastOrderedAt: '2026-10-01T13:00:00.000Z', estimatedCurrentPrice: money(56800),
    items: [basketItem('usual-1', 'pizza-pesto', 'Pesto Pizza', 1, 42900), basketItem('usual-2', 'dip-viva-rosso', 'Viva Rosso', 1, 13900)],
  },
  {
    id: 'basket-movie-night', name: 'Movie Night', kind: 'MOVIE_NIGHT', peopleCount: 3,
    lastOrderedAt: '2026-08-22T15:30:00.000Z', estimatedCurrentPrice: money(119600),
    items: [basketItem('movie-1', 'pizza-farmhouse', 'Farmhouse Pizza', 1, 46900), basketItem('movie-2', 'side-garlic-bread', 'Garlic Bread', 1, 19900), basketItem('movie-3', 'drink-coke', 'Coke', 2, 9900), basketItem('movie-4', 'dessert-tiramisu', 'Tiramisu', 1, 29900)],
  },
  {
    id: 'basket-office-lunch', name: 'Office Lunch', kind: 'OFFICE_LUNCH', peopleCount: 6,
    lastOrderedAt: null, estimatedCurrentPrice: money(283400),
    items: [basketItem('office-1', 'pizza-margherita', 'Classic Margherita Pizza', 2, 34900), basketItem('office-2', 'pizza-chicken-pepperoni', 'Chicken Pepperoni Pizza', 2, 48900), basketItem('office-3', 'side-garlic-knots', 'Garlic Knots', 2, 21900), basketItem('office-4', 'drink-sprite', 'Sprite', 6, 9900)],
  },
  {
    id: 'basket-date-night', name: 'Date Night', kind: 'DATE_NIGHT', peopleCount: 2,
    lastOrderedAt: '2026-09-28T14:00:00.000Z', estimatedCurrentPrice: money(84700),
    items: [basketItem('date-1', 'pizza-mushroom-alfredo', 'Mushroom Alfredo Pizza', 1, 44900), basketItem('date-2', 'dessert-tiramisu', 'Tiramisu', 1, 29900), basketItem('date-3', 'drink-diet-coke', 'Diet Coke', 1, 9900)],
  },
];

export const householdMembers: HouseholdMember[] = [
  { id: 'household-meera', displayName: 'Meera', relationship: 'PARTNER', birthday: { day: 18, month: 11 }, foodPreference: 'VEG', favouritePizza: 'Pesto Pizza', favouriteSide: 'Garlic Knots', avoidIngredients: ['olives'] },
  { id: 'household-amma', displayName: 'Mom', relationship: 'MOM', birthday: { day: 13, month: 10 }, foodPreference: 'VEG', favouritePizza: 'Classic Margherita Pizza', favouriteSide: null, avoidIngredients: [] },
];

export const occasions: Occasion[] = [
  { id: 'occasion-mom-birthday', title: "Mom's birthday", type: 'BIRTHDAY', date: '2026-10-13', daysAway: 6, householdMemberId: 'household-amma', savedBasketId: 'basket-family-friday', peopleCount: 4, reminderPreference: 'THREE_DAYS' },
  { id: 'occasion-game-night', title: 'Game night', type: 'GAME_NIGHT', date: '2026-10-18', daysAway: 11, householdMemberId: null, savedBasketId: 'basket-movie-night', peopleCount: 3, reminderPreference: 'ONE_DAY' },
];

export const referral: Referral = {
  id: 'referral-priya', inviteeDisplayName: 'Priya', status: 'FIRST_ORDER_PENDING', sharedAt: '2026-10-04T10:00:00.000Z', qualifyingOrderCompleted: false,
  rewardLabel: 'Free Garlic Knots after a qualifying completed order', shareCode: 'AVENUE-PRIYA-24',
};
export const tasteCard: TasteCard = {
  displayName: 'Arjun R.', title: 'My Pizza Avenue picks',
  picks: [
    { productId: 'pizza-pesto', label: 'Pesto Pizza' },
    { productId: 'side-garlic-knots', label: 'Garlic Knots' },
    { productId: 'dessert-tiramisu', label: 'Tiramisu' },
  ],
  passportProgress: { completed: 4, total: 6 },
  sharePayload: { title: 'My Pizza Avenue picks', text: 'Pesto Pizza, Garlic Knots and Tiramisu · Pizza Passport 4/6' },
};

export const leagueOverview: LeagueOverview = {
  optedIn: true,
  meaningfulParticipation: true,
  season: {
    id: 'season-oct-2026', name: 'October Avenue', startsAt: '2026-10-01T00:00:00.000Z', endsAt: '2026-10-31T18:29:59.000Z',
    tiers: [
      { tier: 'STARTER', thresholdXp: 0 }, { tier: 'BRONZE', thresholdXp: 200 }, { tier: 'SILVER', thresholdXp: 400 },
      { tier: 'GOLD', thresholdXp: 600 }, { tier: 'AVENUE_CLUB', thresholdXp: 1000 },
    ],
  },
  currentTier: 'GOLD', currentXp: 620, currentRank: 12, progressMessage: '60 XP to Top 10',
  nextThreshold: { tier: 'AVENUE_CLUB', xpRemaining: 380 },
  topThree: [
    { id: 'league-1', displayName: 'Ananya S.', rank: 1, xp: 1120, isCurrentCustomer: false },
    { id: 'league-2', displayName: 'Vikram R.', rank: 2, xp: 1040, isCurrentCustomer: false },
    { id: 'league-3', displayName: 'Nisha K.', rank: 3, xp: 980, isCurrentCustomer: false },
  ],
  nearby: [
    { id: 'league-10', displayName: 'Ananya P.', rank: 10, xp: 680, isCurrentCustomer: false },
    { id: 'league-11', displayName: 'Vikram M.', rank: 11, xp: 650, isCurrentCustomer: false },
    { id: 'league-you', displayName: 'You', rank: 12, xp: 620, isCurrentCustomer: true },
    { id: 'league-13', displayName: 'Kabir A.', rank: 13, xp: 590, isCurrentCustomer: false },
    { id: 'league-14', displayName: 'Sneha P.', rank: 14, xp: 560, isCurrentCustomer: false },
  ],
  previousSeasonSummary: 'September · Silver · finished #24',
};

export const groupOrder: GroupOrder = {
  id: 'group-friday-team', name: 'Friday Pizza Crew', status: 'OPEN', inviteCode: 'FRIDAY-24', currentParticipantRole: 'HOST', notices: [],
  participants: [
    { id: 'participant-host', displayName: 'Arjun', role: 'HOST', contributions: [{ productId: 'pizza-pesto', productName: 'Pesto Pizza', quantity: 1 }] },
    { id: 'participant-priya', displayName: 'Priya', role: 'PARTICIPANT', contributions: [{ productId: 'pizza-chicken-pepperoni', productName: 'Chicken Pepperoni Pizza', quantity: 1 }] },
  ],
  poll: {
    id: 'poll-addon', question: 'What should we add?', options: [
      { id: 'poll-pepperoni', productId: 'pizza-chicken-pepperoni', label: 'Chicken Pepperoni', votes: 5, selectedByCurrentParticipant: false },
      { id: 'poll-pesto', productId: 'pizza-pesto', label: 'Pesto', votes: 4, selectedByCurrentParticipant: false },
      { id: 'poll-farmhouse', productId: 'pizza-farmhouse', label: 'Farmhouse', votes: 2, selectedByCurrentParticipant: false },
    ],
  },
};

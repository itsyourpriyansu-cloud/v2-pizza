import type { Cart, ModifierSelection } from './cart';
import type { EntityId, ISODateTime } from './common';
import type { Money } from './money';

export type SavedBasketKind = 'MY_USUAL' | 'FAMILY_FRIDAY' | 'MOVIE_NIGHT' | 'OFFICE_LUNCH' | 'DATE_NIGHT' | 'CUSTOM';

export interface SavedBasketItem {
  id: EntityId;
  productId: EntityId;
  productName: string;
  variantId: EntityId;
  variantName: string;
  modifiers: ModifierSelection[];
  quantity: number;
  historicalUnitPrice: Money;
}
export interface SavedBasket {
  id: EntityId;
  name: string;
  kind: SavedBasketKind;
  items: SavedBasketItem[];
  peopleCount: number | null;
  lastOrderedAt: ISODateTime | null;
  estimatedCurrentPrice: Money;
}

export interface SavedBasketDifference {
  code: 'PRICE_CHANGED' | 'ITEM_UNAVAILABLE' | 'MODIFIER_CHANGED' | 'SERVICE_MODE_UNAVAILABLE';
  itemId: EntityId;
  message: string;
  recoverable: boolean;
}

export interface SavedBasketValidationResult {
  basket: SavedBasket;
  cart: Cart;
  differences: SavedBasketDifference[];
  preservedItemCount: number;
}

export type HouseholdRelationship = 'ME' | 'PARTNER' | 'MOM' | 'DAD' | 'CHILD' | 'FRIEND' | 'OTHER';

export interface HouseholdMember {
  id: EntityId;
  displayName: string;
  relationship: HouseholdRelationship;
  birthday: { day: number; month: number } | null;
  foodPreference: 'VEG' | 'NON_VEG' | 'NO_PREFERENCE';
  favouritePizza: string | null;
  favouriteSide: string | null;
  avoidIngredients: string[];
}

export type HouseholdMemberInput = Omit<HouseholdMember, 'id'>;
export type OccasionType = 'BIRTHDAY' | 'ANNIVERSARY' | 'FAMILY_DINNER' | 'GAME_NIGHT' | 'OFFICE_PIZZA_DAY' | 'DATE_NIGHT' | 'CUSTOM';

export interface Occasion {
  id: EntityId;
  title: string;
  type: OccasionType;
  date: string;
  daysAway: number;
  householdMemberId: EntityId | null;
  savedBasketId: EntityId | null;
  peopleCount: number | null;
  reminderPreference: 'NONE' | 'ONE_DAY' | 'THREE_DAYS' | 'ONE_WEEK';
}

export type OccasionInput = Omit<Occasion, 'id' | 'daysAway'>;

export type ReferralStatus = 'SHARED' | 'CLICKED' | 'REGISTERED' | 'VERIFIED' | 'FIRST_ORDER_PENDING' | 'QUALIFIED' | 'REWARDED' | 'EXPIRED';

export interface Referral {
  id: EntityId;
  inviteeDisplayName: string;
  status: ReferralStatus;
  sharedAt: ISODateTime;
  qualifyingOrderCompleted: boolean;
  rewardLabel: string;
  shareCode: string;
}

export interface TasteCard {
  displayName: string;
  title: string;
  picks: Array<{ productId: EntityId; label: string }>;
  passportProgress: { completed: number; total: number };
  sharePayload: { title: string; text: string };
}

export type LeagueTier = 'STARTER' | 'BRONZE' | 'SILVER' | 'GOLD' | 'AVENUE_CLUB';

export interface LeagueEntry {
  id: EntityId;
  displayName: string;
  rank: number;
  xp: number;
  isCurrentCustomer: boolean;
}

export interface LeagueSeason {
  id: EntityId;
  name: string;
  startsAt: ISODateTime;
  endsAt: ISODateTime;
  tiers: Array<{ tier: LeagueTier; thresholdXp: number }>;
}

export interface LeagueOverview {
  optedIn: boolean;
  meaningfulParticipation: boolean;
  season: LeagueSeason;
  currentTier: LeagueTier;
  currentXp: number;
  currentRank: number | null;
  progressMessage: string;
  nextThreshold: { tier: LeagueTier; xpRemaining: number } | null;
  topThree: LeagueEntry[];
  nearby: LeagueEntry[];
  previousSeasonSummary: string | null;
}

export type GroupOrderStatus = 'OPEN' | 'LOCKED' | 'CHECKOUT_READY' | 'CLOSED' | 'EXPIRED' | 'HOST_LEFT';

export interface GroupParticipant {
  id: EntityId;
  displayName: string;
  role: 'HOST' | 'PARTICIPANT';
  contributions: Array<{ productId: EntityId; productName: string; quantity: number }>;
}

export interface GroupPollOption {
  id: EntityId;
  productId: EntityId;
  label: string;
  votes: number;
  selectedByCurrentParticipant: boolean;
}

export interface GroupPoll {
  id: EntityId;
  question: string;
  options: GroupPollOption[];
}

export interface GroupOrder {
  id: EntityId;
  name: string;
  status: GroupOrderStatus;
  inviteCode: string;
  currentParticipantRole: 'HOST' | 'PARTICIPANT';
  participants: GroupParticipant[];
  poll: GroupPoll | null;
  notices: string[];
}

export interface EngagementSummary {
  savedBasket: Pick<SavedBasket, 'id' | 'name' | 'lastOrderedAt' | 'peopleCount'> | null;
  occasion: Pick<Occasion, 'id' | 'title' | 'daysAway' | 'savedBasketId'> | null;
  referral: Pick<Referral, 'id' | 'inviteeDisplayName' | 'status'> | null;
  league: Pick<LeagueOverview, 'optedIn' | 'currentTier' | 'currentRank' | 'progressMessage'> | null;
  reactivation: { title: string; body: string; ctaLabel: string; ctaHref: string } | null;
}

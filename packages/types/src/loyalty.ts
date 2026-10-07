import type { EntityId, ISODateTime } from './common';

export type RewardRedemptionStatus =
  | 'AVAILABLE'
  | 'RESERVED'
  | 'APPLIED'
  | 'CONSUMED'
  | 'RELEASED';

export type RewardStatus =
  | 'LOCKED'
  | 'AVAILABLE'
  | 'RESERVED'
  | 'APPLIED'
  | 'CONSUMED'
  | 'EXPIRED'
  | 'UNAVAILABLE';

export interface LoyaltyAccount {
  id: EntityId;
  customerId: EntityId;
  pointsBalance: number;
  pendingPoints: number;
  avenueXp: number;
  nextRewardAt: number | null;
  status: 'ACTIVE' | 'SUSPENDED';
}

export interface LoyaltyTransaction {
  id: EntityId;
  accountId: EntityId;
  pointsDelta: number;
  type: 'EARN' | 'REDEEM' | 'REVERSAL' | 'ADJUSTMENT';
  sourceId: EntityId;
  displayLabel: string;
  sourceType: 'PICKUP_ORDER' | 'DINE_IN_ORDER' | 'REWARD' | 'ADJUSTMENT';
  createdAt: ISODateTime;
}

export interface Reward {
  id: EntityId;
  name: string;
  pointsCost: number;
  description: string;
  status: RewardStatus;
  remainingPoints: number;
  active: boolean;
}

export interface RewardRedemption {
  id: EntityId;
  customerId: EntityId;
  rewardId: EntityId;
  orderId: EntityId | null;
  status: RewardRedemptionStatus;
}

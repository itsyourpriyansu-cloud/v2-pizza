import type { EntityId, ISODateTime } from './common';

export type RewardRedemptionStatus =
  | 'AVAILABLE'
  | 'RESERVED'
  | 'APPLIED'
  | 'CONSUMED'
  | 'RELEASED';

export interface LoyaltyAccount {
  id: EntityId;
  customerId: EntityId;
  pointsBalance: number;
  status: 'ACTIVE' | 'SUSPENDED';
}

export interface LoyaltyTransaction {
  id: EntityId;
  accountId: EntityId;
  pointsDelta: number;
  type: 'EARN' | 'REDEEM' | 'REVERSAL' | 'ADJUSTMENT';
  sourceId: EntityId;
  createdAt: ISODateTime;
}

export interface Reward {
  id: EntityId;
  name: string;
  pointsCost: number;
  active: boolean;
}

export interface RewardRedemption {
  id: EntityId;
  customerId: EntityId;
  rewardId: EntityId;
  orderId: EntityId | null;
  status: RewardRedemptionStatus;
}

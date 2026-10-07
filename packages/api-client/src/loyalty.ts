import type {
  LoyaltyAccount,
  LoyaltyTransaction,
  Reward,
  RewardRedemption,
} from '@pizza-avenue/types';
import { apiRequest } from './client';

export function getLoyaltyAccount(): Promise<LoyaltyAccount> {
  return apiRequest('me/loyalty');
}

export function getRewards(): Promise<Reward[]> {
  return apiRequest('me/rewards');
}

export function getLoyaltyActivity(): Promise<LoyaltyTransaction[]> {
  return apiRequest('me/loyalty/activity');
}

export function reserveReward(rewardId: string): Promise<RewardRedemption> {
  return apiRequest(`rewards/${rewardId}/reserve`, { method: 'POST' });
}

export function releaseRewardReservation(redemptionId: string): Promise<RewardRedemption> {
  return apiRequest(`reward-reservations/${redemptionId}`, { method: 'DELETE' });
}

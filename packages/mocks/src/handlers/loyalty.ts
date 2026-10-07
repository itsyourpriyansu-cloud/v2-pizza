import { HttpResponse, http } from 'msw';
import type { Reward } from '@pizza-avenue/types';
import { loyaltyAccounts, loyaltyActivity, rewards } from '../data';
import { getScenarioState } from '../scenarios';

const loyaltyForScenario = () => {
  const { customer, rewards: rewardsScenario } = getScenarioState();
  if (rewardsScenario === 'POINTS_NEAR_REWARD') return { ...loyaltyAccounts.returning, pointsBalance: 270, nextRewardAt: 300 };
  if (rewardsScenario === 'DINE_IN_LOYALTY_PENDING') return { ...loyaltyAccounts.returning, pointsBalance: 840, pendingPoints: 130 };
  if (rewardsScenario === 'DINE_IN_LOYALTY_PAID') return { ...loyaltyAccounts.returning, pointsBalance: 970, pendingPoints: 0 };
  if (customer === 'NEW_CUSTOMER') return loyaltyAccounts.new;
  if (customer === 'LOYAL_CUSTOMER') return loyaltyAccounts.loyal;
  return loyaltyAccounts.returning;
};

function rewardsForScenario(): Reward[] {
  const scenario = getScenarioState().rewards;
  if (scenario === 'NO_REWARDS') return [];
  const statusByScenario: Partial<Record<typeof scenario, Reward['status']>> = {
    REWARD_LOCKED: 'LOCKED', REWARD_AVAILABLE: 'AVAILABLE', REWARD_RESERVED: 'RESERVED',
    REWARD_APPLIED: 'APPLIED', REWARD_CONSUMED: 'CONSUMED', REWARD_UNAVAILABLE: 'UNAVAILABLE',
  };
  const primaryStatus = statusByScenario[scenario];
  if (!primaryStatus) return rewards;
  return rewards.map((reward, index) => index === 0 ? { ...reward, status: primaryStatus } : reward);
}

export const loyaltyHandlers = [
  http.get('*/api/v1/me/loyalty', () => HttpResponse.json(loyaltyForScenario())),
  http.get('*/api/v1/me/rewards', () => getScenarioState().rewards === 'REWARDS_NETWORK_ERROR'
    ? HttpResponse.json({ message: 'Rewards are temporarily unavailable.' }, { status: 503 })
    : HttpResponse.json(rewardsForScenario())),
  http.get('*/api/v1/me/loyalty/activity', () => HttpResponse.json(loyaltyActivity)),
  http.post('*/api/v1/rewards/:rewardId/reserve', ({ params }) => getScenarioState().rewards === 'REWARD_RESERVATION_CONFLICT'
    ? HttpResponse.json({ message: 'This reward is already reserved.' }, { status: 409 })
    : HttpResponse.json({
      id: 'redemption-mock-1',
      customerId: loyaltyForScenario().customerId,
      rewardId: String(params.rewardId),
      orderId: null,
      status: 'RESERVED' as const,
    })),
  http.delete('*/api/v1/reward-reservations/:redemptionId', ({ params }) =>
    HttpResponse.json({
      id: String(params.redemptionId), customerId: loyaltyForScenario().customerId,
      rewardId: 'reward-dip', orderId: null, status: 'RELEASED' as const,
    }),
  ),
];

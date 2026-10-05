import { HttpResponse, http } from 'msw';
import { loyaltyAccounts, rewards } from '../data';
import { getScenarioState } from '../scenarios';

const loyaltyForScenario = () => {
  const scenario = getScenarioState().customer;
  if (scenario === 'NEW_CUSTOMER') return loyaltyAccounts.new;
  if (scenario === 'LOYAL_CUSTOMER') return loyaltyAccounts.loyal;
  return loyaltyAccounts.returning;
};

export const loyaltyHandlers = [
  http.get('*/api/v1/me/loyalty', () => HttpResponse.json(loyaltyForScenario())),
  http.get('*/api/v1/me/rewards', () =>
    HttpResponse.json(getScenarioState().rewards === 'NO_REWARDS' ? [] : rewards),
  ),
  http.post('*/api/v1/rewards/:rewardId/reserve', ({ params }) =>
    HttpResponse.json({
      id: 'redemption-mock-1',
      customerId: loyaltyForScenario().customerId,
      rewardId: String(params.rewardId),
      orderId: null,
      status: 'RESERVED' as const,
    }),
  ),
];

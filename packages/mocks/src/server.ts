import { setupServer } from 'msw/node';
import { resetCartData } from './handlers/cart';
import { resetEngagementData } from './handlers/engagement';
import { handlers } from './handlers';
import { resetScenarioState as resetScenarios } from './scenarios';

export const server = setupServer(...handlers);

export function resetScenarioState() {
  resetCartData();
  resetEngagementData();
  return resetScenarios();
}

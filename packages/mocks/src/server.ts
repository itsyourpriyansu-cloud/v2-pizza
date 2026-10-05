import { setupServer } from 'msw/node';
import { resetCartData } from './handlers/cart';
import { handlers } from './handlers';
import { resetScenarioState as resetScenarios } from './scenarios';

export const server = setupServer(...handlers);

export function resetScenarioState() {
  resetCartData();
  return resetScenarios();
}

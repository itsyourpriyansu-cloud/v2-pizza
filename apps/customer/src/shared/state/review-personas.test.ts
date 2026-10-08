import { getScenarioState } from '@pizza-avenue/mocks';
import { describe, expect, it } from 'vitest';
import { applyReviewPersona, reviewPersonaNames, reviewPersonaPresets } from './review-personas';

describe('client-review persona presets', () => {
  it('keeps every required review persona mapped to a deterministic preset', () => {
    expect(Object.keys(reviewPersonaPresets)).toEqual([...reviewPersonaNames]);
    for (const persona of reviewPersonaNames) {
      const first = applyReviewPersona(persona);
      const second = applyReviewPersona(persona);
      expect(second).toEqual(first);
    }
  });

  it('isolates the Passport one-left Home priority', () => {
    const applied = applyReviewPersona('PASSPORT_ONE_LEFT');
    expect(applied.serviceContext?.mode).toBe('PICKUP');
    expect(applied.scenarioState).toMatchObject({
      savedBasket: 'SAVED_BASKETS_EMPTY',
      occasion: 'NO_OCCASIONS',
      rewards: 'REWARD_LOCKED',
      passport: 'PASSPORT_ONE_LEFT',
      missions: 'NO_ACTIVE_MISSIONS',
    });
    expect(getScenarioState()).toEqual(applied.scenarioState);
  });

  it('provides an authenticated table context for the active Dine-in persona', () => {
    const applied = applyReviewPersona('ACTIVE_DINE_IN');
    expect(applied.serviceContext).toMatchObject({
      mode: 'DINE_IN',
      tableId: 'table-12',
      tableSessionId: 'table-session-12',
    });
    expect(applied.scenarioState.operations).toBe('DINE_IN_WAITER_CONFIRMED');
  });
});

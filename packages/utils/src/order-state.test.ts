import { assertOrderTransition, canTransitionOrder } from './order-state';

describe('documented order state transitions', () => {
  it('allows the canonical operational path', () => {
    expect(canTransitionOrder('CONFIRMED', 'PREPARING')).toBe(true);
    expect(canTransitionOrder('PREPARING', 'READY')).toBe(true);
    expect(canTransitionOrder('READY', 'PICKED_UP')).toBe(true);
    expect(canTransitionOrder('PICKED_UP', 'COMPLETED')).toBe(true);
  });

  it('rejects an illegal shortcut', () => {
    expect(() => assertOrderTransition('DRAFT', 'READY')).toThrow(
      'Invalid order transition: DRAFT -> READY',
    );
  });
});

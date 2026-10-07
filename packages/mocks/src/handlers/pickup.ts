import { HttpResponse, http } from 'msw';
import type { PickupOptions, PickupReservation } from '@pizza-avenue/types';
import { pickupOptions } from '../data';
import { getScenarioState } from '../scenarios';

function optionsForScenario(): PickupOptions {
  const response = structuredClone(pickupOptions);
  const scenario = getScenarioState().pickup;
  if (scenario === 'PICKUP_NO_SLOTS' || scenario === 'PICKUP_UNAVAILABLE') {
    return { asap: null, scheduled: [] };
  }
  const state =
    scenario === 'PICKUP_FULL' || scenario === 'PICKUP_SLOT_FULL'
      ? 'FULL'
      : scenario === 'PICKUP_NEAR_FULL'
        ? 'NEARLY_FULL'
        : 'AVAILABLE';
  if (response.asap) {
    response.asap.state = state;
    response.asap.remainingCapacityUnits = state === 'FULL' ? 0 : state === 'NEARLY_FULL' ? 2 : 12;
  }
  response.scheduled = response.scheduled.map((slot) => ({
    ...slot,
    state,
    remainingCapacityUnits: state === 'FULL' ? 0 : state === 'NEARLY_FULL' ? 2 : 12,
  }));
  return response;
}

export const pickupHandlers = [
  http.get('*/api/v1/stores/:storeId/pickup-options', () =>
    HttpResponse.json(optionsForScenario()),
  ),
  http.post('*/api/v1/pickup/reservations', async ({ request }) => {
    const input = (await request.json()) as {
      cartId: string;
      slotId: string;
      pickupType: PickupReservation['pickupType'];
      reservedCapacityUnits: number;
    };
    if (getScenarioState().pickup === 'PICKUP_FULL' || getScenarioState().pickup === 'PICKUP_SLOT_FULL') {
      return HttpResponse.json(
        { error: { code: 'SLOT_FULL', message: 'This pickup slot is full.', details: {} } },
        { status: 409 },
      );
    }
    const reservation: PickupReservation = {
      id: 'reservation-mock-1',
      cartId: input.cartId,
      slotId: input.slotId,
      pickupType: input.pickupType,
      reservedCapacityUnits: input.reservedCapacityUnits,
      status: 'HELD',
      expiresAt: getScenarioState().pickup === 'PICKUP_HOLD_EXPIRED'
        ? new Date(Date.now() - 60_000).toISOString()
        : new Date(Date.now() + 5 * 60_000).toISOString(),
    };
    return HttpResponse.json(reservation, { status: 201 });
  }),
];

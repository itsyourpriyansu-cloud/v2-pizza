import type { CustomerProfileUpdate } from '@pizza-avenue/types';
import { HttpResponse, http } from 'msw';
import { profiles } from '../data';
import { getScenarioState } from '../scenarios';

export const profileHandlers = [
  http.get('*/api/v1/me/profile', () => {
    const scenario = getScenarioState().profile;
    if (scenario === 'PROFILE_NETWORK_ERROR') return HttpResponse.json({ message: 'Profile is temporarily unavailable.' }, { status: 503 });
    return HttpResponse.json(scenario === 'PROFILE_PARTIAL' ? profiles.partial : profiles.complete);
  }),
  http.patch('*/api/v1/me/profile', async ({ request }) => {
    if (getScenarioState().profile === 'PROFILE_SAVE_FAILURE') return HttpResponse.json({ message: 'Preferences could not be saved.' }, { status: 503 });
    const update = await request.json() as CustomerProfileUpdate;
    return HttpResponse.json({ ...profiles.complete, ...update });
  }),
];

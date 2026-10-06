import { HttpResponse, http } from 'msw';
import { passportProgress } from '../data';
import { getScenarioState } from '../scenarios';

export const passportHandlers = [
  http.get('*/api/v1/me/passport', () => {
    const scenario = getScenarioState().passport;
    if (scenario === 'PASSPORT_NEW') return HttpResponse.json(passportProgress.new);
    if (scenario === 'PASSPORT_COMPLETED') {
      return HttpResponse.json(passportProgress.completed);
    }
    return HttpResponse.json(passportProgress.inProgress);
  }),
];

import { HttpResponse, http } from 'msw';
import { passportProgram, passportProgress } from '../data';
import { getScenarioState } from '../scenarios';

export const passportHandlers = [
  http.get('*/api/v1/me/passport', () => {
    const scenario = getScenarioState().passport;
    if (scenario === 'PASSPORT_NETWORK_ERROR') return HttpResponse.json({ message: 'Passport is temporarily unavailable.' }, { status: 503 });
    if (scenario === 'PASSPORT_NEW') return HttpResponse.json(passportProgress.new);
    if (scenario === 'PASSPORT_COMPLETED') {
      return HttpResponse.json(passportProgress.completed);
    }
    if (scenario === 'PASSPORT_ONE_LEFT') {
      return HttpResponse.json({ ...passportProgress.inProgress, completedItemIds: passportProgram.items.slice(0, 5).map((item) => item.id), nextItemId: 'passport-seasonal' });
    }
    if (scenario === 'PASSPORT_ITEM_UNAVAILABLE') {
      return HttpResponse.json({ ...passportProgress.inProgress, program: { ...passportProgress.inProgress.program, items: passportProgress.inProgress.program.items.map((item) => item.id === 'passport-avenue' ? { ...item, availability: 'UNAVAILABLE' as const } : item) } });
    }
    if (scenario === 'PASSPORT_IN_PROGRESS' || scenario === 'PASSPORT_PROGRESS') {
      return HttpResponse.json({ ...passportProgress.inProgress, status: 'IN_PROGRESS' as const });
    }
    return HttpResponse.json(passportProgress.inProgress);
  }),
];

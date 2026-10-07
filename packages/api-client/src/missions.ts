import type { MissionOverview } from '@pizza-avenue/types';
import { apiRequest } from './client';

export function getMissions(): Promise<MissionOverview> {
  return apiRequest('me/missions');
}

export function completeMission(missionId: string): Promise<MissionOverview> {
  return apiRequest(`missions/${missionId}/complete`, { method: 'POST' });
}

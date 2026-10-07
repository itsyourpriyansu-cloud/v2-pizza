import type { Mission, MissionOverview } from '@pizza-avenue/types';
import { HttpResponse, http } from 'msw';
import { missionOverview } from '../data';
import { getScenarioState } from '../scenarios';

function overviewForScenario(): MissionOverview {
  const scenario = getScenarioState().missions;
  const clone = structuredClone(missionOverview);
  if (scenario === 'NO_ACTIVE_MISSIONS') return { ...clone, personal: [], common: [] };
  if (scenario === 'MISSIONS_ZERO_PROGRESS' || scenario === 'PERSONAL_MISSION_0_PROGRESS') {
    return { ...clone, personal: clone.personal.map((mission) => ({ ...mission, status: 'ASSIGNED', progress: { ...mission.progress, current: 0, label: 'Not started' } })) };
  }
  if (scenario === 'PERSONAL_MISSION_PARTIAL') clone.common = [];
  if (scenario === 'PERSONAL_MISSION_COMPLETE') {
    const mission = clone.personal[0];
    if (mission) clone.personal[0] = { ...mission, status: 'COMPLETED', progress: { ...mission.progress, current: mission.progress.target, label: 'Complete' } };
  }
  if (scenario === 'COMMON_MISSION_COMPLETE') {
    clone.common = clone.common.map((mission) => ({ ...mission, status: 'COMPLETED', progress: { ...mission.progress, current: mission.progress.target, label: 'Complete' } }));
  }
  if (scenario === 'MISSION_EXPIRED') {
    const mission = clone.personal[0];
    if (mission) clone.personal[0] = { ...mission, status: 'EXPIRED', ctaLabel: null, ctaHref: null };
  }
  if (scenario === 'PERSONAL_MISSION_ACTIVE') clone.common = [];
  if (scenario === 'COMMON_MISSION_ACTIVE') clone.personal = [];
  return clone;
}

function completeMissionInOverview(overview: MissionOverview, missionId: string): MissionOverview {
  let awardedXp = 0;
  const finish = (mission: Mission) => {
    if (mission.id !== missionId || ['COMPLETED', 'REWARDED'].includes(mission.status)) return mission;
    awardedXp = mission.rewardXp;
    return { ...mission, status: 'COMPLETED' as const, progress: { ...mission.progress, current: mission.progress.target, label: 'Complete' } };
  };
  const personal = overview.personal.map(finish);
  const common = overview.common.map(finish);
  return { avenueXp: overview.avenueXp + awardedXp, personal, common };
}

export const missionHandlers = [
  http.get('*/api/v1/me/missions', () => getScenarioState().missions === 'MISSIONS_NETWORK_ERROR'
    ? HttpResponse.json({ message: 'Missions are temporarily unavailable.' }, { status: 503 })
    : HttpResponse.json(overviewForScenario())),
  http.post('*/api/v1/missions/:missionId/complete', ({ request }) => {
    const missionId = new URL(request.url).pathname.match(/\/missions\/([^/]+)\/complete$/)?.[1] ?? '';
    return HttpResponse.json(completeMissionInOverview(overviewForScenario(), missionId));
  }),
];

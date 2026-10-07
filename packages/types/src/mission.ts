import type { EntityId, ISODateTime } from './common';

export type MissionScope = 'PERSONAL' | 'COMMON';
export type MissionStatus = 'ASSIGNED' | 'ACTIVE' | 'IN_PROGRESS' | 'COMPLETED' | 'REWARDED' | 'EXPIRED' | 'CANCELLED';

export interface MissionProgress {
  current: number;
  target: number;
  label: string;
}

export interface Mission {
  id: EntityId;
  scope: MissionScope;
  title: string;
  requirement: string;
  status: MissionStatus;
  progress: MissionProgress;
  rewardXp: number;
  ctaLabel: string | null;
  ctaHref: string | null;
  expiresAt: ISODateTime | null;
}

export interface MissionOverview {
  avenueXp: number;
  personal: Mission[];
  common: Mission[];
}

import type { EntityId } from './common';

export interface PassportItem {
  id: EntityId;
  productId: EntityId;
  label: string;
  displayOrder: number;
  availability: 'AVAILABLE' | 'UNAVAILABLE';
}

export interface PassportProgram {
  id: EntityId;
  name: string;
  active: boolean;
  items: PassportItem[];
  milestoneRewardId: EntityId | null;
}

export interface PassportProgress {
  program: PassportProgram;
  programId: EntityId;
  customerId: EntityId;
  completedItemIds: EntityId[];
  completed: boolean;
  status: 'NEW' | 'IN_PROGRESS' | 'NEAR_COMPLETE' | 'COMPLETE';
  nextItemId: EntityId | null;
  unlockedRewardId: EntityId | null;
}

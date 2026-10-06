import type { EntityId } from './common';

export interface PassportItem {
  id: EntityId;
  productId: EntityId;
  label: string;
  displayOrder: number;
}

export interface PassportProgram {
  id: EntityId;
  name: string;
  active: boolean;
  items: PassportItem[];
  milestoneRewardId: EntityId | null;
}

export interface PassportProgress {
  programId: EntityId;
  customerId: EntityId;
  completedItemIds: EntityId[];
  completed: boolean;
  unlockedRewardId: EntityId | null;
}

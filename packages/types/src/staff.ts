import type { EntityId } from './common';

export type StaffRole =
  | 'WAITER'
  | 'KITCHEN'
  | 'COUNTER'
  | 'ADMIN'
  | 'MANAGER'
  | 'FOUNDER';

export type StaffPermission =
  | 'VIEW_ASSIGNED_TABLES'
  | 'CONFIRM_DINE_IN_ORDER'
  | 'MARK_DINE_IN_SERVED'
  | 'VIEW_KDS'
  | 'UPDATE_KDS_ORDER'
  | 'FINALIZE_TABLE_BILL'
  | 'RECORD_TABLE_PAYMENT'
  | 'CLOSE_TABLE_SESSION'
  | 'ISSUE_REFUND'
  | 'MANAGE_LOYALTY'
  | 'MANAGE_STAFF';

export interface StaffSummary {
  id: EntityId;
  displayName: string;
  roles: StaffRole[];
  storeId: EntityId;
}

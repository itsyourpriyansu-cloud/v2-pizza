import type { StaffPermission, StaffRole } from '@pizza-avenue/types';

const rolePermissions: Readonly<Record<StaffRole, readonly StaffPermission[]>> = {
  WAITER: ['VIEW_ASSIGNED_TABLES', 'CONFIRM_DINE_IN_ORDER', 'MARK_DINE_IN_SERVED'],
  KITCHEN: ['VIEW_KDS', 'UPDATE_KDS_ORDER'],
  COUNTER: ['FINALIZE_TABLE_BILL', 'RECORD_TABLE_PAYMENT', 'CLOSE_TABLE_SESSION'],
  ADMIN: ['FINALIZE_TABLE_BILL', 'RECORD_TABLE_PAYMENT', 'CLOSE_TABLE_SESSION'],
  MANAGER: [
    'VIEW_ASSIGNED_TABLES',
    'CONFIRM_DINE_IN_ORDER',
    'MARK_DINE_IN_SERVED',
    'VIEW_KDS',
    'UPDATE_KDS_ORDER',
    'FINALIZE_TABLE_BILL',
    'RECORD_TABLE_PAYMENT',
    'CLOSE_TABLE_SESSION',
    'ISSUE_REFUND',
    'MANAGE_LOYALTY',
  ],
  FOUNDER: [
    'VIEW_ASSIGNED_TABLES',
    'CONFIRM_DINE_IN_ORDER',
    'MARK_DINE_IN_SERVED',
    'VIEW_KDS',
    'UPDATE_KDS_ORDER',
    'FINALIZE_TABLE_BILL',
    'RECORD_TABLE_PAYMENT',
    'CLOSE_TABLE_SESSION',
    'ISSUE_REFUND',
    'MANAGE_LOYALTY',
    'MANAGE_STAFF',
  ],
};

export function roleHasPermission(role: StaffRole, permission: StaffPermission): boolean {
  return rolePermissions[role].includes(permission);
}

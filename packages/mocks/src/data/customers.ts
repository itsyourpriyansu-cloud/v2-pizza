import type { AuthIdentity, Customer, LoyaltyAccount } from '@pizza-avenue/types';
import { makeCustomer } from '../factories';

export const customers: Record<'new' | 'returning' | 'dualIdentity' | 'loyal', Customer> = {
  new: makeCustomer({
    id: 'customer-aisha',
    name: 'Aisha Khan',
    phoneMasked: '+91 ******2002',
  }),
  returning: makeCustomer({
    id: 'customer-arjun',
    name: 'Arjun Rao',
    phoneMasked: '+91 ******1001',
  }),
  dualIdentity: makeCustomer({
    id: 'customer-rahul',
    name: 'Rahul Mehta',
    phoneMasked: '+91 ******3003',
  }),
  loyal: makeCustomer({
    id: 'customer-neha',
    name: 'Neha Reddy',
    phoneMasked: '+91 ******4004',
  }),
};

export const loyaltyAccounts: Record<'new' | 'returning' | 'dualIdentity' | 'loyal', LoyaltyAccount> = {
  new: {
    id: 'loyalty-aisha',
    customerId: 'customer-aisha',
    pointsBalance: 0,
    pendingPoints: 0,
    avenueXp: 0,
    nextRewardAt: 300,
    status: 'ACTIVE',
  },
  returning: {
    id: 'loyalty-arjun',
    customerId: 'customer-arjun',
    pointsBalance: 840,
    pendingPoints: 0,
    avenueXp: 180,
    nextRewardAt: 900,
    status: 'ACTIVE',
  },
  dualIdentity: {
    id: 'loyalty-rahul',
    customerId: 'customer-rahul',
    pointsBalance: 260,
    pendingPoints: 120,
    avenueXp: 60,
    nextRewardAt: 300,
    status: 'ACTIVE',
  },
  loyal: {
    id: 'loyalty-neha',
    customerId: 'customer-neha',
    pointsBalance: 1420,
    pendingPoints: 0,
    avenueXp: 420,
    nextRewardAt: null,
    status: 'ACTIVE',
  },
};

export const authIdentities: AuthIdentity[] = [
  {
    id: 'identity-rahul-phone',
    customerId: 'customer-rahul',
    provider: 'PHONE',
    providerIdentifierMasked: '+91 ******3003',
    verifiedAt: '2026-09-01T10:00:00.000Z',
  },
  {
    id: 'identity-rahul-whatsapp',
    customerId: 'customer-rahul',
    provider: 'WHATSAPP',
    providerIdentifierMasked: '+91 ******3003',
    verifiedAt: '2026-09-01T10:05:00.000Z',
  },
];

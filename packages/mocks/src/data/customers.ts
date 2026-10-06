import type { Customer, LoyaltyAccount } from '@pizza-avenue/types';
import { makeCustomer } from '../factories';

export const customers: Record<'new' | 'returning' | 'loyal', Customer> = {
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
  loyal: makeCustomer({
    id: 'customer-neha',
    name: 'Neha Reddy',
    phoneMasked: '+91 ******4004',
  }),
};

export const loyaltyAccounts: Record<'new' | 'returning' | 'loyal', LoyaltyAccount> = {
  new: {
    id: 'loyalty-aisha',
    customerId: 'customer-aisha',
    pointsBalance: 0,
    status: 'ACTIVE',
  },
  returning: {
    id: 'loyalty-arjun',
    customerId: 'customer-arjun',
    pointsBalance: 840,
    status: 'ACTIVE',
  },
  loyal: {
    id: 'loyalty-neha',
    customerId: 'customer-neha',
    pointsBalance: 1420,
    status: 'ACTIVE',
  },
};

import type { CustomerProfile, CustomerProfileUpdate } from '@pizza-avenue/types';
import { apiRequest } from './client';

export function getProfile(): Promise<CustomerProfile> {
  return apiRequest('me/profile');
}

export function updateProfile(input: CustomerProfileUpdate): Promise<CustomerProfile> {
  return apiRequest('me/profile', { method: 'PATCH', body: JSON.stringify(input) });
}

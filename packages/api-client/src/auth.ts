import type { Customer, Session } from '@pizza-avenue/types';
import { apiRequest } from './client';

export interface AuthResult {
  customer: Customer;
  session: Session;
}

export function requestOtp(phone: string): Promise<{ accepted: true }> {
  return apiRequest('auth/otp/request', {
    method: 'POST',
    body: JSON.stringify({ phone }),
  });
}

export function verifyOtp(phone: string, otp: string): Promise<AuthResult> {
  return apiRequest('auth/otp/verify', {
    method: 'POST',
    body: JSON.stringify({ phone, otp }),
  });
}

export function consumeMagicLogin(token: string): Promise<AuthResult> {
  return apiRequest('auth/magic/consume', {
    method: 'POST',
    body: JSON.stringify({ token }),
  });
}

export function logout(): Promise<void> {
  return apiRequest('auth/logout', { method: 'POST' });
}

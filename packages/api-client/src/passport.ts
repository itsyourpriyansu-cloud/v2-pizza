import type { PassportProgress } from '@pizza-avenue/types';
import { apiRequest } from './client';

export function getPassportProgress(): Promise<PassportProgress> {
  return apiRequest('me/passport');
}

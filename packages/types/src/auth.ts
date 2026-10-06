import type { EntityId, ISODateTime } from './common';

export type AuthProvider = 'PHONE' | 'WHATSAPP';
export type AuthMethod = 'PHONE_OTP' | 'WHATSAPP_QR_MAGIC_LINK';

export interface Customer {
  id: EntityId;
  name: string;
  phoneMasked: string;
  createdAt: ISODateTime;
}

export interface AuthIdentity {
  id: EntityId;
  customerId: EntityId;
  provider: AuthProvider;
  providerIdentifierMasked: string;
  verifiedAt: ISODateTime;
}

export interface Session {
  id: EntityId;
  customerId: EntityId;
  authMethod: AuthMethod;
  createdAt: ISODateTime;
  expiresAt: ISODateTime;
  revokedAt: ISODateTime | null;
}

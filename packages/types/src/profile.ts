import type { EntityId } from './common';

export type FoodPreference = 'VEG' | 'NON_VEG' | 'NO_PREFERENCE';

export interface CustomerProfile {
  customerId: EntityId;
  name: string;
  phoneMasked: string;
  phoneVerified: boolean;
  foodPreference: FoodPreference;
  avoidMushrooms: boolean;
  preferredCrust: 'CLASSIC' | 'THIN' | null;
  favouriteProductIds: EntityId[];
  notifications: {
    transactional: boolean;
    offers: boolean;
    loyalty: boolean;
  };
}

export type CustomerProfileUpdate = Pick<CustomerProfile, 'foodPreference' | 'avoidMushrooms' | 'preferredCrust' | 'notifications'>;

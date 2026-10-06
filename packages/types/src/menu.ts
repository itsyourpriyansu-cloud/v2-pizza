import type { EntityId } from './common';
import type { Money } from './money';

export type AvailabilityState = 'AVAILABLE' | 'UNAVAILABLE' | 'SOLD_OUT';
export type ModifierSelectionType = 'SINGLE' | 'MULTIPLE';

export interface Category {
  id: EntityId;
  name: string;
  displayOrder: number;
  availability: AvailabilityState;
}

export interface Modifier {
  id: EntityId;
  groupId: EntityId;
  name: string;
  priceDelta: Money;
  availability: AvailabilityState;
  applicableProductIds: EntityId[];
  applicableVariantIds: EntityId[];
}

export interface ModifierGroup {
  id: EntityId;
  name: string;
  required: boolean;
  selectionType: ModifierSelectionType;
  minSelections: number;
  maxSelections: number;
  displayOrder: number;
  modifiers: Modifier[];
  applicableProductIds: EntityId[];
  applicableVariantIds: EntityId[];
}

export interface ProductVariant {
  id: EntityId;
  productId: EntityId;
  name: string;
  basePrice: Money;
  availability: AvailabilityState;
  modifierGroupIds: EntityId[];
}

export interface Product {
  id: EntityId;
  categoryId: EntityId;
  name: string;
  description: string;
  imageUrl: string | null;
  dietaryTags: string[];
  flags: Array<'BESTSELLER' | 'SIGNATURE' | 'PASSPORT' | 'FAVOURITE'>;
  availability: AvailabilityState;
  variants: ProductVariant[];
  modifierGroups: ModifierGroup[];
}

export interface Menu {
  storeId: EntityId;
  categories: Category[];
  products: Product[];
  version: string;
}

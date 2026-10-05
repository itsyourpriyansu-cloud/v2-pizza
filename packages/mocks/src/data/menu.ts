import type {
  Category,
  Menu,
  ModifierGroup,
  Product,
  ProductVariant,
} from '@pizza-avenue/types';
import { money } from '../factories';

export const categories: Category[] = [
  { id: 'signature', name: 'Signature', displayOrder: 1, availability: 'AVAILABLE' },
  { id: 'classics', name: 'Classics', displayOrder: 2, availability: 'AVAILABLE' },
  { id: 'vegetarian', name: 'Vegetarian', displayOrder: 3, availability: 'AVAILABLE' },
  { id: 'sides', name: 'Sides', displayOrder: 4, availability: 'AVAILABLE' },
  { id: 'desserts', name: 'Desserts', displayOrder: 5, availability: 'AVAILABLE' },
  { id: 'drinks', name: 'Drinks', displayOrder: 6, availability: 'AVAILABLE' },
];

const pizzaIds = [
  'pizza-margherita',
  'pizza-diavola',
  'pizza-funghi',
  'pizza-quattro-formaggi',
  'pizza-avenue-signature',
];

const sizeGroup: ModifierGroup = {
  id: 'group-size',
  name: 'Size',
  required: true,
  selectionType: 'SINGLE',
  minSelections: 1,
  maxSelections: 1,
  displayOrder: 1,
  applicableProductIds: pizzaIds,
  applicableVariantIds: [],
  modifiers: [
    {
      id: 'size-regular',
      groupId: 'group-size',
      name: 'Regular',
      priceDelta: money(0),
      availability: 'AVAILABLE',
      applicableProductIds: pizzaIds,
      applicableVariantIds: [],
    },
    {
      id: 'size-large',
      groupId: 'group-size',
      name: 'Large',
      priceDelta: money(18000),
      availability: 'AVAILABLE',
      applicableProductIds: pizzaIds,
      applicableVariantIds: [],
    },
  ],
};

const crustGroup: ModifierGroup = {
  id: 'group-crust',
  name: 'Crust',
  required: true,
  selectionType: 'SINGLE',
  minSelections: 1,
  maxSelections: 1,
  displayOrder: 2,
  applicableProductIds: pizzaIds,
  applicableVariantIds: [],
  modifiers: [
    {
      id: 'crust-classic',
      groupId: 'group-crust',
      name: 'Classic',
      priceDelta: money(0),
      availability: 'AVAILABLE',
      applicableProductIds: pizzaIds,
      applicableVariantIds: [],
    },
    {
      id: 'crust-thin',
      groupId: 'group-crust',
      name: 'Thin',
      priceDelta: money(0),
      availability: 'AVAILABLE',
      applicableProductIds: pizzaIds,
      applicableVariantIds: [],
    },
  ],
};

const toppingsGroup: ModifierGroup = {
  id: 'group-toppings',
  name: 'Extra toppings',
  required: false,
  selectionType: 'MULTIPLE',
  minSelections: 0,
  maxSelections: 3,
  displayOrder: 3,
  applicableProductIds: pizzaIds,
  applicableVariantIds: [],
  modifiers: [
    {
      id: 'topping-mushroom',
      groupId: 'group-toppings',
      name: 'Mushroom',
      priceDelta: money(6000),
      availability: 'AVAILABLE',
      applicableProductIds: pizzaIds,
      applicableVariantIds: [],
    },
    {
      id: 'topping-jalapeno',
      groupId: 'group-toppings',
      name: 'Jalapeño',
      priceDelta: money(5000),
      availability: 'AVAILABLE',
      applicableProductIds: pizzaIds,
      applicableVariantIds: [],
    },
    {
      id: 'topping-extra-cheese',
      groupId: 'group-toppings',
      name: 'Extra cheese',
      priceDelta: money(8000),
      availability: 'AVAILABLE',
      applicableProductIds: pizzaIds,
      applicableVariantIds: [],
    },
  ],
};

const pizzaVariants = (productId: string, basePaise: number): ProductVariant[] => [
  {
    id: `${productId}-regular`,
    productId,
    name: 'Regular',
    basePrice: money(basePaise),
    availability: 'AVAILABLE',
    modifierGroupIds: ['group-size', 'group-crust', 'group-toppings'],
  },
  {
    id: `${productId}-large`,
    productId,
    name: 'Large',
    basePrice: money(basePaise + 18000),
    availability: 'AVAILABLE',
    modifierGroupIds: ['group-size', 'group-crust', 'group-toppings'],
  },
];

function pizza(
  id: string,
  categoryId: string,
  name: string,
  description: string,
  basePaise: number,
  flags: Product['flags'] = [],
): Product {
  return {
    id,
    categoryId,
    name,
    description,
    imageUrl: null,
    dietaryTags: categoryId === 'vegetarian' ? ['VEGETARIAN'] : [],
    flags,
    availability: 'AVAILABLE',
    variants: pizzaVariants(id, basePaise),
    modifierGroups: [sizeGroup, crustGroup, toppingsGroup],
  };
}

function simpleProduct(
  id: string,
  categoryId: string,
  name: string,
  description: string,
  pricePaise: number,
): Product {
  return {
    id,
    categoryId,
    name,
    description,
    imageUrl: null,
    dietaryTags: [],
    flags: [],
    availability: 'AVAILABLE',
    variants: [
      {
        id: `${id}-standard`,
        productId: id,
        name: 'Standard',
        basePrice: money(pricePaise),
        availability: 'AVAILABLE',
        modifierGroupIds: [],
      },
    ],
    modifierGroups: [],
  };
}

export const products: Product[] = [
  pizza(
    'pizza-margherita',
    'classics',
    'Margherita',
    'Tomato, mozzarella and basil.',
    34900,
    ['BESTSELLER'],
  ),
  pizza(
    'pizza-diavola',
    'signature',
    'Diavola',
    'Spicy salami, chilli and mozzarella.',
    44900,
    ['BESTSELLER'],
  ),
  pizza(
    'pizza-funghi',
    'vegetarian',
    'Funghi',
    'Mushrooms, mozzarella and herbs.',
    42900,
  ),
  pizza(
    'pizza-quattro-formaggi',
    'vegetarian',
    'Quattro Formaggi',
    'A four-cheese pizza with a rich finish.',
    49900,
    ['PASSPORT'],
  ),
  pizza(
    'pizza-avenue-signature',
    'signature',
    'Avenue Signature',
    'The Pizza Avenue house combination.',
    54900,
    ['SIGNATURE', 'PASSPORT'],
  ),
  simpleProduct('side-garlic-bread', 'sides', 'Garlic Bread', 'Oven-baked garlic bread.', 17900),
  simpleProduct(
    'side-loaded-garlic-bread',
    'sides',
    'Loaded Garlic Bread',
    'Garlic bread finished with cheese.',
    24900,
  ),
  simpleProduct('drink-coke', 'drinks', 'Coke', 'Chilled soft drink.', 8000),
  simpleProduct('drink-sprite', 'drinks', 'Sprite', 'Chilled soft drink.', 8000),
  simpleProduct('dessert-tiramisu', 'desserts', 'Tiramisu', 'Coffee-layered Italian dessert.', 24900),
];

export const menu: Menu = {
  storeId: 'sainikpuri',
  categories,
  products,
  version: 'mock-menu-1',
};

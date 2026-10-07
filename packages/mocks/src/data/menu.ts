import type {
  Category,
  Menu,
  ModifierGroup,
  Product,
  ProductVariant,
} from '@pizza-avenue/types';
import { money } from '../factories';

export const categories: Category[] = [
  { id: 'pizzas', name: 'Pizzas', displayOrder: 1, availability: 'AVAILABLE' },
  { id: 'pastas', name: 'Pastas', displayOrder: 2, availability: 'AVAILABLE' },
  { id: 'sides', name: 'Breads & Sides', displayOrder: 3, availability: 'AVAILABLE' },
  { id: 'dips', name: 'Dips', displayOrder: 4, availability: 'AVAILABLE' },
  { id: 'desserts', name: 'Dessert', displayOrder: 5, availability: 'AVAILABLE' },
  { id: 'drinks', name: 'Drinks', displayOrder: 6, availability: 'AVAILABLE' },
];

const pizzaIds = [
  'pizza-margherita',
  'pizza-diavola',
  'pizza-funghi',
  'pizza-quattro-formaggi',
  'pizza-avenue-signature',
];

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
  displayOrder: 4,
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
      id: 'topping-olives',
      groupId: 'group-toppings',
      name: 'Olives',
      priceDelta: money(5000),
      availability: 'AVAILABLE',
      applicableProductIds: pizzaIds,
      applicableVariantIds: [],
    },
    {
      id: 'topping-onion',
      groupId: 'group-toppings',
      name: 'Onion',
      priceDelta: money(4000),
      availability: 'AVAILABLE',
      applicableProductIds: pizzaIds,
      applicableVariantIds: [],
    },
  ],
};

const cheeseGroup: ModifierGroup = {
  id: 'group-cheese',
  name: 'Cheese',
  required: false,
  selectionType: 'MULTIPLE',
  minSelections: 0,
  maxSelections: 1,
  displayOrder: 3,
  applicableProductIds: pizzaIds,
  applicableVariantIds: [],
  modifiers: [
    {
      id: 'topping-extra-cheese',
      groupId: 'group-cheese',
      name: 'Extra cheese',
      priceDelta: money(8000),
      availability: 'AVAILABLE',
      applicableProductIds: pizzaIds,
      applicableVariantIds: [],
    },
  ],
};

const dipsGroup: ModifierGroup = {
  id: 'group-dips',
  name: 'Dips',
  required: false,
  selectionType: 'MULTIPLE',
  minSelections: 0,
  maxSelections: 2,
  displayOrder: 5,
  applicableProductIds: pizzaIds,
  applicableVariantIds: [],
  modifiers: [
    {
      id: 'dip-viva-rosso-addon',
      groupId: 'group-dips',
      name: 'Viva Rosso',
      priceDelta: money(6000),
      availability: 'AVAILABLE',
      applicableProductIds: pizzaIds,
      applicableVariantIds: [],
    },
    {
      id: 'dip-pesto-addon',
      groupId: 'group-dips',
      name: 'Pesto Dip',
      priceDelta: money(7000),
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
    modifierGroupIds: ['group-crust', 'group-cheese', 'group-toppings', 'group-dips'],
  },
  {
    id: `${productId}-large`,
    productId,
    name: 'Large',
    basePrice: money(basePaise + 18000),
    availability: 'AVAILABLE',
    modifierGroupIds: ['group-crust', 'group-cheese', 'group-toppings', 'group-dips'],
  },
];

function pizza(
  id: string,
  categoryId: string,
  name: string,
  description: string,
  basePaise: number,
  flags: Product['flags'] = [],
  dietaryTags: string[] = [],
): Product {
  return {
    id,
    categoryId,
    name,
    description,
    imageUrl: id === 'pizza-funghi' ? '/assets/seed/mushroom-cheese-pizza.png' : null,
    dietaryTags,
    flags,
    availability: 'AVAILABLE',
    variants: pizzaVariants(id, basePaise),
    modifierGroups: [crustGroup, cheeseGroup, toppingsGroup, dipsGroup],
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
    imageUrl: id === 'side-garlic-bread' || id === 'side-loaded-garlic-bread'
      ? '/assets/seed/cheesy-garlic-bread.png'
      : null,
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
    'pizzas',
    'Margherita',
    'Tomato, mozzarella and basil.',
    34900,
    ['BESTSELLER'],
    ['VEGETARIAN'],
  ),
  pizza(
    'pizza-diavola',
    'pizzas',
    'Diavola',
    'Spicy salami, chilli and mozzarella.',
    44900,
    ['BESTSELLER'],
  ),
  pizza(
    'pizza-funghi',
    'pizzas',
    'Funghi',
    'Mushrooms, mozzarella and herbs.',
    42900,
    [],
    ['VEGETARIAN'],
  ),
  pizza(
    'pizza-quattro-formaggi',
    'pizzas',
    'Quattro Formaggi',
    'A four-cheese pizza with a rich finish.',
    49900,
    ['PASSPORT'],
    ['VEGETARIAN'],
  ),
  pizza(
    'pizza-avenue-signature',
    'pizzas',
    'Avenue Signature',
    'The Pizza Avenue house combination.',
    54900,
    ['SIGNATURE', 'PASSPORT'],
  ),
  simpleProduct('pasta-alfredo', 'pastas', 'Alfredo Pasta', 'Creamy sauce with herbs.', 32900),
  simpleProduct('pasta-arrabbiata', 'pastas', 'Arrabbiata Pasta', 'Tomato, chilli and garlic.', 30900),
  simpleProduct('side-garlic-bread', 'sides', 'Garlic Bread', 'Oven-baked garlic bread.', 17900),
  simpleProduct(
    'side-loaded-garlic-bread',
    'sides',
    'Loaded Garlic Bread',
    'Garlic bread finished with cheese.',
    24900,
  ),
  simpleProduct('dip-viva-rosso', 'dips', 'Viva Rosso', 'A bright tomato and chilli dip.', 6000),
  simpleProduct('dip-pesto', 'dips', 'Pesto Dip', 'Herby basil pesto.', 7000),
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

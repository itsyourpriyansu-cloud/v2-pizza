import type {
  Category,
  Menu,
  ModifierGroup,
  Product,
  ProductVariant,
} from '@pizza-avenue/types';
import { money } from '../factories';

export const categories: Category[] = [
  { id: 'veggie-haven', name: 'Veggie Haven', displayOrder: 1, availability: 'AVAILABLE' },
  { id: 'non-veg-paradise', name: 'Non-Veg Paradise', displayOrder: 2, availability: 'AVAILABLE' },
  { id: 'pasta', name: 'Pasta — Tossed & Sauced', displayOrder: 3, availability: 'AVAILABLE' },
  { id: 'breads-sides', name: 'Breads & Sides', displayOrder: 4, availability: 'AVAILABLE' },
  { id: 'dunk-dip', name: 'Dunk & Dip', displayOrder: 5, availability: 'AVAILABLE' },
  { id: 'top-it-off', name: 'Top It Off', displayOrder: 6, availability: 'AVAILABLE' },
  { id: 'dessert', name: 'Dessert', displayOrder: 7, availability: 'AVAILABLE' },
  { id: 'canned-classics', name: 'Canned Classics', displayOrder: 8, availability: 'AVAILABLE' },
];

const pizzaIds = [
  'pizza-margherita',
  'pizza-mushroom-alfredo',
  'pizza-pesto',
  'pizza-paneer-makhani',
  'pizza-farmhouse',
  'pizza-corn',
  'pizza-diavola',
  'pizza-chicken-alfredo',
  'pizza-chicken-makhani',
  'pizza-meat-lovers',
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
    imageUrl: id === 'pizza-mushroom-alfredo' ? '/assets/seed/mushroom-cheese-pizza.png' : null,
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
    imageUrl: id === 'side-garlic-bread' || id === 'side-pepperoni-garlic-bread'
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
  pizza('pizza-margherita', 'veggie-haven', 'Classic Margherita Pizza', 'Tomato, mozzarella and basil.', 34900, ['BESTSELLER', 'PASSPORT'], ['VEGETARIAN']),
  pizza('pizza-mushroom-alfredo', 'veggie-haven', 'Mushroom Alfredo Pizza', 'Mushrooms, creamy Alfredo and mozzarella.', 42900, ['PASSPORT'], ['VEGETARIAN']),
  pizza('pizza-pesto', 'veggie-haven', 'Pesto Pizza', 'Basil pesto, mozzarella and cherry tomato.', 41900, [], ['VEGETARIAN']),
  pizza('pizza-paneer-makhani', 'veggie-haven', 'Paneer Makhani Pizza', 'Spiced paneer, makhani sauce and onion.', 44900, ['PASSPORT'], ['VEGETARIAN']),
  pizza('pizza-farmhouse', 'veggie-haven', 'Farmhouse Pizza', 'Capsicum, onion, corn and mozzarella.', 43900, ['SIGNATURE', 'BESTSELLER', 'PASSPORT'], ['VEGETARIAN']),
  pizza('pizza-corn', 'veggie-haven', 'Corn Pizza', 'Sweet corn, mozzarella and herbed tomato sauce.', 37900, [], ['VEGETARIAN']),
  pizza('pizza-diavola', 'non-veg-paradise', 'Chicken Pepperoni Pizza', 'Chicken pepperoni, mozzarella and tomato sauce.', 45900, ['BESTSELLER', 'PASSPORT']),
  pizza('pizza-chicken-alfredo', 'non-veg-paradise', 'Chicken Alfredo Pizza', 'Roast chicken, creamy Alfredo and herbs.', 47900),
  pizza('pizza-chicken-makhani', 'non-veg-paradise', 'Chicken Makhani Pizza', 'Makhani chicken, onion and mozzarella.', 48900, ['SIGNATURE']),
  pizza('pizza-meat-lovers', 'non-veg-paradise', 'Meat Lovers Pizza', 'Chicken pepperoni, roast chicken and mozzarella.', 52900, ['PASSPORT']),
  simpleProduct('pasta-alfredo', 'pasta', 'Alfredo Pasta', 'Creamy sauce with herbs.', 32900),
  simpleProduct('pasta-pesto', 'pasta', 'Pesto Pasta', 'Basil pesto, parmesan and herbs.', 32900),
  simpleProduct('pasta-arrabbiata', 'pasta', 'Arrabbiata Pasta', 'Tomato, chilli and garlic.', 30900),
  simpleProduct('pasta-aglio-olio', 'pasta', 'Spaghetti Aglio-e-Olio', 'Garlic, olive oil and chilli flakes.', 29900),
  simpleProduct('side-focaccia', 'breads-sides', 'Focaccia', 'Oven-baked rosemary focaccia.', 15900),
  simpleProduct('side-garlic-knots', 'breads-sides', 'Garlic Knots', 'Soft knots tossed in garlic butter.', 16900),
  simpleProduct('side-garlic-bread', 'breads-sides', 'Garlic Bread', 'Oven-baked garlic bread.', 17900),
  simpleProduct('side-pepperoni-garlic-bread', 'breads-sides', 'Pepperoni Garlic Bread', 'Garlic bread with chicken pepperoni and cheese.', 24900),
  simpleProduct('dip-viva-rosso', 'dunk-dip', 'Viva Rosso', 'A bright tomato and chilli dip.', 6000),
  simpleProduct('dip-pesto', 'dunk-dip', 'Pesto', 'Herby basil pesto.', 7000),
  simpleProduct('top-fresh-mozzarella', 'top-it-off', 'Fresh Mozzarella', 'A cool fresh mozzarella finish.', 9900),
  simpleProduct('top-burrata', 'top-it-off', 'Burrata', 'Creamy burrata for sharing.', 18900),
  simpleProduct('dessert-tiramisu', 'dessert', 'Tiramisu', 'Coffee-layered Italian dessert.', 24900),
  simpleProduct('drink-coke', 'canned-classics', 'Coke', 'Chilled soft drink.', 8000),
  simpleProduct('drink-sprite', 'canned-classics', 'Sprite', 'Chilled soft drink.', 8000),
  simpleProduct('drink-thums-up', 'canned-classics', 'Thums Up', 'Chilled soft drink.', 8000),
  simpleProduct('drink-diet-coke', 'canned-classics', 'Diet Coke', 'Chilled zero-sugar soft drink.', 9000),
  simpleProduct('drink-water-1l', 'canned-classics', 'Water Bottle 1L', 'Packaged drinking water.', 5000),
  simpleProduct('drink-water-500ml', 'canned-classics', 'Water Bottle 500ml', 'Packaged drinking water.', 3000),
];

export const menu: Menu = {
  storeId: 'sainikpuri',
  categories,
  products,
  version: 'mock-menu-2',
};

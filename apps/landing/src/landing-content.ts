export interface SignaturePizza {
  readonly name: string;
  readonly description: string;
  readonly price: string;
  readonly dietaryLabel: 'Veg' | 'Non-veg';
  readonly imageSrc: string;
  readonly imageAlt: string;
}

/**
 * Prototype-only marketing content extracted from the supplied menu reference.
 * Names, ingredients and prices require founder verification before release and
 * never participate in authoritative cart or checkout calculations.
 */
export const signaturePizzas: readonly SignaturePizza[] = [
  {
    name: 'Farmhouse Pizza',
    description: 'Peppers, onions and garden vegetables over a bright tomato base.',
    price: 'From ₹520*',
    dietaryLabel: 'Veg',
    imageSrc: '/assets/pizza-wave/hero-main-pizza.png',
    imageAlt: 'Freshly baked vegetable pizza with peppers, onion, basil and melted cheese',
  },
  {
    name: 'Mushroom Alfredo',
    description: 'Sautéed mushrooms, mozzarella and a creamy Alfredo-style finish.',
    price: 'From ₹450*',
    dietaryLabel: 'Veg',
    imageSrc: '/assets/pizza-wave/mushroom-cheese-pizza.png',
    imageAlt: 'Mushroom and cheese pizza on a ceramic plate',
  },
  {
    name: 'Paneer Makhani',
    description: 'Spiced paneer, peppers and mozzarella on a warm makhani-style base.',
    price: 'From ₹420*',
    dietaryLabel: 'Veg',
    imageSrc: '/assets/pizza-wave/paneer-cheese-pizza.png',
    imageAlt: 'Paneer pizza with green peppers, onion, herbs and melted cheese',
  },
  {
    name: 'Chicken Makhani',
    description: 'Charred chicken, peppers and mozzarella with a rich, spiced finish.',
    price: 'From ₹520*',
    dietaryLabel: 'Non-veg',
    imageSrc: '/assets/pizza-wave/chicken-tikka-pizza.png',
    imageAlt: 'Chicken pizza with green peppers, onion, herbs and melted cheese',
  },
];

export const proofPoints = [
  'Freshly baked',
  'Made to order',
  'Italian-inspired',
  'Pickup made easy',
] as const;

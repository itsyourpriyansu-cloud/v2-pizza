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

const palette = {
  maroon: '#6B1F1F',
  espresso: '#3B2F2A',
  sand: '#EADCC8',
  brown: '#8C4A2F',
  olive: '#556B2F',
  sage: '#A7B58B',
  cream: '#FDF6E9',
} as const;

export interface HeroCategoryCard {
  readonly id: string;
  readonly label: string;
  readonly imageSrc: string;
  readonly imageAlt: string;
  readonly badgeBg: string;
  readonly badgeColor: string;
}

export const heroCategoryCards: readonly HeroCategoryCard[] = [
  {
    id: 'pizzas',
    label: 'PIZZA',
    imageSrc: '/assets/pizza-wave/hero-main-pizza.png',
    imageAlt: 'Handcrafted fresh vegetable pizza slice',
    badgeBg: palette.espresso,
    badgeColor: palette.cream,
  },
  {
    id: 'paneer',
    label: 'PANEER',
    imageSrc: '/assets/pizza-wave/paneer-cheese-pizza.png',
    imageAlt: 'Spiced paneer and pepper pizza',
    badgeBg: palette.sand,
    badgeColor: palette.espresso,
  },
  {
    id: 'chicken',
    label: 'CHICKEN',
    imageSrc: '/assets/pizza-wave/chicken-tikka-pizza.png',
    imageAlt: 'Charred chicken tikka pizza',
    badgeBg: palette.brown,
    badgeColor: palette.cream,
  },
  {
    id: 'mushrooms',
    label: 'MUSHROOM',
    imageSrc: '/assets/pizza-wave/mushroom-cheese-pizza.png',
    imageAlt: 'Creamy mushroom alfredo pizza',
    badgeBg: palette.sage,
    badgeColor: palette.espresso,
  },
  {
    id: 'sides',
    label: 'SIDES',
    imageSrc: '/assets/pizza-wave/cheesy-garlic-bread.png',
    imageAlt: 'Cheesy herb garlic bread slices',
    badgeBg: palette.olive,
    badgeColor: palette.cream,
  },
  {
    id: 'desserts',
    label: 'DESSERT',
    imageSrc: '/assets/pizza-wave/chocolate-brownie.png',
    imageAlt: 'Warm rich chocolate brownie slice',
    badgeBg: palette.cream,
    badgeColor: palette.maroon,
  },
];

export const brandStoryPoints = {
  contentA: {
    title: 'The 80 Sq.Ft. Kiosk',
    description:
      'We started with a humble roadside kiosk in Sainikpuri—just a single deck oven, 72-hour cold-fermented dough, and a mission to serve honest artisanal slices on the go.',
    image: {
      url: '/assets/pizza-wave/hero-main-pizza.png',
      width: 658,
      height: 715,
      alt: 'Freshly baked artisanal pizza from our original kiosk oven',
    },
  },
  contentB: {
    title: 'The Street-Side Craving',
    description:
      'Queues formed down the pavement as word quickly spread. Our tiny kiosk was pushing out hundreds of blistered crusts every evening, proving that Sainikpuri craved serious sourdough.',
    image: {
      url: '/assets/pizza-wave/paneer-cheese-pizza.png',
      width: 658,
      height: 715,
      alt: 'Handcrafted paneer pizza with blistered sourdough crust',
    },
  },
  contentC: {
    title: 'Our Permanent Pizzeria Spot',
    description:
      'That kiosk dream has evolved into our dedicated neighbourhood pizzeria spot—complete with high-capacity ovens, 20-minute rapid pickup, and the same uncompromising craft.',
    image: {
      url: '/assets/pizza-wave/mushroom-cheese-pizza.png',
      width: 658,
      height: 715,
      alt: 'Gourmet pizza served at our permanent Sainikpuri pizzeria spot',
    },
  },
};

export interface FaqItemContent {
  readonly id: string;
  readonly q: string;
  readonly a: string;
}

export const landingFaqs: readonly FaqItemContent[] = [
  {
    id: 'item-pickup',
    q: 'How does pickup work at the Sainikpuri counter?',
    a: 'Order ahead through our web app. We fire your pizza fresh in our high-capacity ovens, ready for pickup in 20 minutes with zero waiting.',
  },
  {
    id: 'item-crust',
    q: 'Can I customise crusts and toppings?',
    a: 'Yes! Choose between our 72-hour cold-fermented sourdough crusts, extra toppings, and spice levels directly in the ordering menu.',
  },
  {
    id: 'item-passport',
    q: 'What is the Pizza Passport loyalty program?',
    a: 'Every pickup order earns stamp progress towards free pizzas, secret menu drops, and exclusive community tasting invites.',
  },
  {
    id: 'item-delivery',
    q: 'Do you offer home delivery?',
    a: 'We are pickup-first to ensure your sourdough crust stays blistered, hot, and crispy. You can pick up directly at our Sainikpuri store.',
  },
  {
    id: 'item-hygiene',
    q: 'Are vegetarian and non-vegetarian pizzas prepared separately?',
    a: 'Absolutely. We maintain strict separation of prep stations, utensils, and baking zones for all veg and non-veg orders.',
  },
];

export interface CustomerReviewItem {
  readonly id: string | number;
  readonly title: string;
  readonly description: string;
  readonly name: string;
  readonly role: string;
  readonly rating: number;
  readonly tags: readonly string[];
  readonly avatar: string;
  readonly image?: string;
}

export const googleMapsReviewsUrl = 'https://maps.app.goo.gl/dMzrGhS9LBqQVNx3A';

export const customerReviews: readonly CustomerReviewItem[] = [
  {
    id: 1,
    title: 'The best sourdough crust in Sainikpuri',
    description:
      'Hands down the crispiest, airiest sourdough base in Secunderabad. We ordered the Mushroom Alfredo and picked it up piping hot in under 20 minutes.',
    name: 'Rahul Verma',
    role: 'Local Guide · 48 reviews',
    rating: 5,
    tags: ['Google Review', 'Sainikpuri', 'Sourdough'],
    avatar:
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    image: '/assets/pizza-wave/mushroom-cheese-pizza.png',
  },
  {
    id: 2,
    title: 'Unmatched pickup experience',
    description:
      'Ordered ahead on the web app and our box was ready at the handover counter the moment we walked in. The Chicken Makhani has the perfect blistered crust.',
    name: 'Ananya Reddy',
    role: 'Google Reviewer · Sainikpuri',
    rating: 5,
    tags: ['Fast Pickup', 'Chicken Makhani'],
    avatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    image: '/assets/pizza-wave/chicken-tikka-pizza.png',
  },
  {
    id: 3,
    title: 'Finally, authentic Neapolitan-style dough',
    description:
      '72-hour slow-fermented dough makes all the difference. Super light on the stomach, no heavy bloat. The Farmhouse veg is loaded with fresh toppings.',
    name: 'Vikram Malhotra',
    role: 'Food Explorer · 120 reviews',
    rating: 5,
    tags: ['72hr Ferment', 'Farmhouse'],
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    image: '/assets/pizza-wave/hero-main-pizza.png',
  },
  {
    id: 4,
    title: 'Paneer Makhani with real charred edges',
    description:
      'The balance of spicy makhani sauce and fresh mozzarella is outstanding. Great vibes at the 42 Sainikpuri counter and friendly team.',
    name: 'Sneha Rao',
    role: 'Google Reviewer · Secunderabad',
    rating: 5,
    tags: ['Paneer Makhani', 'Veg Friendly'],
    avatar:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    image: '/assets/pizza-wave/paneer-cheese-pizza.png',
  },
  {
    id: 5,
    title: 'Garlic bread & dips are incredible too',
    description:
      'Not just great pizza — the cheesy garlic bread and hot dips make every weekend pickup complete. Loyalty passport stamps add up fast!',
    name: 'Karthik Nair',
    role: 'Sainikpuri Regular',
    rating: 5,
    tags: ['Garlic Bread', 'Pizza Passport'],
    avatar:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    image: '/assets/pizza-wave/cheesy-garlic-bread.png',
  },
];

export interface CustomerFlowStep {
  readonly stepNumber: number;
  readonly stepLabel: string;
  readonly title: string;
  readonly description: string;
  readonly actionText: string;
  readonly actionColor: string;
  readonly imageSrc: string;
  readonly imageAlt: string;
}

export const customerFlowSteps: readonly CustomerFlowStep[] = [
  {
    stepNumber: 1,
    stepLabel: 'STEP 1',
    title: 'PICK WHAT HITS',
    description: 'Add items to your cart and check out fast.',
    actionText: 'BROWSE',
    actionColor: palette.sand,
    imageSrc: '/assets/customer-flow/step-1-browse.jpg',
    imageAlt: 'Customer smiling while browsing Pizza Avenue menu on phone',
  },
  {
    stepNumber: 2,
    stepLabel: 'STEP 2',
    title: 'PICK YOUR TIME',
    description: 'Choose a pickup slot that works for you.',
    actionText: 'ORDER',
    actionColor: palette.sage,
    imageSrc: '/assets/customer-flow/step-2-order.jpg',
    imageAlt: 'Friends happily opening a freshly baked artisan pizza box',
  },
  {
    stepNumber: 3,
    stepLabel: 'STEP 3',
    title: 'EAT LIKE YOU MEAN IT',
    description: 'Tear into it. No apologies. No regrets. Just good food.',
    actionText: 'ENJOY',
    actionColor: palette.cream,
    imageSrc: '/assets/customer-flow/step-3-enjoy.jpg',
    imageAlt: 'Customer taking a joyful bite of freshly baked artisan pizza',
  },
];

export interface CravingMenuItem {
  readonly id: string;
  readonly name: string;
  readonly category: string;
  readonly description: string;
  readonly price: string;
  readonly priceValue: number;
  readonly imageSrc: string;
  readonly imageAlt: string;
  readonly dietaryLabel: 'Veg' | 'Non-veg';
}

export interface CravingCategory {
  readonly id: string;
  readonly label: string;
}

export const cravingCategories: readonly CravingCategory[] = [
  { id: 'hot-selling', label: 'HOT SELLING' },
  { id: 'veg-pizza', label: 'VEG PIZZAS' },
  { id: 'non-veg-pizza', label: 'NON-VEG PIZZAS' },
  { id: 'pasta', label: 'PASTAS' },
  { id: 'sides', label: 'BREADS & SIDES' },
  { id: 'dessert-dips', label: 'DESSERT & DIPS' },
];

export const cravingMenuItems: readonly CravingMenuItem[] = [
  // HOT SELLING
  {
    id: 'hs-margherita',
    name: 'CLASSIC MARGHERITA',
    category: 'hot-selling',
    description: 'San Marzano tomato sauce, mozzarella, fresh basil.',
    price: '₹380',
    priceValue: 380,
    imageSrc: '/assets/pizza-wave/hero-main-pizza.png',
    imageAlt: 'Classic Margherita pizza with San Marzano tomato sauce and fresh basil',
    dietaryLabel: 'Veg',
  },
  {
    id: 'hs-pepperoni',
    name: 'CHICKEN PEPPERONI',
    category: 'hot-selling',
    description: 'San Marzano tomato sauce, mozzarella, spicy chicken pepperoni.',
    price: '₹480',
    priceValue: 480,
    imageSrc: '/assets/pizza-wave/chicken-tikka-pizza.png',
    imageAlt: 'Chicken pepperoni pizza with melted mozzarella',
    dietaryLabel: 'Non-veg',
  },
  {
    id: 'hs-alfredo-pasta',
    name: 'ALFREDO PASTA',
    category: 'hot-selling',
    description: 'Fettuccine tossed in a silky, parmesan-rich cream sauce.',
    price: '₹370',
    priceValue: 370,
    imageSrc: '/assets/menu/alfredo-pasta.jpg',
    imageAlt: 'Fettuccine Alfredo pasta in rich creamy parmesan sauce',
    dietaryLabel: 'Veg',
  },
  {
    id: 'hs-garlic-knots',
    name: 'GARLIC KNOTS',
    category: 'hot-selling',
    description: 'Soft dough tied into knots, baked golden, herb-infused garlic butter.',
    price: '₹250',
    priceValue: 250,
    imageSrc: '/assets/menu/garlic-knots.jpg',
    imageAlt: 'Golden baked Italian garlic knots with parsley and herb butter',
    dietaryLabel: 'Veg',
  },
  {
    id: 'hs-tiramisu',
    name: 'TIRAMISU',
    category: 'hot-selling',
    description: 'Espresso-soaked ladyfingers layered with airy mascarpone cream.',
    price: '₹380',
    priceValue: 380,
    imageSrc: '/assets/menu/tiramisu.jpg',
    imageAlt: 'Classic Italian tiramisu dusted with cocoa powder',
    dietaryLabel: 'Veg',
  },
  {
    id: 'hs-paneer-makhani',
    name: 'PANEER MAKHANI',
    category: 'hot-selling',
    description: 'Spiced makhani gravy, marinated paneer, mozzarella.',
    price: '₹420',
    priceValue: 420,
    imageSrc: '/assets/pizza-wave/paneer-cheese-pizza.png',
    imageAlt: 'Paneer Makhani pizza with spiced gravy and mozzarella',
    dietaryLabel: 'Veg',
  },

  // VEG PIZZAS (Veggie Haven)
  {
    id: 'veg-margherita',
    name: 'CLASSIC MARGHERITA',
    category: 'veg-pizza',
    description: 'San Marzano tomato sauce, mozzarella, fresh basil.',
    price: '₹380',
    priceValue: 380,
    imageSrc: '/assets/pizza-wave/hero-main-pizza.png',
    imageAlt: 'Classic Margherita pizza with San Marzano sauce and mozzarella',
    dietaryLabel: 'Veg',
  },
  {
    id: 'veg-mushroom-alfredo',
    name: 'MUSHROOM ALFREDO',
    category: 'veg-pizza',
    description: 'Sautéed mushrooms, white cream sauce, mozzarella.',
    price: '₹450',
    priceValue: 450,
    imageSrc: '/assets/pizza-wave/mushroom-cheese-pizza.png',
    imageAlt: 'Mushroom Alfredo pizza with sautéed mushrooms and white cream sauce',
    dietaryLabel: 'Veg',
  },
  {
    id: 'veg-pesto',
    name: 'PESTO PIZZA',
    category: 'veg-pizza',
    description: 'Basil pesto base, feta cheese, mozzarella.',
    price: '₹520',
    priceValue: 520,
    imageSrc: '/assets/pizza-wave/hero-main-pizza.png',
    imageAlt: 'Pesto pizza with basil pesto base and feta cheese',
    dietaryLabel: 'Veg',
  },
  {
    id: 'veg-paneer-makhani',
    name: 'PANEER MAKHANI',
    category: 'veg-pizza',
    description: 'Spiced makhani gravy, marinated paneer, mozzarella.',
    price: '₹420',
    priceValue: 420,
    imageSrc: '/assets/pizza-wave/paneer-cheese-pizza.png',
    imageAlt: 'Paneer makhani pizza with marinated paneer and mozzarella',
    dietaryLabel: 'Veg',
  },
  {
    id: 'veg-farmhouse',
    name: 'FARMHOUSE PIZZA',
    category: 'veg-pizza',
    description: 'San Marzano sauce, bell peppers, onions, corn, mushrooms, zucchini.',
    price: '₹520',
    priceValue: 520,
    imageSrc: '/assets/pizza-wave/hero-main-pizza.png',
    imageAlt: 'Farmhouse pizza loaded with garden vegetables',
    dietaryLabel: 'Veg',
  },
  {
    id: 'veg-corn',
    name: 'CORN PIZZA',
    category: 'veg-pizza',
    description: 'San Marzano tomato sauce, mozzarella, sweet corn.',
    price: '₹400',
    priceValue: 400,
    imageSrc: '/assets/pizza-wave/paneer-cheese-pizza.png',
    imageAlt: 'Sweet corn pizza with mozzarella',
    dietaryLabel: 'Veg',
  },

  // NON-VEG PIZZAS (Non-Veg Paradise)
  {
    id: 'nv-pepperoni',
    name: 'CHICKEN PEPPERONI',
    category: 'non-veg-pizza',
    description: 'San Marzano tomato sauce, mozzarella, chicken pepperoni.',
    price: '₹480',
    priceValue: 480,
    imageSrc: '/assets/pizza-wave/chicken-tikka-pizza.png',
    imageAlt: 'Chicken pepperoni pizza with mozzarella',
    dietaryLabel: 'Non-veg',
  },
  {
    id: 'nv-alfredo',
    name: 'CHICKEN ALFREDO',
    category: 'non-veg-pizza',
    description: 'Pan seared chicken, alfredo sauce, mozzarella.',
    price: '₹530',
    priceValue: 530,
    imageSrc: '/assets/pizza-wave/chicken-tikka-pizza.png',
    imageAlt: 'Chicken alfredo pizza with pan-seared chicken and alfredo sauce',
    dietaryLabel: 'Non-veg',
  },
  {
    id: 'nv-makhani',
    name: 'CHICKEN MAKHANI',
    category: 'non-veg-pizza',
    description: 'Pan seared chicken, buttery makhani sauce, mozzarella.',
    price: '₹520',
    priceValue: 520,
    imageSrc: '/assets/pizza-wave/chicken-tikka-pizza.png',
    imageAlt: 'Chicken makhani pizza with pan-seared chicken',
    dietaryLabel: 'Non-veg',
  },
  {
    id: 'nv-meat-lovers',
    name: 'MEAT LOVERS PIZZA',
    category: 'non-veg-pizza',
    description: 'San Marzano tomato sauce, mozzarella, assorted premium meats.',
    price: '₹600',
    priceValue: 600,
    imageSrc: '/assets/pizza-wave/chicken-tikka-pizza.png',
    imageAlt: 'Meat lovers pizza with assorted premium meats and mozzarella',
    dietaryLabel: 'Non-veg',
  },

  // PASTAS (Pasta Tossed & Sauced)
  {
    id: 'pasta-alfredo',
    name: 'ALFREDO PASTA',
    category: 'pasta',
    description: 'Fettuccine tossed in a silky, parmesan-rich cream sauce.',
    price: '₹370',
    priceValue: 370,
    imageSrc: '/assets/menu/alfredo-pasta.jpg',
    imageAlt: 'Silky Fettuccine Alfredo pasta with shaved parmesan',
    dietaryLabel: 'Veg',
  },
  {
    id: 'pasta-pesto',
    name: 'PESTO PASTA',
    category: 'pasta',
    description: 'Fettuccine, rigatoni, spaghetti coated in a fresh basil pesto.',
    price: '₹410',
    priceValue: 410,
    imageSrc: '/assets/menu/pesto-pasta.jpg',
    imageAlt: 'Fresh basil pesto pasta with pine nuts and parmesan',
    dietaryLabel: 'Veg',
  },
  {
    id: 'pasta-arrabbiata',
    name: 'ARRABBIATA PASTA',
    category: 'pasta',
    description: 'Rigatoni, spaghetti coated in a classic red sauce with tomatoes, garlic, Italian herbs.',
    price: '₹370',
    priceValue: 370,
    imageSrc: '/assets/menu/alfredo-pasta.jpg',
    imageAlt: 'Rigatoni in zesty Arrabbiata tomato sauce with herbs',
    dietaryLabel: 'Veg',
  },
  {
    id: 'pasta-aglio-olio',
    name: 'SPAGHETTI AGLIO-E-OLIO',
    category: 'pasta',
    description: 'A minimalist masterpiece sautéed with extra virgin olive oil, toasted garlic, chili flakes.',
    price: '₹350',
    priceValue: 350,
    imageSrc: '/assets/menu/pesto-pasta.jpg',
    imageAlt: 'Spaghetti Aglio-e-Olio with olive oil and garlic',
    dietaryLabel: 'Veg',
  },

  // BREADS & SIDES
  {
    id: 'side-garlic-knots',
    name: 'GARLIC KNOTS',
    category: 'sides',
    description: 'Soft dough tied into knots, baked until golden, herb-infused garlic butter.',
    price: '₹250',
    priceValue: 250,
    imageSrc: '/assets/menu/garlic-knots.jpg',
    imageAlt: 'Soft garlic knots brushed with herb butter',
    dietaryLabel: 'Veg',
  },
  {
    id: 'side-focaccia',
    name: 'FOCACCIA',
    category: 'sides',
    description: 'Traditional Italian flatbread, rosemary, and a generous drizzle of olive oil.',
    price: '₹250',
    priceValue: 250,
    imageSrc: '/assets/pizza-wave/cheesy-garlic-bread.png',
    imageAlt: 'Traditional Italian rosemary focaccia bread',
    dietaryLabel: 'Veg',
  },
  {
    id: 'side-garlic-bread',
    name: 'GARLIC BREAD',
    category: 'sides',
    description: 'Toasted artisanal bread slices with a savory blend of garlic, butter, fresh parsley.',
    price: '₹250',
    priceValue: 250,
    imageSrc: '/assets/pizza-wave/cheesy-garlic-bread.png',
    imageAlt: 'Toasted artisanal garlic bread with fresh parsley',
    dietaryLabel: 'Veg',
  },
  {
    id: 'side-pep-garlic-bread',
    name: 'PEPPERONI GARLIC BREAD',
    category: 'sides',
    description: 'Garlic bread elevated with spicy chicken pepperoni.',
    price: '₹300',
    priceValue: 300,
    imageSrc: '/assets/pizza-wave/cheesy-garlic-bread.png',
    imageAlt: 'Garlic bread topped with spicy chicken pepperoni',
    dietaryLabel: 'Non-veg',
  },

  // DESSERT & DIPS
  {
    id: 'des-tiramisu',
    name: 'TIRAMISU',
    category: 'dessert-dips',
    description: 'An elegant Italian dessert of espresso-soaked ladyfingers layered with airy mascarpone cream.',
    price: '₹380',
    priceValue: 380,
    imageSrc: '/assets/menu/tiramisu.jpg',
    imageAlt: 'Classic Italian Tiramisu dessert with espresso and mascarpone',
    dietaryLabel: 'Veg',
  },
  {
    id: 'dip-viva-rosso',
    name: 'VIVA ROSSO DIP',
    category: 'dessert-dips',
    description: 'Freshly made dip with San Marzano tomatoes, roasted garlic, and a hint of red chili.',
    price: '₹69',
    priceValue: 69,
    imageSrc: '/assets/menu/viva-rosso-dip.jpg',
    imageAlt: 'Fresh tomato and roasted garlic dip in ceramic bowl',
    dietaryLabel: 'Veg',
  },
  {
    id: 'dip-pesto',
    name: 'FRESH PESTO DIP',
    category: 'dessert-dips',
    description: 'Rich, vibrant, and bursting with fresh basil, extra virgin olive oil, and herbs.',
    price: '₹69',
    priceValue: 69,
    imageSrc: '/assets/menu/pesto-pasta.jpg',
    imageAlt: 'Rich green basil pesto dip',
    dietaryLabel: 'Veg',
  },
  {
    id: 'dip-brownie',
    name: 'CHOCOLATE BROWNIE',
    category: 'dessert-dips',
    description: 'Warm, gooey chocolate fudge brownie with a rich melted center.',
    price: '₹280',
    priceValue: 280,
    imageSrc: '/assets/pizza-wave/chocolate-brownie.png',
    imageAlt: 'Decadent chocolate brownie',
    dietaryLabel: 'Veg',
  },
];

export interface ComboOffer {
  readonly id: string;
  readonly name: string;
  readonly badgeText: string;
  readonly badgeBg: string;
  readonly badgeColor: string;
  readonly cardBg: string;
  readonly textColor: string;
  readonly imageSrc: string;
  readonly imageAlt: string;
  readonly items: readonly string[];
  readonly originalPrice: string;
  readonly discountedPrice: string;
  readonly ctaText: string;
}

export const comboOffers: readonly ComboOffer[] = [
  {
    id: 'the-feast-combo',
    name: 'THE PIZZA FEAST',
    badgeText: 'FOR SHARING',
    badgeBg: palette.olive,
    badgeColor: palette.cream,
    cardBg: palette.sand,
    textColor: palette.espresso,
    imageSrc: '/assets/pizza-wave/hero-main-pizza.png',
    imageAlt: 'Fresh vegetable pizza for sharing',
    items: [
      'A favourite pizza',
      'Garlic bread',
      'A sweet finish',
    ],
    originalPrice: '₹849',
    discountedPrice: '₹699',
    ctaText: 'EXPLORE MENU',
  },
  {
    id: 'pizza-party-deal',
    name: 'PANEER PARTY',
    badgeText: 'PICKUP PICK',
    badgeBg: palette.brown,
    badgeColor: palette.cream,
    cardBg: palette.sage,
    textColor: palette.espresso,
    imageSrc: '/assets/pizza-wave/paneer-cheese-pizza.png',
    imageAlt: 'Paneer pizza with peppers and melted cheese',
    items: [
      'Paneer pizza',
      'Cheesy garlic bread',
      'Dips for the table',
    ],
    originalPrice: '₹1,199',
    discountedPrice: '₹949',
    ctaText: 'EXPLORE MENU',
  },
  {
    id: 'wrap-wings-bundle',
    name: 'CHICKEN & SIDES',
    badgeText: 'CROWD PLEASER',
    badgeBg: palette.olive,
    badgeColor: palette.cream,
    cardBg: palette.brown,
    textColor: palette.cream,
    imageSrc: '/assets/pizza-wave/chicken-tikka-pizza.png',
    imageAlt: 'Chicken tikka pizza with herbs and melted cheese',
    items: [
      'Chicken pizza',
      'Golden garlic bread',
      'A favourite dip',
    ],
    originalPrice: '₹799',
    discountedPrice: '₹619',
    ctaText: 'EXPLORE MENU',
  },
  {
    id: 'date-night-special',
    name: 'SWEET SLICE SET',
    badgeText: 'SOMETHING EXTRA',
    badgeBg: palette.sand,
    badgeColor: palette.maroon,
    cardBg: palette.olive,
    textColor: palette.cream,
    imageSrc: '/assets/pizza-wave/chocolate-brownie.png',
    imageAlt: 'Chocolate brownie for dessert',
    items: [
      'Your choice of pizza',
      'Cheesy side',
      'Chocolate brownie',
    ],
    originalPrice: '₹999',
    discountedPrice: '₹779',
    ctaText: 'EXPLORE MENU',
  },
];

export interface CateringPackage {
  readonly id: string;
  readonly name: string;
  readonly serves: string;
  readonly guestCount: string;
  readonly cardBg: string;
  readonly textColor: string;
  readonly imageSrc: string;
  readonly imageAlt: string;
  readonly items: readonly string[];
  readonly ctaText: string;
}

export const cateringPackages: readonly CateringPackage[] = [
  {
    id: 'office-party',
    name: 'OFFICE PARTY',
    serves: 'Serves 10-15 people',
    guestCount: '10–15',
    cardBg: palette.brown,
    textColor: palette.cream,
    imageSrc: '/assets/catering/office-party.jpg',
    imageAlt: 'Office party catering package with coworkers sharing artisan pizzas and drinks in breakroom',
    items: ['Pizzas for the team', 'Garlic bread', 'Dips & sides'],
    ctaText: 'EXPLORE MENU',
  },
  {
    id: 'game-night-feast',
    name: 'GAME NIGHT FEAST',
    serves: 'Serves 6-8 people',
    guestCount: '6–8',
    cardBg: palette.cream,
    textColor: palette.espresso,
    imageSrc: '/assets/catering/game-night.jpg',
    imageAlt: 'Game night feast catering package with friends playing video games and enjoying pizzas and snacks',
    items: ['Pizzas to share', 'Sides for the table', 'Dessert bites'],
    ctaText: 'EXPLORE MENU',
  },
  {
    id: 'wedding-rehearsal',
    name: 'BIG CELEBRATION',
    serves: 'Serves 25-30 people',
    guestCount: '25–30',
    cardBg: palette.sage,
    textColor: palette.espresso,
    imageSrc: '/assets/catering/wedding-rehearsal.jpg',
    imageAlt: 'Wedding rehearsal dinner celebration table with guests toasting and dining on gourmet pizzas and desserts',
    items: ['Pizzas for the crowd', 'Garlic bread', 'Sides', 'Desserts'],
    ctaText: 'EXPLORE MENU',
  },
];

export interface BrandStatCard {
  readonly id: string;
  readonly value: string;
  readonly label: string;
  readonly bg: string;
  readonly textColor: string;
}

export interface BrandPhotoCard {
  readonly id: string;
  readonly title: string;
  readonly imageSrc: string;
  readonly imageAlt: string;
}

export const brandStatCards: readonly BrandStatCard[] = [
  {
    id: 'happy-foodies',
    value: 'FRESH',
    label: 'Made to order',
    bg: palette.brown,
    textColor: palette.cream,
  },
  {
    id: 'artificial-additives',
    value: 'HOT',
    label: 'Baked for pickup',
    bg: palette.sage,
    textColor: palette.espresso,
  },
  {
    id: 'fresh-hot',
    value: 'LOCAL',
    label: 'Sainikpuri kitchen',
    bg: palette.cream,
    textColor: palette.espresso,
  },
  {
    id: 'certified-safe',
    value: 'YOURS',
    label: 'Your perfect slice',
    bg: palette.olive,
    textColor: palette.cream,
  },
];

export const brandPhotoCards: readonly BrandPhotoCard[] = [
  {
    id: 'flavors-made-for-you',
    title: 'FLAVORS MADE FOR YOU',
    imageSrc: '/assets/highlights/flavors-made-for-you.jpg',
    imageAlt: 'Pizza lover enjoying a hot artisan sourdough pizza slice with melted cheese',
  },
  {
    id: 'hot-fresh-perfect',
    title: 'HOT, FRESH, PERFECT',
    imageSrc: '/assets/highlights/hot-fresh-perfect.jpg',
    imageAlt: 'Street counter dining enjoying freshly baked craft pizza with cheese pull and iced tea',
  },
];

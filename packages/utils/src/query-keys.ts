export const queryKeys = {
  menu: (storeId: string) => ['menu', storeId] as const,
  product: (productId: string) => ['product', productId] as const,
  cart: (cartId: string) => ['cart', cartId] as const,
  pickupSlots: (storeId: string) => ['pickup-slots', storeId] as const,
  order: (orderId: string) => ['order', orderId] as const,
  orders: () => ['orders'] as const,
  loyalty: () => ['loyalty'] as const,
  passport: () => ['passport'] as const,
  kdsOrders: () => ['kds', 'orders'] as const,
} as const;

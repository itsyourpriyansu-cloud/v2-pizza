import { adminHandlers } from './admin';
import { authHandlers } from './auth';
import { cartHandlers } from './cart';
import { loyaltyHandlers } from './loyalty';
import { menuHandlers } from './menu';
import { orderHandlers } from './orders';
import { passportHandlers } from './passport';
import { paymentHandlers } from './payments';
import { pickupHandlers } from './pickup';

export const handlers = [
  ...authHandlers,
  ...menuHandlers,
  ...cartHandlers,
  ...pickupHandlers,
  ...paymentHandlers,
  ...orderHandlers,
  ...loyaltyHandlers,
  ...passportHandlers,
  ...adminHandlers,
];

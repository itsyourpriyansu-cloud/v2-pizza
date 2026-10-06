import { adminHandlers } from './admin';
import { authHandlers } from './auth';
import { billingHandlers } from './billing';
import { cartHandlers } from './cart';
import { dineInHandlers } from './dine-in';
import { loyaltyHandlers } from './loyalty';
import { menuHandlers } from './menu';
import { orderHandlers } from './orders';
import { passportHandlers } from './passport';
import { paymentHandlers } from './payments';
import { pickupHandlers } from './pickup';
import { waiterHandlers } from './waiter';

export const handlers = [
  ...authHandlers,
  ...menuHandlers,
  ...cartHandlers,
  ...dineInHandlers,
  ...pickupHandlers,
  ...paymentHandlers,
  ...orderHandlers,
  ...loyaltyHandlers,
  ...passportHandlers,
  ...adminHandlers,
  ...waiterHandlers,
  ...billingHandlers,
];

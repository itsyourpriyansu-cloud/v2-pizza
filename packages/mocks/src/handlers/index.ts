import { adminHandlers } from './admin';
import { authHandlers } from './auth';
import { billingHandlers } from './billing';
import { cartHandlers } from './cart';
import { dineInHandlers } from './dine-in';
import { engagementHandlers } from './engagement';
import { loyaltyHandlers } from './loyalty';
import { menuHandlers } from './menu';
import { missionHandlers } from './missions';
import { orderHandlers } from './orders';
import { passportHandlers } from './passport';
import { paymentHandlers } from './payments';
import { pickupHandlers } from './pickup';
import { profileHandlers } from './profile';
import { waiterHandlers } from './waiter';

export const handlers = [
  ...authHandlers,
  ...menuHandlers,
  ...cartHandlers,
  ...dineInHandlers,
  ...engagementHandlers,
  ...pickupHandlers,
  ...paymentHandlers,
  ...orderHandlers,
  ...loyaltyHandlers,
  ...passportHandlers,
  ...missionHandlers,
  ...profileHandlers,
  ...adminHandlers,
  ...waiterHandlers,
  ...billingHandlers,
];

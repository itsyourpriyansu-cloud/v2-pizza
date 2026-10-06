import type { Order } from '@pizza-avenue/types';
import { makeOrder } from '../factories';

export const orders: Order[] = [
  makeOrder('order-pa-1001', 'PA-1001', 'CONFIRMED'),
  makeOrder('order-pa-1002', 'PA-1002', 'PREPARING'),
  makeOrder('order-pa-1003', 'PA-1003', 'READY_FOR_PICKUP'),
  makeOrder('order-pa-1004', 'PA-1004', 'PAYMENT_FAILED'),
  makeOrder('order-pa-1005', 'PA-1005', 'COMPLETED'),
  makeOrder('order-pa-2001', 'PA-2001', 'CUSTOMER_SUBMITTED', 'DINE_IN'),
  makeOrder('order-pa-2002', 'PA-2002', 'READY_TO_SERVE', 'DINE_IN'),
];

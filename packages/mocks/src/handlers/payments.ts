import { HttpResponse, http } from 'msw';
import { payment } from '../data';
import { getScenarioState } from '../scenarios';

const currentPayment = () => ({
  ...payment,
  status:
    getScenarioState().payment === 'PAYMENT_FAILURE'
      ? ('FAILED' as const)
      : ('SUCCESS' as const),
});

export const paymentHandlers = [
  http.post('*/api/v1/payments', () => HttpResponse.json(currentPayment(), { status: 201 })),
  http.get('*/api/v1/payments/:paymentId', () => HttpResponse.json(currentPayment())),
];

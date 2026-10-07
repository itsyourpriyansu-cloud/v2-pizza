import { HttpResponse, http } from 'msw';
import { payment } from '../data';
import { getScenarioState } from '../scenarios';

const currentPayment = () => ({
  ...payment,
  status: (() => {
    const scenario = getScenarioState().payment;
    if (scenario === 'PAYMENT_FAILURE' || scenario === 'PICKUP_PAYMENT_FAILED') return 'FAILED' as const;
    if (scenario === 'PICKUP_PAYMENT_TIMEOUT') return 'EXPIRED' as const;
    if (scenario === 'PICKUP_PAYMENT_CHECKING') return 'PENDING' as const;
    return 'SUCCESS' as const;
  })(),
});

export const paymentHandlers = [
  http.post('*/api/v1/payments', () => HttpResponse.json(currentPayment(), { status: 201 })),
  http.get('*/api/v1/payments/:paymentId', () => HttpResponse.json(currentPayment())),
];

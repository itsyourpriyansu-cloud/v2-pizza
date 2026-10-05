import { HttpResponse, http } from 'msw';
import type { Session } from '@pizza-avenue/types';
import { customers } from '../data';
import { getScenarioState } from '../scenarios';

const customerForScenario = () => {
  const scenario = getScenarioState().customer;
  if (scenario === 'NEW_CUSTOMER') return customers.new;
  if (scenario === 'LOYAL_CUSTOMER') return customers.loyal;
  return customers.returning;
};

const session = (customerId: string): Session => ({
  id: 'mock-session',
  customerId,
  authMethod: 'PHONE_OTP',
  createdAt: '2026-10-05T14:00:00.000Z',
  expiresAt: '2026-10-12T14:00:00.000Z',
  revokedAt: null,
});

export const authHandlers = [
  http.post('*/api/v1/auth/otp/request', () =>
    HttpResponse.json({ accepted: true as const }),
  ),
  http.post('*/api/v1/auth/otp/verify', () => {
    const customer = customerForScenario();
    return HttpResponse.json({ customer, session: session(customer.id) });
  }),
  http.post('*/api/v1/auth/magic/consume', () => {
    const customer = customerForScenario();
    return HttpResponse.json({
      customer,
      session: {
        ...session(customer.id),
        authMethod: 'WHATSAPP_QR_MAGIC_LINK' as const,
      },
    });
  }),
  http.post('*/api/v1/auth/logout', () => new HttpResponse(null, { status: 204 })),
];

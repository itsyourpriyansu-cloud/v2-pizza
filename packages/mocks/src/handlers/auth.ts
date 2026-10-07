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
  http.post('*/api/v1/auth/otp/request', async ({ request }) => {
    const { phone } = (await request.json()) as { phone: string };
    if (getScenarioState().auth === 'OTP_RATE_LIMITED' || phone.endsWith('9999')) {
      return HttpResponse.json(
        { error: { code: 'OTP_RATE_LIMITED', message: 'Too many attempts. Try again in a few minutes.', details: {} } },
        { status: 429 },
      );
    }
    return HttpResponse.json({ accepted: true as const });
  }),
  http.post('*/api/v1/auth/otp/verify', async ({ request }) => {
    const { otp } = (await request.json()) as { phone: string; otp: string };
    const authScenario = getScenarioState().auth;
    if (authScenario === 'OTP_EXPIRED' || otp === '999999') {
      return HttpResponse.json(
        { error: { code: 'OTP_EXPIRED', message: 'That code has expired. Request a new one.', details: {} } },
        { status: 400 },
      );
    }
    if (authScenario === 'OTP_INVALID' || otp !== '123456') {
      return HttpResponse.json(
        { error: { code: 'OTP_INVALID', message: 'That code is not correct. Try again.', details: {} } },
        { status: 400 },
      );
    }
    const customer = customerForScenario();
    return HttpResponse.json({ customer, session: session(customer.id) });
  }),
  http.post('*/api/v1/auth/magic/consume', async ({ request }) => {
    const { token } = (await request.json()) as { token: string };
    const scenario = getScenarioState().auth;
    if (scenario === 'MAGIC_LINK_EXPIRED' || scenario === 'MAGIC_LINK_USED' || scenario === 'MAGIC_LINK_INVALID' || token !== 'valid-magic-token') {
      return HttpResponse.json(
        { error: { code: 'MAGIC_LINK_INVALID_OR_EXPIRED', message: 'This continuation link can no longer be used.', details: {} } },
        { status: 400 },
      );
    }
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

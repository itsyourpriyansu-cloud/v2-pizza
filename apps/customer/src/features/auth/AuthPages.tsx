import { zodResolver } from '@hookform/resolvers/zod';
import { ApiClientError, consumeMagicLogin, requestOtp, verifyOtp } from '@pizza-avenue/api-client';
import { useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { trackCustomerEvent } from '../../shared/analytics/analytics';
import { Button, ButtonLink, ErrorState, PageHeader, Surface } from '../../shared/components/Primitives';
import { otpSchema, phoneSchema, type PhoneForm } from '../../shared/forms/schemas';
import { useCommerceStore } from '../../shared/state/commerce-store';
import { useScenarioFromUrl } from '../../shared/state/use-scenario-from-url';

type OtpForm = { otp: string };

function errorCode(error: unknown) {
  return error instanceof ApiClientError ? error.apiError.code : 'NETWORK_ERROR';
}

export function AuthPage() {
  useScenarioFromUrl();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const startAuth = useCommerceStore((state) => state.startAuth);
  const session = useCommerceStore((state) => state.session);
  const returnTo = searchParams.get('returnTo') ?? '/checkout';
  const form = useForm<PhoneForm>({
    resolver: zodResolver(phoneSchema),
    defaultValues: { phone: '' },
  });
  const mutation = useMutation({
    mutationFn: requestOtp,
    onSuccess: (_, phone) => {
      startAuth(phone, returnTo);
      trackCustomerEvent('otp_sent', { authMethod: 'PHONE_OTP' });
      trackCustomerEvent('otp_requested', { authMethod: 'PHONE_OTP' });
      navigate('/auth/otp?returnTo=' + encodeURIComponent(returnTo));
    },
  });

  useEffect(() => {
    trackCustomerEvent('auth_started', { authMethod: 'PHONE_OTP' });
  }, []);

  if (session) {
    return (
      <Surface className="state-card">
        <p className="eyebrow">Session restored</p>
        <h1>Welcome back</h1>
        <p>Your secure session is already active. Your cart and Pickup or Dine-in choice are unchanged.</p>
        <ButtonLink to={returnTo}>Continue</ButtonLink>
      </Surface>
    );
  }

  return (
    <div className="auth-layout">
      <PageHeader eyebrow="Checkout identity" title="Continue with your phone" description="We’ll send a short-lived verification code. Browsing and building your cart never required login." />
      <Surface>
        <form className="page-stack" onSubmit={form.handleSubmit(({ phone }) => mutation.mutate(phone))} noValidate>
          <label className="field" htmlFor="phone">
            <span>Mobile number</span>
            <input id="phone" className="input" type="tel" inputMode="tel" autoComplete="tel" placeholder="+91 98765 43210" aria-invalid={Boolean(form.formState.errors.phone)} {...form.register('phone')} />
          </label>
          {form.formState.errors.phone ? <p className="validation-message" role="alert">{form.formState.errors.phone.message}</p> : null}
          {mutation.isError ? <p className="validation-message" role="alert">{errorCode(mutation.error) === 'OTP_RATE_LIMITED' ? 'Too many attempts. Wait a few minutes, then try again.' : 'We could not send a code. Your cart is safe—try again.'}</p> : null}
          <Button type="submit" disabled={mutation.isPending}>{mutation.isPending ? 'Sending code…' : 'Send verification code'}</Button>
        </form>
      </Surface>
      <p className="muted">Prefer the in-store flow? <Link className="text-link" to="/auth/whatsapp">Continue through official WhatsApp</Link>.</p>
    </div>
  );
}

export function AuthOtpPage() {
  useScenarioFromUrl();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const authPhone = useCommerceStore((state) => state.authPhone);
  const storedReturnTo = useCommerceStore((state) => state.authReturnTo);
  const restoreSession = useCommerceStore((state) => state.restoreSession);
  const returnTo = searchParams.get('returnTo') ?? storedReturnTo;
  const [cooldown, setCooldown] = useState(30);
  const form = useForm<OtpForm>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: '' },
  });
  const verifyMutation = useMutation({
    mutationFn: ({ otp }: OtpForm) => verifyOtp(authPhone, otp),
    onSuccess: ({ customer, session }) => {
      restoreSession(customer, session);
      trackCustomerEvent('otp_verified', { authMethod: 'PHONE_OTP' });
      trackCustomerEvent('login_completed', { authMethod: 'PHONE_OTP' });
      navigate(returnTo);
    },
  });
  const resendMutation = useMutation({
    mutationFn: () => requestOtp(authPhone),
    onSuccess: () => {
      setCooldown(30);
      form.reset();
      trackCustomerEvent('otp_sent', { authMethod: 'PHONE_OTP', resend: true });
    },
  });

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = window.setInterval(() => setCooldown((value) => Math.max(0, value - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [cooldown]);

  if (!authPhone) {
    return <ErrorState title="Start with your phone number" body="No verification request is active. Your cart has not changed." onRetry={() => navigate('/auth?returnTo=' + encodeURIComponent(returnTo))} />;
  }
  const code = errorCode(verifyMutation.error);
  return (
    <div className="auth-layout">
      <PageHeader eyebrow="Code sent" title="Enter the six-digit code" description={'Sent to ' + authPhone.replace(/.(?=.{4})/g, '•') + '. For this prototype, use 123456.'} />
      <Surface>
        <form className="page-stack" onSubmit={form.handleSubmit((values) => verifyMutation.mutate(values))} noValidate>
          <label className="field" htmlFor="otp">
            <span>Verification code</span>
            <input id="otp" className="input otp-input" inputMode="numeric" autoComplete="one-time-code" maxLength={6} aria-invalid={Boolean(form.formState.errors.otp || verifyMutation.isError)} {...form.register('otp')} />
          </label>
          {form.formState.errors.otp ? <p role="alert" className="validation-message">{form.formState.errors.otp.message}</p> : null}
          {verifyMutation.isError ? <p role="alert" className="validation-message">{code === 'OTP_EXPIRED' ? 'That code expired. Request a new one—your cart is still safe.' : 'That code is not correct. Try again or request a new code.'}</p> : null}
          <Button type="submit" disabled={verifyMutation.isPending}>{verifyMutation.isPending ? 'Checking code…' : 'Verify and continue'}</Button>
          <Button type="button" variant="secondary" disabled={cooldown > 0 || resendMutation.isPending} onClick={() => resendMutation.mutate()}>
            {cooldown > 0 ? 'Resend available in 00:' + String(cooldown).padStart(2, '0') : resendMutation.isPending ? 'Sending…' : 'Resend code'}
          </Button>
          <ButtonLink variant="ghost" to={'/auth?returnTo=' + encodeURIComponent(returnTo)}>Use a different number</ButtonLink>
        </form>
      </Surface>
    </div>
  );
}

export function AuthWhatsAppPage() {
  return (
    <div className="auth-layout">
      <PageHeader eyebrow="Official WhatsApp continuation" title="Continue safely from the restaurant" description="Send the prefilled join message, wait for the official Pizza Avenue reply, then open its one-time link." />
      <Surface className="state-card">
        <strong>Waiting for the official reply</strong>
        <ol>
          <li>Send the prefilled message.</li>
          <li>Check the verified restaurant conversation.</li>
          <li>Tap “Continue to Pizza Avenue”.</li>
        </ol>
        <p className="muted">A QR or typed phone number never signs you in by itself. This prototype does not contact WhatsApp.</p>
        <ButtonLink to="/auth/magic?token=valid-magic-token">Open demo continuation</ButtonLink>
        <ButtonLink variant="ghost" to="/auth">Use phone OTP instead</ButtonLink>
      </Surface>
    </div>
  );
}

export function AuthMagicPage() {
  useScenarioFromUrl();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const restoreSession = useCommerceStore((state) => state.restoreSession);
  const token = searchParams.get('token') ?? '';
  const mutation = useMutation({
    mutationFn: consumeMagicLogin,
    onSuccess: ({ customer, session }) => {
      restoreSession(customer, session);
      trackCustomerEvent('magic_link_opened', { authMethod: 'WHATSAPP_QR_MAGIC_LINK' });
      trackCustomerEvent('whatsapp_login_completed', { authMethod: 'WHATSAPP_QR_MAGIC_LINK' });
    },
  });

  useEffect(() => {
    if (!token || mutation.isPending || mutation.isSuccess || mutation.isError) return;
    window.history.replaceState({}, document.title, '/auth/magic');
    mutation.mutate(token);
  }, [mutation, token]);

  if (!token && !mutation.isSuccess && !mutation.isError) {
    return <ErrorState title="This continuation link is incomplete" body="Restart from official WhatsApp or use phone OTP. No account information was exposed." />;
  }
  if (mutation.isPending || mutation.isIdle) {
    return <Surface className="state-card" role="status"><p className="eyebrow">Secure continuation</p><h1>Checking your one-time link…</h1><p>We’ll continue only after the link is verified.</p></Surface>;
  }
  if (mutation.isError) {
    return (
      <ErrorState
        title="This link can no longer be used"
        body="It may be invalid, expired or already used. Restart through official WhatsApp or use phone OTP."
        onRetry={() => navigate('/auth/whatsapp')}
      />
    );
  }
  return (
    <Surface className="state-card">
      <p className="eyebrow">Link verified</p>
      <h1>Welcome back</h1>
      <p>Your secure demo session is active. Your cart and Pickup or Dine-in choice are unchanged.</p>
      <ButtonLink to="/checkout">Continue to checkout</ButtonLink>
    </Surface>
  );
}

import { zodResolver } from '@hookform/resolvers/zod';
import { requestOtp } from '@pizza-avenue/api-client';
import { RoutePlaceholder } from '@pizza-avenue/ui';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { phoneSchema, type PhoneForm } from '../../shared/forms/schemas';

export function AuthPage() {
  const form = useForm<PhoneForm>({
    resolver: zodResolver(phoneSchema),
    defaultValues: { phone: '' },
  });

  return (
    <RoutePlaceholder title="Phone authentication foundation">
      <form onSubmit={form.handleSubmit(async ({ phone }) => requestOtp(phone).then(() => undefined))}>
        <label>
          Phone
          <input autoComplete="tel" {...form.register('phone')} />
        </label>
        {form.formState.errors.phone ? (
          <span role="alert">{form.formState.errors.phone.message}</span>
        ) : null}
        <button type="submit">Request mock OTP</button>
      </form>
      <Link to="/auth/whatsapp">WhatsApp continuation route</Link>
    </RoutePlaceholder>
  );
}

export function AuthOtpPage() {
  return <RoutePlaceholder title="OTP verification" />;
}

export function AuthWhatsAppPage() {
  return (
    <RoutePlaceholder title="WhatsApp continuation">
      <p>Mock-only waiting state. Identity must eventually come from a verified provider webhook.</p>
    </RoutePlaceholder>
  );
}

export function AuthMagicPage() {
  return (
    <RoutePlaceholder title="Magic-link consumption">
      <p>Mock-only consume/recovery boundary. No real token or session is implemented.</p>
    </RoutePlaceholder>
  );
}

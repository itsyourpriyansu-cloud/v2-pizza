import { configureApiClient } from '@pizza-avenue/api-client';

export async function startMocks() {
  const baseUrl = import.meta.env.VITE_API_BASE_URL || '/api/v1';
  configureApiClient({ baseUrl: new URL(baseUrl, window.location.origin).toString() });

  if (import.meta.env.VITE_ENABLE_MOCKS === 'false') return;
  const { worker } = await import('@pizza-avenue/mocks/browser');
  await worker.start({ onUnhandledFrame: 'bypass' });
}

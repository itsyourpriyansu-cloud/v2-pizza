import { configureApiClient } from '@pizza-avenue/api-client';
import { createSurfaceConfig } from '@pizza-avenue/config';

export async function startMocks() {
  const surfaceConfig = createSurfaceConfig(import.meta.env, window.location.origin);
  configureApiClient({ baseUrl: surfaceConfig.apiBaseUrl });

  if (import.meta.env.VITE_ENABLE_MOCKS === 'false') return;
  const { worker } = await import('@pizza-avenue/mocks/browser');
  await worker.start({ onUnhandledFrame: 'bypass' });
}

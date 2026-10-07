import { configureApiClient } from '@pizza-avenue/api-client';
import { createSurfaceConfig } from '@pizza-avenue/config';
import { resetScenarioState } from '@pizza-avenue/mocks';

export async function startMocks() {
  const mocksEnabled = import.meta.env.VITE_ENABLE_MOCKS !== 'false';
  if (mocksEnabled) {
    configureApiClient({ baseUrl: `${window.location.origin}/api/v1` });
  } else {
    const surfaceConfig = createSurfaceConfig(import.meta.env, window.location.origin);
    configureApiClient({ baseUrl: surfaceConfig.apiBaseUrl });
  }

  if (!mocksEnabled) return;
  const { worker } = await import('@pizza-avenue/mocks/browser');
  resetScenarioState();
  await worker.start({
    serviceWorker: { url: '/mockServiceWorker.js' },
    onUnhandledFrame: 'bypass',
  });
}

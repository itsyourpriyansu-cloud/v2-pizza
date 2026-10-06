type PublicEnvironmentKey =
  | 'VITE_APP_ENV'
  | 'VITE_API_BASE_URL'
  | 'VITE_LANDING_URL'
  | 'VITE_CUSTOMER_APP_URL'
  | 'VITE_KDS_URL'
  | 'VITE_ADMIN_URL';

export interface SurfaceConfig {
  readonly landingUrl: string;
  readonly customerAppUrl: string;
  readonly kdsUrl: string;
  readonly adminUrl: string;
  readonly apiBaseUrl: string;
}

const localDefaults: SurfaceConfig = {
  landingUrl: 'http://localhost:5173',
  customerAppUrl: 'http://localhost:5174',
  kdsUrl: 'http://localhost:5175',
  adminUrl: 'http://localhost:5176',
  apiBaseUrl: 'http://localhost:3000/api/v1',
};

function valueFor(environment: object, key: PublicEnvironmentKey): string | undefined {
  const value = (environment as Record<string, unknown>)[key];
  return typeof value === 'string' ? value : undefined;
}

function isLocalEnvironment(environment: object, origin: string): boolean {
  return (
    valueFor(environment, 'VITE_APP_ENV') === 'local' ||
    valueFor(environment, 'VITE_APP_ENV') === 'development' ||
    new URL(origin).hostname === 'localhost'
  );
}

function getUrl(
  environment: object,
  key: PublicEnvironmentKey,
  localFallback: string,
  isLocal: boolean,
): string {
  const configured = valueFor(environment, key)?.trim();
  if (configured) return new URL(configured).toString().replace(/\/$/, '');
  if (isLocal) return localFallback;
  throw new Error(`${key} must be configured outside local development.`);
}

/**
 * Resolves public, non-secret URLs once per frontend bootstrap. Production and
 * staging deployments must provide every URL explicitly; localhost has safe
 * defaults so the four Vite apps remain easy to run together.
 */
export function createSurfaceConfig(
  environment: object,
  origin: string,
): SurfaceConfig {
  const isLocal = isLocalEnvironment(environment, origin);
  return {
    landingUrl: getUrl(environment, 'VITE_LANDING_URL', localDefaults.landingUrl, isLocal),
    customerAppUrl: getUrl(
      environment,
      'VITE_CUSTOMER_APP_URL',
      localDefaults.customerAppUrl,
      isLocal,
    ),
    kdsUrl: getUrl(environment, 'VITE_KDS_URL', localDefaults.kdsUrl, isLocal),
    adminUrl: getUrl(environment, 'VITE_ADMIN_URL', localDefaults.adminUrl, isLocal),
    apiBaseUrl: getUrl(environment, 'VITE_API_BASE_URL', localDefaults.apiBaseUrl, isLocal),
  };
}

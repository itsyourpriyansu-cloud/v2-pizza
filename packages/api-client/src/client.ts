import type { ApiError } from '@pizza-avenue/types';
import { ApiClientError, normalizeApiError } from './errors';

export interface ApiClientConfig {
  baseUrl: string;
  fetcher: typeof fetch;
}

const defaultOrigin = () =>
  typeof globalThis.location === 'undefined'
    ? 'http://localhost'
    : globalThis.location.origin;

let config: ApiClientConfig = {
  baseUrl: `${defaultOrigin()}/api/v1`,
  fetcher: (input, init) => globalThis.fetch(input, init),
};

export function configureApiClient(
  next: Partial<ApiClientConfig>,
): ApiClientConfig {
  config = { ...config, ...next };
  return config;
}

export function getApiClientConfig(): Readonly<ApiClientConfig> {
  return config;
}

export async function apiRequest<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const headers = new Headers(init.headers);
  if (init.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  let response: Response;
  try {
    response = await config.fetcher(new URL(path, `${config.baseUrl}/`), {
      ...init,
      credentials: 'include',
      headers,
    });
  } catch (error) {
    throw new ApiClientError(normalizeApiError(error));
  }

  if (!response.ok) {
    let payload: unknown;
    try {
      payload = await response.json();
    } catch {
      payload = undefined;
    }
    throw new ApiClientError(normalizeApiError(payload, response.status));
  }

  if (response.status === 204) {
    return undefined as T;
  }
  return (await response.json()) as T;
}

export function errorPayload(error: ApiError): { error: ApiError } {
  return { error };
}

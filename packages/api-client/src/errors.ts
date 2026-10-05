import type { ApiError, ApiErrorCode } from '@pizza-avenue/types';

const statusCodeMap: Record<number, ApiErrorCode> = {
  400: 'VALIDATION_ERROR',
  401: 'AUTH_REQUIRED',
  403: 'FORBIDDEN',
  404: 'NOT_FOUND',
  409: 'CONFLICT',
  429: 'RATE_LIMITED',
  500: 'INTERNAL_ERROR',
  502: 'NETWORK_ERROR',
  503: 'UNAVAILABLE',
};

function isApiErrorEnvelope(value: unknown): value is { error: ApiError } {
  if (!value || typeof value !== 'object' || !('error' in value)) return false;
  const candidate = value.error;
  return Boolean(
    candidate &&
      typeof candidate === 'object' &&
      'code' in candidate &&
      'message' in candidate,
  );
}

export function normalizeApiError(value: unknown, status?: number): ApiError {
  if (isApiErrorEnvelope(value)) {
    return {
      code: String(value.error.code),
      message: String(value.error.message),
      details:
        value.error.details && typeof value.error.details === 'object'
          ? value.error.details
          : {},
      ...(value.error.requestId
        ? { requestId: String(value.error.requestId) }
        : {}),
    };
  }

  if (value instanceof Error) {
    return {
      code: 'NETWORK_ERROR',
      message: value.message || 'The network request failed.',
      details: {},
    };
  }

  return {
    code: statusCodeMap[status ?? 500] ?? 'INTERNAL_ERROR',
    message: 'The request could not be completed.',
    details: {},
  };
}

export class ApiClientError extends Error {
  readonly apiError: ApiError;

  constructor(apiError: ApiError) {
    super(apiError.message);
    this.name = 'ApiClientError';
    this.apiError = apiError;
  }
}

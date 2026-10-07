import type { AnalyticsEventName } from '@pizza-avenue/types';

export interface CustomerAnalyticsDetail {
  name: AnalyticsEventName;
  properties: Record<string, string | number | boolean | null>;
}

export function trackCustomerEvent(
  name: AnalyticsEventName,
  properties: CustomerAnalyticsDetail['properties'] = {},
) {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(
    new CustomEvent<CustomerAnalyticsDetail>('pizza-avenue:analytics', {
      detail: { name, properties },
    }),
  );
}

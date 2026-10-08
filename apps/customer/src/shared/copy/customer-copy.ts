export function formatCustomerState(value: string) {
  const words = value.toLocaleLowerCase().replaceAll('_', ' ');
  return words.charAt(0).toLocaleUpperCase() + words.slice(1);
}

export function rewardStatusLabel(status: string) {
  const labels: Record<string, string> = {
    AVAILABLE: 'Reward available',
    RESERVED: 'Reserved for this order',
    APPLIED: 'Applied to this order',
    RELEASED: 'Available again',
    CONSUMED: 'Used',
    LOCKED: 'Locked',
    UNAVAILABLE: 'Unavailable',
    EXPIRED: 'Expired',
  };
  return labels[status] ?? formatCustomerState(status);
}

import { getPickupSlots } from '@pizza-avenue/api-client';
import { RoutePlaceholder } from '@pizza-avenue/ui';
import { queryKeys } from '@pizza-avenue/utils';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';

export function CheckoutPage() {
  return (
    <RoutePlaceholder title="Checkout">
      <p>Identity, server quote, pickup reservation and payment boundaries are prepared.</p>
      <Link to="/checkout/pickup">Choose pickup</Link>
    </RoutePlaceholder>
  );
}

export function CheckoutPickupPage() {
  const pickupQuery = useQuery({
    queryKey: queryKeys.pickupSlots('sainikpuri'),
    queryFn: () => getPickupSlots('sainikpuri'),
  });

  if (pickupQuery.isPending) return <p role="status">Loading pickup options…</p>;
  if (pickupQuery.isError) return <p role="alert">Pickup options could not be loaded.</p>;

  return (
    <RoutePlaceholder title="Pickup options">
      <p>ASAP: {pickupQuery.data.asap?.state ?? 'UNAVAILABLE'}</p>
      <ul>
        {pickupQuery.data.scheduled.map((slot) => (
          <li key={slot.id}>{slot.startsAt} — {slot.state}</li>
        ))}
      </ul>
    </RoutePlaceholder>
  );
}

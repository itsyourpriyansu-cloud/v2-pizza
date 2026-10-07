import { RoutePlaceholder } from '@pizza-avenue/ui';
import { Link } from 'react-router-dom';
import { usePrototypeStore } from '../../shared/state/prototype-store';

export function HomePage() {
  const setServiceContext = usePrototypeStore((state) => state.setServiceContext);
  return (
    <RoutePlaceholder title="How would you like to order?">
      <p>Select a service mode before account or loyalty content. This is an architecture shell.</p>
      <section aria-labelledby="pickup-mode">
        <h2 id="pickup-mode">Pickup</h2>
        <p>Order ahead and collect it when it is ready. Approximate ready time: 30 minutes.</p>
        <Link
          to="/menu"
          onClick={() => setServiceContext({
            mode: 'PICKUP',
            storeId: 'sainikpuri',
            tableId: null,
            tableLabel: null,
            tableSessionId: null,
            confirmedAt: new Date().toISOString(),
          })}
        >
          Choose Pickup
        </Link>
      </section>
      <section aria-labelledby="dine-in-mode">
        <h2 id="dine-in-mode">Dine In</h2>
        <p>Already at Pizza Avenue? Scan the QR on your table to start ordering.</p>
        <Link to="/dine-in/start">Dine In</Link>
      </section>
    </RoutePlaceholder>
  );
}

import { RoutePlaceholder } from '@pizza-avenue/ui';
import { Link } from 'react-router-dom';

export function HomePage() {
  return (
    <RoutePlaceholder title="Customer home">
      <p>Neutral route shell for store state, pickup estimate and repeat-order entry points.</p>
      <div className="route-links">
        <Link to="/menu">Browse menu</Link>
        <Link to="/checkout/pickup">Inspect pickup options</Link>
      </div>
    </RoutePlaceholder>
  );
}

import { RoutePlaceholder } from '@pizza-avenue/ui';
import { Link } from 'react-router-dom';

export function CartPage() {
  return (
    <RoutePlaceholder title="Cart">
      <p>Cart mutations will flow through the typed API client; page-level data is not embedded here.</p>
      <Link to="/checkout">Continue to checkout</Link>
    </RoutePlaceholder>
  );
}

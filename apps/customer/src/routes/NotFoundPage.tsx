import { RoutePlaceholder } from '@pizza-avenue/ui';
import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <RoutePlaceholder title="Not found">
      <Link to="/">Return home</Link>
    </RoutePlaceholder>
  );
}

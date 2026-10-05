import { getMenu } from '@pizza-avenue/api-client';
import { RoutePlaceholder } from '@pizza-avenue/ui';
import { queryKeys } from '@pizza-avenue/utils';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';

export function MenuPage() {
  const menuQuery = useQuery({
    queryKey: queryKeys.menu('sainikpuri'),
    queryFn: () => getMenu('sainikpuri'),
  });

  if (menuQuery.isPending) return <p role="status">Loading menu…</p>;
  if (menuQuery.isError) return <p role="alert">Menu could not be loaded.</p>;

  return (
    <RoutePlaceholder title="Menu">
      <p>Mock HTTP data through TanStack Query and the shared API client.</p>
      <ul>
        {menuQuery.data.products.map((product) => (
          <li key={product.id}>
            <Link to={`/menu/${product.id}`}>{product.name}</Link> — {product.availability}
          </li>
        ))}
      </ul>
    </RoutePlaceholder>
  );
}

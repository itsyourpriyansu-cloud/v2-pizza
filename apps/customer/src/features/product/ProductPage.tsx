import { getProduct } from '@pizza-avenue/api-client';
import { RoutePlaceholder } from '@pizza-avenue/ui';
import { formatMoney, queryKeys } from '@pizza-avenue/utils';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';

export function ProductPage() {
  const { productId = '' } = useParams();
  const productQuery = useQuery({
    queryKey: queryKeys.product(productId),
    queryFn: () => getProduct(productId),
    enabled: Boolean(productId),
  });

  if (productQuery.isPending) return <p role="status">Loading product…</p>;
  if (productQuery.isError) return <p role="alert">Product could not be loaded.</p>;

  const product = productQuery.data;
  return (
    <RoutePlaceholder title={product.name}>
      <p>{product.description}</p>
      <p>
        Provisional starting price: {formatMoney(product.variants[0]?.basePrice ?? { amount: 0, currency: 'INR' })}
      </p>
      <p>Backend quote remains authoritative.</p>
    </RoutePlaceholder>
  );
}

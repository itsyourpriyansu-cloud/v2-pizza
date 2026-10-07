import { getMenu, getProduct } from '@pizza-avenue/api-client';
import { formatMoney, queryKeys } from '@pizza-avenue/utils';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { trackCustomerEvent } from '../../shared/analytics/analytics';
import { Badge, ButtonLink, ErrorState, PageSkeleton, SectionHeader } from '../../shared/components/Primitives';
import { useScenarioFromUrl } from '../../shared/state/use-scenario-from-url';
import { ProductCard } from '../menu/components/ProductCard';
import { ProductMedia } from '../menu/components/ProductMedia';

export function ProductPage() {
  useScenarioFromUrl();
  const { productId = '' } = useParams();
  const productQuery = useQuery({
    queryKey: queryKeys.product(productId),
    queryFn: () => getProduct(productId),
    enabled: Boolean(productId),
  });
  const menuQuery = useQuery({
    queryKey: queryKeys.menu('sainikpuri'),
    queryFn: () => getMenu('sainikpuri'),
  });

  useEffect(() => {
    if (productQuery.data) trackCustomerEvent('product_viewed', { productId: productQuery.data.id });
  }, [productQuery.data]);

  if (productQuery.isPending) return <PageSkeleton label="product" />;
  if (productQuery.isError) return <ErrorState title="We couldn't find that item" body="It may have left the menu. Return to the menu and choose another favourite." />;

  const product = productQuery.data;
  const firstAvailableVariant = product.variants.find((variant) => variant.availability === 'AVAILABLE');
  const isAvailable = product.availability === 'AVAILABLE' && Boolean(firstAvailableVariant);
  const alternatives = menuQuery.data?.products
    .filter((candidate) => candidate.categoryId === product.categoryId && candidate.id !== product.id && candidate.availability === 'AVAILABLE')
    .slice(0, 3) ?? [];

  return (
    <div className="page-stack">
      <section className="product-hero">
        <ProductMedia product={product} className="product-hero__media" eager />
        <div className="product-hero__content">
          <div className="product-card__badges">
            {product.dietaryTags.includes('VEGETARIAN') ? <Badge tone="success">Vegetarian</Badge> : null}
            {product.flags.map((flag) => <Badge key={flag}>{flag.toLocaleLowerCase().replace('_', ' ')}</Badge>)}
          </div>
          <h1>{product.name}</h1>
          <p className="muted">{product.description}</p>
          <strong>{firstAvailableVariant ? `From ${formatMoney(firstAvailableVariant.basePrice)}` : 'Currently unavailable'}</strong>
          {isAvailable ? (
            <ButtonLink to={`/menu/${product.id}/customize`}>Customize</ButtonLink>
          ) : (
            <Badge tone="danger">Sold out today</Badge>
          )}
          <p className="muted">Final price and availability are confirmed by the server when you review your cart.</p>
        </div>
      </section>
      {!isAvailable && alternatives.length ? (
        <section className="page-stack" aria-labelledby="alternatives-title">
          <SectionHeader id="alternatives-title" title="Try one of these instead" />
          <div className="product-grid">
            {alternatives.map((candidate) => <ProductCard key={candidate.id} product={candidate} />)}
          </div>
        </section>
      ) : null}
    </div>
  );
}

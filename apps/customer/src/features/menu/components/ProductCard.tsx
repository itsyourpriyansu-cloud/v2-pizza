import type { Product } from '@pizza-avenue/types';
import { formatMoney } from '@pizza-avenue/utils';
import { Link } from 'react-router-dom';
import { Badge } from '../../../shared/components/Primitives';
import { ProductMedia } from './ProductMedia';

export function ProductCard({ product }: { product: Product }) {
  const startingPrice = product.variants
    .filter((variant) => variant.availability === 'AVAILABLE')
    .sort((a, b) => a.basePrice.amount - b.basePrice.amount)[0]?.basePrice;
  const available = product.availability === 'AVAILABLE' && Boolean(startingPrice);

  return (
    <article className={`product-card${available ? '' : ' product-card--unavailable'}`}>
      <Link className="product-card__link" to={`/menu/${product.id}`} aria-label={`View ${product.name}`}>
        <ProductMedia product={product} className="product-card__media" />
        <div className="product-card__body">
          <div className="product-card__badges">
            {product.dietaryTags.includes('VEGETARIAN') ? <Badge tone="success">Vegetarian</Badge> : <span />}
            {product.flags.includes('BESTSELLER') ? <Badge>Bestseller</Badge> : null}
          </div>
          <h3>{product.name}</h3>
          <p className="product-card__description">{product.description}</p>
          <div className="product-card__meta">
            <strong>{startingPrice ? `From ${formatMoney(startingPrice)}` : 'Unavailable'}</strong>
            {!available ? <Badge tone="danger">Sold out</Badge> : <span aria-hidden="true">→</span>}
          </div>
        </div>
      </Link>
    </article>
  );
}

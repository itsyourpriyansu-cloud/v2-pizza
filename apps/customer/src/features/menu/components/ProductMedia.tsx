import type { Product } from '@pizza-avenue/types';
import { ImageOff } from 'lucide-react';
import { useState } from 'react';

export function ProductMedia({
  product,
  className = '',
  eager = false,
}: {
  product: Product;
  className?: string;
  eager?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  const classes = `product-media ${className}`.trim();

  if (product.imageUrl && !failed) {
    return (
      <div className={classes}>
        <img
          src={product.imageUrl}
          alt={product.name}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          onError={() => setFailed(true)}
        />
      </div>
    );
  }

  return (
    <div className={`${classes} product-media--fallback`} role="img" aria-label={`${product.name} image coming soon`}>
      <ImageOff aria-hidden="true" />
      <span>{product.name}</span>
    </div>
  );
}

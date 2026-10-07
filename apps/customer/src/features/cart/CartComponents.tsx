import type { CartItem as CartItemType, CartQuote, ServiceMode } from '@pizza-avenue/types';
import { formatMoney } from '@pizza-avenue/utils';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { Button, ButtonLink, Surface } from '../../shared/components/Primitives';

export function CartItem({
  item,
  mode,
  busy,
  onQuantity,
  onRemove,
}: {
  item: CartItemType;
  mode: ServiceMode;
  busy: boolean;
  onQuantity: (quantity: number) => void;
  onRemove: () => void;
}) {
  const modifiers = item.selectedModifiers.map((modifier) => modifier.nameSnapshot).join(', ');
  const editBase = mode === 'DINE_IN' ? '/dine-in/menu' : '/menu';
  return (
    <article className="surface cart-item">
      <div className="cart-item__content">
        <div>
          <h2>{item.productNameSnapshot}</h2>
          <p className="muted">{item.variantNameSnapshot}{modifiers ? ` · ${modifiers}` : ''}</p>
          {item.notes ? <p className="cart-item__notes">“{item.notes}”</p> : null}
        </div>
        <strong>{formatMoney({ ...item.provisionalUnitPrice, amount: item.provisionalUnitPrice.amount * item.quantity })}</strong>
      </div>
      <div className="cart-item__actions">
        <div className="quantity-stepper" aria-label={`Quantity for ${item.productNameSnapshot}`}>
          <Button variant="ghost" type="button" aria-label={`Decrease ${item.productNameSnapshot} quantity`} disabled={busy || item.quantity <= 1} onClick={() => onQuantity(item.quantity - 1)}><Minus aria-hidden="true" /></Button>
          <output aria-live="polite">{item.quantity}</output>
          <Button variant="ghost" type="button" aria-label={`Increase ${item.productNameSnapshot} quantity`} disabled={busy || item.quantity >= 8} onClick={() => onQuantity(item.quantity + 1)}><Plus aria-hidden="true" /></Button>
        </div>
        <ButtonLink variant="ghost" to={`${editBase}/${item.productId}/customize`}>Edit</ButtonLink>
        <Button variant="ghost" type="button" aria-label={`Remove ${item.productNameSnapshot}`} disabled={busy} onClick={onRemove}><Trash2 aria-hidden="true" /> Remove</Button>
      </div>
    </article>
  );
}

export function CartSummary({ quote }: { quote: CartQuote }) {
  return (
    <Surface className="commerce-summary" aria-label="Authoritative cart quote">
      <h2>Payment summary</h2>
      <dl>
        <div><dt>Subtotal</dt><dd>{formatMoney(quote.subtotal)}</dd></div>
        {quote.discount.amount ? <div><dt>Discount</dt><dd>−{formatMoney(quote.discount)}</dd></div> : null}
        <div><dt>Tax</dt><dd>{quote.tax.amount ? formatMoney(quote.tax) : 'Included'}</dd></div>
        <div className="commerce-summary__total"><dt>Total</dt><dd>{formatMoney(quote.payableTotal)}</dd></div>
      </dl>
      <p className="muted">Quoted by Pizza Avenue. Availability and price are checked again before submission.</p>
    </Surface>
  );
}

export function CartRecoveryNotice({ quote }: { quote: CartQuote }) {
  if (!quote.changes?.length) return null;
  return (
    <Surface className="recovery-notice" as="div">
      <strong>Review changes before continuing</strong>
      <ul>
        {quote.changes.map((change) => <li key={`${change.itemId}-${change.code}`}>{change.message}</li>)}
      </ul>
    </Surface>
  );
}

export function ServiceModeCartGuard({ mode, otherCount }: { mode: ServiceMode; otherCount: number }) {
  if (!otherCount) return null;
  return (
    <Surface className="context-notice" as="div">
      <strong>Your {mode === 'PICKUP' ? 'Dine-in' : 'Pickup'} cart is still safe</strong>
      <p>You’re viewing a separate {mode === 'PICKUP' ? 'Pickup' : 'Dine-in'} cart. We never move items between service modes automatically.</p>
    </Surface>
  );
}

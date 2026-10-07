import { addCartItem, createCart, getProduct } from '@pizza-avenue/api-client';
import type { Modifier, ModifierGroup, ProductVariant } from '@pizza-avenue/types';
import { formatMoney, queryKeys } from '@pizza-avenue/utils';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { trackCustomerEvent } from '../../shared/analytics/analytics';
import { Badge, Button, ButtonLink, ErrorState, PageHeader, PageSkeleton, Surface } from '../../shared/components/Primitives';
import { useToast } from '../../shared/feedback/use-toast';
import { useCommerceStore } from '../../shared/state/commerce-store';
import { usePrototypeStore } from '../../shared/state/prototype-store';
import { useScenarioFromUrl } from '../../shared/state/use-scenario-from-url';

type SelectionMap = Record<string, string[]>;

function selectedForGroup(selections: SelectionMap, groupId: string) {
  return selections[groupId] ?? [];
}

function groupError(group: ModifierGroup, selections: SelectionMap) {
  const count = selectedForGroup(selections, group.id).length;
  if (count < group.minSelections) return `Choose at least ${group.minSelections} option${group.minSelections === 1 ? '' : 's'}.`;
  if (count > group.maxSelections) return `Choose no more than ${group.maxSelections} options.`;
  return null;
}

export function ProductBuilderPage() {
  useScenarioFromUrl();
  const { productId = '' } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const serviceContext = usePrototypeStore((state) => state.serviceContext);
  const serviceMode = serviceContext?.mode ?? 'PICKUP';
  const cartId = useCommerceStore((state) => state.carts[serviceMode].cartId);
  const scenarioState = usePrototypeStore((state) => state.scenarioState);
  const setCartSummary = useCommerceStore((state) => state.setCartSummary);
  const setBuilderModifierIds = usePrototypeStore((state) => state.setBuilderModifierIds);
  const [variantId, setVariantId] = useState('');
  const [selections, setSelections] = useState<SelectionMap>({});
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const productQuery = useQuery({
    queryKey: queryKeys.product(productId),
    queryFn: () => getProduct(productId),
    enabled: Boolean(productId),
  });

  const product = productQuery.data;
  const activeVariant = product?.variants.find((variant) => variant.id === variantId)
    ?? product?.variants.find((variant) => variant.availability === 'AVAILABLE');
  const applicableGroups = useMemo(() => product?.modifierGroups
    .filter((group) => !activeVariant || activeVariant.modifierGroupIds.includes(group.id))
    .sort((a, b) => a.displayOrder - b.displayOrder) ?? [], [activeVariant, product]);
  const selectedModifiers = useMemo(() => {
    if (!product) return [];
    const ids = Object.values(selections).flat();
    return product.modifierGroups.flatMap((group) => group.modifiers).filter((modifier) => ids.includes(modifier.id));
  }, [product, selections]);
  const provisionalTotal = (activeVariant?.basePrice.amount ?? 0)
    + selectedModifiers.reduce((sum, modifier) => sum + modifier.priceDelta.amount, 0);
  const errors = applicableGroups.map((group) => ({ group, message: groupError(group, selections) })).filter((item) => item.message);
  const storeAcceptingOrders = !['STORE_PAUSED', 'STORE_CLOSED'].includes(scenarioState.store);

  useEffect(() => {
    if (!product) return;
    trackCustomerEvent('builder_started', { productId: product.id });
  }, [product]);

  useEffect(() => {
    setBuilderModifierIds(selectedModifiers.map((modifier) => modifier.id));
  }, [selectedModifiers, setBuilderModifierIds]);

  const addMutation = useMutation({
    mutationFn: async () => {
      if (!product || !activeVariant) throw new Error('Product configuration is incomplete.');
      const activeCartId = cartId ?? (await createCart('sainikpuri', serviceMode)).id;
      const cart = await addCartItem(activeCartId, {
        productId: product.id,
        productNameSnapshot: product.name,
        variantId: activeVariant.id,
        variantNameSnapshot: activeVariant.name,
        selectedModifiers: selectedModifiers.map((modifier) => ({
          modifierId: modifier.id,
          groupId: modifier.groupId,
          nameSnapshot: modifier.name,
          quantity: 1,
          provisionalPriceDelta: modifier.priceDelta,
        })),
        quantity: 1,
        notes: notes.trim() || null,
        provisionalUnitPrice: { amount: provisionalTotal, currency: activeVariant.basePrice.currency },
      });
      return cart;
    },
    onSuccess: (cart) => {
      setCartSummary(serviceMode, cart.id, cart.items.reduce((sum, item) => sum + item.quantity, 0));
      trackCustomerEvent('builder_completed', { productId, variantId: activeVariant?.id ?? null, modifierCount: selectedModifiers.length });
      showToast(`${product?.name ?? 'Item'} added to your ${serviceMode === 'DINE_IN' ? 'dine-in' : 'pickup'} cart.`);
      navigate(serviceMode === 'DINE_IN' ? '/dine-in/cart' : '/cart');
    },
  });

  function chooseVariant(variant: ProductVariant) {
    setVariantId(variant.id);
    setSelections({});
    trackCustomerEvent('variant_selected', { productId, variantId: variant.id });
  }

  function toggleModifier(group: ModifierGroup, modifier: Modifier) {
    if (modifier.availability !== 'AVAILABLE') return;
    const current = selectedForGroup(selections, group.id);
    let next: string[];
    if (group.selectionType === 'SINGLE') {
      next = [modifier.id];
    } else if (current.includes(modifier.id)) {
      next = current.filter((id) => id !== modifier.id);
    } else if (current.length < group.maxSelections) {
      next = [...current, modifier.id];
    } else {
      showToast(`You can choose up to ${group.maxSelections} ${group.name.toLocaleLowerCase()}.`);
      return;
    }
    setSelections((value) => ({ ...value, [group.id]: next }));
    trackCustomerEvent('modifier_selected', { productId, groupId: group.id, modifierId: modifier.id, selected: next.includes(modifier.id) });
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    setSubmitted(true);
    if (!activeVariant || errors.length || !storeAcceptingOrders) return;
    addMutation.mutate();
  }

  if (productQuery.isPending) return <PageSkeleton label="pizza builder" />;
  if (productQuery.isError || !product) return <ErrorState title="Builder unavailable" body="We couldn't load this item's options. Return to the menu and try again." />;
  if (product.availability !== 'AVAILABLE') {
    return <ErrorState title={`${product.name} is sold out`} body="Your selections weren't lost because customization had not started. Choose another item from the live menu." />;
  }

  return (
    <form className="page-stack" onSubmit={submit} noValidate>
      <PageHeader eyebrow="Build your pizza" title={product.name} description="Choose a size, crust and up to three extras. Your running total is provisional until cart review." />
      {!storeAcceptingOrders ? (
        <Surface className="state-card" as="div">
          <Badge tone="warning">Ordering paused</Badge>
          <p>You can review options, but pickup ordering is not accepting new items right now.</p>
        </Surface>
      ) : null}
      <div className="builder-layout">
        <div className="builder-options">
          <fieldset className="surface option-group">
            <legend>Choose a size</legend>
            {product.variants.map((variant) => (
              <label className={`option-row${variant.availability === 'AVAILABLE' ? '' : ' is-unavailable'}`} key={variant.id}>
                <span className="option-row__control">
                  <input type="radio" name="variant" value={variant.id} aria-label={variant.name} checked={activeVariant?.id === variant.id} disabled={variant.availability !== 'AVAILABLE'} onChange={() => chooseVariant(variant)} />
                  <span>{variant.name}</span>
                </span>
                <strong>{formatMoney(variant.basePrice)}</strong>
              </label>
            ))}
          </fieldset>
          {applicableGroups.map((group) => {
            const current = selectedForGroup(selections, group.id);
            const error = submitted ? groupError(group, selections) : null;
            return (
              <fieldset className="surface option-group" key={group.id} aria-describedby={`${group.id}-help${error ? ` ${group.id}-error` : ''}`}>
                <legend>{group.name}</legend>
                <p className="option-help" id={`${group.id}-help`}>
                  {group.required ? 'Required' : 'Optional'} · {group.selectionType === 'SINGLE' ? 'Choose one' : `Choose up to ${group.maxSelections}`}
                </p>
                {group.modifiers.map((modifier) => {
                  const checked = current.includes(modifier.id);
                  const maxReached = group.selectionType === 'MULTIPLE' && current.length >= group.maxSelections && !checked;
                  const unavailable = modifier.availability !== 'AVAILABLE';
                  return (
                    <label className={`option-row${unavailable ? ' is-unavailable' : ''}`} key={modifier.id}>
                      <span className="option-row__control">
                        <input
                          type={group.selectionType === 'SINGLE' ? 'radio' : 'checkbox'}
                          name={group.id}
                          aria-label={`${modifier.name}${unavailable ? ' — unavailable' : ''}`}
                          checked={checked}
                          disabled={unavailable || maxReached}
                          onChange={() => toggleModifier(group, modifier)}
                        />
                        <span>{modifier.name}{unavailable ? ' — unavailable' : ''}</span>
                      </span>
                      <strong>{modifier.priceDelta.amount ? `+${formatMoney(modifier.priceDelta)}` : 'Included'}</strong>
                    </label>
                  );
                })}
                {error ? <p className="validation-message" id={`${group.id}-error`} role="alert">{error}</p> : null}
              </fieldset>
            );
          })}
          <label className="surface field">
            <span>Special instructions (optional)</span>
            <textarea className="textarea" maxLength={180} value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="For example: cut into smaller slices" />
            <small className="muted">Allergy requests need confirmation from the store.</small>
          </label>
        </div>
        <aside className="builder-summary" aria-label="Your pizza summary">
          <h2>Your pizza</h2>
          <div className="builder-summary__line"><span>{activeVariant?.name ?? 'Choose a size'}</span><span>{activeVariant ? formatMoney(activeVariant.basePrice) : '—'}</span></div>
          {selectedModifiers.length ? selectedModifiers.map((modifier) => (
            <div className="builder-summary__line" key={modifier.id}><span>{modifier.name}</span><span>{modifier.priceDelta.amount ? `+${formatMoney(modifier.priceDelta)}` : 'Included'}</span></div>
          )) : <p className="muted">Choose your crust and extras.</p>}
          <div className="builder-summary__line builder-summary__total"><strong>Provisional total</strong><strong>{formatMoney({ amount: provisionalTotal, currency: activeVariant?.basePrice.currency ?? 'INR' })}</strong></div>
          {addMutation.isError ? <p className="validation-message" role="alert">We couldn't add this item. Your choices are still here—try again.</p> : null}
          <Button type="submit" disabled={addMutation.isPending || !storeAcceptingOrders}>{addMutation.isPending ? 'Adding…' : `Add to ${serviceMode === 'DINE_IN' ? 'dine-in' : 'pickup'} cart`}</Button>
          <ButtonLink to={`${serviceMode === 'DINE_IN' ? '/dine-in/menu' : '/menu'}/${product.id}`} variant="ghost">Back to item</ButtonLink>
        </aside>
      </div>
    </form>
  );
}

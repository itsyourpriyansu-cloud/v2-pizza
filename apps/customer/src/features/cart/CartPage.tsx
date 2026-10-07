import { addCartItem, getCart, getCartQuote, getMenu, removeCartItem, updateCartItem } from '@pizza-avenue/api-client';
import type { Product } from '@pizza-avenue/types';
import { formatMoney, queryKeys } from '@pizza-avenue/utils';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo } from 'react';
import { trackCustomerEvent } from '../../shared/analytics/analytics';
import { Button, ButtonLink, EmptyState, ErrorState, PageHeader, PageSkeleton, Surface } from '../../shared/components/Primitives';
import { useCommerceStore } from '../../shared/state/commerce-store';
import { usePrototypeStore } from '../../shared/state/prototype-store';
import { useScenarioFromUrl } from '../../shared/state/use-scenario-from-url';
import { CartItem, CartRecoveryNotice, CartSummary, ServiceModeCartGuard } from './CartComponents';

export function CartPage() {
  useScenarioFromUrl();
  const queryClient = useQueryClient();
  const serviceContext = usePrototypeStore((state) => state.serviceContext);
  const mode = serviceContext?.mode ?? 'PICKUP';
  const carts = useCommerceStore((state) => state.carts);
  const setCartSummary = useCommerceStore((state) => state.setCartSummary);
  const summary = carts[mode];
  const otherCount = carts[mode === 'PICKUP' ? 'DINE_IN' : 'PICKUP'].itemCount;
  const cartQuery = useQuery({
    queryKey: queryKeys.cart(summary.cartId ?? 'empty'),
    queryFn: () => getCart(summary.cartId!),
    enabled: Boolean(summary.cartId),
  });
  const quoteQuery = useQuery({
    queryKey: [...queryKeys.cart(summary.cartId ?? 'empty'), 'quote'],
    queryFn: () => getCartQuote(summary.cartId!),
    enabled: Boolean(summary.cartId) && Boolean(cartQuery.data?.items.length),
  });
  const menuQuery = useQuery({
    queryKey: queryKeys.menu('sainikpuri'),
    queryFn: () => getMenu('sainikpuri'),
    enabled: Boolean(cartQuery.data?.items.length),
  });

  useEffect(() => {
    trackCustomerEvent('cart_viewed', { serviceMode: mode, itemCount: summary.itemCount });
  }, [mode, summary.itemCount]);

  const refreshCart = async (cart: Awaited<ReturnType<typeof getCart>>) => {
    setCartSummary(mode, cart.id, cart.items.reduce((total, item) => total + item.quantity, 0));
    queryClient.setQueryData(queryKeys.cart(cart.id), cart);
    await queryClient.invalidateQueries({ queryKey: [...queryKeys.cart(cart.id), 'quote'] });
  };

  const updateMutation = useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: string; quantity: number }) => updateCartItem(summary.cartId!, itemId, { quantity }),
    onSuccess: refreshCart,
  });
  const removeMutation = useMutation({
    mutationFn: (itemId: string) => removeCartItem(summary.cartId!, itemId),
    onSuccess: async (cart) => {
      trackCustomerEvent('cart_item_removed', { serviceMode: mode });
      await refreshCart(cart);
    },
  });
  const addMutation = useMutation({
    mutationFn: async (product: Product) => {
      const variant = product.variants.find((candidate) => candidate.availability === 'AVAILABLE');
      if (!variant || !summary.cartId) throw new Error('Upsell item is unavailable.');
      return addCartItem(summary.cartId, {
        productId: product.id,
        productNameSnapshot: product.name,
        variantId: variant.id,
        variantNameSnapshot: variant.name,
        selectedModifiers: [],
        quantity: 1,
        notes: null,
        provisionalUnitPrice: variant.basePrice,
      });
    },
    onSuccess: async (cart, product) => {
      trackCustomerEvent('upsell_accepted', { serviceMode: mode, productId: product.id });
      await refreshCart(cart);
    },
  });

  const suggestions = useMemo(() => {
    const cart = cartQuery.data;
    const menu = menuQuery.data;
    if (!cart || !menu) return [];
    const productIds = new Set(cart.items.map((item) => item.productId));
    const productCategories = new Set(
      menu.products.filter((product) => productIds.has(product.id)).map((product) => product.categoryId),
    );
    const preferred = ['sides', 'drinks', 'desserts'].filter((category) => !productCategories.has(category));
    return preferred
      .flatMap((category) => menu.products.filter((product) => product.categoryId === category && product.availability === 'AVAILABLE').slice(0, 1))
      .slice(0, 3);
  }, [cartQuery.data, menuQuery.data]);

  if (mode === 'DINE_IN' && (!serviceContext?.tableSessionId || !serviceContext.tableLabel)) {
    return <ErrorState title="Confirm your table first" body="Scan the opaque QR at your table before creating a Dine-in cart." />;
  }
  if (!summary.cartId || (!cartQuery.isPending && cartQuery.data?.items.length === 0)) {
    return (
      <div className="page-stack">
        <PageHeader eyebrow={mode === 'DINE_IN' ? serviceContext?.tableLabel ?? 'Dine in' : 'Sainikpuri pickup'} title="Your cart" />
        <ServiceModeCartGuard mode={mode} otherCount={otherCount} />
        <EmptyState
          title="Your cart is ready for a good idea"
          body={'Add a pizza, side or drink to your ' + (mode === 'DINE_IN' ? 'Dine-in' : 'Pickup') + ' cart.'}
          action={<ButtonLink to={mode === 'DINE_IN' ? '/dine-in/menu' : '/menu'}>Browse menu</ButtonLink>}
        />
      </div>
    );
  }
  if (cartQuery.isPending) return <PageSkeleton label="cart" />;
  if (cartQuery.isError || !cartQuery.data) return <ErrorState title="Your cart could not be restored" body="Your selections may still be safe. Try the cart again before rebuilding anything." onRetry={() => void cartQuery.refetch()} />;

  const cart = cartQuery.data;
  const blocked = Boolean(quoteQuery.data?.changes?.some((change) => change.code !== 'PRICE_CHANGED'));
  const busy = updateMutation.isPending || removeMutation.isPending || addMutation.isPending;

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow={mode === 'DINE_IN' ? 'Dine in · ' + serviceContext?.tableLabel : 'Sainikpuri pickup'}
        title="Your cart"
        description={mode === 'DINE_IN' ? 'Current kitchen estimate: 20–30 min. Your waiter confirms every round.' : 'Review every choice before selecting a pickup time.'}
      />
      <ServiceModeCartGuard mode={mode} otherCount={otherCount} />
      {quoteQuery.data ? <CartRecoveryNotice quote={quoteQuery.data} /> : null}
      <section className="cart-layout">
        <div className="page-stack" aria-label="Cart items">
          {cart.items.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              mode={mode}
              busy={busy}
              onQuantity={(quantity) => {
                trackCustomerEvent('cart_item_edited', { serviceMode: mode, itemId: item.id, quantity });
                updateMutation.mutate({ itemId: item.id, quantity });
              }}
              onRemove={() => removeMutation.mutate(item.id)}
            />
          ))}
          {suggestions.length ? (
            <Surface className="cart-upsell">
              <div>
                <h2>A little something alongside?</h2>
                <p className="muted">Optional suggestions based on this cart. Nothing is added automatically.</p>
              </div>
              <div className="upsell-list">
                {suggestions.map((product) => {
                  const price = product.variants[0]?.basePrice;
                  return (
                    <div className="upsell-row" key={product.id}>
                      <span><strong>{product.name}</strong>{price ? ' · ' + formatMoney(price) : ''}</span>
                      <Button type="button" variant="secondary" disabled={busy} onClick={() => addMutation.mutate(product)}>Add</Button>
                    </div>
                  );
                })}
              </div>
            </Surface>
          ) : null}
        </div>
        <aside className="page-stack">
          {quoteQuery.isPending ? <p role="status">Confirming the latest total…</p> : null}
          {quoteQuery.isError ? <ErrorState title="We couldn't confirm the latest total" body="Try again before continuing. The cart itself is unchanged." onRetry={() => void quoteQuery.refetch()} /> : null}
          {quoteQuery.data ? <CartSummary quote={quoteQuery.data} /> : null}
          <ButtonLink
            className={blocked || !quoteQuery.data ? 'is-disabled' : ''}
            aria-disabled={blocked || !quoteQuery.data}
            tabIndex={blocked || !quoteQuery.data ? -1 : undefined}
            to={blocked || !quoteQuery.data ? '#' : mode === 'DINE_IN' ? '/dine-in/review' : '/checkout/pickup'}
            onClick={(event) => {
              if (blocked || !quoteQuery.data) event.preventDefault();
              else trackCustomerEvent('checkout_started', { serviceMode: mode, quoteVersion: quoteQuery.data.version });
            }}
          >
            {mode === 'DINE_IN' ? 'Review dine-in order' : 'Choose pickup time'}
          </ButtonLink>
        </aside>
      </section>
      {(updateMutation.isError || removeMutation.isError || addMutation.isError) ? <p role="alert" className="validation-message">That change did not save. Your previous cart is still intact.</p> : null}
    </div>
  );
}

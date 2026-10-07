import { createSavedBasket, deleteSavedBasket, getSavedBasket, getSavedBaskets, reorderSavedBasket, shareSavedBasket, updateSavedBasket } from '@pizza-avenue/api-client';
import type { SavedBasket } from '@pizza-avenue/types';
import { formatMoney, queryKeys } from '@pizza-avenue/utils';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AlertTriangle, ChevronRight, Clock3, Share2, ShoppingBasket, Trash2, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { trackCustomerEvent } from '../../shared/analytics/analytics';
import { Badge, Button, ButtonLink, EmptyState, ErrorState, PageHeader, PageSkeleton, Surface } from '../../shared/components/Primitives';
import { useToast } from '../../shared/feedback/use-toast';
import { useCommerceStore } from '../../shared/state/commerce-store';
import { useScenarioFromUrl } from '../../shared/state/use-scenario-from-url';

function BasketSummary({ basket }: { basket: SavedBasket }) {
  return <Link className="surface engagement-list-card" to={`/profile/saved-baskets/${basket.id}`}>
    <span className="engagement-card-icon" aria-hidden="true"><ShoppingBasket /></span>
    <span><small>{basket.kind.replaceAll('_', ' ')}</small><strong>{basket.name}</strong><span className="muted">{basket.items.reduce((sum, item) => sum + item.quantity, 0)} items{basket.peopleCount ? ` · Serves ${basket.peopleCount}` : ''}</span></span>
    <span><strong>{formatMoney(basket.estimatedCurrentPrice)}</strong><ChevronRight aria-hidden="true" /></span>
  </Link>;
}

export function SavedBasketsPage() {
  useScenarioFromUrl();
  const query = useQuery({ queryKey: queryKeys.savedBaskets(), queryFn: getSavedBaskets });
  const client = useQueryClient();
  const [creating, setCreating] = useState(false);
  const [customName, setCustomName] = useState('My custom basket');
  const create = useMutation({ mutationFn: () => createSavedBasket({ name: customName, kind: 'CUSTOM', peopleCount: null }), onSuccess: () => { trackCustomerEvent('saved_basket_created', { kind: 'CUSTOM' }); void client.invalidateQueries({ queryKey: queryKeys.savedBaskets() }); setCreating(false); } });
  useEffect(() => { trackCustomerEvent('saved_baskets_viewed'); }, []);
  if (query.isPending) return <PageSkeleton label="saved baskets" />;
  if (query.isError) return <ErrorState title="Saved baskets are taking a breather" body="Your saved combinations are unchanged. Try again shortly." onRetry={() => void query.refetch()} />;
  return <div className="page-stack engagement-page"><PageHeader eyebrow="Faster next time" title="Saved baskets" description="Review current prices and availability before anything reaches your cart." action={<Button type="button" onClick={() => setCreating((value) => !value)}>Create custom</Button>} />
    {creating ? <Surface className="engagement-form"><h2>Create a custom basket</h2><label className="field"><span>Basket name</span><input className="input" value={customName} onChange={(event) => setCustomName(event.target.value)} /></label><p className="muted">Create the named basket, then rebuild it from the current menu so every item uses today’s configuration.</p><div className="button-row"><Button type="button" disabled={!customName.trim() || create.isPending} onClick={() => create.mutate()}>Create basket</Button><Button type="button" variant="ghost" onClick={() => setCreating(false)}>Cancel</Button></div></Surface> : null}
    {query.data.length ? <div className="engagement-list">{query.data.map((basket) => <BasketSummary basket={basket} key={basket.id} />)}</div> : <EmptyState title="No saved baskets yet" body="After building a cart, save it as My Usual, Family Friday, Movie Night, Office Lunch, Date Night or your own custom basket." action={<ButtonLink to="/menu">Build a basket</ButtonLink>} />}
    <Surface className="context-notice"><strong>Always current</strong><p>Reordering checks today’s products, modifiers, price and service eligibility. Historical cart data is never replayed blindly.</p></Surface>
  </div>;
}

export function SavedBasketDetailPage() {
  useScenarioFromUrl();
  const { basketId = '' } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const setCartSummary = useCommerceStore((state) => state.setCartSummary);
  const query = useQuery({ queryKey: queryKeys.savedBasket(basketId), queryFn: () => getSavedBasket(basketId), enabled: Boolean(basketId) });
  const [edit, setEdit] = useState(false);
  const [name, setName] = useState('');
  const [peopleCount, setPeopleCount] = useState('');
  const [validation, setValidation] = useState<Awaited<ReturnType<typeof reorderSavedBasket>> | null>(null);
  const reorder = useMutation({ mutationFn: () => reorderSavedBasket(basketId), onSuccess: (result) => {
    setCartSummary('PICKUP', result.cart.id, result.cart.items.reduce((sum, item) => sum + item.quantity, 0));
    trackCustomerEvent(result.differences.length ? 'saved_basket_revalidation_failed' : 'saved_basket_reordered', { basketId, differences: result.differences.length });
    if (result.differences.length) setValidation(result); else navigate('/cart');
  } });
  const save = useMutation({ mutationFn: () => updateSavedBasket(basketId, { name, peopleCount: peopleCount ? Number(peopleCount) : null }), onSuccess: (saved) => { queryClient.setQueryData(queryKeys.savedBasket(basketId), saved); void queryClient.invalidateQueries({ queryKey: queryKeys.savedBaskets() }); setEdit(false); showToast('Saved basket updated.'); } });
  const remove = useMutation({ mutationFn: () => deleteSavedBasket(basketId), onSuccess: () => { void queryClient.invalidateQueries({ queryKey: queryKeys.savedBaskets() }); navigate('/profile/saved-baskets'); } });
  const share = useMutation({ mutationFn: () => shareSavedBasket(basketId), onSuccess: (result) => showToast(`Share copy ready: ${result.text}`) });
  if (query.isPending) return <PageSkeleton label="saved basket" />;
  if (query.isError || !query.data) return <ErrorState title="This basket could not be loaded" body="Return to Saved Baskets and try again." onRetry={() => void query.refetch()} />;
  const basket = query.data;
  return <div className="page-stack engagement-page"><PageHeader eyebrow={basket.kind.replaceAll('_', ' ')} title={basket.name} description={basket.peopleCount ? `Built for about ${basket.peopleCount} people.` : 'A saved combination ready to revalidate.'} />
    {validation ? <Surface className="recovery-notice" role="alert"><Badge tone="warning"><AlertTriangle aria-hidden="true" /> Basket changed</Badge><h2>We preserved what still works</h2><ul>{validation.differences.map((difference) => <li key={`${difference.code}-${difference.itemId}`}>{difference.message}</li>)}</ul><p><strong>{validation.preservedItemCount} items remain ready.</strong></p><Button type="button" onClick={() => navigate('/cart')}>Continue with preserved basket</Button></Surface> : null}
    <Surface><div className="engagement-meta"><span><Users aria-hidden="true" /> {basket.peopleCount ? `Serves ${basket.peopleCount}` : 'Flexible serving'}</span><span><Clock3 aria-hidden="true" /> {basket.lastOrderedAt ? 'Last ordered recently' : 'Not ordered yet'}</span></div><ul className="basket-item-list">{basket.items.map((item) => <li key={item.id}><span><strong>{item.quantity} × {item.productName}</strong><small>{item.variantName}{item.modifiers.length ? ` · ${item.modifiers.map((modifier) => modifier.nameSnapshot).join(', ')}` : ''}</small></span><span>{formatMoney(item.historicalUnitPrice)}</span></li>)}</ul><div className="price-line"><span>Estimated current price</span><strong>{formatMoney(basket.estimatedCurrentPrice)}</strong></div></Surface>
    {edit ? <Surface className="engagement-form"><h2>Edit basket details</h2><label className="field"><span>Name</span><input className="input" value={name} onChange={(event) => setName(event.target.value)} /></label><label className="field"><span>People count (optional)</span><input className="input" type="number" min="1" max="20" value={peopleCount} onChange={(event) => setPeopleCount(event.target.value)} /></label><div className="button-row"><Button type="button" onClick={() => save.mutate()} disabled={!name.trim() || save.isPending}>Save</Button><Button type="button" variant="ghost" onClick={() => setEdit(false)}>Cancel</Button></div></Surface> : null}
    <div className="engagement-actions"><Button type="button" onClick={() => reorder.mutate()} disabled={reorder.isPending}>{reorder.isPending ? 'Checking today’s menu…' : 'Order again'}</Button><ButtonLink to="/menu" variant="secondary">Rebuild from menu</ButtonLink><Button type="button" variant="secondary" onClick={() => { setName(basket.name); setPeopleCount(basket.peopleCount?.toString() ?? ''); setEdit(true); }}>Edit</Button><Button type="button" variant="ghost" onClick={() => share.mutate()}><Share2 aria-hidden="true" /> Share</Button><Button type="button" variant="ghost" onClick={() => remove.mutate()}><Trash2 aria-hidden="true" /> Delete</Button></div>
    {reorder.isError || save.isError || share.isError ? <p className="validation-message" role="alert">That action did not complete. Your saved basket is unchanged.</p> : null}
  </div>;
}

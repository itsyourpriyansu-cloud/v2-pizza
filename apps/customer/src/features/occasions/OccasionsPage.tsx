import { createOccasion, getHouseholdMembers, getOccasions, getSavedBaskets, planOccasion } from '@pizza-avenue/api-client';
import type { OccasionInput, OccasionType } from '@pizza-avenue/types';
import { queryKeys } from '@pizza-avenue/utils';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CalendarHeart, Gift, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { trackCustomerEvent } from '../../shared/analytics/analytics';
import { Badge, Button, ButtonLink, EmptyState, ErrorState, PageHeader, PageSkeleton, Surface } from '../../shared/components/Primitives';
import { formatCustomerState } from '../../shared/copy/customer-copy';
import { useCommerceStore } from '../../shared/state/commerce-store';
import { useScenarioFromUrl } from '../../shared/state/use-scenario-from-url';

const types: OccasionType[] = ['BIRTHDAY', 'ANNIVERSARY', 'FAMILY_DINNER', 'GAME_NIGHT', 'OFFICE_PIZZA_DAY', 'DATE_NIGHT', 'CUSTOM'];

export function OccasionsPage() {
  useScenarioFromUrl();
  const navigate = useNavigate();
  const client = useQueryClient();
  const setCartSummary = useCommerceStore((state) => state.setCartSummary);
  const occasions = useQuery({ queryKey: queryKeys.occasions(), queryFn: getOccasions });
  const baskets = useQuery({ queryKey: queryKeys.savedBaskets(), queryFn: getSavedBaskets });
  const household = useQuery({ queryKey: queryKeys.household(), queryFn: getHouseholdMembers });
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<OccasionInput>({ title: '', type: 'BIRTHDAY', date: '2026-10-21', householdMemberId: null, savedBasketId: null, peopleCount: null, reminderPreference: 'THREE_DAYS' });
  useEffect(() => { trackCustomerEvent('profile_viewed', { subsection: 'occasions' }); }, []);
  const create = useMutation({ mutationFn: () => createOccasion(form), onSuccess: () => { trackCustomerEvent('occasion_created', { type: form.type }); void client.invalidateQueries({ queryKey: queryKeys.occasions() }); setCreating(false); } });
  const plan = useMutation({ mutationFn: (id: string) => planOccasion(id), onSuccess: (result, id) => { trackCustomerEvent('occasion_cta_clicked', { occasionId: id }); setCartSummary('PICKUP', result.cart.id, result.cart.items.reduce((sum, item) => sum + item.quantity, 0)); navigate('/cart'); } });
  if (occasions.isPending || baskets.isPending || household.isPending) return <PageSkeleton label="occasions" />;
  if (occasions.isError || baskets.isError || household.isError) return <ErrorState title="Occasions could not be loaded" body="Your reminders and linked baskets are unchanged. Try again shortly." onRetry={() => { void occasions.refetch(); void baskets.refetch(); void household.refetch(); }} />;
  const basketName = (id: string | null) => baskets.data.find((basket) => basket.id === id)?.name;
  return <div className="page-stack engagement-page"><PageHeader eyebrow="Plan, when useful" title="Important occasions" description="Add occasions progressively. Pizza Avenue never forces this into onboarding." action={<Button type="button" onClick={() => setCreating((value) => !value)}><CalendarHeart aria-hidden="true" /> Add occasion</Button>} />
    {creating ? <Surface className="engagement-form"><h2>Create an occasion</h2><label className="field"><span>Title</span><input className="input" value={form.title} onChange={(event) => setForm((value) => ({ ...value, title: event.target.value }))} /></label><label className="field"><span>Type</span><select className="input" value={form.type} onChange={(event) => setForm((value) => ({ ...value, type: event.target.value as OccasionType }))}>{types.map((type) => <option value={type} key={type}>{formatCustomerState(type)}</option>)}</select></label><label className="field"><span>Date</span><input className="input" type="date" value={form.date} onChange={(event) => setForm((value) => ({ ...value, date: event.target.value }))} /></label><label className="field"><span>Linked family member (optional)</span><select className="input" value={form.householdMemberId ?? ''} onChange={(event) => setForm((value) => ({ ...value, householdMemberId: event.target.value || null }))}><option value="">None</option>{household.data.map((member) => <option value={member.id} key={member.id}>{member.displayName}</option>)}</select></label><label className="field"><span>Saved basket</span><select className="input" value={form.savedBasketId ?? ''} onChange={(event) => setForm((value) => ({ ...value, savedBasketId: event.target.value || null }))}><option value="">Choose later</option>{baskets.data.map((basket) => <option value={basket.id} key={basket.id}>{basket.name}</option>)}</select></label><label className="field"><span>People count</span><input className="input" type="number" min="1" max="30" value={form.peopleCount ?? ''} onChange={(event) => setForm((value) => ({ ...value, peopleCount: event.target.value ? Number(event.target.value) : null }))} /></label><label className="field"><span>Reminder</span><select className="input" value={form.reminderPreference} onChange={(event) => setForm((value) => ({ ...value, reminderPreference: event.target.value as OccasionInput['reminderPreference'] }))}><option value="NONE">No reminder</option><option value="ONE_DAY">One day before</option><option value="THREE_DAYS">Three days before</option><option value="ONE_WEEK">One week before</option></select></label>{create.isError ? <p role="alert" className="validation-message">The occasion could not be created. Your form is still here.</p> : null}<div className="button-row"><Button type="button" disabled={!form.title.trim() || !form.date || create.isPending} onClick={() => create.mutate()}>Save occasion</Button><Button type="button" variant="ghost" onClick={() => setCreating(false)}>Cancel</Button></div></Surface> : null}
    {occasions.data.length ? <div className="engagement-grid">{occasions.data.map((occasion) => <Surface as="article" className="occasion-card" key={occasion.id}><div className="engagement-card-heading"><span className="engagement-card-icon" aria-hidden="true"><Gift /></span><Badge tone={occasion.daysAway <= 7 ? 'warning' : 'neutral'}>{occasion.daysAway} days away</Badge></div><p className="eyebrow">{formatCustomerState(occasion.type)}</p><h2>{occasion.title}</h2><p className="muted">{basketName(occasion.savedBasketId) ?? 'Choose a basket when you plan'}</p>{occasion.peopleCount ? <p className="profile-inline"><Users aria-hidden="true" /> Serves {occasion.peopleCount}</p> : null}{occasion.savedBasketId ? <Button type="button" disabled={plan.isPending} onClick={() => plan.mutate(occasion.id)}>Plan order</Button> : <ButtonLink to="/profile/saved-baskets" variant="secondary">Choose saved basket</ButtonLink>}</Surface>)}</div> : <EmptyState title="No occasions added" body="Birthdays, anniversaries, family dinners, game nights, office pizza days and date nights can be planned when they become useful." action={<Button type="button" onClick={() => setCreating(true)}>Create an occasion</Button>} />}
    {plan.isError ? <p className="validation-message" role="alert">This plan could not be prepared. The occasion and its saved basket are unchanged.</p> : null}
  </div>;
}

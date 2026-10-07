import { addHouseholdMember, getHouseholdMembers, updateHouseholdMember } from '@pizza-avenue/api-client';
import type { HouseholdMember, HouseholdMemberInput, HouseholdRelationship } from '@pizza-avenue/types';
import { queryKeys } from '@pizza-avenue/utils';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ShieldCheck, UserRoundPlus, UsersRound } from 'lucide-react';
import { useEffect, useState } from 'react';
import { trackCustomerEvent } from '../../shared/analytics/analytics';
import { Badge, Button, EmptyState, ErrorState, PageHeader, PageSkeleton, Surface } from '../../shared/components/Primitives';
import { useToast } from '../../shared/feedback/use-toast';
import { useScenarioFromUrl } from '../../shared/state/use-scenario-from-url';

const blankMember: HouseholdMemberInput = { displayName: '', relationship: 'PARTNER', birthday: null, foodPreference: 'NO_PREFERENCE', favouritePizza: null, favouriteSide: null, avoidIngredients: [] };
const relationships: HouseholdRelationship[] = ['ME', 'PARTNER', 'MOM', 'DAD', 'CHILD', 'FRIEND', 'OTHER'];

function MemberForm({ member, onCancel }: { member?: HouseholdMember; onCancel: () => void }) {
  const client = useQueryClient();
  const { showToast } = useToast();
  const [form, setForm] = useState<HouseholdMemberInput>(member ? { displayName: member.displayName, relationship: member.relationship, birthday: member.birthday, foodPreference: member.foodPreference, favouritePizza: member.favouritePizza, favouriteSide: member.favouriteSide, avoidIngredients: member.avoidIngredients } : blankMember);
  const mutation = useMutation({ mutationFn: (input: HouseholdMemberInput) => member ? updateHouseholdMember(member.id, input) : addHouseholdMember(input), onSuccess: () => { trackCustomerEvent(member ? 'family_member_updated' : 'family_member_added'); void client.invalidateQueries({ queryKey: queryKeys.household() }); showToast(member ? 'Family profile updated.' : 'Family profile added.'); onCancel(); } });
  const day = form.birthday?.day?.toString() ?? '';
  const month = form.birthday?.month?.toString() ?? '';
  const updateBirthday = (nextDay: string, nextMonth: string) => setForm((value) => ({ ...value, birthday: nextDay && nextMonth ? { day: Number(nextDay), month: Number(nextMonth) } : null }));
  return <Surface className="engagement-form"><h2>{member ? `Edit ${member.displayName}` : 'Add someone useful'}</h2>
    <label className="field"><span>Display name</span><input className="input" value={form.displayName} onChange={(event) => setForm((value) => ({ ...value, displayName: event.target.value }))} /></label>
    <label className="field"><span>Relationship</span><select className="input" value={form.relationship} onChange={(event) => setForm((value) => ({ ...value, relationship: event.target.value as HouseholdRelationship }))}>{relationships.map((relationship) => <option key={relationship} value={relationship}>{relationship.replaceAll('_', ' ')}</option>)}</select></label>
    <fieldset className="birthday-fields"><legend>Birthday (optional — day and month only)</legend><label className="field"><span>Day</span><input className="input" type="number" min="1" max="31" value={day} onChange={(event) => updateBirthday(event.target.value, month)} /></label><label className="field"><span>Month</span><input className="input" type="number" min="1" max="12" value={month} onChange={(event) => updateBirthday(day, event.target.value)} /></label></fieldset>
    <label className="field"><span>Food preference</span><select className="input" value={form.foodPreference} onChange={(event) => setForm((value) => ({ ...value, foodPreference: event.target.value as HouseholdMemberInput['foodPreference'] }))}><option value="NO_PREFERENCE">No preference</option><option value="VEG">Vegetarian</option><option value="NON_VEG">Non-vegetarian</option></select></label>
    <label className="field"><span>Favourite pizza (optional)</span><input className="input" value={form.favouritePizza ?? ''} onChange={(event) => setForm((value) => ({ ...value, favouritePizza: event.target.value || null }))} /></label>
    <label className="field"><span>Favourite side (optional)</span><input className="input" value={form.favouriteSide ?? ''} onChange={(event) => setForm((value) => ({ ...value, favouriteSide: event.target.value || null }))} /></label>
    <label className="field"><span>Avoid ingredients (comma separated)</span><input className="input" value={form.avoidIngredients.join(', ')} onChange={(event) => setForm((value) => ({ ...value, avoidIngredients: event.target.value.split(',').map((item) => item.trim()).filter(Boolean) }))} /></label>
    <p className="allergy-warning"><ShieldCheck aria-hidden="true" /><span><strong>Preference only.</strong> Avoid ingredients are not an allergy-safety guarantee. Always tell restaurant staff about allergies.</span></p>
    {mutation.isError ? <p className="validation-message" role="alert">This family profile could not be saved. Your previous information is unchanged.</p> : null}
    <div className="button-row"><Button type="button" disabled={!form.displayName.trim() || mutation.isPending} onClick={() => mutation.mutate(form)}>{mutation.isPending ? 'Saving…' : 'Save member'}</Button><Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button></div>
  </Surface>;
}

export function FamilyPage() {
  useScenarioFromUrl();
  const query = useQuery({ queryKey: queryKeys.household(), queryFn: getHouseholdMembers });
  const [editing, setEditing] = useState<HouseholdMember | 'new' | null>(null);
  useEffect(() => { trackCustomerEvent('family_viewed'); }, []);
  if (query.isPending) return <PageSkeleton label="family profiles" />;
  if (query.isError) return <ErrorState title="Family profiles could not be loaded" body="This private information is unchanged. Try again when the connection returns." onRetry={() => void query.refetch()} />;
  return <div className="page-stack engagement-page"><PageHeader eyebrow="Private to your account" title="Family & household" description="Optional shortcuts for the people you commonly order with. They are not separate Pizza Avenue accounts." action={<Button type="button" onClick={() => setEditing('new')}><UserRoundPlus aria-hidden="true" /> Add</Button>} />
    <Surface className="privacy-banner"><ShieldCheck aria-hidden="true" /><span><strong>Private by design</strong><small>Phone, birthday, preferences, Points and order history never appear in Taste Cards, League, referrals or group links.</small></span></Surface>
    {editing ? editing === 'new' ? <MemberForm onCancel={() => setEditing(null)} /> : <MemberForm member={editing} onCancel={() => setEditing(null)} /> : null}
    {query.data.length ? <div className="engagement-grid">{query.data.map((member) => <Surface as="article" className="household-card" key={member.id}><div className="engagement-card-heading"><span className="engagement-card-icon" aria-hidden="true"><UsersRound /></span><Badge>{member.relationship}</Badge></div><h2>{member.displayName}</h2><p className="muted">{member.foodPreference === 'NO_PREFERENCE' ? 'No food preference' : member.foodPreference === 'VEG' ? 'Vegetarian' : 'Non-vegetarian'}</p>{member.favouritePizza ? <p><strong>Pizza:</strong> {member.favouritePizza}</p> : null}{member.favouriteSide ? <p><strong>Side:</strong> {member.favouriteSide}</p> : null}{member.avoidIngredients.length ? <p><strong>Avoid:</strong> {member.avoidIngredients.join(', ')}</p> : null}<Button type="button" variant="secondary" onClick={() => setEditing(member)}>Edit</Button></Surface>)}</div> : <EmptyState title="No family profiles yet" body="Add only the details that make shared orders easier. Nothing here is required during onboarding." action={<Button type="button" onClick={() => setEditing('new')}>Add first member</Button>} />}
  </div>;
}

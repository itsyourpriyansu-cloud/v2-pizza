import { getProfile, updateProfile } from '@pizza-avenue/api-client';
import type { CustomerProfile, CustomerProfileUpdate, FoodPreference } from '@pizza-avenue/types';
import { queryKeys } from '@pizza-avenue/utils';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Bell, CalendarHeart, ChevronRight, CircleUserRound, Heart, Palette, ReceiptText, ShieldCheck, ShoppingBasket, Star, Trophy, UserPlus, UsersRound } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { trackCustomerEvent } from '../../shared/analytics/analytics';
import { Badge, Button, ErrorState, PageHeader, PageSkeleton } from '../../shared/components/Primitives';
import { useToast } from '../../shared/feedback/use-toast';
import { useCommerceStore } from '../../shared/state/commerce-store';
import { useScenarioFromUrl } from '../../shared/state/use-scenario-from-url';
import { ProfileSection } from '../retention/RetentionComponents';
import { customerFeatureFlags } from '../../shared/config/feature-flags';

function ProfileForm({ profile }: { profile: CustomerProfile }) {
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const [form, setForm] = useState<CustomerProfileUpdate>({
    foodPreference: profile.foodPreference, avoidMushrooms: profile.avoidMushrooms,
    preferredCrust: profile.preferredCrust, notifications: profile.notifications,
  });
  const mutation = useMutation({ mutationFn: updateProfile, onSuccess: (saved) => {
    queryClient.setQueryData(queryKeys.profile(), saved);
    trackCustomerEvent('profile_preferences_saved', { foodPreference: saved.foodPreference });
    showToast('Preferences saved.');
  } });
  const setFood = (foodPreference: FoodPreference) => setForm((value) => ({ ...value, foodPreference }));
  return <>
    <ProfileSection title="Food preferences">
      <fieldset className="preference-fieldset"><legend>What suits you?</legend>{(['VEG', 'NON_VEG', 'NO_PREFERENCE'] as FoodPreference[]).map((option) => <label className="preference-option" key={option}><input type="radio" name="foodPreference" checked={form.foodPreference === option} onChange={() => setFood(option)} /><span>{option === 'NO_PREFERENCE' ? 'No preference' : option === 'NON_VEG' ? 'Non-vegetarian' : 'Vegetarian'}</span></label>)}</fieldset>
      <label className="preference-option"><input type="checkbox" checked={form.avoidMushrooms} onChange={(event) => setForm((value) => ({ ...value, avoidMushrooms: event.target.checked }))} /><span>Avoid mushrooms in suggestions</span></label>
      <label className="field"><span>Preferred crust</span><select className="input" value={form.preferredCrust ?? ''} onChange={(event) => setForm((value) => ({ ...value, preferredCrust: event.target.value ? event.target.value as 'CLASSIC' | 'THIN' : null }))}><option value="">No preference</option><option value="CLASSIC">Classic</option><option value="THIN">Thin</option></select></label>
      <p className="allergy-warning"><ShieldCheck aria-hidden="true" /><span><strong>Preference, not allergy protection.</strong> Tell our staff about allergies. The kitchen handles shared ingredients and equipment.</span></p>
    </ProfileSection>
    <ProfileSection title="Notifications"><label className="preference-option"><input type="checkbox" checked={form.notifications.transactional} onChange={(event) => setForm((value) => ({ ...value, notifications: { ...value.notifications, transactional: event.target.checked } }))} /><span>Order and payment updates</span></label><label className="preference-option"><input type="checkbox" checked={form.notifications.offers} onChange={(event) => setForm((value) => ({ ...value, notifications: { ...value.notifications, offers: event.target.checked } }))} /><span>Occasional offers</span></label><label className="preference-option"><input type="checkbox" checked={form.notifications.loyalty} onChange={(event) => setForm((value) => ({ ...value, notifications: { ...value.notifications, loyalty: event.target.checked } }))} /><span>Rewards and Passport progress</span></label></ProfileSection>
    {mutation.isError ? <p className="validation-message" role="alert">We couldn’t save these preferences. Your previous settings are unchanged.</p> : null}
    <Button type="button" disabled={mutation.isPending} onClick={() => mutation.mutate(form)}>{mutation.isPending ? 'Saving…' : 'Save preferences'}</Button>
  </>;
}

export function ProfilePage() {
  useScenarioFromUrl();
  const { showToast } = useToast();
  const clearSession = useCommerceStore((state) => state.clearSession);
  const query = useQuery({ queryKey: queryKeys.profile(), queryFn: getProfile });
  useEffect(() => { trackCustomerEvent('profile_viewed'); }, []);
  if (query.isPending) return <PageSkeleton label="profile" />;
  if (query.isError) return <ErrorState title="Profile could not be loaded" body="Try again to recover your saved preferences." onRetry={() => void query.refetch()} />;
  const profile = query.data;
  return <div className="page-stack retention-page"><PageHeader eyebrow="Your Pizza Avenue" title="Profile" description="Keep your account, preferences and notification choices in one place." />
    <ProfileSection title="Account"><div className="profile-identity"><span><CircleUserRound aria-hidden="true" /></span><div><strong>{profile.name}</strong><p>{profile.phoneMasked}</p></div>{profile.phoneVerified ? <Badge tone="success">Verified</Badge> : null}</div></ProfileSection>
    <nav className="profile-links" aria-label="Profile shortcuts"><Link className="surface profile-link" to="/orders"><ReceiptText aria-hidden="true" /><span><strong>Orders</strong><small>Track and review past orders</small></span><ChevronRight aria-hidden="true" /></Link><Link className="surface profile-link" to="/rewards"><Star aria-hidden="true" /><span><strong>Rewards</strong><small>Points, Passport and missions</small></span><ChevronRight aria-hidden="true" /></Link>{customerFeatureFlags.FEATURE_SAVED_BASKETS ? <Link className="surface profile-link" to="/profile/saved-baskets"><ShoppingBasket aria-hidden="true" /><span><strong>Saved Baskets</strong><small>My Usual, Family Friday and more</small></span><ChevronRight aria-hidden="true" /></Link> : null}{customerFeatureFlags.FEATURE_FAMILY ? <Link className="surface profile-link" to="/profile/family"><UsersRound aria-hidden="true" /><span><strong>Family & Household</strong><small>Private optional ordering preferences</small></span><ChevronRight aria-hidden="true" /></Link> : null}{customerFeatureFlags.FEATURE_OCCASIONS ? <Link className="surface profile-link" to="/profile/occasions"><CalendarHeart aria-hidden="true" /><span><strong>Important Occasions</strong><small>Plan useful reminders and baskets</small></span><ChevronRight aria-hidden="true" /></Link> : null}{customerFeatureFlags.FEATURE_REFERRALS ? <Link className="surface profile-link" to="/rewards/invite"><UserPlus aria-hidden="true" /><span><strong>Invite Friends</strong><small>Track qualifying first-order progress</small></span><ChevronRight aria-hidden="true" /></Link> : null}{customerFeatureFlags.FEATURE_TASTE_CARD ? <Link className="surface profile-link" to="/profile/taste-card"><Palette aria-hidden="true" /><span><strong>Taste Card</strong><small>Preview a privacy-safe share card</small></span><ChevronRight aria-hidden="true" /></Link> : null}</nav>
    {profile.favouriteProductIds.length ? <ProfileSection title="Your favourites"><p className="profile-inline"><Heart aria-hidden="true" /><span>{profile.favouriteProductIds.length} saved menu favourites</span></p></ProfileSection> : null}
    <ProfileForm profile={profile} />
    {customerFeatureFlags.FEATURE_LEAGUE ? <ProfileSection title="League privacy"><p className="profile-inline"><Trophy aria-hidden="true" /><span>League is optional. Only your selected display name appears after opt-in and meaningful participation.</span></p><Link className="text-link" to="/rewards/league">Review League settings</Link></ProfileSection> : null}
    <ProfileSection title="Help & legal"><div className="profile-info-row"><strong>Help</strong><span>Ask our Sainikpuri counter team for order or account support.</span></div><div className="profile-info-row"><strong>Privacy</strong><span>Only service and preference data needed for this account is represented here.</span></div><div className="profile-info-row"><strong>Terms</strong><span>Reward eligibility and availability are confirmed by Pizza Avenue.</span></div></ProfileSection>
    <Button type="button" variant="secondary" onClick={() => { clearSession(); showToast('Signed out of this device.'); }}>Log out</Button>
    <p className="profile-footer-note"><Bell aria-hidden="true" /> Transactional order updates may still be required to complete your service.</p>
  </div>;
}

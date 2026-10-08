import { getReferrals, getTasteCard, shareReferral, shareTasteCard } from '@pizza-avenue/api-client';
import type { ReferralStatus } from '@pizza-avenue/types';
import { queryKeys } from '@pizza-avenue/utils';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Check, Copy, Gift, Pizza, Share2, ShieldCheck, UserCheck } from 'lucide-react';
import { useEffect } from 'react';
import { trackCustomerEvent } from '../../shared/analytics/analytics';
import { Badge, Button, ErrorState, PageHeader, PageSkeleton, Surface } from '../../shared/components/Primitives';
import { formatCustomerState } from '../../shared/copy/customer-copy';
import { useToast } from '../../shared/feedback/use-toast';
import { useScenarioFromUrl } from '../../shared/state/use-scenario-from-url';

const referralSteps: ReferralStatus[] = ['SHARED', 'CLICKED', 'REGISTERED', 'VERIFIED', 'FIRST_ORDER_PENDING', 'QUALIFIED', 'REWARDED'];

export function InvitePage() {
  useScenarioFromUrl();
  const client = useQueryClient();
  const { showToast } = useToast();
  const query = useQuery({ queryKey: queryKeys.referrals(), queryFn: getReferrals });
  const share = useMutation({ mutationFn: shareReferral, onSuccess: (created) => { trackCustomerEvent('referral_shared', { status: created.status }); void client.invalidateQueries({ queryKey: queryKeys.referrals() }); showToast('Invite link ready to share.'); } });
  useEffect(() => { trackCustomerEvent('referral_viewed'); }, []);
  if (query.isPending) return <PageSkeleton label="invites" />;
  if (query.isError) return <ErrorState title="Invites could not be loaded" body="No referral progress has been lost. Try again shortly." onRetry={() => void query.refetch()} />;
  return <div className="page-stack engagement-page"><PageHeader eyebrow="Invite friends" title="Share pizza, earn after their first order" description="Sharing, clicking or registering alone never unlocks a reward." action={<Button type="button" disabled={share.isPending} onClick={() => share.mutate()}><Share2 aria-hidden="true" /> Share invite</Button>} />
    <Surface className="qualification-card"><ShieldCheck aria-hidden="true" /><span><strong>Qualification rule</strong><small>Your friend must verify their identity and complete a qualifying paid first order. Pizza Avenue confirms the result.</small></span></Surface>
    {query.data.map((referral) => {
      const current = referralSteps.indexOf(referral.status);
      return <Surface as="article" className="referral-card" key={referral.id}><div className="engagement-card-heading"><span className="engagement-card-icon" aria-hidden="true"><UserCheck /></span><Badge tone={referral.status === 'REWARDED' ? 'success' : referral.status === 'EXPIRED' ? 'danger' : 'warning'}>{formatCustomerState(referral.status)}</Badge></div><h2>{referral.inviteeDisplayName}</h2><ol className="referral-progress" aria-label={`Referral progress for ${referral.inviteeDisplayName}`}>{referralSteps.map((step, index) => <li className={current >= index ? 'is-complete' : ''} key={step}><span aria-hidden="true">{current >= index ? <Check /> : index + 1}</span><span>{formatCustomerState(step)}</span></li>)}</ol><p>{referral.status === 'FIRST_ORDER_PENDING' ? 'Joined ✓. Their first qualifying completed order unlocks your reward.' : referral.status === 'QUALIFIED' ? 'The first order qualified. Reward confirmation is next.' : referral.status === 'REWARDED' ? `Reward unlocked: ${referral.rewardLabel}.` : referral.status === 'EXPIRED' ? 'This invite expired without a qualifying order.' : 'Referral progress updates after verified milestones.'}</p><Button type="button" variant="secondary" onClick={() => { trackCustomerEvent('referral_progress_viewed', { status: referral.status }); showToast(`Invite code copied: ${referral.shareCode}`); }}><Copy aria-hidden="true" /> Copy invite code</Button></Surface>;
    })}
  </div>;
}
export function TasteCardPage() {
  useScenarioFromUrl();
  const { showToast } = useToast();
  const query = useQuery({ queryKey: queryKeys.tasteCard(), queryFn: getTasteCard });
  const share = useMutation({ mutationFn: shareTasteCard, onSuccess: ({ payload }) => { trackCustomerEvent('taste_card_shared', { pickCount: query.data?.picks.length ?? 0 }); showToast(`Safe share copy ready: ${payload.text}`); } });
  useEffect(() => { trackCustomerEvent('taste_card_viewed'); }, []);
  if (query.isPending) return <PageSkeleton label="Taste Card" />;
  if (query.isError) return <ErrorState title="Taste Card could not be loaded" body="Your favourites and private profile remain unchanged." onRetry={() => void query.refetch()} />;
  const card = query.data;
  return <div className="page-stack engagement-page"><PageHeader eyebrow="Shareable, not personal" title="Taste Card" description="A small public preview of your selected Pizza Avenue picks." />
    <Surface className="taste-card"><div className="taste-card__heading"><span><Pizza aria-hidden="true" /></span><div><p className="eyebrow">{card.title}</p><h2>{card.displayName}</h2></div></div><ol>{card.picks.map((pick) => <li key={pick.productId}>{pick.label}</li>)}</ol><div className="taste-card__passport"><span>Pizza Passport</span><strong>{card.passportProgress.completed} / {card.passportProgress.total}</strong></div><Button type="button" disabled={share.isPending} onClick={() => share.mutate()}><Share2 aria-hidden="true" /> Share Taste Card</Button></Surface>
    <Surface className="privacy-banner"><ShieldCheck aria-hidden="true" /><span><strong>Safe to share</strong><small>Includes only display name, selected picks and public Passport progress. It excludes phone, email, birthday, Points, order history, household data and private preferences.</small></span></Surface>
    <Surface><div className="engagement-card-heading"><Gift aria-hidden="true" /><Badge>Preview</Badge></div><h2>What friends see</h2><p>{card.sharePayload.text}</p></Surface>
  </div>;
}

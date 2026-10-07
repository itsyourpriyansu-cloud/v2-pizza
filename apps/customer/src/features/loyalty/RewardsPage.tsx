import { getLoyaltyAccount, getLoyaltyActivity, getPassportProgress, getRewards, releaseRewardReservation, reserveReward } from '@pizza-avenue/api-client';
import type { Reward } from '@pizza-avenue/types';
import { queryKeys } from '@pizza-avenue/utils';
import { useMutation, useQueries, useQueryClient } from '@tanstack/react-query';
import { ClipboardCheck, Trophy } from 'lucide-react';
import { useEffect, useState } from 'react';
import { trackCustomerEvent } from '../../shared/analytics/analytics';
import { EmptyState, ErrorState, PageHeader, PageSkeleton, SectionHeader, Surface } from '../../shared/components/Primitives';
import { useToast } from '../../shared/feedback/use-toast';
import { useScenarioFromUrl } from '../../shared/state/use-scenario-from-url';
import { PassportProgressCard, PointsBalanceCard, RetentionLinkCard, RewardCard } from '../retention/RetentionComponents';

export function RewardsPage() {
  useScenarioFromUrl();
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const [reservationId, setReservationId] = useState<string | null>(null);
  const [account, rewards, activity, passport] = useQueries({ queries: [
    { queryKey: queryKeys.loyalty(), queryFn: getLoyaltyAccount },
    { queryKey: queryKeys.rewards(), queryFn: getRewards },
    { queryKey: queryKeys.loyaltyActivity(), queryFn: getLoyaltyActivity },
    { queryKey: queryKeys.passport(), queryFn: getPassportProgress },
  ] });
  useEffect(() => { trackCustomerEvent('reward_viewed'); }, []);
  const reservation = useMutation({ mutationFn: reserveReward, onSuccess: (redemption) => {
    setReservationId(redemption.id);
    queryClient.setQueryData<Reward[]>(queryKeys.rewards(), (items = []) => items.map((reward) => reward.id === redemption.rewardId ? { ...reward, status: 'RESERVED' } : reward));
    trackCustomerEvent('reward_reservation_started', { rewardId: redemption.rewardId });
    showToast('Reward reserved for checkout. It has not been consumed.');
  } });
  const release = useMutation({ mutationFn: releaseRewardReservation, onSuccess: (redemption) => {
    setReservationId(null);
    queryClient.setQueryData<Reward[]>(queryKeys.rewards(), (items = []) => items.map((reward) => reward.id === redemption.rewardId ? { ...reward, status: 'AVAILABLE' } : reward));
    trackCustomerEvent('reward_reservation_released', { rewardId: redemption.rewardId });
    showToast('Reward released and available again.');
  } });
  if ([account, rewards, activity, passport].some((query) => query.isPending)) return <PageSkeleton label="rewards" />;
  if (account.isError || rewards.isError || activity.isError || passport.isError || !account.data || !rewards.data || !activity.data || !passport.data) return <ErrorState title="Rewards could not be loaded" body="Your balance is safe. Try again to recover the latest server state." onRetry={() => void Promise.all([account.refetch(), rewards.refetch(), activity.refetch(), passport.refetch()])} />;
  return <div className="page-stack retention-page">
    <PageHeader eyebrow="Pizza Avenue Rewards" title="Good pizza gives back." description="Points unlock order rewards. Avenue XP tracks missions and is not redeemable." />
    <PointsBalanceCard account={account.data} />
    <section className="page-stack" aria-labelledby="available-rewards"><SectionHeader id="available-rewards" title="Your rewards" />
      {rewards.data.length ? <div className="reward-grid">{rewards.data.map((reward) => <RewardCard key={reward.id} reward={reward} busy={reservation.isPending || release.isPending} onReserve={reward.status === 'AVAILABLE' ? () => reservation.mutate(reward.id) : undefined} onRelease={reward.status === 'RESERVED' ? () => release.mutate(reservationId ?? 'redemption-mock-1') : undefined} />)}</div> : <EmptyState title="Your first reward starts here" body="Complete eligible orders to earn Points and unlock rewards." />}
      {reservation.isError ? <p className="validation-message" role="alert">That reward could not be reserved. Refresh its status and try again.</p> : null}
    </section>
    <div className="retention-link-grid"><PassportProgressCard passport={passport.data} compact /><RetentionLinkCard eyebrow="Avenue XP" title="Missions" body="Take on personal and community challenges." href="/rewards/missions" icon={<Trophy />} /></div>
    <section className="page-stack" aria-labelledby="points-activity"><SectionHeader id="points-activity" title="Points activity" /><Surface><ul className="activity-list">{activity.data.map((entry) => <li key={entry.id}><span><ClipboardCheck aria-hidden="true" /><span><strong>{entry.displayLabel}</strong><small>{new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(entry.createdAt))}</small></span></span><strong className={entry.pointsDelta >= 0 ? 'positive-value' : ''}>{entry.pointsDelta >= 0 ? '+' : ''}{entry.pointsDelta}</strong></li>)}</ul></Surface></section>
  </div>;
}

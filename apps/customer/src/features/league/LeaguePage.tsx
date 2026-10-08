import { getLeague, optIntoLeague } from '@pizza-avenue/api-client';
import { queryKeys } from '@pizza-avenue/utils';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Crown, Medal, ShieldCheck, Sparkles, Trophy } from 'lucide-react';
import { useEffect } from 'react';
import { trackCustomerEvent } from '../../shared/analytics/analytics';
import { Badge, Button, ErrorState, PageHeader, PageSkeleton, Surface } from '../../shared/components/Primitives';
import { formatCustomerState } from '../../shared/copy/customer-copy';
import { useScenarioFromUrl } from '../../shared/state/use-scenario-from-url';

export function LeaguePage() {
  useScenarioFromUrl();
  const client = useQueryClient();
  const query = useQuery({ queryKey: queryKeys.league(), queryFn: getLeague });
  const optIn = useMutation({ mutationFn: optIntoLeague, onSuccess: (league) => { client.setQueryData(queryKeys.league(), league); trackCustomerEvent('league_opted_in', { seasonId: league.season.id }); } });
  useEffect(() => { trackCustomerEvent('league_viewed'); }, []);
  useEffect(() => { if (query.data?.optedIn && query.data.meaningfulParticipation) trackCustomerEvent('league_progress_viewed', { tier: query.data.currentTier, rank: query.data.currentRank ?? 0 }); }, [query.data]);
  if (query.isPending) return <PageSkeleton label="Avenue League" />;
  if (query.isError) return <ErrorState title="League could not be loaded" body="Your Avenue XP is safe. Try again to view the current season." onRetry={() => void query.refetch()} />;
  const league = query.data;
  if (!league.optedIn || !league.meaningfulParticipation) return <div className="page-stack engagement-page"><PageHeader eyebrow="Optional seasonal challenge" title="Avenue League" description="League uses Avenue XP, not direct spend. Ordering and rewards work normally without joining." /><Surface className="league-opt-in"><span className="league-emblem" aria-hidden="true"><Trophy /></span><h2>Join when it feels fun</h2><p>Your rank stays hidden until you opt in and meaningfully participate. No discouraging low-engagement rank is shown.</p><Button type="button" disabled={optIn.isPending} onClick={() => optIn.mutate()}>{optIn.isPending ? 'Joining…' : 'Join this season'}</Button></Surface><Surface className="privacy-banner"><ShieldCheck aria-hidden="true" /><span><strong>Leaderboard privacy</strong><small>Only a first name plus initial or a chosen display name appears. No phone, Points, family data or order history.</small></span></Surface></div>;
  const tierIndex = league.season.tiers.findIndex((tier) => tier.tier === league.currentTier);
  const currentThreshold = league.season.tiers[tierIndex]?.thresholdXp ?? 0;
  const next = league.season.tiers[tierIndex + 1];
  const progress = next ? Math.min(100, Math.max(0, (league.currentXp - currentThreshold) / Math.max(1, next.thresholdXp - currentThreshold) * 100)) : 100;
  return <div className="page-stack engagement-page"><PageHeader eyebrow={league.season.name} title="Avenue League" description="A seasonal view of Avenue XP — never a replacement for ordering or Pizza Points." />
    <Surface className="league-hero"><div><Badge tone="warning"><Crown aria-hidden="true" /> {formatCustomerState(league.currentTier)}</Badge><h2>{league.currentRank ? `#${league.currentRank} this month` : 'Season active'}</h2><p>{league.progressMessage}</p></div><div><strong>{league.currentXp}</strong><small>Avenue XP</small></div><div className="progress-track" role="progressbar" aria-label={`Progress to ${next ? formatCustomerState(next.tier) : 'season peak'}`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress)}><span style={{ width: `${progress}%` }} /></div>{league.nextThreshold ? <p className="muted">{league.nextThreshold.xpRemaining} XP to {formatCustomerState(league.nextThreshold.tier)}</p> : null}</Surface>
    <section className="page-stack" aria-labelledby="top-three"><h2 id="top-three">Top 3</h2><ol className="leaderboard leaderboard--top" aria-label="Top three Avenue League positions">{league.topThree.map((entry) => <li key={entry.id}><span><Medal aria-hidden="true" /><strong>#{entry.rank}</strong></span><span>{entry.displayName}</span><strong>{entry.xp} XP</strong></li>)}</ol></section>
    <section className="page-stack" aria-labelledby="near-you"><h2 id="near-you">Near you</h2><ol className="leaderboard" aria-label="Avenue League positions near you">{league.nearby.map((entry) => <li className={entry.isCurrentCustomer ? 'is-you' : ''} key={entry.id}><span><strong>#{entry.rank}</strong></span><span>{entry.displayName}{entry.isCurrentCustomer ? <Badge tone="success">You</Badge> : null}</span><strong>{entry.xp} XP</strong></li>)}</ol></section>
    <Surface><div className="engagement-card-heading"><Sparkles aria-hidden="true" /><Badge>Previous season</Badge></div><p>{league.previousSeasonSummary ?? 'No previous season yet.'}</p></Surface>
  </div>;
}

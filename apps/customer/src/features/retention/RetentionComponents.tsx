import type { LoyaltyAccount, Mission, PassportProgress, Reward } from '@pizza-avenue/types';
import { ArrowRight, Check, LockKeyhole, Sparkles, Star } from 'lucide-react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Badge, Button, Surface } from '../../shared/components/Primitives';
import { formatCustomerState, rewardStatusLabel } from '../../shared/copy/customer-copy';

export function PointsBalanceCard({ account }: { account: LoyaltyAccount }) {
  const remaining = account.nextRewardAt === null ? 0 : Math.max(0, account.nextRewardAt - account.pointsBalance);
  const progress = account.nextRewardAt ? Math.min(100, account.pointsBalance / account.nextRewardAt * 100) : 100;
  return (
    <Surface className="points-balance-card">
      <div><p className="eyebrow">Your Pizza Points</p><strong className="points-total">{account.pointsBalance.toLocaleString('en-IN')}</strong></div>
      <div className="points-balance-card__detail">
        <strong>{account.nextRewardAt === null ? 'Every current reward is within reach' : `${remaining} Pizza Points to your next reward`}</strong>
        <div className="progress-track" role="progressbar" aria-label="Progress to the next reward" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress)}><span style={{ width: `${progress}%` }} /></div>
        {account.pendingPoints > 0 ? <p className="pending-copy">+{account.pendingPoints} Pizza Points pending until your table bill is paid</p> : null}
      </div>
    </Surface>
  );
}

function rewardTone(status: Reward['status']) {
  if (status === 'AVAILABLE') return 'success' as const;
  if (status === 'RESERVED' || status === 'APPLIED') return 'warning' as const;
  if (status === 'UNAVAILABLE' || status === 'EXPIRED') return 'danger' as const;
  return 'neutral' as const;
}

export function RewardCard({ reward, busy, onReserve, onRelease }: { reward: Reward; busy?: boolean; onReserve?: (() => void) | undefined; onRelease?: (() => void) | undefined }) {
  const locked = reward.status === 'LOCKED';
  return (
    <Surface as="article" className={`reward-card reward-card--${reward.status.toLowerCase()}`}>
      <div className="reward-card__top">
        <span className="reward-card__icon" aria-hidden="true">{locked ? <LockKeyhole /> : <Star />}</span>
        <Badge tone={rewardTone(reward.status)}>{rewardStatusLabel(reward.status)}</Badge>
      </div>
      <div><h3>{reward.name}</h3><p className="muted">{reward.description}</p></div>
      <div className="reward-card__footer">
        <strong>{reward.pointsCost} Pizza Points</strong>
        {reward.status === 'AVAILABLE' && onReserve ? <Button type="button" disabled={busy} onClick={onReserve}>{busy ? 'Reserving…' : 'Use reward'}</Button> : null}
        {reward.status === 'RESERVED' && onRelease ? <Button type="button" variant="secondary" disabled={busy} onClick={onRelease}>{busy ? 'Releasing…' : 'Release'}</Button> : null}
        {locked ? <span className="muted">{reward.remainingPoints} more needed</span> : null}
      </div>
    </Surface>
  );
}

export function PassportProgressCard({ passport, compact = false }: { passport: PassportProgress; compact?: boolean }) {
  const total = passport.program.items.length;
  const completed = passport.completedItemIds.length;
  return (
    <Surface className={`passport-progress-card${compact ? ' passport-progress-card--compact' : ''}`}>
      <div className="retention-card__heading">
        <div><p className="eyebrow">Pizza Passport</p><h2>{passport.status === 'COMPLETE' ? 'Passport complete' : `${completed} of ${total} discovered`}</h2></div>
        <span className="passport-stamp" aria-hidden="true"><Check /></span>
      </div>
      <div className="progress-track" role="progressbar" aria-label="Pizza Passport progress" aria-valuemin={0} aria-valuemax={total} aria-valuenow={completed}><span style={{ width: `${total ? completed / total * 100 : 0}%` }} /></div>
      <p className="muted">{passport.status === 'COMPLETE' ? 'Your completion reward is unlocked.' : passport.status === 'NEAR_COMPLETE' ? 'You’re close—choose your next signature.' : 'Every eligible completed pizza adds a stamp.'}</p>
      <Link className="text-link" to="/rewards/passport">Open Pizza Passport <ArrowRight aria-hidden="true" /></Link>
    </Surface>
  );
}

export function XpBadge({ value }: { value: number }) {
  return <Badge tone="warning"><Sparkles aria-hidden="true" /> {value} Avenue XP</Badge>;
}

export function MissionCard({ mission }: { mission: Mission }) {
  const percent = Math.min(100, mission.progress.current / Math.max(1, mission.progress.target) * 100);
  return (
    <Surface as="article" className={`mission-card${mission.status === 'EXPIRED' ? ' mission-card--expired' : ''}`}>
      <div className="mission-card__heading"><Badge>{mission.scope === 'PERSONAL' ? 'For you' : 'For everyone'}</Badge><XpBadge value={mission.rewardXp} /></div>
      <div><h3>{mission.title}</h3><p className="muted">{mission.requirement}</p></div>
      <div className="progress-track" role="progressbar" aria-label={mission.progress.label} aria-valuemin={0} aria-valuemax={mission.progress.target} aria-valuenow={mission.progress.current}><span style={{ width: `${percent}%` }} /></div>
      <div className="mission-card__footer"><strong>{mission.progress.label}</strong>{mission.ctaHref && mission.ctaLabel && mission.status !== 'EXPIRED' ? <Link className="text-link" to={mission.ctaHref}>{mission.ctaLabel} <ArrowRight aria-hidden="true" /></Link> : <Badge tone={mission.status === 'COMPLETED' ? 'success' : mission.status === 'EXPIRED' ? 'danger' : 'neutral'}>{formatCustomerState(mission.status)}</Badge>}</div>
    </Surface>
  );
}

export function RetentionLinkCard({ eyebrow, title, body, href, icon, onClick }: { eyebrow: string; title: string; body: string; href: string; icon?: ReactNode; onClick?: () => void }) {
  return <Link className="surface retention-link-card" to={href} onClick={onClick}><span className="retention-link-card__icon" aria-hidden="true">{icon ?? <Star />}</span><span><small>{eyebrow}</small><strong>{title}</strong><span className="muted">{body}</span></span><ArrowRight aria-hidden="true" /></Link>;
}

export function ProfileSection({ title, children }: { title: string; children: ReactNode }) {
  return <Surface className="profile-section"><h2>{title}</h2>{children}</Surface>;
}

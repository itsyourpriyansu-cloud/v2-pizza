import { getMissions } from '@pizza-avenue/api-client';
import { queryKeys } from '@pizza-avenue/utils';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { trackCustomerEvent } from '../../shared/analytics/analytics';
import { EmptyState, ErrorState, PageHeader, PageSkeleton, SectionHeader } from '../../shared/components/Primitives';
import { useScenarioFromUrl } from '../../shared/state/use-scenario-from-url';
import { MissionCard, XpBadge } from '../retention/RetentionComponents';

export function MissionsPage() {
  useScenarioFromUrl();
  const query = useQuery({ queryKey: queryKeys.missions(), queryFn: getMissions });
  useEffect(() => { trackCustomerEvent('missions_viewed'); }, []);
  if (query.isPending) return <PageSkeleton label="missions" />;
  if (query.isError) return <ErrorState title="Missions could not be loaded" body="Try again to recover your latest mission progress." onRetry={() => void query.refetch()} />;
  const { personal, common, avenueXp } = query.data;
  return <div className="page-stack retention-page"><PageHeader eyebrow="Small challenges, more discovery" title="Missions" description="Earn Avenue XP for completing challenges. XP is progress—not money or redeemable Points." action={<XpBadge value={avenueXp} />} />
    {!personal.length && !common.length ? <EmptyState title="No active missions right now" body="Fresh missions will appear here when they are assigned." /> : null}
    {personal.length ? <section className="page-stack" aria-labelledby="personal-missions"><SectionHeader id="personal-missions" title="Personal missions" /><p className="muted">Selected for your Pizza Avenue journey.</p><div className="mission-grid">{personal.map((mission) => <MissionCard mission={mission} key={mission.id} />)}</div></section> : null}
    {common.length ? <section className="page-stack" aria-labelledby="common-missions"><SectionHeader id="common-missions" title="Common missions" /><p className="muted">Open to every Pizza Avenue customer.</p><div className="mission-grid">{common.map((mission) => <MissionCard mission={mission} key={mission.id} />)}</div></section> : null}
  </div>;
}

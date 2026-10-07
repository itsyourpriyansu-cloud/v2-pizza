import { getPassportProgress } from '@pizza-avenue/api-client';
import { queryKeys } from '@pizza-avenue/utils';
import { useQuery } from '@tanstack/react-query';
import { Check, LockKeyhole, Pizza } from 'lucide-react';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { trackCustomerEvent } from '../../shared/analytics/analytics';
import { Badge, ErrorState, PageHeader, PageSkeleton, Surface } from '../../shared/components/Primitives';
import { useScenarioFromUrl } from '../../shared/state/use-scenario-from-url';
import { PassportProgressCard } from '../retention/RetentionComponents';

export function PassportPage() {
  useScenarioFromUrl();
  const passportQuery = useQuery({ queryKey: queryKeys.passport(), queryFn: getPassportProgress });
  useEffect(() => { trackCustomerEvent('passport_viewed'); }, []);
  if (passportQuery.isPending) return <PageSkeleton label="Pizza Passport" />;
  if (passportQuery.isError) return <ErrorState title="Passport could not be loaded" body="Your stamps are safe. Try again for the latest progress." onRetry={() => void passportQuery.refetch()} />;
  const passport = passportQuery.data;
  return <div className="page-stack retention-page">
    <PageHeader eyebrow="Collect signature stamps" title="Pizza Passport" description="A stamp is recorded only after an eligible order is completed. Duplicate orders never add duplicate credit." />
    <PassportProgressCard passport={passport} />
    <div className="passport-grid">{passport.program.items.map((item) => {
      const completed = passport.completedItemIds.includes(item.id);
      const unavailable = item.availability === 'UNAVAILABLE';
      return <Surface as="article" className={`passport-item${completed ? ' passport-item--complete' : ''}`} key={item.id}><span className="passport-item__mark" aria-hidden="true">{completed ? <Check /> : unavailable ? <LockKeyhole /> : <Pizza />}</span><div><Badge tone={completed ? 'success' : unavailable ? 'danger' : 'neutral'}>{completed ? 'Discovered' : unavailable ? 'Unavailable today' : 'Ready to try'}</Badge><h2>{item.label}</h2><p className="muted">{completed ? 'This stamp is secured.' : unavailable ? 'Choose another Passport pizza while this one is unavailable.' : 'Complete an eligible order to add this stamp.'}</p></div>{!completed && !unavailable ? <Link className="button button--secondary" to={`/menu/${item.productId}?source=PASSPORT`} onClick={() => trackCustomerEvent('passport_product_selected', { productId: item.productId })}>View pizza</Link> : null}</Surface>;
    })}</div>
  </div>;
}

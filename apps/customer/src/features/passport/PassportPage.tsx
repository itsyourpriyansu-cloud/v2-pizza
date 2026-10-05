import { getPassportProgress } from '@pizza-avenue/api-client';
import { RoutePlaceholder } from '@pizza-avenue/ui';
import { queryKeys } from '@pizza-avenue/utils';
import { useQuery } from '@tanstack/react-query';

export function PassportPage() {
  const passportQuery = useQuery({
    queryKey: queryKeys.passport(),
    queryFn: getPassportProgress,
  });
  if (passportQuery.isPending) return <p role="status">Loading passport…</p>;
  if (passportQuery.isError) return <p role="alert">Passport could not be loaded.</p>;
  return (
    <RoutePlaceholder title="Pizza Passport">
      <p>Completed items: {passportQuery.data.completedItemIds.length}</p>
      <p>Program complete: {String(passportQuery.data.completed)}</p>
    </RoutePlaceholder>
  );
}

import { getLoyaltyAccount, getRewards } from '@pizza-avenue/api-client';
import { RoutePlaceholder } from '@pizza-avenue/ui';
import { queryKeys } from '@pizza-avenue/utils';
import { useQueries } from '@tanstack/react-query';

export function RewardsPage() {
  const [account, rewards] = useQueries({
    queries: [
      { queryKey: queryKeys.loyalty(), queryFn: getLoyaltyAccount },
      { queryKey: ['rewards'], queryFn: getRewards },
    ],
  });
  if (account.isPending || rewards.isPending) return <p role="status">Loading rewards…</p>;
  if (account.isError || rewards.isError) return <p role="alert">Rewards could not be loaded.</p>;
  return (
    <RoutePlaceholder title="Rewards">
      <p>Points: {account.data.pointsBalance}</p>
      <p>Available mock rewards: {rewards.data.length}</p>
    </RoutePlaceholder>
  );
}

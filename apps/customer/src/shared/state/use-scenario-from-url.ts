import { isMockScenarioName } from '@pizza-avenue/mocks';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { usePrototypeStore } from './prototype-store';

export function useScenarioFromUrl() {
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const selectScenario = usePrototypeStore((state) => state.selectScenario);
  const scenario = searchParams.get('scenario');

  useEffect(() => {
    if (!scenario || !isMockScenarioName(scenario)) return;
    selectScenario(scenario);
    void queryClient.invalidateQueries();
  }, [queryClient, scenario, selectScenario]);
}

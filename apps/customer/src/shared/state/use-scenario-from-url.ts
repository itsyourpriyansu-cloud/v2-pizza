import { isMockScenarioName } from '@pizza-avenue/mocks';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { usePrototypeStore } from './prototype-store';
import { isReviewPersonaName } from './review-personas';

export function useScenarioFromUrl() {
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const selectScenario = usePrototypeStore((state) => state.selectScenario);
  const selectReviewPersona = usePrototypeStore((state) => state.selectReviewPersona);
  const scenario = searchParams.get('scenario');
  const reviewPersona = searchParams.get('review');

  useEffect(() => {
    if (!import.meta.env.DEV) return;
    if (reviewPersona && isReviewPersonaName(reviewPersona)) {
      selectReviewPersona(reviewPersona);
      void queryClient.invalidateQueries();
      return;
    }
    if (!scenario || !isMockScenarioName(scenario)) return;
    selectScenario(scenario);
    void queryClient.invalidateQueries();
  }, [queryClient, reviewPersona, scenario, selectReviewPersona, selectScenario]);
}

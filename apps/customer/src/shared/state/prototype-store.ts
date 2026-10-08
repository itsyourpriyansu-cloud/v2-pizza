import {
  getScenarioState,
  setScenario,
  type MockScenarioName,
  type MockScenarioState,
} from '@pizza-avenue/mocks';
import type { ServiceContext } from '@pizza-avenue/types';
import { create } from 'zustand';
import { applyReviewPersona, type ReviewPersonaName } from './review-personas';

interface PrototypeState {
  selectedScenario: MockScenarioName | null;
  scenarioState: MockScenarioState;
  builderModifierIds: string[];
  serviceContext: ServiceContext | null;
  selectScenario: (scenario: MockScenarioName) => void;
  selectReviewPersona: (persona: ReviewPersonaName) => void;
  setBuilderModifierIds: (modifierIds: string[]) => void;
  setServiceContext: (context: ServiceContext | null) => void;
}

export const usePrototypeStore = create<PrototypeState>((set) => ({
  selectedScenario: null,
  scenarioState: getScenarioState(),
  builderModifierIds: [],
  serviceContext: null,
  selectScenario: (scenario) => {
    const scenarioState = setScenario(scenario);
    set({ selectedScenario: scenario, scenarioState });
  },
  selectReviewPersona: (persona) => {
    const { scenarioState, serviceContext } = applyReviewPersona(persona);
    set({ selectedScenario: null, scenarioState, serviceContext, builderModifierIds: [] });
  },
  setBuilderModifierIds: (builderModifierIds) => set({ builderModifierIds }),
  setServiceContext: (serviceContext) => set({ serviceContext }),
}));

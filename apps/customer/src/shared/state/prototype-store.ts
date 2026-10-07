import { setScenario, type MockScenarioName } from '@pizza-avenue/mocks';
import type { ServiceContext } from '@pizza-avenue/types';
import { create } from 'zustand';

interface PrototypeState {
  selectedScenario: MockScenarioName | null;
  builderModifierIds: string[];
  serviceContext: ServiceContext | null;
  selectScenario: (scenario: MockScenarioName) => void;
  setBuilderModifierIds: (modifierIds: string[]) => void;
  setServiceContext: (context: ServiceContext | null) => void;
}

export const usePrototypeStore = create<PrototypeState>((set) => ({
  selectedScenario: null,
  builderModifierIds: [],
  serviceContext: null,
  selectScenario: (scenario) => {
    setScenario(scenario);
    set({ selectedScenario: scenario });
  },
  setBuilderModifierIds: (builderModifierIds) => set({ builderModifierIds }),
  setServiceContext: (serviceContext) => set({ serviceContext }),
}));

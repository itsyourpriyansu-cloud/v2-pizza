import { setScenario, type MockScenarioName } from '@pizza-avenue/mocks';
import { create } from 'zustand';

interface PrototypeState {
  selectedScenario: MockScenarioName | null;
  builderModifierIds: string[];
  selectScenario: (scenario: MockScenarioName) => void;
  setBuilderModifierIds: (modifierIds: string[]) => void;
}

export const usePrototypeStore = create<PrototypeState>((set) => ({
  selectedScenario: null,
  builderModifierIds: [],
  selectScenario: (scenario) => {
    setScenario(scenario);
    set({ selectedScenario: scenario });
  },
  setBuilderModifierIds: (builderModifierIds) => set({ builderModifierIds }),
}));

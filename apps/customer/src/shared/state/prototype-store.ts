import {
  getScenarioState,
  setScenario,
  type MockScenarioName,
  type MockScenarioState,
} from '@pizza-avenue/mocks';
import type { ServiceContext } from '@pizza-avenue/types';
import { create } from 'zustand';

interface PrototypeState {
  selectedScenario: MockScenarioName | null;
  scenarioState: MockScenarioState;
  builderModifierIds: string[];
  cartId: string | null;
  cartItemCount: number;
  serviceContext: ServiceContext | null;
  selectScenario: (scenario: MockScenarioName) => void;
  setBuilderModifierIds: (modifierIds: string[]) => void;
  setCartSummary: (cartId: string, cartItemCount: number) => void;
  setServiceContext: (context: ServiceContext | null) => void;
}

export const usePrototypeStore = create<PrototypeState>((set) => ({
  selectedScenario: null,
  scenarioState: getScenarioState(),
  builderModifierIds: [],
  cartId: null,
  cartItemCount: 0,
  serviceContext: null,
  selectScenario: (scenario) => {
    const scenarioState = setScenario(scenario);
    set({ selectedScenario: scenario, scenarioState });
  },
  setBuilderModifierIds: (builderModifierIds) => set({ builderModifierIds }),
  setCartSummary: (cartId, cartItemCount) => set({ cartId, cartItemCount }),
  setServiceContext: (serviceContext) => set({ serviceContext }),
}));

import type {
  Customer,
  Payment,
  PickupReservation,
  PickupSlot,
  PickupType,
  ServiceMode,
  Session,
} from '@pizza-avenue/types';
import { create } from 'zustand';

export interface ServiceCartSummary {
  cartId: string | null;
  itemCount: number;
}

export interface PickupSelection {
  type: PickupType;
  slot: PickupSlot;
  reservation: PickupReservation;
}

interface CommerceState {
  carts: Record<ServiceMode, ServiceCartSummary>;
  customer: Customer | null;
  session: Session | null;
  authPhone: string;
  authReturnTo: string;
  pickupSelection: PickupSelection | null;
  payment: Payment | null;
  pickupOrderId: string | null;
  dineInOrderIds: string[];
  setCartSummary: (mode: ServiceMode, cartId: string, itemCount: number) => void;
  clearCart: (mode: ServiceMode) => void;
  startAuth: (phone: string, returnTo: string) => void;
  restoreSession: (customer: Customer, session: Session) => void;
  clearSession: () => void;
  setPickupSelection: (selection: PickupSelection | null) => void;
  setPayment: (payment: Payment | null) => void;
  setPickupOrderId: (orderId: string | null) => void;
  addDineInOrderId: (orderId: string) => void;
}

const emptyCarts: Record<ServiceMode, ServiceCartSummary> = {
  PICKUP: { cartId: null, itemCount: 0 },
  DINE_IN: { cartId: null, itemCount: 0 },
};

export const useCommerceStore = create<CommerceState>((set) => ({
  carts: emptyCarts,
  customer: null,
  session: null,
  authPhone: '',
  authReturnTo: '/checkout',
  pickupSelection: null,
  payment: null,
  pickupOrderId: null,
  dineInOrderIds: [],
  setCartSummary: (mode, cartId, itemCount) => set((state) => ({
    carts: { ...state.carts, [mode]: { cartId, itemCount } },
  })),
  clearCart: (mode) => set((state) => ({
    carts: { ...state.carts, [mode]: { cartId: null, itemCount: 0 } },
  })),
  startAuth: (authPhone, authReturnTo) => set({ authPhone, authReturnTo }),
  restoreSession: (customer, session) => set({ customer, session }),
  clearSession: () => set({ customer: null, session: null }),
  setPickupSelection: (pickupSelection) => set({ pickupSelection }),
  setPayment: (payment) => set({ payment }),
  setPickupOrderId: (pickupOrderId) => set({ pickupOrderId }),
  addDineInOrderId: (orderId) => set((state) => ({
    dineInOrderIds: state.dineInOrderIds.includes(orderId)
      ? state.dineInOrderIds
      : [...state.dineInOrderIds, orderId],
  })),
}));

export function resetCommerceStore() {
  useCommerceStore.setState({
    carts: emptyCarts,
    customer: null,
    session: null,
    authPhone: '',
    authReturnTo: '/checkout',
    pickupSelection: null,
    payment: null,
    pickupOrderId: null,
    dineInOrderIds: [],
  });
}

// lib/store/transition.store.ts
import { create } from 'zustand'

interface TransitionState {
  isTransitioning: boolean;
  showTransition: () => void;
  hideTransition: () => void;
}

export const useTransitionStore = create<TransitionState>((set) => ({
  isTransitioning: false,
  showTransition: () => set({ isTransitioning: true }),
  hideTransition: () => set({ isTransitioning: false }),
}));

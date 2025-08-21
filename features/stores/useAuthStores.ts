import { create } from 'zustand';

interface AuthState {
  isAdmin: boolean | null; // null until checked
  setIsAdmin: (value: boolean) => void;
  resetAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAdmin: null,
  setIsAdmin: (value) => set({ isAdmin: value }),
  resetAuth: () => set({ isAdmin: null }),
}));
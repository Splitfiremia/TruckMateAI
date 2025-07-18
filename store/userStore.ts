import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type UserRole = 'owner-operator' | 'fleet-company';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  companyName?: string;
  fleetSize?: number;
  cdlNumber?: string;
  dotNumber?: string;
  mcNumber?: string;
  createdAt: string;
  onboardingCompleted: boolean;
}

export interface UserState {
  user: UserProfile | null;
  isOnboarded: boolean;
  
  // Actions
  setUser: (user: UserProfile) => void;
  updateUser: (updates: Partial<UserProfile>) => void;
  setUserType: (role: UserRole) => void;
  completeOnboarding: () => void;
  logout: () => void;
  
  // Role-specific getters
  isOwnerOperator: () => boolean;
  isFleetCompany: () => boolean;
}

export const useUserStore = create<UserState>()(persist(
  (set, get) => ({
    user: null,
    isOnboarded: false,
    
    setUser: (user) => {
      set({ user, isOnboarded: user.onboardingCompleted });
    },
    
    updateUser: (updates) => {
      const currentUser = get().user;
      if (currentUser) {
        const updatedUser = { ...currentUser, ...updates };
        set({ user: updatedUser });
      }
    },
    
    setUserType: (role) => {
      const currentUser = get().user;
      if (currentUser) {
        const updatedUser = { ...currentUser, role };
        set({ user: updatedUser });
      }
    },
    
    completeOnboarding: () => {
      const currentUser = get().user;
      if (currentUser) {
        const updatedUser = { ...currentUser, onboardingCompleted: true };
        set({ user: updatedUser, isOnboarded: true });
      }
    },
    
    logout: () => {
      set({ user: null, isOnboarded: false });
    },
    
    isOwnerOperator: () => {
      const user = get().user;
      return user?.role === 'owner-operator';
    },
    
    isFleetCompany: () => {
      const user = get().user;
      return user?.role === 'fleet-company';
    },
  }),
  {
    name: 'user-storage',
    storage: createJSONStorage(() => AsyncStorage),
  }
));
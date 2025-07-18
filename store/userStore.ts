import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

export type UserRole = 'owner-operator' | 'fleet-company';
export type AuthProvider = 'google' | 'apple' | 'email';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role?: UserRole;
  companyName?: string;
  fleetSize?: number;
  cdlNumber?: string;
  dotNumber?: string;
  mcNumber?: string;
  phone?: string;
  profilePicture?: string;
  authProvider: AuthProvider;
  createdAt: string;
  onboardingCompleted: boolean;
}

export interface UserState {
  user: UserProfile | null;
  isAuthenticated: boolean;
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
    isAuthenticated: false,
    isOnboarded: false,
    
    setUser: (user) => {
      set({ 
        user, 
        isAuthenticated: true,
        isOnboarded: user.onboardingCompleted 
      });
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
      set({ user: null, isAuthenticated: false, isOnboarded: false });
      // Navigate to sign-in screen after logout
      setTimeout(() => {
        try {
          router.replace('/sign-in');
        } catch (error) {
          console.error('Navigation error after logout:', error);
          // Fallback navigation
          setTimeout(() => {
            try {
              router.push('/sign-in');
            } catch (fallbackError) {
              console.error('Fallback navigation error after logout:', fallbackError);
            }
          }, 500);
        }
      }, 100);
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
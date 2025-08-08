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
      console.log('Logging out user...');
      
      // Clear user state immediately
      set({ user: null, isAuthenticated: false, isOnboarded: false });
      
      // Clear AsyncStorage to ensure persistence is updated
      AsyncStorage.removeItem('user-storage').catch(error => {
        console.error('Error clearing user storage:', error);
      });
      
      // Navigate to sign-in directly
      setTimeout(() => {
        try {
          console.log('Navigating to sign-in after logout');
          router.replace('/sign-in');
        } catch (error) {
          console.error('Navigation error after logout:', error);
          // Try alternative navigation methods
          setTimeout(() => {
            try {
              console.log('Trying router.push to sign-in');
              router.push('/sign-in');
            } catch (pushError) {
              console.error('Push navigation error:', pushError);
              // Last resort - navigate to index
              setTimeout(() => {
                try {
                  console.log('Last resort - navigating to index');
                  router.replace('/');
                } catch (indexError) {
                  console.error('Index navigation error:', indexError);
                }
              }, 300);
            }
          }, 300);
        }
      }, 200);
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
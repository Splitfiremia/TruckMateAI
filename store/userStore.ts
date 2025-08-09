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
      console.log('Starting logout process...');
      
      try {
        // Clear user state immediately
        set({ user: null, isAuthenticated: false, isOnboarded: false });
        console.log('User state cleared');
        
        // Clear AsyncStorage asynchronously but don't wait for it
        AsyncStorage.removeItem('user-storage').then(() => {
          console.log('User storage cleared from AsyncStorage');
        }).catch((error) => {
          console.error('Error clearing user storage:', error);
        });
        
        // Also clear any other related storage keys
        AsyncStorage.removeItem('driver-storage').then(() => {
          console.log('Driver storage cleared from AsyncStorage');
        }).catch((error) => {
          console.error('Error clearing driver storage:', error);
        });
        
        // Navigate to sign-in screen immediately
        console.log('Navigating to sign-in screen');
        
        // Use setTimeout to ensure state update is processed
        setTimeout(() => {
          try {
            console.log('Attempting navigation to sign-in');
            router.replace('/sign-in');
          } catch (navError) {
            console.error('Navigation failed, trying push:', navError);
            try {
              router.push('/sign-in');
            } catch (pushError) {
              console.error('Push navigation also failed:', pushError);
              // Force reload as last resort
              if (typeof window !== 'undefined') {
                window.location.href = '/sign-in';
              }
            }
          }
        }, 50);
        
      } catch (error) {
        console.error('Error during logout:', error);
        
        // Emergency fallback
        setTimeout(() => {
          try {
            router.replace('/sign-in');
          } catch (finalError) {
            console.error('All logout attempts failed:', finalError);
            if (typeof window !== 'undefined') {
              window.location.href = '/sign-in';
            }
          }
        }, 100);
      }
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
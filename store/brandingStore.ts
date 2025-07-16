import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface BrandingSettings {
  // Company Information
  companyName: string;
  appName: string;
  welcomeMessage: string;
  
  // Visual Branding
  logoUrl?: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  
  // Contact Information
  supportEmail: string;
  supportPhone: string;
  
  // Advanced Settings
  showCompanyLogo: boolean;
  customSplashScreen: boolean;
  hideDefaultBranding: boolean;
  
  // Theme Settings
  darkMode: boolean;
  customFontFamily?: string;
}

interface BrandingState {
  settings: BrandingSettings;
  isCustomized: boolean;
  
  // Actions
  updateBranding: (updates: Partial<BrandingSettings>) => void;
  resetToDefaults: () => void;
  applyPreset: (preset: BrandingPreset) => void;
  
  // Getters
  getActiveColors: () => {
    primary: string;
    secondary: string;
    accent: string;
  };
}

export interface BrandingPreset {
  name: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
}

const defaultBranding: BrandingSettings = {
  companyName: 'Your Company',
  appName: 'TruckLogPro',
  welcomeMessage: 'Welcome to your professional trucking companion',
  primaryColor: '#3B82F6',
  secondaryColor: '#10B981',
  accentColor: '#F59E0B',
  supportEmail: 'support@trucklogpro.com',
  supportPhone: '(555) 123-4567',
  showCompanyLogo: false,
  customSplashScreen: false,
  hideDefaultBranding: false,
  darkMode: true,
};

export const brandingPresets: BrandingPreset[] = [
  {
    name: 'Ocean Blue',
    primaryColor: '#1E3A8A',
    secondaryColor: '#10B981',
    accentColor: '#F59E0B',
  },
  {
    name: 'Forest Green',
    primaryColor: '#065F46',
    secondaryColor: '#059669',
    accentColor: '#D97706',
  },
  {
    name: 'Sunset Orange',
    primaryColor: '#EA580C',
    secondaryColor: '#DC2626',
    accentColor: '#7C3AED',
  },
  {
    name: 'Royal Purple',
    primaryColor: '#7C3AED',
    secondaryColor: '#EC4899',
    accentColor: '#F59E0B',
  },
  {
    name: 'Steel Gray',
    primaryColor: '#374151',
    secondaryColor: '#6B7280',
    accentColor: '#3B82F6',
  },
  {
    name: 'Crimson Red',
    primaryColor: '#DC2626',
    secondaryColor: '#EF4444',
    accentColor: '#F59E0B',
  },
];

export const useBrandingStore = create<BrandingState>()(persist(
  (set, get) => ({
    settings: defaultBranding,
    isCustomized: false,
    
    updateBranding: (updates) => {
      set((state) => ({
        settings: { ...state.settings, ...updates },
        isCustomized: true,
      }));
    },
    
    resetToDefaults: () => {
      set({
        settings: defaultBranding,
        isCustomized: false,
      });
    },
    
    applyPreset: (preset) => {
      set((state) => ({
        settings: {
          ...state.settings,
          primaryColor: preset.primaryColor,
          secondaryColor: preset.secondaryColor,
          accentColor: preset.accentColor,
        },
        isCustomized: true,
      }));
    },
    
    getActiveColors: () => {
      const { settings } = get();
      return {
        primary: settings.primaryColor,
        secondary: settings.secondaryColor,
        accent: settings.accentColor,
      };
    },
  }),
  {
    name: 'branding-storage',
    storage: createJSONStorage(() => AsyncStorage),
  }
));
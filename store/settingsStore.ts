import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SettingsState {
  // App Settings
  autoTrackDriving: boolean;
  voiceCommands: boolean;
  pushNotifications: boolean;
  complianceAlerts: boolean;
  dataSync: boolean;
  darkMode: boolean;
  
  // Safety Settings
  bypassPreTripHardStop: boolean;
  
  // Actions
  updateSetting: (key: keyof Omit<SettingsState, 'updateSetting'>, value: boolean) => void;
  resetSettings: () => void;
}

const defaultSettings = {
  autoTrackDriving: true,
  voiceCommands: true,
  pushNotifications: true,
  complianceAlerts: true,
  dataSync: true,
  darkMode: true,
  bypassPreTripHardStop: false, // Default to false for safety
};

export const useSettingsStore = create<SettingsState>()(persist(
  (set, get) => ({
    ...defaultSettings,
    
    updateSetting: (key, value) => {
      set({ [key]: value });
    },
    
    resetSettings: () => {
      set(defaultSettings);
    },
  }),
  {
    name: 'settings-storage',
    storage: createJSONStorage(() => AsyncStorage),
  }
));
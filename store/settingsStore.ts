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
  emergencyContacts: boolean;
  speedLimitAlerts: boolean;
  fatigueMonitoring: boolean;
  
  // Weather Settings
  weatherAlertsEnabled: boolean;
  severeWeatherOnly: boolean;
  
  // Actions
  updateSetting: (key: keyof Omit<SettingsState, 'updateSetting' | 'resetSettings'>, value: boolean) => void;
  resetSettings: () => void;
}

const defaultSettings = {
  autoTrackDriving: true,
  voiceCommands: true,
  pushNotifications: true,
  complianceAlerts: true,
  dataSync: true,
  darkMode: true,
  emergencyContacts: true,
  speedLimitAlerts: true,
  fatigueMonitoring: true,
  weatherAlertsEnabled: true,
  severeWeatherOnly: false,
};

export const useSettingsStore = create<SettingsState>()(persist(
  (set, get) => ({
    ...defaultSettings,
    
    updateSetting: (key, value) => {
      console.log(`Updating setting ${key} from ${get()[key]} to ${value}`);
      set((state) => {
        const newState = { ...state, [key]: value };
        console.log('New state:', newState);
        return newState;
      });
    },
    
    resetSettings: () => {
      console.log('Resetting settings to defaults');
      set(defaultSettings);
    },
  }),
  {
    name: 'settings-storage',
    storage: createJSONStorage(() => AsyncStorage),
    onRehydrateStorage: () => (state) => {
      console.log('Settings rehydrated:', state);
    },
  }
));
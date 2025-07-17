import createContextHook from '@nkzw/create-context-hook';
import { themes } from '@/constants/colors';
import { useSettingsStore } from './settingsStore';

export type Theme = typeof themes.light;
export type ThemeMode = 'light' | 'dark';

export const [ThemeProvider, useTheme] = createContextHook(() => {
  const { darkMode } = useSettingsStore();
  
  const currentTheme: Theme = darkMode ? themes.dark : themes.light;
  const themeMode: ThemeMode = darkMode ? 'dark' : 'light';
  
  return {
    theme: currentTheme,
    mode: themeMode,
    isDark: darkMode,
  };
});
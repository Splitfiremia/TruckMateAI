// Light Theme Colors
const lightTheme = {
  primary: "#2563EB", // Vibrant blue
  primaryLight: "#DBEAFE", // Very light blue
  secondary: "#1E40AF", // Deep blue
  accent: "#3B82F6", // Medium blue
  success: "#059669", // Professional green
  warning: "#D97706", // Professional amber
  danger: "#DC2626", // Professional red
  error: "#DC2626", // Professional red (alias for danger)
  white: "#FFFFFF",
  black: "#0F172A", // Deep slate
  
  // Background colors
  background: {
    primary: "#FFFFFF", // Pure white background
    secondary: "#F8FAFC", // Very light blue-gray background
    tertiary: "#F1F5F9", // Light blue-gray background
  },
  
  // Text colors
  text: {
    primary: "#0F172A", // Deep slate text
    secondary: "#475569", // Slate gray text
    tertiary: "#64748B", // Medium slate text
  },
  
  // Status colors
  status: {
    success: "#059669",
    warning: "#D97706",
    error: "#DC2626",
  },
  
  // Border and surface
  border: "#E2E8F0", // Light slate border
  surface: "#F8FAFC", // Light blue surface
  card: "#FFFFFF", // White card background
  shadow: "rgba(15, 23, 42, 0.1)", // Light shadow
};

// Dark Theme Colors
const darkTheme = {
  primary: "#60A5FA", // Lighter blue for dark mode
  primaryLight: "#1E3A8A", // Dark blue background
  secondary: "#3B82F6", // Medium blue
  accent: "#93C5FD", // Light blue accent
  success: "#10B981", // Brighter green for dark mode
  warning: "#F59E0B", // Brighter amber for dark mode
  danger: "#EF4444", // Brighter red for dark mode
  error: "#EF4444", // Brighter red (alias for danger)
  white: "#FFFFFF",
  black: "#000000",
  
  // Background colors
  background: {
    primary: "#0F172A", // Deep slate background
    secondary: "#1E293B", // Lighter slate background
    tertiary: "#334155", // Medium slate background
  },
  
  // Text colors
  text: {
    primary: "#F8FAFC", // Very light text
    secondary: "#CBD5E1", // Light slate text
    tertiary: "#94A3B8", // Medium slate text
  },
  
  // Status colors
  status: {
    success: "#10B981",
    warning: "#F59E0B",
    error: "#EF4444",
  },
  
  // Border and surface
  border: "#475569", // Medium slate border
  surface: "#1E293B", // Dark surface
  card: "#1E293B", // Dark card background
  shadow: "rgba(0, 0, 0, 0.3)", // Dark shadow
};

// Export themes
export const themes = {
  light: lightTheme,
  dark: darkTheme,
};

// Default export for backward compatibility
export const colors = lightTheme;

// Deprecated properties for backward compatibility
export const deprecatedColors = {
  textSecondary: lightTheme.text.secondary,
  backgroundSecondary: lightTheme.background.secondary,
  backgroundLight: lightTheme.background.secondary,
};
// Light Theme Colors - Trucker-Friendly Blue Palette
const lightTheme = {
  primary: "#2563EB", // Bold, high visibility blue for buttons and CTAs
  primaryLight: "#3B82F6", // Softer contrast blue for navigation and headers
  secondary: "#1E40AF", // Dark blue readable in daylight for text on light backgrounds
  accent: "#60A5FA", // Attention-grabbing blue for alerts and warnings
  success: "#28A745", // Professional green
  warning: "#F59E0B", // Amber for maintenance warnings
  danger: "#DC2626", // Red for critical alerts
  error: "#DC2626", // Red for critical alerts (alias for danger)
  white: "#FFFFFF",
  black: "#1A1A1A", // Deep charcoal
  
  // Background colors - Professional blue tones with high contrast
  background: {
    primary: "#FFFFFF", // White primary background for daylight visibility
    secondary: "#93C5FD", // Light blue for cards and non-intrusive backgrounds
    tertiary: "#DBEAFE", // Very light blue for subtle backgrounds
  },
  
  // Text colors - High contrast for readability
  text: {
    primary: "#1E40AF", // Dark blue for primary text on light backgrounds
    secondary: "#1E3A8A", // Darker blue for secondary text
    tertiary: "#3730A3", // Medium blue for tertiary text
  },
  
  // Status colors - High visibility for safety
  status: {
    success: "#16A34A", // Bright green for visibility
    warning: "#F59E0B", // Amber for maintenance alerts
    error: "#DC2626", // Red for critical warnings
  },
  
  // Border and surface
  border: "#3B82F6", // Secondary blue for borders
  surface: "#F8FAFC", // Very light surface for cards
  card: "#FFFFFF", // White card backgrounds for maximum contrast
  shadow: "rgba(37, 99, 235, 0.1)", // Light blue shadow
};

// Dark Theme Colors - Trucker-Friendly Blue Palette for Night Driving
const darkTheme = {
  primary: "#3B82F6", // Softer blue for dark mode to reduce eye strain
  primaryLight: "#60A5FA", // Light blue for highlights
  secondary: "#1E40AF", // Dark blue for contrast elements
  accent: "#93C5FD", // Light blue accent for attention
  success: "#22C55E", // Professional green
  warning: "#F59E0B", // Amber for maintenance warnings
  danger: "#DC2626", // Red for critical alerts
  error: "#DC2626", // Red for critical alerts (alias for danger)
  white: "#FFFFFF",
  black: "#000000",
  
  // Background colors - Professional dark tones for night visibility
  background: {
    primary: "#0F172A", // Very dark slate for primary background
    secondary: "#1E293B", // Dark slate blue for secondary areas
    tertiary: "#334155", // Medium slate for cards
  },
  
  // Text colors - High contrast whites for night readability
  text: {
    primary: "#FFFFFF", // Pure white text for maximum contrast
    secondary: "#F1F5F9", // Very light text
    tertiary: "#CBD5E1", // Light gray-blue text
  },
  
  // Status colors - High visibility for night driving safety
  status: {
    success: "#22C55E", // Bright green for visibility
    warning: "#F59E0B", // Bright amber for alerts
    error: "#EF4444", // Bright red for warnings
  },
  
  // Border and surface
  border: "#3B82F6", // Secondary blue for borders
  surface: "#1E293B", // Dark slate surface
  card: "#334155", // Medium slate card background
  shadow: "rgba(15, 23, 42, 0.5)", // Deep slate shadow
};

// Export themes
export const themes = {
  light: lightTheme,
  dark: darkTheme,
};

// Default export for backward compatibility with deprecated properties
export const colors = {
  ...lightTheme,
  textSecondary: lightTheme.text.secondary,
  backgroundLight: lightTheme.background.secondary,
  backgroundSecondary: lightTheme.background.secondary,
};

// Deprecated properties for backward compatibility
export const deprecatedColors = {
  textSecondary: lightTheme.text.secondary,
  backgroundSecondary: lightTheme.background.secondary,
  backgroundLight: lightTheme.background.secondary,
};
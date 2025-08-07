// Light Theme Colors - Blue Professional Palette
const lightTheme = {
  primary: "#2563EB", // Modern blue for main buttons and CTAs
  primaryLight: "#3B82F6", // Lighter blue for navigation and headers
  secondary: "#1E40AF", // Darker blue for headers and subtitles
  accent: "#06B6D4", // Cyan accent for notifications and badges
  success: "#10B981", // Professional green
  warning: "#F59E0B", // Amber for maintenance warnings
  danger: "#EF4444", // Red for critical alerts
  error: "#EF4444", // Red for critical alerts (alias for danger)
  white: "#FFFFFF",
  black: "#1F2937", // Primary text color
  
  // Background colors - Professional blue tones
  background: {
    primary: "#F8FAFC", // Very light blue-gray app background
    secondary: "#FFFFFF", // White for cards and secondary areas
    tertiary: "#F1F5F9", // Light blue-gray for subtle backgrounds
  },
  
  // Text colors - High contrast for readability
  text: {
    primary: "#1F2937", // Primary text color
    secondary: "#4B5563", // Secondary text
    tertiary: "#6B7280", // Tertiary text
  },
  
  // Status colors - High visibility for safety
  status: {
    success: "#10B981", // Bright green for visibility
    warning: "#F59E0B", // Amber for warnings
    error: "#EF4444", // Red for critical warnings
  },
  
  // Border and surface
  border: "#E2E8F0", // Light blue-gray for borders
  surface: "#F8FAFC", // Light blue-gray surface for cards
  card: "#FFFFFF", // White card backgrounds for maximum contrast
  shadow: "rgba(37, 99, 235, 0.1)", // Blue shadow
};

// Dark Theme Colors - Blue Professional Dark Palette for Night Driving
const darkTheme = {
  primary: "#3B82F6", // Blue for dark mode
  primaryLight: "#60A5FA", // Lighter blue for highlights
  secondary: "#1E293B", // Dark blue-gray for contrast elements
  accent: "#06B6D4", // Cyan accent for attention
  success: "#22C55E", // Professional green
  warning: "#FFB81C", // Chase gold for maintenance warnings
  danger: "#E5252C", // Chase red for critical alerts
  error: "#E5252C", // Chase red for critical alerts (alias for danger)
  white: "#FFFFFF",
  black: "#000000",
  
  // Background colors - Professional dark tones for night visibility
  background: {
    primary: "#1A1A1A", // Very dark background
    secondary: "#2D2D2D", // Dark gray for secondary areas
    tertiary: "#3A3A3A", // Medium gray for cards
  },
  
  // Text colors - High contrast whites for night readability
  text: {
    primary: "#FFFFFF", // Pure white text for maximum contrast
    secondary: "#E0E0E0", // Very light text
    tertiary: "#B0B0B0", // Light gray text
  },
  
  // Status colors - High visibility for night driving safety
  status: {
    success: "#22C55E", // Bright green for visibility
    warning: "#FFB81C", // Chase gold for alerts
    error: "#E5252C", // Chase red for warnings
  },
  
  // Border and surface
  border: "#4A4A4A", // Gray for borders
  surface: "#2D2D2D", // Dark gray surface
  card: "#3A3A3A", // Medium gray card background
  shadow: "rgba(0, 0, 0, 0.5)", // Deep shadow
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
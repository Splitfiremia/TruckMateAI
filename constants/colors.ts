// Light Theme Colors - Chase Bank Professional Palette
const lightTheme = {
  primary: "#117ACA", // Chase blue for main buttons and CTAs
  primaryLight: "#117ACA", // Chase blue for navigation and headers
  secondary: "#2D2D2D", // Dark gray for headers and subtitles
  accent: "#FFB81C", // Chase gold for notifications and badges
  success: "#28A745", // Professional green
  warning: "#F59E0B", // Amber for maintenance warnings
  danger: "#E5252C", // Chase red for critical alerts
  error: "#E5252C", // Chase red for critical alerts (alias for danger)
  white: "#FFFFFF",
  black: "#333333", // Primary text color
  
  // Background colors - Professional Chase tones
  background: {
    primary: "#F7F7F7", // Light gray app background
    secondary: "#FFFFFF", // White for cards and secondary areas
    tertiary: "#F7F7F7", // Light gray for subtle backgrounds
  },
  
  // Text colors - High contrast for readability
  text: {
    primary: "#333333", // Primary text color
    secondary: "#2D2D2D", // Secondary text
    tertiary: "#666666", // Tertiary text
  },
  
  // Status colors - High visibility for safety
  status: {
    success: "#16A34A", // Bright green for visibility
    warning: "#FFB81C", // Chase gold for warnings
    error: "#E5252C", // Chase red for critical warnings
  },
  
  // Border and surface
  border: "#E0E0E0", // Light gray for borders
  surface: "#F7F7F7", // Light gray surface for cards
  card: "#FFFFFF", // White card backgrounds for maximum contrast
  shadow: "rgba(17, 122, 202, 0.1)", // Chase blue shadow
};

// Dark Theme Colors - Chase Bank Professional Dark Palette for Night Driving
const darkTheme = {
  primary: "#117ACA", // Chase blue for dark mode
  primaryLight: "#4A9FE7", // Lighter Chase blue for highlights
  secondary: "#2D2D2D", // Dark gray for contrast elements
  accent: "#FFB81C", // Chase gold accent for attention
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
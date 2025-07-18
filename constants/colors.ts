// Light Theme Colors
const lightTheme = {
  primary: "#0F4C75", // Deep navy blue
  primaryLight: "#3282B8", // Ocean blue
  secondary: "#1B6EC2", // Royal blue
  accent: "#4A90E2", // Sky blue accent
  success: "#28A745", // Professional green
  warning: "#FFC107", // Professional amber
  danger: "#DC3545", // Professional red
  error: "#DC3545", // Professional red (alias for danger)
  white: "#FFFFFF",
  black: "#1A1A1A", // Deep charcoal
  
  // Background colors - Sophisticated blue tones
  background: {
    primary: "#0A2540", // Deep midnight blue
    secondary: "#0F4C75", // Navy blue
    tertiary: "#1B6EC2", // Royal blue
  },
  
  // Text colors - High contrast whites
  text: {
    primary: "#FFFFFF", // Pure white text
    secondary: "#F5F7FA", // Off-white text
    tertiary: "#E8EDF5", // Light blue-gray text
  },
  
  // Status colors - High visibility for safety
  status: {
    success: "#00C851", // Bright green for visibility
    warning: "#FFB300", // Bright amber for alerts
    error: "#FF4444", // Bright red for warnings
  },
  
  // Border and surface
  border: "#3282B8", // Ocean blue border
  surface: "#0F4C75", // Navy surface
  card: "#0A2540", // Midnight blue card background
  shadow: "rgba(10, 37, 64, 0.3)", // Deep blue shadow
};

// Dark Theme Colors
const darkTheme = {
  primary: "#4A90E2", // Sky blue for dark mode
  primaryLight: "#6BB6FF", // Light sky blue
  secondary: "#3282B8", // Ocean blue
  accent: "#87CEEB", // Light blue accent
  success: "#28A745", // Professional green
  warning: "#FFC107", // Professional amber
  danger: "#DC3545", // Professional red
  error: "#DC3545", // Professional red (alias for danger)
  white: "#FFFFFF",
  black: "#000000",
  
  // Background colors - Professional dark blue tones
  background: {
    primary: "#0D1B2A", // Very dark navy
    secondary: "#1B263B", // Dark slate blue
    tertiary: "#2C3E50", // Dark blue-gray
  },
  
  // Text colors - High contrast whites
  text: {
    primary: "#FFFFFF", // Pure white text
    secondary: "#F8F9FA", // Very light text
    tertiary: "#E9ECEF", // Light gray text
  },
  
  // Status colors - High visibility for night driving
  status: {
    success: "#00C851", // Bright green
    warning: "#FFB300", // Bright amber
    error: "#FF4444", // Bright red
  },
  
  // Border and surface
  border: "#3282B8", // Ocean blue border
  surface: "#1B263B", // Dark slate surface
  card: "#2C3E50", // Dark blue-gray card background
  shadow: "rgba(13, 27, 42, 0.5)", // Deep navy shadow
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
// Light Theme Colors
const lightTheme = {
  primary: "#1E40AF", // Deep blue
  primaryLight: "#3B82F6", // Medium blue
  secondary: "#2563EB", // Vibrant blue
  accent: "#60A5FA", // Light blue accent
  success: "#059669", // Professional green
  warning: "#D97706", // Professional amber
  danger: "#DC2626", // Professional red
  error: "#DC2626", // Professional red (alias for danger)
  white: "#FFFFFF",
  black: "#0F172A", // Deep slate
  
  // Background colors - Blue tones
  background: {
    primary: "#1E40AF", // Deep blue background
    secondary: "#2563EB", // Vibrant blue background
    tertiary: "#3B82F6", // Medium blue background
  },
  
  // Text colors - White tones
  text: {
    primary: "#FFFFFF", // Pure white text
    secondary: "#F8FAFC", // Very light text
    tertiary: "#E2E8F0", // Light gray text
  },
  
  // Status colors
  status: {
    success: "#10B981", // Brighter green for blue background
    warning: "#F59E0B", // Brighter amber for blue background
    error: "#EF4444", // Brighter red for blue background
  },
  
  // Border and surface
  border: "#60A5FA", // Light blue border
  surface: "#2563EB", // Blue surface
  card: "#1E40AF", // Blue card background
  shadow: "rgba(30, 64, 175, 0.2)", // Blue shadow
};

// Dark Theme Colors
const darkTheme = {
  primary: "#93C5FD", // Light blue for dark mode
  primaryLight: "#60A5FA", // Medium blue
  secondary: "#3B82F6", // Vibrant blue
  accent: "#DBEAFE", // Very light blue accent
  success: "#10B981", // Brighter green for dark mode
  warning: "#F59E0B", // Brighter amber for dark mode
  danger: "#EF4444", // Brighter red for dark mode
  error: "#EF4444", // Brighter red (alias for danger)
  white: "#FFFFFF",
  black: "#000000",
  
  // Background colors - Darker blue tones
  background: {
    primary: "#0F1629", // Very dark blue background
    secondary: "#1E2A47", // Dark blue background
    tertiary: "#2D3E63", // Medium dark blue background
  },
  
  // Text colors - White tones
  text: {
    primary: "#FFFFFF", // Pure white text
    secondary: "#F8FAFC", // Very light text
    tertiary: "#E2E8F0", // Light gray text
  },
  
  // Status colors
  status: {
    success: "#10B981",
    warning: "#F59E0B",
    error: "#EF4444",
  },
  
  // Border and surface
  border: "#3B82F6", // Blue border
  surface: "#1E2A47", // Dark blue surface
  card: "#2D3E63", // Dark blue card background
  shadow: "rgba(15, 22, 41, 0.4)", // Dark blue shadow
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
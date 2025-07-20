import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AppLogo from './AppLogo';
import { colors } from '@/constants/colors';

interface AppBrandProps {
  size?: 'small' | 'medium' | 'large';
  showText?: boolean;
  textColor?: string;
  logoSize?: number;
  style?: any;
}

export default function AppBrand({ 
  size = 'medium', 
  showText = true, 
  textColor = colors.primary,
  logoSize,
  style 
}: AppBrandProps) {
  const getLogoSize = () => {
    if (logoSize) return logoSize;
    switch (size) {
      case 'small': return 40;
      case 'medium': return 60;
      case 'large': return 80;
      default: return 60;
    }
  };

  const getTextSize = () => {
    switch (size) {
      case 'small': return 18;
      case 'medium': return 24;
      case 'large': return 32;
      default: return 24;
    }
  };

  const getSpacing = () => {
    switch (size) {
      case 'small': return 8;
      case 'medium': return 12;
      case 'large': return 16;
      default: return 12;
    }
  };

  return (
    <View style={[styles.container, style]}>
      <AppLogo size={getLogoSize()} animated={true} />
      {showText && (
        <Text style={[
          styles.brandText, 
          { 
            color: textColor, 
            fontSize: getTextSize(),
            marginTop: getSpacing()
          }
        ]}>
          TruckMate AI
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandText: {
    fontWeight: '700' as const,
    letterSpacing: -0.5,
    textAlign: 'center',
    textShadowColor: 'rgba(37, 99, 235, 0.1)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
});
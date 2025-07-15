import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '@/constants/colors';
import { LucideIcon } from 'lucide-react-native';

interface QuickActionButtonProps {
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
  style?: ViewStyle;
  color?: string;
  disabled?: boolean;
}

export default function QuickActionButton({ 
  icon, 
  label, 
  onPress, 
  style,
  color = colors.primaryLight,
  disabled = false
}: QuickActionButtonProps) {
  return (
    <TouchableOpacity 
      style={[
        styles.container, 
        { borderColor: color }, 
        disabled && styles.disabledContainer,
        style
      ]}
      onPress={disabled ? undefined : onPress}
      activeOpacity={disabled ? 1 : 0.7}
      disabled={disabled}
    >
      <View style={[
        styles.iconContainer, 
        { backgroundColor: color },
        disabled && styles.disabledIconContainer
      ]}>
        {icon}
      </View>
      <Text style={[
        styles.label,
        disabled && styles.disabledLabel
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const View = require('react-native').View;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    minWidth: 80,
    backgroundColor: colors.backgroundLight,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.text,
    textAlign: 'center',
  },
  disabledContainer: {
    opacity: 0.5,
    backgroundColor: colors.border,
  },
  disabledIconContainer: {
    backgroundColor: colors.border,
  },
  disabledLabel: {
    color: colors.textSecondary,
  },
});
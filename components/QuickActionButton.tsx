import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, View } from 'react-native';
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
      <Text 
        style={[
          styles.label,
          disabled && styles.disabledLabel
        ]}
        numberOfLines={2}
        ellipsizeMode="tail"
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    minWidth: 80,
    minHeight: 100,
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
    color: colors.text.primary,
    textAlign: 'center',
    lineHeight: 14,
    flexShrink: 1,
    flexWrap: 'wrap',
  },
  disabledContainer: {
    opacity: 0.5,
    backgroundColor: colors.border,
  },
  disabledIconContainer: {
    backgroundColor: colors.border,
  },
  disabledLabel: {
    color: colors.text.secondary,
  },
});
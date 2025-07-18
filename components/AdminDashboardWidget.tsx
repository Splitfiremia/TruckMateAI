import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { LucideIcon } from 'lucide-react-native';

interface AdminDashboardWidgetProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  color: string;
  onPress?: () => void;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  alert?: boolean;
}

export default function AdminDashboardWidget({
  title,
  value,
  subtitle,
  icon: Icon,
  color,
  onPress,
  trend,
  alert = false,
}: AdminDashboardWidgetProps) {
  return (
    <Pressable
      style={[
        styles.container,
        alert && styles.alertContainer,
        onPress && styles.pressable
      ]}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.header}>
        <Icon size={24} color={alert ? '#E5252C' : color} />
        {trend && (
          <View style={[
            styles.trendBadge,
            { backgroundColor: trend.isPositive ? '#10B981' : '#E5252C' }
          ]}>
            <Text style={styles.trendText}>
              {trend.isPositive ? '+' : ''}{trend.value}%
            </Text>
          </View>
        )}
      </View>
      
      <Text style={[
        styles.value,
        alert && styles.alertValue
      ]}>
        {value}
      </Text>
      
      <Text style={styles.title}>{title}</Text>
      
      {subtitle && (
        <Text style={styles.subtitle}>{subtitle}</Text>
      )}
      
      {alert && (
        <View style={styles.alertIndicator}>
          <Text style={styles.alertText}>ALERT</Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    minHeight: 120,
    justifyContent: 'space-between',
  },
  alertContainer: {
    borderWidth: 2,
    borderColor: '#E5252C',
    backgroundColor: '#FEF2F2',
  },
  pressable: {
    opacity: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  trendBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  trendText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  value: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  alertValue: {
    color: '#E5252C',
  },
  title: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 12,
    color: '#999999',
  },
  alertIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#E5252C',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  alertText: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});
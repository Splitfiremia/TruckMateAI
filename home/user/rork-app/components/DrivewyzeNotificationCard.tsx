import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { CheckCircle, XCircle, AlertTriangle, MapPin, Clock, Bell } from 'lucide-react-native';
import type { DrivewyzeNotification } from '@/types';
import { colors } from '@/constants/colors';

interface DrivewyzeNotificationCardProps {
  notification: DrivewyzeNotification;
  onPress?: () => void;
  onAction?: (action: string) => void;
  onDismiss?: () => void;
}

export const DrivewyzeNotificationCard: React.FC<DrivewyzeNotificationCardProps> = ({
  notification,
  onPress,
  onAction,
  onDismiss
}) => {
  const getTypeIcon = () => {
    switch (notification.type) {
      case 'bypass_approved': return <CheckCircle size={20} color={colors.success} />;
      case 'bypass_denied': return <XCircle size={20} color={colors.danger} />;
      case 'weigh_station_ahead': return <MapPin size={20} color={colors.warning} />;
      case 'status_change': return <Bell size={20} color={colors.primary} />;
      case 'inspection_required': return <AlertTriangle size={20} color={colors.danger} />;
      default: return <Bell size={20} color={colors.primary} />;
    }
  };

  const getPriorityColor = () => {
    switch (notification.priority) {
      case 'critical': return colors.danger;
      case 'high': return colors.warning;
      case 'medium': return colors.info;
      case 'low': return colors.success;
      default: return colors.primary;
    }
  };

  return (
    <TouchableOpacity onPress={onPress} style={[styles.container, { borderLeftColor: getPriorityColor() }]}>
      <View style={styles.header}>
        {getTypeIcon()}
        <Text style={styles.title}>{notification.title}</Text>
        <Clock size={16} color="#666" />
      </View>
      <Text style={styles.message}>{notification.message}</Text>
      {notification.actions?.length > 0 && (
        <View style={styles.actions}>
          {notification.actions.map((action, index) => (
            <TouchableOpacity key={index} onPress={() => onAction?.(action.action)}>
              <Text style={styles.actionText}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
      {onDismiss && (
        <TouchableOpacity onPress={onDismiss} style={styles.dismiss}>
          <Text style={styles.dismissText}>Dismiss</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#fff',
    marginBottom: 8,
    borderLeftWidth: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  message: {
    fontSize: 14,
    color: '#444',
    marginBottom: 12,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
  actionText: {
    color: colors.primary,
    fontWeight: '500',
  },
  dismiss: {
    alignSelf: 'flex-end',
  },
  dismissText: {
    color: '#666',
    fontSize: 12,
  },
});

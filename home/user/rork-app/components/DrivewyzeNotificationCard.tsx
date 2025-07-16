import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Bell, AlertTriangle, CheckCircle, X } from 'lucide-react-native';
import { DrivewyzeNotification } from '@/types';
import { colors } from '@/constants/colors';

interface DrivewyzeNotificationCardProps {
  notification: DrivewyzeNotification;
  onAction?: (action: string) => void;
  onDismiss?: () => void;
}

export const DrivewyzeNotificationCard: React.FC<DrivewyzeNotificationCardProps> = ({
  notification,
  onAction,
  onDismiss,
}) => {
  const getPriorityColor = () => {
    switch (notification.priority) {
      case 'high':
        return colors.danger;
      case 'medium':
        return colors.warning;
      case 'low':
        return colors.success;
      default:
        return colors.text.secondary;
    }
  };

  const getPriorityIcon = () => {
    switch (notification.priority) {
      case 'high':
        return <AlertTriangle size={20} color={colors.danger} />;
      case 'medium':
        return <Bell size={20} color={colors.warning} />;
      case 'low':
        return <CheckCircle size={20} color={colors.success} />;
      default:
        return <Bell size={20} color={colors.text.secondary} />;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <View style={[styles.container, { borderLeftColor: getPriorityColor() }]}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          {getPriorityIcon()}
          <Text style={styles.title}>{notification.title}</Text>
        </View>
        <View style={styles.headerActions}>
          <Text style={styles.timestamp}>
            {formatTimestamp(notification.timestamp)}
          </Text>
          {onDismiss && (
            <TouchableOpacity style={styles.dismissButton} onPress={onDismiss}>
              <X size={16} color={colors.text.secondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <Text style={styles.message}>{notification.message}</Text>

      {notification.location && (
        <Text style={styles.location}>
          {notification.location.distance?.toFixed(1)} miles away
        </Text>
      )}

      {notification.expiresAt && (
        <Text style={styles.expiry}>
          Expires: {new Date(notification.expiresAt).toLocaleTimeString()}
        </Text>
      )}

      {notification.actions && notification.actions.length > 0 && (
        <View style={styles.actions}>
          {notification.actions.map((action, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.actionButton,
                index === 0 ? styles.primaryAction : styles.secondaryAction
              ]}
              onPress={() => onAction?.(action.action)}
            >
              <Text
                style={[
                  styles.actionButtonText,
                  index === 0 ? styles.primaryActionText : styles.secondaryActionText
                ]}
              >
                {action.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginLeft: 8,
    flex: 1,
  },
  headerActions: {
    alignItems: 'flex-end',
    gap: 4,
  },
  timestamp: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  dismissButton: {
    padding: 4,
  },
  message: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
    marginBottom: 8,
  },
  location: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '500',
    marginBottom: 4,
  },
  expiry: {
    fontSize: 12,
    color: colors.warning,
    fontWeight: '500',
    marginBottom: 8,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  actionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    flex: 1,
  },
  primaryAction: {
    backgroundColor: colors.primary,
  },
  secondaryAction: {
    backgroundColor: colors.background.secondary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  primaryActionText: {
    color: colors.white,
  },
  secondaryActionText: {
    color: colors.text.primary,
  },
});
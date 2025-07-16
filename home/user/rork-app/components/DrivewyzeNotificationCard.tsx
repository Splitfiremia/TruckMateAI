import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { CheckCircle, XCircle, AlertTriangle, MapPin, Clock, Bell } from 'lucide-react-native';
import { DrivewyzeNotification } from '@/types';
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
      case 'bypass_approved':
        return <CheckCircle size={20} color={colors.success} />;
      case 'bypass_denied':
        return <XCircle size={20} color={colors.danger} />;
      case 'weigh_station_ahead':
        return <MapPin size={20} color={colors.warning} />;
      case 'status_change':
        return <Bell size={20} color={colors.primary} />;
      case 'inspection_required':
        return <AlertTriangle size={20} color={colors.danger} />;
      default:
        return <Bell size={20} color={colors.primary} />;
    }
  };

  const getPriorityColor = () => {
    switch (notification.priority) {
      case 'critical':
        return colors.danger;
      case 'high':
        return colors.warning;
      case 'medium':
        return colors.primary;
      case 'low':
        return colors.text.secondary;
      default:
        return colors.primary;
    }
  };

  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const notificationTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - notificationTime.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const isExpired = notification.expiresAt && new Date(notification.expiresAt) < new Date();

  return (
    <TouchableOpacity 
      style={[
        styles.container,
        notification.actionRequired && styles.actionRequired,
        isExpired && styles.expired
      ]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          {getTypeIcon()}
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.title} numberOfLines={1}>
            {notification.title}
          </Text>
          <View style={styles.metaContainer}>
            <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor() }]}>
              <Text style={styles.priorityText}>
                {notification.priority.toUpperCase()}
              </Text>
            </View>
            <View style={styles.timeContainer}>
              <Clock size={12} color={colors.text.secondary} />
              <Text style={styles.timeText}>
                {getTimeAgo(notification.timestamp)}
              </Text>
            </View>
          </View>
        </View>
        {onDismiss && (
          <TouchableOpacity 
            style={styles.dismissButton}
            onPress={(e) => {
              e.stopPropagation();
              onDismiss();
            }}
          >
            <XCircle size={20} color={colors.text.secondary} />
          </TouchableOpacity>
        )}
      </View>

      <Text style={styles.message} numberOfLines={2}>
        {notification.message}
      </Text>

      {notification.location && (
        <View style={styles.locationContainer}>
          <MapPin size={14} color={colors.text.secondary} />
          <Text style={styles.locationText}>
            {notification.location.distance ? 
              `${notification.location.distance.toFixed(1)} miles away` : 
              'Location available'
            }
          </Text>
        </View>
      )}

      {notification.expiresAt && !isExpired && (
        <View style={styles.expiryContainer}>
          <Clock size={14} color={colors.warning} />
          <Text style={styles.expiryText}>
            Expires: {new Date(notification.expiresAt).toLocaleTimeString()}
          </Text>
        </View>
      )}

      {isExpired && (
        <View style={styles.expiredContainer}>
          <AlertTriangle size={14} color={colors.danger} />
          <Text style={styles.expiredText}>Expired</Text>
        </View>
      )}

      {notification.actions && notification.actions.length > 0 && !isExpired && (
        <View style={styles.actionsContainer}>
          {notification.actions.map((action, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.actionButton,
                action.action === 'request_bypass' && styles.primaryActionButton
              ]}
              onPress={(e) => {
                e.stopPropagation();
                onAction?.(action.action);
              }}
            >
              <Text style={[
                styles.actionButtonText,
                action.action === 'request_bypass' && styles.primaryActionButtonText
              ]}>
                {action.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    shadowColor: colors.text.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionRequired: {
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  expired: {
    opacity: 0.6,
    backgroundColor: colors.background.secondary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  iconContainer: {
    marginRight: 12,
    marginTop: 2,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 4,
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  priorityBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.white,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeText: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  dismissButton: {
    padding: 4,
    marginLeft: 8,
  },
  message: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  locationText: {
    fontSize: 13,
    color: colors.text.secondary,
  },
  expiryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  expiryText: {
    fontSize: 13,
    color: colors.warning,
    fontWeight: '500',
  },
  expiredContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  expiredText: {
    fontSize: 13,
    color: colors.danger,
    fontWeight: '500',
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background.primary,
  },
  primaryActionButton: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  actionButtonText: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.text.primary,
  },
  primaryActionButtonText: {
    color: colors.white,
  },
});
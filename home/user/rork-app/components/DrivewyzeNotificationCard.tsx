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
        return colors.success;
      default:
        return colors.primary;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <View style={styles.header}>
        {getTypeIcon()}
        <Text style={styles.title}>{notification.title}</Text>
        {notification.actionRequired && (
          <View style={[styles.badge, { backgroundColor: getPriorityColor() }]}>
            <Text style={styles.badgeText}>Action</Text>
          </View>
        )}
      </View>
      
      <Text style={styles.message}>{notification.message}</Text>
      
      {notification.location && (
        <View style={styles.locationContainer}>
          <MapPin size={14} color="#666" />
          <Text style={styles.locationText}>
            {notification.location.distance ? `${notification.location.distance.toFixed(1)} miles away` : 'Location available'}
          </Text>
        </View>
      )}
      
      <View style={styles.footer}>
        <View style={styles.timestampContainer}>
          <Clock size={14} color="#666" />
          <Text style={styles.timestamp}>{formatTimestamp(notification.timestamp)}</Text>
        </View>
        
        {notification.actions && notification.actions.length > 0 && (
          <View style={styles.actionsContainer}>
            {notification.actions.map((action, index) => (
              <TouchableOpacity 
                key={index}
                style={[
                  styles.actionButton,
                  { backgroundColor: index === 0 ? getPriorityColor() : 'transparent' }
                ]}
                onPress={() => onAction && onAction(action.action)}
              >
                <Text 
                  style={[
                    styles.actionText,
                    { color: index === 0 ? '#fff' : getPriorityColor() }
                  ]}
                >
                  {action.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
        
        {onDismiss && (
          <TouchableOpacity style={styles.dismissButton} onPress={onDismiss}>
            <XCircle size={16} color="#999" />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
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
    color: '#333333',
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#ffffff',
  },
  message: {
    fontSize: 14,
    color: '#444444',
    marginBottom: 12,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 12,
  },
  locationText: {
    fontSize: 12,
    color: '#666666',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  timestampContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timestamp: {
    fontSize: 12,
    color: '#666666',
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  actionText: {
    fontSize: 12,
    fontWeight: '500',
  },
  dismissButton: {
    padding: 4,
  },
});